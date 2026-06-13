import { renderBadge } from "../badge/renderer.js?v=b56";

export function renderMissingEntity(entityId, localize) {
    return `
        <div style="
            padding: 12px;
            border-radius: 12px;
            background: var(--card-background-color);
            border: 1px solid var(--divider-color);
        ">
            <div style="font-weight: 600; margin-bottom: 4px;">
                ${localize("error.entity_not_found")}
            </div>
            <div style="font-size: 13px; opacity: 0.75;">
                ${entityId}
            </div>
        </div>
    `;
}

export function renderVehicleHeader({
    compact,
    vehicleName,
    plate,
    plateLayout,
    renderPlate
}) {
    return `
        <div style="
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 1px;
            text-align: center;
        ">
            <div style="
                font-size: ${compact ? "18px" : "22px"};
                font-weight: 600;
                line-height: 1.2;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            ">
                ${vehicleName}
            </div>

            ${plateLayout && plate ? `
                <div style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    margin-top: 3px;
                    overflow: hidden;
                ">
                    ${renderPlate()}
                </div>
            ` : `
                <div style="
                    font-size: ${compact ? "13px" : "15px"};
                    opacity: 0.75;
                    letter-spacing: 0.08em;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                ">
                    ${plate}
                </div>
            `}
        </div>
    `;
}

export function getOverlayStyleOptions({ badgeSize, compact }) {
    const overlayScale = badgeSize <= 115
        ? "tiny"
        : badgeSize <= 140
            ? "small"
            : "normal";

    return {
        minWidth: {
            tiny: 104,
            small: 122,
            normal: compact ? 145 : 170
        }[overlayScale],
        maxWidth: {
            tiny: 126,
            small: 150,
            normal: compact ? 180 : 220
        }[overlayScale],
        padding: {
            tiny: "7px",
            small: "8px",
            normal: compact ? "10px" : "12px"
        }[overlayScale],
        gap: {
            tiny: "5px",
            small: "6px",
            normal: compact ? "7px" : "9px"
        }[overlayScale],
        titleSize: {
            tiny: "11px",
            small: "12px",
            normal: compact ? "14px" : "16px"
        }[overlayScale],
        textSize: {
            tiny: "10px",
            small: "11px",
            normal: compact ? "12px" : "13px"
        }[overlayScale],
        buttonPadding: {
            tiny: "5px 9px",
            small: "6px 10px",
            normal: compact ? "7px 12px" : "8px 15px"
        }[overlayScale],
        buttonFontSize: {
            tiny: "10px",
            small: "11px",
            normal: compact ? "12px" : "13px"
        }[overlayScale]
    };
}

export function renderConfirmOverlay({
    entityId,
    ui,
    showSuccess,
    overlayTitle,
    overlayText,
    buttonText,
    style
}) {
    return `
        <div
            style="
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                z-index: 5;
                min-width: ${style.minWidth}px;
                max-width: ${style.maxWidth}px;
                padding: ${style.padding};
                border-radius: 16px;
                background: rgba(20, 20, 20, 0.62);
                border: 1px solid rgba(255, 255, 255, 0.20);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.38);
                backdrop-filter: blur(6px);
                -webkit-backdrop-filter: blur(6px);
                color: white;
                text-align: center;
                display: flex;
                flex-direction: column;
                gap: ${style.gap};
                align-items: center;
                transition:
                    opacity 0.5s ease,
                    transform 0.3s ease;
            "
        >
            <div style="
                font-size: ${style.titleSize};
                font-weight: 700;
                line-height: 1.15;
            ">
                ${overlayTitle}
            </div>

            <div style="
                font-size: ${style.textSize};
                opacity: 0.9;
                line-height: 1.2;
            ">
                ${overlayText}
            </div>

            <button
                data-confirm-entity="${entityId}"
                ${ui.confirming || showSuccess ? "disabled" : ""}
                style="
                    border: none;
                    border-radius: 999px;
                    padding: ${style.buttonPadding};
                    background: ${showSuccess ? "var(--success-color, #43a047)" : "var(--primary-color)"};
                    color: var(--text-primary-color);
                    font-size: ${style.buttonFontSize};
                    font-weight: 700;
                    cursor: ${ui.confirming || showSuccess ? "default" : "pointer"};
                    white-space: nowrap;
                    opacity: ${ui.confirming ? "0.75" : "1"};
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.30);
                "
            >
                ${buttonText}
            </button>
        </div>
    `;
}

export function renderVehicleDetails({ showDetails, compact, huLabel, statusColor, statusLabel }) {
    if (!showDetails) {
        return "";
    }

    return `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            font-size: ${compact ? "12px" : "13px"};
            line-height: 1.25;
            opacity: 0.82;
            text-align: center;
        ">
            <div style="font-weight: 600;">
                ${huLabel}
            </div>
            <div style="
                display: inline-flex;
                align-items: center;
                gap: 5px;
            ">
                <span style="
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: ${statusColor};
                    display: inline-block;
                    box-shadow: 0 0 5px ${statusColor};
                    flex: 0 0 auto;
                "></span>
                <span style="color: inherit;">
                    ${statusLabel}
                </span>
            </div>
        </div>
    `;
}

export function renderBadgeLayer(badge, size) {
    return `
        <div style="
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 1;
            z-index: 1;
        ">
            ${renderBadge(badge.year, badge.rotation, badge.blurred, size)}
        </div>
    `;
}

export function renderCrossfadeLayer(crossfade, size) {
    if (!crossfade.from) {
        return "";
    }

    return `
        <div style="
            position: absolute;
            inset: 0;
            z-index: 2;
            pointer-events: none;
        ">
            <div
                style="
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: tuevFadeOut ${crossfade.duration}ms ease forwards;
                "
            >
                ${renderBadge(crossfade.from.year, crossfade.from.rotation, crossfade.from.blurred, size)}
            </div>

            <div
                style="
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: tuevFadeIn ${crossfade.duration}ms ease forwards;
                "
            >
                ${renderBadge(crossfade.to.year, crossfade.to.rotation, crossfade.to.blurred, size)}
            </div>

            <style>
                @keyframes tuevFadeOut {
                    from { opacity: 1; transform: scale(1); }
                    to { opacity: 0; transform: scale(0.985); }
                }

                @keyframes tuevFadeIn {
                    from { opacity: 0; transform: scale(1.015); }
                    to { opacity: 1; transform: scale(1); }
                }
            </style>
        </div>
    `;
}

function renderStampLines(text) {
    const parts = String(text || "").trim().split(/\s+/).filter(Boolean);

    if (parts.length <= 1) {
        return `<span>${text}</span>`;
    }

    return `
        <span>${parts[0]}</span>
        <span>${parts.slice(1).join(" ")}</span>
    `;
}

export function renderCompactConfirmPanel({
    entityId,
    ui,
    showSuccess,
    overlayTitle,
    actionText,
    compact,
    expired
}) {
    const acknowledged = ui.confirming || showSuccess;
    const stampColor = showSuccess
        ? "var(--success-color, #43a047)"
        : expired
            ? "var(--error-color, #db5337)"
            : "var(--warning-color, #ffa000)";
    const actionColor = showSuccess ? "var(--success-color, #43a047)" : "var(--success-color, #2e9d43)";
    const stampLines = renderStampLines(overlayTitle);
    const actionLines = renderStampLines(actionText);

    return `
        <div style="
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(-18deg);
            z-index: 6;
            width: max-content;
            max-width: min(96%, ${compact ? "154px" : "178px"});
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: ${compact ? "3px" : "4px"};
            pointer-events: none;
            filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.48));
        ">
            <div style="
                position: relative;
                box-sizing: border-box;
                min-width: ${compact ? "62px" : "72px"};
                max-width: 100%;
                padding: ${compact ? "4px 8px 5px" : "5px 10px 6px"};
                border: 2px solid color-mix(in srgb, ${stampColor} 88%, transparent);
                outline: 1px dashed color-mix(in srgb, ${stampColor} 64%, transparent);
                outline-offset: -4px;
                border-radius: 4px;
                background:
                    radial-gradient(circle at 24% 24%, color-mix(in srgb, ${stampColor} 28%, transparent), transparent 45%),
                    radial-gradient(circle at 72% 70%, color-mix(in srgb, ${stampColor} 16%, transparent), transparent 48%),
                    linear-gradient(135deg, transparent 0 10%, color-mix(in srgb, ${stampColor} 18%, transparent) 10% 21%, transparent 21% 100%),
                    color-mix(in srgb, ${stampColor} 18%, rgba(0, 0, 0, 0.78));
                color: color-mix(in srgb, ${stampColor} 78%, white 22%);
                font-family: 'Arial Narrow', 'DIN Condensed', 'Bahnschrift SemiCondensed', sans-serif;
                font-size: ${compact ? "10px" : "11px"};
                font-weight: 900;
                line-height: 0.92;
                letter-spacing: 0.28px;
                text-transform: uppercase;
                text-align: center;
                text-shadow: 0 1px 1px rgba(0, 0, 0, 0.78), 0 0 5px rgba(0, 0, 0, 0.35);
                opacity: ${showSuccess ? "0.94" : "0.92"};
                overflow: hidden;
                pointer-events: none;
                backdrop-filter: blur(2.2px) saturate(1.18);
            ">
                <span style="position: absolute; left: 10%; top: -3px; width: 20px; height: 6px; background: rgba(0, 0, 0, 0.60); transform: rotate(-7deg); opacity: 0.34;"></span>
                <span style="position: absolute; right: 16%; bottom: -3px; width: 26px; height: 5px; background: rgba(0, 0, 0, 0.62); transform: rotate(5deg); opacity: 0.32;"></span>
                <span style="position: absolute; left: 46%; top: 47%; width: 31px; height: 2px; background: rgba(0, 0, 0, 0.50); transform: rotate(-10deg); opacity: 0.22;"></span>
                <span style="position: relative; z-index: 1; display: inline-flex; flex-direction: column; align-items: center; gap: 1px; white-space: nowrap;">
                    ${stampLines}
                </span>
            </div>

            <button
                data-confirm-entity="${entityId}"
                ${acknowledged ? "disabled" : ""}
                style="
                    position: relative;
                    transform: translateX(${compact ? "9px" : "13px"}) rotate(14deg);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: ${compact ? "5px" : "6px"};
                    max-width: 100%;
                    box-sizing: border-box;
                    padding: ${compact ? "4px 6px" : "5px 8px"};
                    border-radius: 4px;
                    border: 2px solid color-mix(in srgb, ${actionColor} 88%, transparent);
                    outline: 1px dashed color-mix(in srgb, ${actionColor} 62%, transparent);
                    outline-offset: -4px;
                    background:
                        radial-gradient(circle at 72% 28%, color-mix(in srgb, ${actionColor} 26%, transparent), transparent 44%),
                        radial-gradient(circle at 24% 76%, color-mix(in srgb, ${actionColor} 14%, transparent), transparent 48%),
                        linear-gradient(135deg, transparent 0 12%, color-mix(in srgb, ${actionColor} 18%, transparent) 12% 23%, transparent 23% 100%),
                        color-mix(in srgb, ${actionColor} 18%, rgba(0, 0, 0, 0.76));
                    color: color-mix(in srgb, ${actionColor} 76%, white 24%);
                    font-family: 'Arial Narrow', 'DIN Condensed', 'Bahnschrift SemiCondensed', sans-serif;
                    font-size: ${compact ? "9px" : "10px"};
                    font-weight: 900;
                    line-height: 0.94;
                    letter-spacing: 0.18px;
                    text-transform: uppercase;
                    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.75), 0 0 5px rgba(0, 0, 0, 0.35);
                    cursor: ${acknowledged ? "default" : "pointer"};
                    opacity: ${acknowledged ? "0.94" : "0.92"};
                    pointer-events: auto;
                    box-shadow: 0 0 10px color-mix(in srgb, ${actionColor} 28%, transparent);
                    backdrop-filter: blur(2.2px) saturate(1.18);
                "
            >
                <span style="
                    min-width: 0;
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1px;
                    white-space: nowrap;
                ">${actionLines}</span>
                <span style="
                    flex: 0 0 auto;
                    width: ${compact ? "11px" : "12px"};
                    height: ${compact ? "11px" : "12px"};
                    border-radius: 2px;
                    border: 1.6px solid currentColor;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: ${compact ? "9px" : "10px"};
                    line-height: 1;
                    background: ${acknowledged ? "color-mix(in srgb, currentColor 28%, transparent)" : "rgba(0, 0, 0, 0.22)"};
                    transition: transform 160ms ease, background 160ms ease;
                    transform: ${acknowledged ? "scale(1.06)" : "scale(1)"};
                ">${acknowledged ? "✓" : ""}</span>
            </button>
        </div>
    `;
}


export function renderBadgeArea({
    badgeSize,
    badgeLayer,
    crossfadeLayer,
    overlay
}) {
    return `
        <div style="
            position: relative;
            width: ${badgeSize}px;
            height: ${badgeSize}px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            ${badgeLayer}
            ${crossfadeLayer}
            ${overlay}
        </div>
    `;
}
