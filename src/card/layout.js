const HORIZONTAL_PADDING = 32;
const MULTI_GAP = 18;
const SINGLE_GAP = 12;

const MIN_TILE_WIDTH = 100;
const MAX_MANUAL_COLUMNS = 4;
const MAX_AUTO_COLUMNS = 16;

export function getTileWidth(innerWidth, columns, gap) {
    if (columns <= 1) {
        return innerWidth;
    }

    return Math.max(0, (innerWidth - gap * (columns - 1)) / columns);
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function calculateBestColumns(innerWidth, gap, maxColumns, minTileWidth) {
    const safeMaxColumns = Math.max(1, Math.floor(Number(maxColumns) || 1));

    if (!innerWidth) {
        return 1;
    }

    let columns = Math.max(
        1,
        Math.min(
            safeMaxColumns,
            Math.floor((innerWidth + gap) / (minTileWidth + gap))
        )
    );

    while (columns > 1 && getTileWidth(innerWidth, columns, gap) < minTileWidth) {
        columns -= 1;
    }

    return columns;
}

export function calculateLayoutInfo({ cardWidth, isMulti, requestedColumns }) {
    const gap = isMulti ? MULTI_GAP : SINGLE_GAP;
    const innerWidth = Math.max(0, cardWidth - HORIZONTAL_PADDING);

    if (!isMulti) {
        return {
            cardWidth,
            innerWidth,
            gap,
            effectiveColumns: 1,
            tileWidth: innerWidth,
            gridTemplateColumns: "1fr"
        };
    }

    const requested = String(requestedColumns || "auto");
    const maxColumns = requested === "auto"
        ? MAX_AUTO_COLUMNS
        : Math.min(MAX_MANUAL_COLUMNS, Math.max(1, Number(requested) || 1));

    const effectiveColumns = calculateBestColumns(
        innerWidth,
        gap,
        maxColumns,
        MIN_TILE_WIDTH
    );
    const tileWidth = getTileWidth(innerWidth, effectiveColumns, gap);

    return {
        cardWidth,
        innerWidth,
        gap,
        effectiveColumns,
        tileWidth,
        gridTemplateColumns: `repeat(${effectiveColumns}, minmax(0, 1fr))`
    };
}

export function calculateAutomaticBadgeSize({ isMulti, effectiveColumns, tileWidth }) {
    if (!isMulti) {
        return 250;
    }

    const safety = effectiveColumns <= 2 ? 18 : 14;
    const dynamicSize = Math.floor(tileWidth - safety);

    if (effectiveColumns <= 1) {
        return clamp(dynamicSize, 170, 220);
    }

    if (effectiveColumns === 2) {
        return clamp(dynamicSize, 140, 175);
    }

    if (effectiveColumns === 3) {
        return clamp(dynamicSize, 105, 145);
    }

    return clamp(dynamicSize, 80, 105);
}
