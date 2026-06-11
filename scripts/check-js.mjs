import { readdirSync, statSync } from "node:fs";
import { join, resolve, relative, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const files = [resolve(root, "tuev-card.js")];

function collectJavaScriptFiles(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      collectJavaScriptFiles(path);
      continue;
    }

    if (path.endsWith(".js") || path.endsWith(".mjs")) {
      files.push(path);
    }
  }
}

collectJavaScriptFiles(resolve(root, "src"));
collectJavaScriptFiles(resolve(root, "scripts"));

const uniqueFiles = [...new Set(files)];
let hasError = false;

for (const file of uniqueFiles) {
  const displayName = relative(root, file).replace(/\\/g, "/");
  const result = spawnSync(process.execPath, ["--check", file], {
    cwd: root,
    stdio: "inherit"
  });

  if (result.status !== 0) {
    console.error(`Syntax check failed: ${displayName}`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}

console.log(`Checked ${uniqueFiles.length} JavaScript files.`);
