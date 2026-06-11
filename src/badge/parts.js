import { renderBadgeDigits } from "./digits.js?v=b46";
import { polar, splitMarkerVertical } from "./geometry.js?v=b46";
import {
    BADGE_CENTER,
    BADGE_MARKER_PROFILE,
    BADGE_MONTH_LABEL_ORDER,
    BADGE_PROFILE
} from "./profile.js?v=b46";

export function renderMarkerPaths() {
    const markerGapWidth = BADGE_PROFILE.strokeWidth;

    const outerMarker = splitMarkerVertical(
        BADGE_CENTER,
        BADGE_MARKER_PROFILE.outer.startDeg,
        BADGE_MARKER_PROFILE.outer.endDeg,
        BADGE_MARKER_PROFILE.outer.innerRadius,
        BADGE_PROFILE.outerRadius,
        markerGapWidth
    );

    const innerMarker = splitMarkerVertical(
        BADGE_CENTER,
        BADGE_MARKER_PROFILE.inner.startDeg,
        BADGE_MARKER_PROFILE.inner.endDeg,
        BADGE_MARKER_PROFILE.inner.innerRadius,
        BADGE_MARKER_PROFILE.inner.outerRadius,
        markerGapWidth
    );

    return `
                <path d="${outerMarker.leftPath}" fill="black" />
                <path d="${outerMarker.rightPath}" fill="black" />
                <path d="${innerMarker.leftPath}" fill="black" />
                <path d="${innerMarker.rightPath}" fill="black" />
    `;
}

export function renderDividerLines() {
    return Array.from({ length: 12 }, (_, i) => {
        if (i === 0) {
            return "";
        }

        const angle = i * 30;

        const innerA = polar(BADGE_CENTER, angle, BADGE_PROFILE.blackRingRadius);
        const innerB = polar(BADGE_CENTER, angle, BADGE_PROFILE.gapInnerRadius);

        const outerA = polar(BADGE_CENTER, angle, BADGE_PROFILE.gapOuterRadius);
        const outerB = polar(BADGE_CENTER, angle, BADGE_PROFILE.lineOuterRadius);

        return `
            <line
                x1="${innerA.x}" y1="${innerA.y}"
                x2="${innerB.x}" y2="${innerB.y}"
                stroke="black"
                stroke-width="${BADGE_PROFILE.strokeWidth}"
                stroke-linecap="butt"
            />
            <line
                x1="${outerA.x}" y1="${outerA.y}"
                x2="${outerB.x}" y2="${outerB.y}"
                stroke="black"
                stroke-width="${BADGE_PROFILE.strokeWidth}"
                stroke-linecap="butt"
            />
        `;
    }).join("");
}

export function renderMonthDigits() {
    return BADGE_MONTH_LABEL_ORDER.map((num, i) => {
        const angle = i * 30;
        const p = polar(BADGE_CENTER, angle, BADGE_PROFILE.monthNumberRadius);

        return renderBadgeDigits(num, {
            cx: p.x,
            cy: p.y,
            height: BADGE_PROFILE.monthDigitHeight,
            gap: BADGE_PROFILE.monthDigitGap,
            rotation: angle,
            rotateOriginX: p.x,
            rotateOriginY: p.y
        });
    }).join("");
}
