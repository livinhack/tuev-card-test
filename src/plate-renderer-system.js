import {
    escapeHtml,
    hashString,
    normalizePlate,
    renderEuStars
} from "./plate-renderer-shared.js";

const FONT_PROFILE = {
    fontFamily: '"Bahnschrift SemiCondensed", "Bahnschrift Condensed", "Arial Narrow", sans-serif',
    letterSpacing: {
        normal: "0.7px",
        compact: "0.45px",
        tiny: "0.10px"
    },
    textOffsetX: {
        normal: -4,
        compact: -2.5,
        tiny: 0.0
    },
    textY: {
        normal: 0.60,
        compact: 0.60,
        tiny: 0.58
    },
    charWidth: {
        space: 0.28,
        digit: 0.52,
        wide: 0.68,
        narrow: 0.34,
        default: 0.56
    }
};

const LAYOUT_PROFILES = {
    normal: {
        height: 28,
        euWidth: 16,
        fontSize: 29,
        radius: 4,
        textGapLeft: 17,
        euContentX: 9.2,
        minWidth: 82,
        maxWidth: 320,
        starY: 0.27,
        starRadius: 3.8,
        starDotRadius: 0.64,
        countryY: 0.78,
        countryFontSize: 7.2
    },
    compact: {
        height: 23,
        euWidth: 13,
        fontSize: 23,
        radius: 3,
        textGapLeft: 13,
        euContentX: 7.6,
        minWidth: 64,
        maxWidth: 240,
        starY: 0.27,
        starRadius: 3.1,
        starDotRadius: 0.52,
        countryY: 0.78,
        countryFontSize: 5.8
    },
    tiny: {
        height: 20,
        euWidth: 9,
        fontSize: 17,
        radius: 2.5,
        textGapLeft: 6,
        euContentX: 5.0,
        minWidth: 52,
        maxWidth: 175,
        starY: 0.27,
        starRadius: 2.2,
        starDotRadius: 0.38,
        countryY: 0.78,
        countryFontSize: 4.5
    }
};

export function renderSystemLicensePlate(plate, options = {}) {
    const normalizedPlate = normalizePlate(plate);

    if (!normalizedPlate) {
        return "";
    }

    const sizeProfileName = ["normal", "compact", "tiny"].includes(options.sizeProfile)
        ? options.sizeProfile
        : Boolean(options.compact)
            ? "compact"
            : "normal";

    const layout = LAYOUT_PROFILES[sizeProfileName];

    const scale = Number.isFinite(Number(options.scale))
        ? Number(options.scale)
        : 1;

    const plainChars = normalizedPlate.replace(/\s/g, "");
    const charCount = plainChars.length;

    const textPadLeft = getLeftPadding(charCount, sizeProfileName);
    const textPadRight = getRightPadding(charCount, sizeProfileName);

    const textWidth = estimatePlateTextWidth(
        normalizedPlate,
        layout.fontSize,
        sizeProfileName
    );

    const contentWidth =
        layout.euWidth +
        layout.textGapLeft +
        textPadLeft +
        textWidth +
        textPadRight;

    const width = Math.max(
        layout.minWidth,
        Math.min(layout.maxWidth, contentWidth)
    );

    const height = layout.height;
    const displayWidth = Math.round(width * scale);
    const displayHeight = Math.round(height * scale);

    const textAreaStartX = layout.euWidth + layout.textGapLeft + textPadLeft;
    const textAreaWidth = width - textAreaStartX - textPadRight;

    const textX =
        textAreaStartX +
        textAreaWidth / 2 +
        FONT_PROFILE.textOffsetX[sizeProfileName];

    const textY = height * FONT_PROFILE.textY[sizeProfileName];
    const letterSpacing = FONT_PROFILE.letterSpacing[sizeProfileName];

    const clipId = `plateClip-${hashString(normalizedPlate)}-${sizeProfileName}-system`;

    return renderPlateSvg({
        normalizedPlate,
        width,
        height,
        displayWidth,
        displayHeight,
        layout,
        textX,
        textY,
        letterSpacing,
        clipId
    });
}

function getLeftPadding(charCount, sizeProfileName) {
    if (sizeProfileName === "tiny") {
        return charCount <= 4 ? 0 : charCount <= 6 ? 1 : 2;
    }

    if (sizeProfileName === "compact") {
        return charCount <= 4 ? 1 : charCount <= 6 ? 2 : 3;
    }

    return charCount <= 4 ? 2 : charCount <= 6 ? 3 : 4;
}

function getRightPadding(charCount, sizeProfileName) {
    if (sizeProfileName === "tiny") {
        return charCount <= 4 ? 8 : charCount <= 6 ? 10 : 12;
    }

    if (sizeProfileName === "compact") {
        return charCount <= 4 ? 10 : charCount <= 6 ? 11 : 12;
    }

    return charCount <= 4 ? 13 : charCount <= 6 ? 14 : 15;
}

function estimatePlateTextWidth(text, fontSize, sizeProfileName) {
    let width = 0;

    const letterSpacing = Number.parseFloat(
        FONT_PROFILE.letterSpacing?.[sizeProfileName] || "0"
    ) || 0;

    for (const char of text) {
        if (char === " ") {
            width += fontSize * FONT_PROFILE.charWidth.space;
        } else if (char >= "0" && char <= "9") {
            width += fontSize * FONT_PROFILE.charWidth.digit;
        } else if ("MW".includes(char)) {
            width += fontSize * FONT_PROFILE.charWidth.wide;
        } else if ("IJ".includes(char)) {
            width += fontSize * FONT_PROFILE.charWidth.narrow;
        } else {
            width += fontSize * FONT_PROFILE.charWidth.default;
        }
    }

    return width + Math.max(0, text.length - 1) * letterSpacing;
}

function renderPlateSvg({
    normalizedPlate,
    width,
    height,
    displayWidth,
    displayHeight,
    layout,
    textX,
    textY,
    letterSpacing,
    clipId
}) {
    return `
        <svg
            viewBox="0 0 ${width} ${height}"
            width="${displayWidth}"
            height="${displayHeight}"
            role="img"
            aria-label="${escapeHtml(normalizedPlate)}"
            style="
                display: block;
                width: ${displayWidth}px;
                height: ${displayHeight}px;
                flex: 0 0 auto;
            "
        >
            <defs>
                <clipPath id="${clipId}">
                    <rect
                        x="1"
                        y="1"
                        width="${width - 2}"
                        height="${height - 2}"
                        rx="${layout.radius}"
                        ry="${layout.radius}"
                    />
                </clipPath>

                <style>
                    .tuev-plate-text {
                        font-family: ${FONT_PROFILE.fontFamily};
                        font-size: ${layout.fontSize}px;
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
                    width="${layout.euWidth}"
                    height="${height - 2}"
                    fill="#003399"
                />

                <rect
                    x="${layout.euWidth}"
                    y="1"
                    width="1"
                    height="${height - 2}"
                    fill="#111"
                    opacity="0.10"
                />

                ${renderEuStars(
                    layout.euContentX,
                    height * layout.starY,
                    layout.starRadius,
                    layout.starDotRadius
                )}

                <text
                    x="${layout.euContentX}"
                    y="${height * layout.countryY}"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    font-family="Arial, sans-serif"
                    font-size="${layout.countryFontSize}"
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
                rx="${layout.radius}"
                ry="${layout.radius}"
                fill="none"
                stroke="#111"
                stroke-width="2"
            />
        </svg>
    `;
}