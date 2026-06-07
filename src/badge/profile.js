export const BADGE_CENTER = Object.freeze({
    x: 150,
    y: 150
});

export const BADGE_COLORS = Object.freeze([
    "#da6e00",
    "#007cb0",
    "#ddaf27",
    "#8d4931",
    "#d8a0a6",
    "#61993b"
]);

export const BADGE_PROFILE = Object.freeze({
    outerRadius: 144,
    lineOuterRadius: 142,
    blackRingRadius: 42,
    centerRadius: 36,
    monthNumberRadius: 91,
    gapInnerRadius: 63.6,
    gapOuterRadius: 117.8,
    monthDigitHeight: 39,
    monthDigitGap: 2.0,
    yearDigitHeight: 42,
    yearDigitGap: 3.5,
    strokeWidth: 5
});

export const BADGE_MARKER_PROFILE = Object.freeze({
    outer: Object.freeze({
        startDeg: -31.1,
        endDeg: 31.1,
        innerRadius: 117.1
    }),
    inner: Object.freeze({
        startDeg: -32.1,
        endDeg: 32.1,
        outerRadius: 66.5,
        innerRadius: 40
    })
});

export const BADGE_MONTH_LABEL_ORDER = Object.freeze([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);

export function tuevColorForYear(year) {
    const index = ((year - 2025) % BADGE_COLORS.length + BADGE_COLORS.length) % BADGE_COLORS.length;
    return BADGE_COLORS[index];
}
