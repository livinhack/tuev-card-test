import { renderBadge } from "../badge/renderer.js?v=b32";

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
            gap: 2px;
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
