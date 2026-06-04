export function normalizePlate(plate) {
    return String(plate || "")
        .trim()
        .replace(/[-–—]+/g, " ")
        .replace(/\s+/g, " ")
        .toUpperCase();
}

export function renderEuStars(cx, cy, radius, starRadius) {
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

export function renderProfiledLicensePlate({
    plate,
    options = {},
    fontProfile,
    layoutProfiles,
    rendererName,
    getLeftPadding,
    getRightPadding
}) {
    const normalizedPlate = normalizePlate(plate);

    if (!normalizedPlate) {
        return "";
    }

    const sizeProfileName = ["normal", "compact", "tiny"].includes(options.sizeProfile)
        ? options.sizeProfile
        : Boolean(options.compact)
            ? "compact"
            : "normal";

    const layout = layoutProfiles[sizeProfileName];

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
        sizeProfileName,
        fontProfile
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
        fontProfile.textOffsetX[sizeProfileName];

    const textY = height * fontProfile.textY[sizeProfileName];
    const letterSpacing = fontProfile.letterSpacing[sizeProfileName];

    const clipId = `plateClip-${hashString(normalizedPlate)}-${sizeProfileName}-${rendererName}`;

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
        clipId,
        fontProfile
    });
}

function estimatePlateTextWidth(text, fontSize, sizeProfileName, fontProfile) {
    let width = 0;

    const letterSpacing = Number.parseFloat(
        fontProfile.letterSpacing?.[sizeProfileName] || "0"
    ) || 0;

    for (const char of text) {
        if (char === " ") {
            width += fontSize * fontProfile.charWidth.space;
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
    clipId,
    fontProfile
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
                        font-family: ${fontProfile.fontFamily};
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

export function hashString(value) {
    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
        hash = ((hash << 5) - hash) + value.charCodeAt(index);
        hash |= 0;
    }

    return Math.abs(hash);
}

export function escapeHtml(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}