// TÜV Card v0.1.0

import { localize } from "./src/translations.js?v=a8";
import { renderBadge } from "./src/badge-renderer.js?v=a8";
import {
    checkPlateFontAvailable,
    ensurePlateFont,
    isPlateFontLoaded,
    renderLicensePlate
} from "./src/plate-renderer.js?v=a8";
import { TuevCardEditor } from "./src/tuev-card-editor.js?v=a8";

window.customCards = window.customCards || [];

if (!window.customCards.some((card) => card.type === "tuev-card")) {
    window.customCards.push({
        type: "tuev-card",
        name: "TÜV Reminder",
        description: "Display TÜV / HU inspection reminders as inspection stickers."
    });
}

class TuevCard extends HTMLElement {
    static getConfigElement() {
        return document.createElement("tuev-card-editor");
    }

    static getStubConfig(hass) {
        const entityId = Object.keys(hass.states).find((entityId) => {
            const entity = hass.states[entityId];

            return (
                entityId.startsWith("sensor.") &&
                entity?.attributes?.month !== undefined &&
                entity?.attributes?.year !== undefined &&
                entity?.attributes?.plate !== undefined
            );
        });

        return {
            type: "custom:tuev-card",
            columns: "auto",
            sort: "name",
            show_details: true,
            ...(entityId ? { entity: entityId } : {})
        };
    }

    localize(key) {
        return localize(this._hass, key);
    }

    setConfig(config) {
        const allowedSorts = ["name", "plate", "due_date", "status"];
        const allowedColumns = ["auto", "1", "2", "3", "4"];
        const allowedPlateStyles = ["text", "plate"];
        const allowedPlateFonts = ["auto", "europlate", "fallback"];
        const plateFont = allowedPlateFonts.includes(config.plate_font)
            ? config.plate_font
            : "auto";

        if (!config.entity && !config.entities) {
            throw new Error("Please provide entity or entities.");
        }

        const rawColumns = config.columns === undefined || config.columns === null
            ? "auto"
            : String(config.columns);

        const columns = allowedColumns.includes(rawColumns)
            ? rawColumns
            : "auto";

        const sort = allowedSorts.includes(config.sort)
            ? config.sort
            : "name";

        const plateStyle = allowedPlateStyles.includes(config.plate_style)
            ? config.plate_style
            : "text";            
            
        this.config = {
            show_details: true,
            plate_style: plateStyle,
            plate_font: plateFont,
            ...config,
            columns,
            sort
        };

        delete this.config.layout;

        this._entityUiState = this._entityUiState || {};

        this._plateFontAvailable = false;
        this._plateFontLoaded = false;
        this._plateFontCheckStarted = false;

        this.checkPlateFontAvailability();
    }

    checkPlateFontAvailability() {
        if (this._plateFontCheckStarted) {
            return;
        }

        this._plateFontCheckStarted = true;

        checkPlateFontAvailable().then((available) => {
            this._plateFontAvailable = available;

            if (!available) {
                this._plateFontLoaded = false;

                if (this._hass) {
                    this.hass = this._hass;
                }

                return;
            }

            this._plateFontLoaded = isPlateFontLoaded();

            ensurePlateFont(() => {
                this._plateFontLoaded = true;

                if (this._hass) {
                    this.hass = this._hass;
                }
            });

            if (this._hass) {
                this.hass = this._hass;
            }
        }).catch(() => {
            this._plateFontAvailable = false;
            this._plateFontLoaded = false;

            if (this._hass) {
                this.hass = this._hass;
            }
        });
    }

    set hass(hass) {
        this._hass = hass;
        this._entityUiState = this._entityUiState || {};

        const entityIds = this.getSortedEntityIds(hass);

        if (entityIds.length === 0) {
            this.innerHTML = `
                <ha-card>
                    <div style="padding:16px;">
                        ${this.localize("error.no_entities")}
                    </div>
                </ha-card>
            `;
            return;
        }

        const isMulti = entityIds.length > 1;
        const columns = this.config.columns || "auto";

        let gridTemplateColumns;

        if (!isMulti) {
            gridTemplateColumns = "1fr";
        } else if (columns === "auto") {
            gridTemplateColumns = "repeat(auto-fit, minmax(190px, 1fr))";
        } else {
            gridTemplateColumns = `repeat(${Number(columns)}, minmax(0, 1fr))`;
        }

        const automaticBadgeSize = this.getAutomaticBadgeSize(isMulti);

        this.innerHTML = `
            <ha-card>
                <div style="
                    padding: 16px;
                    display: grid;
                    grid-template-columns: ${gridTemplateColumns};
                    gap: ${isMulti ? "18px" : "12px"};
                    align-items: start;
                ">
                    ${entityIds.map((entityId) => this.renderVehicle(hass, entityId, isMulti, automaticBadgeSize)).join("")}
                </div>
            </ha-card>
        `;

        this.querySelectorAll("[data-confirm-entity]").forEach((button) => {
            const entityId = button.getAttribute("data-confirm-entity");

            button.addEventListener("click", async () => {
                await this.confirmPassed(entityId);
            });
        });
    }

    getEntityIds() {
        const rawEntityIds = [];

        if (this.config.entity) {
            rawEntityIds.push(this.config.entity);
        }

        if (Array.isArray(this.config.entities)) {
            this.config.entities.forEach((entry) => {
                if (typeof entry === "string") {
                    rawEntityIds.push(entry);
                    return;
                }

                if (entry && entry.entity) {
                    rawEntityIds.push(entry.entity);
                }
            });
        }

        return [...new Set(rawEntityIds.filter(Boolean))];
    }

    getSortedEntityIds(hass) {
        const entityIds = this.getEntityIds();
        const sort = this.config.sort || "name";

        const statusRank = {
            expired: 0,
            due: 1,
            valid: 2
        };

        return [...entityIds].sort((a, b) => {
            const entityA = hass.states[a];
            const entityB = hass.states[b];

            if (!entityA && !entityB) {
                return 0;
            }

            if (!entityA) {
                return 1;
            }

            if (!entityB) {
                return -1;
            }

            const attrA = entityA.attributes;
            const attrB = entityB.attributes;

            if (sort === "name") {
                return this.compareText(
                    attrA.vehicle_name || attrA.friendly_name || a,
                    attrB.vehicle_name || attrB.friendly_name || b
                );
            }

            if (sort === "plate") {
                return this.compareText(
                    attrA.plate || "",
                    attrB.plate || ""
                );
            }

            if (sort === "due_date") {
                return this.compareText(
                    attrA.due_date || "",
                    attrB.due_date || ""
                );
            }

            if (sort === "status") {
                const rankA = statusRank[entityA.state] ?? statusRank[attrA.status] ?? 99;
                const rankB = statusRank[entityB.state] ?? statusRank[attrB.status] ?? 99;

                if (rankA !== rankB) {
                    return rankA - rankB;
                }

                return this.compareText(
                    attrA.due_date || "",
                    attrB.due_date || ""
                );
            }

            return 0;
        });
    }

    compareText(a, b) {
        return String(a).localeCompare(String(b), undefined, {
            numeric: true,
            sensitivity: "base"
        });
    }

    getAutomaticBadgeSize(isMulti) {
        if (!isMulti) {
            return 250;
        }

        const columns = this.config.columns || "auto";

        if (columns === "1") {
            return 220;
        }

        if (columns === "2") {
            return 175;
        }

        if (columns === "3") {
            return 135;
        }

        if (columns === "4") {
            return 105;
        }

        return 175;
    }

    getPlateFontProfile() {
        const plateFont = this.config.plate_font || "auto";
        const euroPlateUsable =
            this._plateFontAvailable === true &&
            this._plateFontLoaded === true;

        if (plateFont === "fallback") {
            return "fallback";
        }

        if (plateFont === "europlate") {
            return euroPlateUsable ? "europlate" : "fallback";
        }

        return euroPlateUsable ? "europlate" : "fallback";
    }

    getUiState(entityId) {
        if (!this._entityUiState[entityId]) {
            this._entityUiState[entityId] = {
                confirming: false,
                confirmStartedAt: 0,
                confirmFinishScheduled: false,
                frozenBadge: null,
                crossfadeBadge: null,
                showSuccessUntil: 0,
            };
        }

        return this._entityUiState[entityId];
    }

    renderVehicle(hass, entityId, compact, automaticBadgeSize) {
        const entity = hass.states[entityId];

        if (!entity) {
            return `
                <div style="
                    padding: 12px;
                    border-radius: 12px;
                    background: var(--card-background-color);
                    border: 1px solid var(--divider-color);
                ">
                    <div style="font-weight: 600; margin-bottom: 4px;">
                        ${this.localize("error.entity_not_found")}
                    </div>
                    <div style="font-size: 13px; opacity: 0.75;">
                        ${entityId}
                    </div>
                </div>
            `;
        }

        const ui = this.getUiState(entityId);
        const attr = entity.attributes;

        const vehicleName = attr.vehicle_name || attr.friendly_name || "Vehicle";
        const plate = attr.plate || "";
        const month = Number(attr.month || 1);
        const year = Number(attr.year || new Date().getFullYear());

        const status = attr.status || entity.state || "";
        const showDetails = this.config.show_details !== false;

        const statusLabel = {
            valid: this.localize("status.valid"),
            due: this.localize("status.due"),
            expired: this.localize("status.expired")
        }[status] || status;

        const statusColor = {
            valid: "var(--success-color, #43a047)",
            due: "var(--warning-color, #ffa000)",
            expired: "var(--error-color, #db4437)"
        }[status] || "var(--secondary-text-color)";

        const huLabel = month && year
            ? `${this.localize("details.next_inspection")}: ${String(month).padStart(2, "0")}/${year}`
            : "";

        const fallbackRotation = (month % 12) * 30;
        const rotation = Number.isFinite(Number(attr.rotation))
            ? Number(attr.rotation)
            : fallbackRotation;

        const blurred = Boolean(attr.blurred);

        const pending =
            entity.state === "due" ||
            entity.state === "expired" ||
            attr.status === "due" ||
            attr.status === "expired" ||
            blurred;

        const MIN_CONFIRM_MS = 700;
        const SUCCESS_MS = 800;
        const CROSSFADE_MS = 800;

        if (!pending && ui.confirming && !ui.confirmFinishScheduled) {
            ui.confirmFinishScheduled = true;

            const elapsed = Date.now() - (ui.confirmStartedAt || 0);
            const remaining = Math.max(0, MIN_CONFIRM_MS - elapsed);

            window.setTimeout(() => {
                ui.confirming = false;
                ui.confirmFinishScheduled = false;
                ui.showSuccessUntil = Date.now() + SUCCESS_MS;

                ui.crossfadeBadge = {
                    from: ui.frozenBadge,
                    to: {
                        year,
                        rotation,
                        blurred: false
                    },
                    startedAt: Date.now(),
                    duration: CROSSFADE_MS
                };

                ui.frozenBadge = null;

                if (this._hass) {
                    this.hass = this._hass;
                }

                window.setTimeout(() => {
                    ui.showSuccessUntil = 0;
                    ui.crossfadeBadge = null;

                    if (this._hass) {
                        this.hass = this._hass;
                    }
                }, Math.max(SUCCESS_MS, CROSSFADE_MS));
            }, remaining);
        }

        const showSuccess = Date.now() < (ui.showSuccessUntil || 0);
        const showConfirmOverlay = pending || ui.confirming || showSuccess;

        const isExpired =
            entity.state === "expired" ||
            attr.status === "expired";

        const overlayTitle = ui.confirming
            ? this.localize("overlay.updating")
            : showSuccess
                ? this.localize("overlay.updated")
                : isExpired
                    ? this.localize("overlay.expired")
                    : this.localize("overlay.due");

        const overlayText = ui.confirming
            ? this.localize("overlay.updating_text")
            : showSuccess
                ? this.localize("overlay.updated_text")
                : this.localize("overlay.question");

        const buttonText = ui.confirming
            ? this.localize("button.wait")
            : showSuccess
                ? this.localize("button.done")
                : this.localize("button.confirm");

        const displayBadge = ui.frozenBadge
            ? ui.frozenBadge
            : {
                year,
                rotation,
                blurred
            };

        const badgeSize = Number(this.config.badge_size || 0) || automaticBadgeSize;
        const plateSizeProfile =
            String(this.config.columns || "auto") === "4"
                ? "tiny"
                : compact
                    ? "compact"
                    : "normal";

        const plateScale = 1;

        const overlayScale = badgeSize <= 115
            ? "tiny"
            : badgeSize <= 140
                ? "small"
                : "normal";

        const overlayMinWidth = {
            tiny: 104,
            small: 122,
            normal: compact ? 145 : 170
        }[overlayScale];

        const overlayMaxWidth = {
            tiny: 126,
            small: 150,
            normal: compact ? 180 : 220
        }[overlayScale];

        const overlayPadding = {
            tiny: "7px",
            small: "8px",
            normal: compact ? "10px" : "12px"
        }[overlayScale];

        const overlayGap = {
            tiny: "5px",
            small: "6px",
            normal: compact ? "7px" : "9px"
        }[overlayScale];

        const overlayTitleSize = {
            tiny: "11px",
            small: "12px",
            normal: compact ? "14px" : "16px"
        }[overlayScale];

        const overlayTextSize = {
            tiny: "10px",
            small: "11px",
            normal: compact ? "12px" : "13px"
        }[overlayScale];

        const overlayButtonPadding = {
            tiny: "5px 9px",
            small: "6px 10px",
            normal: compact ? "7px 12px" : "8px 15px"
        }[overlayScale];

        const overlayButtonFontSize = {
            tiny: "10px",
            small: "11px",
            normal: compact ? "12px" : "13px"
        }[overlayScale];

        return `
            <div style="
                display: flex;
                flex-direction: column;
                gap: 10px;
                align-items: center;
                min-width: 0;
            ">
                <div style="
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    text-align: ${compact ? "center" : "left"};
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

                    ${this.config.plate_style === "plate" && plate ? `
                        <div style="
                            display: flex;
                            justify-content: ${compact ? "center" : "flex-start"};
                            width: 100%;
                            margin-top: 3px;
                        ">
                            ${renderLicensePlate(plate, {
                                compact,
                                fontProfile: this.getPlateFontProfile(),
                                sizeProfile: plateSizeProfile,
                                scale: plateScale
                            })}
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

                <div style="
                    position: relative;
                    width: ${badgeSize}px;
                    height: ${badgeSize}px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    ${this.renderBadgeLayer(displayBadge, badgeSize)}

                    ${ui.crossfadeBadge ? this.renderCrossfadeLayer(ui.crossfadeBadge, badgeSize) : ""}

                    ${showConfirmOverlay ? `
                        <div
                            style="
                                position: absolute;
                                left: 50%;
                                top: 50%;
                                transform: translate(-50%, -50%);
                                z-index: 5;
                                min-width: ${overlayMinWidth}px;
                                max-width: ${overlayMaxWidth}px;
                                padding: ${overlayPadding};
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
                                gap: ${overlayGap};
                                align-items: center;
                                transition:
                                    opacity 0.5s ease,
                                    transform 0.3s ease;
                            "
                        >
                            <div style="
                                font-size: ${overlayTitleSize};
                                font-weight: 700;
                                line-height: 1.15;
                            ">
                                ${overlayTitle}
                            </div>

                            <div style="
                                font-size: ${overlayTextSize};
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
                                    padding: ${overlayButtonPadding};
                                    background: ${showSuccess ? "var(--success-color, #43a047)" : "var(--primary-color)"};
                                    color: var(--text-primary-color);
                                    font-size: ${overlayButtonFontSize};
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
                    ` : ""}
                </div>

                ${showDetails ? `
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
                ` : ""}
            </div>
        `;
    }

    async confirmPassed(entityId) {
        const entity = this._hass.states[entityId];

        if (!entity) {
            return;
        }

        const ui = this.getUiState(entityId);
        const attr = entity.attributes;

        const month = Number(attr.month || 1);
        const year = Number(attr.year || new Date().getFullYear());

        const fallbackRotation = (month % 12) * 30;
        const rotation = Number.isFinite(Number(attr.rotation))
            ? Number(attr.rotation)
            : fallbackRotation;

        if (ui.confirming) {
            return;
        }

        ui.confirming = true;
        ui.confirmFinishScheduled = false;
        ui.confirmStartedAt = Date.now();
        ui.crossfadeBadge = null;

        ui.frozenBadge = {
            year,
            rotation,
            blurred: true
        };

        this.hass = this._hass;

        try {
            await this._hass.callService("tuev_reminder", "confirm_passed", {
                entity_id: entityId
            });
        } catch (error) {
            console.error("TÜV confirmation failed", error);

            ui.confirming = false;
            ui.confirmFinishScheduled = false;
            ui.frozenBadge = null;
            ui.crossfadeBadge = null;

            if (this._hass) {
                this.hass = this._hass;
            }
        }
    }

    renderBadgeLayer(badge, size) {
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

    renderCrossfadeLayer(crossfade, size) {
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

    getCardSize() {
        return 4;
    }
}

if (!customElements.get("tuev-card-editor")) {
    customElements.define("tuev-card-editor", TuevCardEditor);
}

if (!customElements.get("tuev-card")) {
    customElements.define("tuev-card", TuevCard);
}