import { renderYearDigits as renderYearDigitPaths } from "./digits.js?v=b51";
import { renderDividerLines, renderMarkerPaths, renderMonthDigits } from "./parts.js?v=b51";
import { BADGE_CENTER, BADGE_PROFILE, tuevColorForYear } from "./profile.js?v=b51";

export { tuevColorForYear } from "./profile.js?v=b51";

function getBadgeBlurStyle(blurred) {
    return blurred
        ? "transition: filter 0.5s ease, opacity 0.5s ease; filter: blur(3px); opacity: 0.65;"
        : "transition: filter 0.5s ease, opacity 0.5s ease; filter: blur(0); opacity: 1;";
}

function renderYearDigits(value) {
    return renderYearDigitPaths(value, {
        cx: BADGE_CENTER.x,
        cy: BADGE_CENTER.y,
        height: BADGE_PROFILE.yearDigitHeight,
        gap: BADGE_PROFILE.yearDigitGap
    });
}

export function renderBadge(year, rotation, blurred, size = 250) {
    const yearShort = String(year).slice(-2);
    const color = tuevColorForYear(year);
    const blurStyle = getBadgeBlurStyle(blurred);

    return `
        <svg
            viewBox="0 0 300 300"
            width="${size}"
            height="${size}"
            style="${blurStyle}"
        >
            <g transform="rotate(${rotation} 150 150)">
                <circle cx="${BADGE_CENTER.x}" cy="${BADGE_CENTER.y}" r="${BADGE_PROFILE.outerRadius}" fill="${color}" />

                ${renderMarkerPaths()}

                ${renderDividerLines()}
                ${renderMonthDigits()}

                <circle cx="${BADGE_CENTER.x}" cy="${BADGE_CENTER.y}" r="${BADGE_PROFILE.blackRingRadius}" fill="black" />
                <circle cx="${BADGE_CENTER.x}" cy="${BADGE_CENTER.y}" r="${BADGE_PROFILE.centerRadius}" fill="${color}" />

                ${renderYearDigits(yearShort)}

                <circle
                    cx="${BADGE_CENTER.x}"
                    cy="${BADGE_CENTER.y}"
                    r="${BADGE_PROFILE.outerRadius}"
                    fill="none"
                    stroke="black"
                    stroke-width="${BADGE_PROFILE.strokeWidth}"
                />
            </g>
        </svg>
    `;
}
