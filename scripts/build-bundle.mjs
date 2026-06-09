import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const version = "b29";
const entry = resolve(root, "src/tuev-card-entry.js");
const moduleIds = new Map();
const modules = [];

function withoutQuery(spec) {
  return spec.split("?")[0];
}

function moduleName(path) {
  return "__m_" + relative(root, path).replace(/[^A-Za-z0-9_$]/g, "_");
}

function resolveModule(current, spec) {
  return resolve(dirname(current), withoutQuery(spec));
}

function collect(path) {
  path = resolve(path);
  if (moduleIds.has(path)) return;
  moduleIds.set(path, moduleName(path));
  const code = readFileSync(path, "utf8");

  for (const match of code.matchAll(/import\s*\{[\s\S]*?\}\s*from\s*["']([^"']+)["']\s*;/g)) {
    collect(resolveModule(path, match[1]));
  }

  for (const match of code.matchAll(/export\s*\{[\s\S]*?\}\s*from\s*["']([^"']+)["']\s*;/g)) {
    collect(resolveModule(path, match[1]));
  }

  modules.push(path);
}

function parseNamedList(text) {
  return text.replace(/\n/g, " ").split(",").map((part) => part.trim()).filter(Boolean).map((part) => {
    if (part.includes(" as ")) {
      const [imported, local] = part.split(" as ").map((item) => item.trim());
      return { imported, local };
    }
    return { imported: part, local: part };
  });
}

function transformModule(path, isEntry) {
  let code = readFileSync(path, "utf8");
  const exportedPairs = [];
  const declared = new Set();

  code = code.replace(/import\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["']\s*;/g, (_match, body, spec) => {
    const dep = moduleIds.get(resolveModule(path, spec));
    const destructured = parseNamedList(body).map(({ imported, local }) => {
      declared.add(local);
      return imported === local ? imported : `${imported}: ${local}`;
    });
    return `const { ${destructured.join(", ")} } = ${dep};`;
  });

  code = code.replace(/export\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["']\s*;/g, (_match, body, spec) => {
    const dep = moduleIds.get(resolveModule(path, spec));
    const destructured = parseNamedList(body).map(({ imported, local: exported }) => {
      const local = declared.has(exported) ? `__reexport_${exported}` : exported;
      declared.add(local);
      exportedPairs.push({ exported, local });
      return imported === local ? imported : `${imported}: ${local}`;
    });
    return `const { ${destructured.join(", ")} } = ${dep};`;
  });

  code = code.replace(/export\s+(const|let|var|async function|function|class)\s+([A-Za-z_$][\w$]*)/g, (_match, kind, name) => {
    declared.add(name);
    exportedPairs.push({ exported: name, local: name });
    return `${kind} ${name}`;
  });

  code = code.replace(/export\s*\{([\s\S]*?)\}\s*;/g, (_match, body) => {
    for (const { imported: local, local: exported } of parseNamedList(body)) {
      exportedPairs.push({ exported, local });
    }
    return "";
  });

  if (isEntry) return `${code}\nreturn {};\n`;

  const seen = new Set();
  const exports = [];
  for (const { exported, local } of exportedPairs) {
    if (seen.has(exported)) continue;
    seen.add(exported);
    exports.push(`${exported}: ${local}`);
  }

  return `${code}\nreturn { ${exports.join(", ")} };\n`;
}

collect(entry);

let bundled = `// TÜV Card bundled v0.1.0-${version}\n`;
bundled += "// This file is generated from the modular source files. Do not edit manually.\n";

for (const path of modules) {
  const id = moduleIds.get(path);
  const rel = relative(root, path).replace(/\\/g, "/");
  bundled += `\n// ---- ${rel} ----\nconst ${id} = (() => {\n${transformModule(path, path === entry)}\n})();\n`;
}

writeFileSync(resolve(root, "tuev-card.js"), bundled);
