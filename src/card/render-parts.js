import { renderBadge } from "../badge/renderer.js?v=b54";

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

    return `
        <div style="
            position: absolute;
            left: 50%;
            top: ${compact ? "58%" : "55%"};
            transform: translate(-50%, -50%) rotate(-13deg);
            z-index: 6;
            width: max-content;
            max-width: min(96%, ${compact ? "156px" : "184px"});
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: ${compact ? "2px" : "3px"};
            pointer-events: none;
            filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
        ">
            <div style="
                position: relative;
                box-sizing: border-box;
                max-width: 100%;
                padding: ${compact ? "3px 7px" : "4px 9px"};
                border: 2px solid color-mix(in srgb, ${stampColor} 82%, transparent);
                outline: 1px dashed color-mix(in srgb, ${stampColor} 58%, transparent);
                outline-offset: -4px;
                border-radius: 4px;
                background:
                    linear-gradient(135deg, transparent 0 12%, color-mix(in srgb, ${stampColor} 10%, transparent) 12% 20%, transparent 20% 100%),
                    color-mix(in srgb, ${stampColor} 12%, transparent);
                color: color-mix(in srgb, ${stampColor} 86%, white 14%);
                font-family: 'Arial Narrow', 'DIN Condensed', 'Bahnschrift SemiCondensed', sans-serif;
                font-size: ${compact ? "11px" : "12px"};
                font-weight: 900;
                line-height: 1;
                letter-spacing: 0.2px;
                text-transform: uppercase;
                text-align: center;
                text-shadow: 0 1px 0 rgba(0, 0, 0, 0.45);
                opacity: ${showSuccess ? "0.86" : "0.78"};
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                pointer-events: none;
                mix-blend-mode: screen;
            ">
                <span style="position: absolute; left: 12%; top: -3px; width: 20px; height: 6px; background: rgba(0, 0, 0, 0.55); transform: rotate(-7deg); opacity: 0.34;"></span>
                <span style="position: absolute; right: 18%; bottom: -3px; width: 25px; height: 5px; background: rgba(0, 0, 0, 0.55); transform: rotate(5deg); opacity: 0.32;"></span>
                <span style="position: absolute; left: 50%; top: 42%; width: 34px; height: 2px; background: rgba(0, 0, 0, 0.42); transform: rotate(-10deg); opacity: 0.28;"></span>
                ${overlayTitle}
            </div>

            <button
                data-confirm-entity="${entityId}"
                ${acknowledged ? "disabled" : ""}
                style="
                    position: relative;
                    transform: translateX(${compact ? "10px" : "14px"}) rotate(9deg);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: ${compact ? "4px" : "5px"};
                    max-width: 100%;
                    box-sizing: border-box;
                    padding: ${compact ? "3px 6px" : "4px 7px"};
                    border-radius: 4px;
                    border: 2px solid color-mix(in srgb, ${actionColor} 82%, transparent);
                    outline: 1px dashed color-mix(in srgb, ${actionColor} 54%, transparent);
                    outline-offset: -4px;
                    background:
                        linear-gradient(135deg, transparent 0 14%, color-mix(in srgb, ${actionColor} 12%, transparent) 14% 23%, transparent 23% 100%),
                        color-mix(in srgb, ${actionColor} 13%, rgba(0, 0, 0, 0.12));
                    color: color-mix(in srgb, ${actionColor} 82%, white 18%);
                    font-family: 'Arial Narrow', 'DIN Condensed', 'Bahnschrift SemiCondensed', sans-serif;
                    font-size: ${compact ? "9px" : "10px"};
                    font-weight: 900;
                    line-height: 1;
                    letter-spacing: 0.1px;
                    text-transform: uppercase;
                    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.45);
                    cursor: ${acknowledged ? "default" : "pointer"};
                    opacity: ${acknowledged ? "0.86" : "0.80"};
                    pointer-events: auto;
                    box-shadow: 0 0 9px color-mix(in srgb, ${actionColor} 22%, transparent);
                "
            >
                <span style="
                    min-width: 0;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                ">${actionText}</span>
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
                    background: ${acknowledged ? "color-mix(in srgb, currentColor 28%, transparent)" : "rgba(0, 0, 0, 0.16)"};
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
