export function renderLicensePlate(plate, options = {}) {
    const normalizedPlate = normalizePlate(plate);

    if (!normalizedPlate) {
        return "";
    }

    const compact = Boolean(options.compact);
    const plainChars = normalizedPlate.replace(/[\s-]/g, "");
    const charCount = plainChars.length;

    const height = compact ? 26 : 31;
    const euWidth = compact ? 13 : 16;
    const fontSize = compact ? 22 : 28;
    const radius = compact ? 3 : 4;

    const textGapLeft = compact ? 13 : 17;

    // Dynamischer Seitenrand je nach Zeichenmenge
const textPadLeft = compact
    ? (charCount <= 4 ? 1 : charCount <= 6 ? 2 : 3)
    : (charCount <= 4 ? 2 : charCount <= 6 ? 3 : 4);

const textPadRight = compact
    ? (charCount <= 4 ? 6 : charCount <= 6 ? 8 : 10)
    : (charCount <= 4 ? 8 : charCount <= 6 ? 10 : 13);

    // EU-Inhalt leicht nach rechts im blauen Feld
    const euContentX = compact ? 7.6 : 9.2;

    const textWidth = estimatePlateTextWidth(normalizedPlate, fontSize);

    // Dynamische Gesamtbreite statt großem festen Leerraum
    const contentWidth = euWidth + textGapLeft + textPadLeft + textWidth + textPadRight;
    const minWidth = compact ? 74 : 92;
    const maxWidth = compact ? 240 : 320;

    const width = Math.max(minWidth, Math.min(maxWidth, contentWidth));

    const textAreaStartX = euWidth + textGapLeft + textPadLeft;
    const textAreaWidth = width - textAreaStartX - textPadRight;

    // Leichte optische Korrektur nach links
    const textOffsetX = compact ? -2.5 : -4;
    const textX = textAreaStartX + textAreaWidth / 2 + textOffsetX;
    const textY = height * 0.60;

    const clipId = `plateClip-${hashString(normalizedPlate)}-${compact ? "c" : "n"}`;

    return `
        <svg
            viewBox="0 0 ${width} ${height}"
            width="${width}"
            height="${height}"
            role="img"
            aria-label="${escapeHtml(normalizedPlate)}"
            style="
                display: block;
                max-width: 100%;
                height: auto;
            "
        >
            <defs>
                <clipPath id="${clipId}">
                    <rect
                        x="1"
                        y="1"
                        width="${width - 2}"
                        height="${height - 2}"
                        rx="${radius}"
                        ry="${radius}"
                    />
                </clipPath>

                <style>
                    @font-face {
                        font-family: "EuroPlate";
                        src: url("/local/EuroPlate.ttf") format("truetype");
                        font-display: swap;
                    }

                    .tuev-plate-text {
                        font-family: "EuroPlate", "Bahnschrift SemiCondensed", "Bahnschrift Condensed", "Arial Narrow", sans-serif;
                        font-size: ${fontSize}px;
                        font-weight: 700;
                        letter-spacing: ${compact ? "0.45px" : "0.7px"};
                    }
                </style>
            </defs>

            <g clip-path="url(#${clipId})">
                <rect
                    x="1"
                    y="1"
                    width="${width - 2}"
                    height="${height - 2}"
                    fill="#f7f7f2"
                />

                <rect
                    x="1"
                    y="1"
                    width="${euWidth}"
                    height="${height - 2}"
                    fill="#003399"
                />

                <rect
                    x="${euWidth}"
                    y="1"
                    width="1.1"
                    height="${height - 2}"
                    fill="#111"
                    opacity="0.10"
                />

                ${renderEuStars(
                    euContentX,
                    height * 0.27,
                    compact ? 3.1 : 3.8,
                    compact ? 0.52 : 0.64
                )}

                <text
                    x="${euContentX}"
                    y="${height * 0.79}"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    font-family="Arial, sans-serif"
                    font-size="${compact ? 5.8 : 7.2}"
                    font-weight="700"
                    fill="#fff"
                >
                    D
                </text>

                <text
                    class="tuev-plate-text"
                    x="${textX}"
                    y="${textY}"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    fill="#111"
                >
                    ${escapeHtml(normalizedPlate)}
                </text>
            </g>

            <rect
                x="1"
                y="1"
                width="${width - 2}"
                height="${height - 2}"
                rx="${radius}"
                ry="${radius}"
                fill="none"
                stroke="#111"
                stroke-width="2"
            />
        </svg>
    `;
}

function normalizePlate(plate) {
    return String(plate || "")
        .trim()
        .replace(/\s+/g, " ")
        .toUpperCase();
}

function estimatePlateTextWidth(text, fontSize) {
    let width = 0;

    for (const char of text) {
        if (char === " ") {
            width += fontSize * 0.28;
        } else if (char === "-") {
            width += fontSize * 0.22;
        } else if (char >= "0" && char <= "9") {
            width += fontSize * 0.52;
        } else if ("MW".includes(char)) {
            width += fontSize * 0.68;
        } else if ("IJ".includes(char)) {
            width += fontSize * 0.34;
        } else {
            width += fontSize * 0.56;
        }
    }

    return width;
}

function renderEuStars(cx, cy, radius, starRadius) {
    return Array.from({ length: 12 }, (_, index) => {
        const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;

        return `
            <circle
                cx="${x.toFixed(2)}"
                cy="${y.toFixed(2)}"
                r="${starRadius}"
                fill="#ffcc00"
            />
        `;
    }).join("");
}

function hashString(value) {
    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
        hash = ((hash << 5) - hash) + value.charCodeAt(index);
        hash |= 0;
    }

    return Math.abs(hash);
}

function escapeHtml(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}