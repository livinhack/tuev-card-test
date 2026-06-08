import {
    checkPlateFontAvailable,
    ensurePlateFont,
    injectPlateFont,
    isPlateFontLoaded
} from "./font.js?v=b25";

export {
    checkPlateFontAvailable,
    ensurePlateFont,
    isPlateFontLoaded
};

const EUROPLATE_FONT_FAMILY = '"EuroPlate", "Arial Narrow", Arial, sans-serif';

// Single base geometry for all graphical plates. The card calculates one
// shared scale from the widest plate and the current tile width; every plate
// is then rendered with this same scale. This keeps the visible height, font
// size and vertical padding consistent while allowing shorter plates to remain
// narrower.
const PLATE_GEOMETRY = {
    height: 38,
    minWidth: 118,
    radius: 3,
    euWidth: 19,
    euContentX: 10,
    textGapLeft: 7,
    fontSize: 30,
    textY: 0.515,
    textScaleY: 1.18,
    letterSpacing: 1.1,
    starY: 0.30,
    starRadius: 5.2,
    starDotRadius: 0.75,
    countryY: 0.72,
    countryFontSize: 8.2
};

const CHAR_WIDTH = {
    space: 0.29,
    digit: 0.48,
    wide: 0.61,
    narrow: 0.36,
    default: 0.51
};

let plateFontRequested = false;

export function normalizePlate(plate) {
    return String(plate || "")
        .trim()
        .replace(/[-–—]+/g, " ")
        .replace(/\s+/g, " ")
        .toUpperCase();
}

export function renderLicensePlate(plate, options = {}) {
    if (!plateFontRequested) {
        plateFontRequested = true;
        injectPlateFont();
    }

    const metrics = getLicensePlateMetrics(plate, options);

    if (!metrics.normalizedPlate) {
        return "";
    }

    const {
        normalizedPlate,
        layout,
        width,
        height,
        textPadLeft,
        textPadRight
    } = metrics;

    const requestedScale = Number(options.scale || 0);
    const maxWidth = Number(options.maxWidth || 0);
    const fallbackScale = Number.isFinite(maxWidth) && maxWidth > 0
        ? maxWidth / width
        : 1;

    // The card should pass one shared scale for all plates. If the renderer is
    // called directly, it still protects a single plate with maxWidth.
    const scale = Number.isFinite(requestedScale) && requestedScale > 0
        ? Math.min(1, requestedScale)
        : Math.min(1, fallbackScale);
    const displayWidth = Math.max(1, Math.round(width * scale));
    const displayHeight = Math.max(1, Math.round(height * scale));

    const textAreaStartX = layout.euWidth + layout.textGapLeft + textPadLeft;
    const textAreaWidth = width - textAreaStartX - textPadRight;
    const textX = textAreaStartX + textAreaWidth / 2;

    const textY = height * layout.textY;
    const textScaleY = layout.textScaleY || 1;
    const textTransform = textScaleY === 1
        ? ""
        : `translate(0 ${textY}) scale(1 ${textScaleY}) translate(0 ${-textY})`;
    const letterSpacing = `${layout.letterSpacing}px`;
    const clipId = `plateClip-${hashString(`${normalizedPlate}-${Math.round(width * 10)}-${Math.round(height * 10)}`)}`;

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
        textTransform,
        clipId
    });
}

export function getLicensePlateMetrics(plate, options = {}) {
    const normalizedPlate = normalizePlate(plate);

    if (!normalizedPlate) {
        return {
            width: 0,
            height: 0,
            normalizedPlate: ""
        };
    }

    const layout = PLATE_GEOMETRY;
    const plainChars = normalizedPlate.replace(/\s/g, "");
    const charCount = plainChars.length;
    const textPadLeft = getLeftPadding(charCount);
    const textPadRight = getRightPadding(charCount);
    const textWidth = estimatePlateTextWidth(normalizedPlate, layout.fontSize);

    const contentWidth =
        layout.euWidth +
        layout.textGapLeft +
        textPadLeft +
        textWidth +
        textPadRight;

    // Do not cap the measured width. The widest real content width must be
    // allowed to determine the shared card-wide scale.
    const width = Math.max(layout.minWidth, contentWidth);

    return {
        width,
        height: layout.height,
        normalizedPlate,
        layout,
        charCount,
        textPadLeft,
        textPadRight,
        textWidth
    };
}

function getLeftPadding(charCount) {
    return charCount >= 8 ? 7 : charCount <= 4 ? 2 : charCount <= 6 ? 3 : 5;
}

function getRightPadding(charCount) {
    return charCount >= 8 ? 9 : charCount <= 4 ? 8 : charCount <= 6 ? 9 : 10;
}

function estimatePlateTextWidth(text, fontSize) {
    let width = 0;
    const letterSpacing = PLATE_GEOMETRY.letterSpacing || 0;

    for (const char of text) {
        if (char === " ") {
            width += fontSize * CHAR_WIDTH.space;
        } else if (char >= "0" && char <= "9") {
            width += fontSize * CHAR_WIDTH.digit;
        } else if ("MW".includes(char)) {
            width += fontSize * CHAR_WIDTH.wide;
        } else if ("IJ".includes(char)) {
            width += fontSize * CHAR_WIDTH.narrow;
        } else {
            width += fontSize * CHAR_WIDTH.default;
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
    textTransform,
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
                max-width: none;
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
                        font-family: ${EUROPLATE_FONT_FAMILY};
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
                    transform="${textTransform}"
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
