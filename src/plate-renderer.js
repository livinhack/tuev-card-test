let plateFontInjected = false;
let plateFontLoaded = false;
let plateFontLoading = false;

const PLATE_FONT_PROFILES = {
    europlate: {
        fontFamily: '"EuroPlate", sans-serif',
        letterSpacing: {
            compact: "0.12px",
            normal: "0.22px"
        },
        textOffsetX: {
            compact: -4.4,
            normal: -6.4
        },
        charWidth: {
            space: 0.34,
            dash: 0.22,
            digit: 0.43,
            wide: 0.54,
            narrow: 0.22,
            default: 0.40
        }
    },
    fallback: {
        fontFamily: '"Bahnschrift SemiCondensed", "Bahnschrift Condensed", "Arial Narrow", sans-serif',
        letterSpacing: {
            compact: "0.45px",
            normal: "0.7px"
        },
        textOffsetX: {
            compact: -2.5,
            normal: -4
        },
        charWidth: {
            space: 0.28,
            dash: 0.22,
            digit: 0.52,
            wide: 0.68,
            narrow: 0.34,
            default: 0.56
        }
    }
};

export function ensurePlateFont(onLoaded) {
    injectPlateFont();

    if (plateFontLoaded || plateFontLoading || !document.fonts?.load) {
        return plateFontLoaded;
    }

    plateFontLoading = true;

    document.fonts
        .load('28px "EuroPlate"')
        .then(() => {
            plateFontLoaded = document.fonts.check('28px "EuroPlate"');
        })
        .catch(() => {
            plateFontLoaded = false;
        })
        .finally(() => {
            plateFontLoading = false;

            if (plateFontLoaded && typeof onLoaded === "function") {
                onLoaded();
            }
        });

    return plateFontLoaded;
}

export function isPlateFontLoaded() {
    if (document.fonts?.check) {
        plateFontLoaded = document.fonts.check('28px "EuroPlate"');
    }

    return plateFontLoaded;
}

function injectPlateFont() {
    if (plateFontInjected) {
        return;
    }

    plateFontInjected = true;

    const style = document.createElement("style");

    style.textContent = `
        @font-face {
            font-family: "EuroPlate";
            src: url("/local/EuroPlate.ttf") format("truetype");
            font-display: swap;
        }
    `;

    document.head.appendChild(style);
}

export function renderLicensePlate(plate, options = {}) {
    injectPlateFont();

    const normalizedPlate = normalizePlate(plate);

    if (!normalizedPlate) {
        return "";
    }

    const compact = Boolean(options.compact);
    const fontProfileName = options.fontProfile === "europlate"
        ? "europlate"
        : "fallback";
    const fontProfile = PLATE_FONT_PROFILES[fontProfileName];

    const plainChars = normalizedPlate.replace(/[\s-]/g, "");
    const charCount = plainChars.length;

    const height = compact ? 23 : 28;
    const euWidth = compact ? 13 : 16;
    const fontSize = compact ? 23 : 29;
    const radius = compact ? 3 : 4;

    const textGapLeft = compact ? 13 : 17;

    const isEuroPlate = fontProfileName === "europlate";

    const textPadLeft = isEuroPlate
        ? (
            compact
                ? (charCount <= 4 ? 0 : charCount <= 6 ? 1 : 2)
                : (charCount <= 4 ? 1 : charCount <= 6 ? 2 : 3)
        )
        : (
            compact
                ? (charCount <= 4 ? 1 : charCount <= 6 ? 2 : 3)
                : (charCount <= 4 ? 2 : charCount <= 6 ? 3 : 4)
        );

    const textPadRight = isEuroPlate
        ? (
            compact
                ? (charCount <= 4 ? 5 : charCount <= 6 ? 6 : 8)
                : (charCount <= 4 ? 7 : charCount <= 6 ? 8 : 10)
        )
        : (
            compact
                ? (charCount <= 4 ? 10 : charCount <= 6 ? 11 : 12)
                : (charCount <= 4 ? 13 : charCount <= 6 ? 14 : 15)
        );

    const euContentX = compact ? 7.6 : 9.2;

    const textWidth = estimatePlateTextWidth(normalizedPlate, fontSize, fontProfile);

    const contentWidth = euWidth + textGapLeft + textPadLeft + textWidth + textPadRight;
    const minWidth = compact ? 74 : 92;
    const maxWidth = compact ? 240 : 320;

    const width = Math.max(minWidth, Math.min(maxWidth, contentWidth));

    const textAreaStartX = euWidth + textGapLeft + textPadLeft;
    const textAreaWidth = width - textAreaStartX - textPadRight;

    const textOffsetX = compact
        ? fontProfile.textOffsetX.compact
        : fontProfile.textOffsetX.normal;

    const textX = textAreaStartX + textAreaWidth / 2 + textOffsetX;
    const textY = height * (fontProfileName === "europlate" ? 0.50 : 0.60);

    const letterSpacing = compact
        ? fontProfile.letterSpacing.compact
        : fontProfile.letterSpacing.normal;

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
                    .tuev-plate-text {
                        font-family: ${fontProfile.fontFamily};
                        font-size: ${fontSize}px;
                        font-weight: 700;
                        letter-spacing: ${letterSpacing};
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
        .replace(/[-–—]+/g, " ")
        .replace(/\s+/g, " ")
        .toUpperCase();
}

function estimatePlateTextWidth(text, fontSize, fontProfile) {
    let width = 0;

    for (const char of text) {
        if (char === " ") {
            width += fontSize * fontProfile.charWidth.space;
        } else if (char === "-") {
            width += fontSize * fontProfile.charWidth.dash;
        } else if (char >= "0" && char <= "9") {
            width += fontSize * fontProfile.charWidth.digit;
        } else if ("MW".includes(char)) {
            width += fontSize * fontProfile.charWidth.wide;
        } else if ("IJ".includes(char)) {
            width += fontSize * fontProfile.charWidth.narrow;
        } else {
            width += fontSize * fontProfile.charWidth.default;
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