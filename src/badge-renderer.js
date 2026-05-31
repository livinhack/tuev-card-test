export function tuevColorForYear(year) {
    const colors = [
        "#da6e00",
        "#007cb0",
        "#ddaf27",
        "#8d4931",
        "#d8a0a6",
        "#61993b"
    ];

    const index = ((year - 2025) % 6 + 6) % 6;
    return colors[index];
}

export function renderBadge(year, rotation, blurred, size = 250) {
    const cx = 150;
    const cy = 150;
    const yearShort = String(year).slice(-2);
    const color = tuevColorForYear(year);

    const OUTER_R = 144;
    const LINE_OUTER_R = 142;
    const BLACK_RING_R = 42;
    const CENTER_R = 36;
    const NUMBER_R = 87;
    const GAP_INNER_R = 63.6;
    const GAP_OUTER_R = 117.8;
    const MONTH_FONT_SIZE = 46.5;
    const YEAR_FONT_SIZE = 56.8;
    const YEAR_Y_OFFSET = 5.9;
    const STROKE = 5;

    const MARKER_START_DEG = -31.1;
    const MARKER_END_DEG = 31.1;
    const MARKER_INNER_R = 117.1;

    const INNER_MARKER_START_DEG = -32.1;
    const INNER_MARKER_END_DEG = 32.1;
    const INNER_MARKER_OUTER_R = 66.5;
    const INNER_MARKER_INNER_R = 40;

    const LINE_INNER_R = BLACK_RING_R;
    const labelOrder = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

    const fontFamily =
        "'Bahnschrift SemiCondensed', 'Bahnschrift Condensed', Bahnschrift, 'DIN 1451 Engschrift', 'DIN 1451 Mittelschrift', 'DIN Alternate', 'Arial Narrow', sans-serif";

    const blurStyle = blurred
        ? "transition: filter 0.5s ease, opacity 0.5s ease; filter: blur(3px); opacity: 0.65;"
        : "transition: filter 0.5s ease, opacity 0.5s ease; filter: blur(0); opacity: 1;";

    const polar = (deg, r) => {
        const rad = (deg - 90) * Math.PI / 180;

        return {
            x: cx + Math.cos(rad) * r,
            y: cy + Math.sin(rad) * r
        };
    };

    const splitMarkerVertical = (startDeg, endDeg, innerR, outerR, gapWidth) => {
        const halfGap = gapWidth / 2;

        const pStartOuter = polar(startDeg, outerR);
        const pStartInner = polar(startDeg, innerR);
        const pEndOuter = polar(endDeg, outerR);
        const pEndInner = polar(endDeg, innerR);

        const outerCutLeft = {
            x: cx - halfGap,
            y: cy - Math.sqrt(Math.max(0, outerR * outerR - halfGap * halfGap))
        };

        const outerCutRight = {
            x: cx + halfGap,
            y: cy - Math.sqrt(Math.max(0, outerR * outerR - halfGap * halfGap))
        };

        const innerCutLeft = {
            x: cx - halfGap,
            y: cy - Math.sqrt(Math.max(0, innerR * innerR - halfGap * halfGap))
        };

        const innerCutRight = {
            x: cx + halfGap,
            y: cy - Math.sqrt(Math.max(0, innerR * innerR - halfGap * halfGap))
        };

        const leftPath = `
            M ${pStartOuter.x} ${pStartOuter.y}
            A ${outerR} ${outerR} 0 0 1 ${outerCutLeft.x} ${outerCutLeft.y}
            L ${innerCutLeft.x} ${innerCutLeft.y}
            A ${innerR} ${innerR} 0 0 0 ${pStartInner.x} ${pStartInner.y}
            Z
        `;

        const rightPath = `
            M ${outerCutRight.x} ${outerCutRight.y}
            A ${outerR} ${outerR} 0 0 1 ${pEndOuter.x} ${pEndOuter.y}
            L ${pEndInner.x} ${pEndInner.y}
            A ${innerR} ${innerR} 0 0 0 ${innerCutRight.x} ${innerCutRight.y}
            Z
        `;

        return { leftPath, rightPath };
    };

    const markerGapWidth = STROKE;

    const outerMarker = splitMarkerVertical(
        MARKER_START_DEG,
        MARKER_END_DEG,
        MARKER_INNER_R,
        OUTER_R,
        markerGapWidth
    );

    const innerMarker = splitMarkerVertical(
        INNER_MARKER_START_DEG,
        INNER_MARKER_END_DEG,
        INNER_MARKER_INNER_R,
        INNER_MARKER_OUTER_R,
        markerGapWidth
    );

    const dividerLines = Array.from({ length: 12 }, (_, i) => {
        if (i === 0) {
            return "";
        }

        const angle = i * 30;

        const innerA = polar(angle, LINE_INNER_R);
        const innerB = polar(angle, GAP_INNER_R);

        const outerA = polar(angle, GAP_OUTER_R);
        const outerB = polar(angle, LINE_OUTER_R);

        return `
            <line
                x1="${innerA.x}" y1="${innerA.y}"
                x2="${innerB.x}" y2="${innerB.y}"
                stroke="black"
                stroke-width="${STROKE}"
                stroke-linecap="butt"
            />
            <line
                x1="${outerA.x}" y1="${outerA.y}"
                x2="${outerB.x}" y2="${outerB.y}"
                stroke="black"
                stroke-width="${STROKE}"
                stroke-linecap="butt"
            />
        `;
    }).join("");

    const monthTexts = labelOrder.map((num, i) => {
        const angle = i * 30;
        const p = polar(angle, NUMBER_R);

        return `
            <text
                x="${p.x}"
                y="${p.y}"
                transform="rotate(${angle} ${p.x} ${p.y})"
                font-size="${MONTH_FONT_SIZE}"
                text-anchor="middle"
                dominant-baseline="middle"
                font-family="${fontFamily}"
                font-weight="500"
                fill="black"
                style="font-stretch: condensed;"
            >
                ${num}
            </text>
        `;
    }).join("");

    return `
        <svg
            viewBox="0 0 300 300"
            width="${size}"
            height="${size}"
            style="${blurStyle}"
        >
            <g transform="rotate(${rotation} 150 150)">
                <circle cx="${cx}" cy="${cy}" r="${OUTER_R}" fill="${color}" />

                <path d="${outerMarker.leftPath}" fill="black" />
                <path d="${outerMarker.rightPath}" fill="black" />
                <path d="${innerMarker.leftPath}" fill="black" />
                <path d="${innerMarker.rightPath}" fill="black" />

                ${dividerLines}
                ${monthTexts}

                <circle cx="${cx}" cy="${cy}" r="${BLACK_RING_R}" fill="black" />
                <circle cx="${cx}" cy="${cy}" r="${CENTER_R}" fill="${color}" />

                <text
                    x="${cx}"
                    y="${cy + YEAR_Y_OFFSET}"
                    font-size="${YEAR_FONT_SIZE}"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    font-family="${fontFamily}"
                    font-weight="500"
                    fill="black"
                    style="font-stretch: condensed;"
                >
                    ${yearShort}
                </text>

                <circle
                    cx="${cx}"
                    cy="${cy}"
                    r="${OUTER_R}"
                    fill="none"
                    stroke="black"
                    stroke-width="${STROKE}"
                />
            </g>
        </svg>
    `;
}