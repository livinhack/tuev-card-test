// TÜV Card source entry v0.1.0-b41

import { localize } from "./translations/index.js?v=b41";
import { normalizeCardConfig } from "./card/config.js?v=b41";
import { findFirstTuevEntity } from "./card/entities.js?v=b41";
import { getAllEntityIdsFromConfig, getEntitySections } from "./card/groups.js?v=b41";
import { calculateAutomaticBadgeSize, calculateLayoutInfo } from "./card/layout.js?v=b41";
import { getSharedPlateLayout } from "./card/plate-layout.js?v=b41";
import { CONFIRM_TIMING, getEntityUiState, resetEntityUiStateAfterError, startEntityConfirmation } from "./card/ui-state.js?v=b41";
import {
    getOverlayStyleOptions,
    renderBadgeArea,
    renderBadgeLayer,
    renderConfirmOverlay,
    renderCrossfadeLayer,
    renderMissingEntity,
    renderVehicleDetails,
    renderVehicleHeader
} from "./card/render-parts.js?v=b41";
import {
    checkPlateFontAvailable,
    ensurePlateFont,
    getLicensePlateMetrics,
    isPlateFontLoaded,
    renderLicensePlate
} from "./plate/renderer.js?v=b41";
import { TuevCardEditor } from "./editor/editor.js?v=b41";

window.customCards = window.customCards || [];

if (!window.customCards.some((card) => card.type === "tuev-card")) {
    window.customCards.push({
        type: "tuev-card",
        name: "TÜV Reminder",
        description: "Display TÜV / HU inspection reminders as inspection stickers."
    });
}

class TuevCard extends HTMLElement {
    connectedCallback() {
        this.style.display = "block";
        this.style.width = "100%";

        if (!this._onWindowResize) {
            this._onWindowResize = () => this.scheduleWidthRefresh(true);
            window.addEventListener("resize", this._onWindowResize);
        }

        if (!this._plateFontRefreshTimer) {
            this._plateFontRefreshTimer = window.setInterval(() => {
                if (this.config) {
                    this.checkPlateFontAvailability(true);
                }
            }, 15000);
        }

        if (this._resizeObserver || typeof ResizeObserver === "undefined") {
            return;
        }

        this._resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            const width = Math.round(entry?.contentRect?.width || 0);

            if (!width) {
                return;
            }

            if (Math.abs((this._cardWidth || 0) - width) < 4) {
                return;
            }

            this._cardWidth = width;

            if (this._hass && this.config) {
                this.hass = this._hass;
            }
        });

        this._resizeObserver.observe(this);
    }

    disconnectedCallback() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }

        if (this._onWindowResize) {
            window.removeEventListener("resize", this._onWindowResize);
            this._onWindowResize = null;
        }

        if (this._plateFontRefreshTimer) {
            window.clearInterval(this._plateFontRefreshTimer);
            this._plateFontRefreshTimer = null;
        }
    }

    static getConfigElement() {
        return document.createElement("tuev-card-editor");
    }

    static getStubConfig(hass) {
        const entityId = findFirstTuevEntity(hass);

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
        this.config = normalizeCardConfig(config);

        this._entityUiState = this._entityUiState || {};

        this._plateFontAvailable = false;
        this._plateFontLoaded = false;
        this._plateFontCheckInProgress = false;
        this._plateFontLastCheckedAt = 0;

        this.checkPlateFontAvailability(true);
        this.scheduleWidthRefresh(true);
    }

    checkPlateFontAvailability(force = false) {
        const now = Date.now();

        if (this._plateFontCheckInProgress) {
            return;
        }

        if (!force && now - (this._plateFontLastCheckedAt || 0) < 10000) {
            return;
        }

        this._plateFontCheckInProgress = true;
        this._plateFontLastCheckedAt = now;

        checkPlateFontAvailable().then((available) => {
            const changed = this._plateFontAvailable !== available;
            this._plateFontAvailable = available;

            if (!available) {
                this._plateFontLoaded = false;

                if (changed && this._hass) {
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

            if (changed && this._hass) {
                this.hass = this._hass;
            }
        }).catch(() => {
            const changed = this._plateFontAvailable !== false || this._plateFontLoaded !== false;
            this._plateFontAvailable = false;
            this._plateFontLoaded = false;

            if (changed && this._hass) {
                this.hass = this._hass;
            }
        }).finally(() => {
            this._plateFontCheckInProgress = false;
        });
    }

    isGraphicalPlateAvailable() {
        return (
            this.config?.plate_style === "plate" &&
            this._plateFontAvailable === true &&
            this._plateFontLoaded === true
        );
    }

    set hass(hass) {
        this._hass = hass;
        this._entityUiState = this._entityUiState || {};
        this.checkPlateFontAvailability(false);

        const sections = getEntitySections(this.config, hass);
        const allEntityIds = getAllEntityIdsFromConfig(this.config)
            .filter((entityId) => hass.states[entityId]);

        if (allEntityIds.length === 0) {
            this.innerHTML = `
                <ha-card style="display:block;width:100%;">
                    <div style="padding:16px;">
                        ${this.localize("error.no_entities")}
                    </div>
                </ha-card>
            `;
            return;
        }

        const isMulti = allEntityIds.length > 1;
        const layoutContext = this.getLayoutContext(isMulti);
        const cardContent = this.renderSections(hass, sections, layoutContext);

        this.innerHTML = `
            <ha-card style="display:block;width:100%;overflow:hidden;">
                ${this.renderPreviewScaledContent(cardContent, layoutContext)}
            </ha-card>
        `;

        this.updatePreviewScaleHeight();

        this.querySelectorAll("[data-confirm-entity]").forEach((button) => {
            const entityId = button.getAttribute("data-confirm-entity");

            button.addEventListener("click", async () => {
                await this.confirmPassed(entityId);
            });
        });

        this.scheduleWidthRefresh();
    }

    isEditorPreviewContext() {
        const previewTagNames = new Set([
            "HUI-CARD-PREVIEW",
            "HUI-CARD-ELEMENT-EDITOR",
            "HUI-CARD-EDITOR",
            "HUI-DIALOG-EDIT-CARD",
            "HA-CARD-PREVIEW",
            "HA-DIALOG"
        ]);
        const previewClassNeedles = [
            "preview",
            "card-preview",
            "editor-preview",
            "edit-card",
            "card-editor"
        ];

        let node = this;
        let depth = 0;

        while (node && depth < 32) {
            const tagName = String(node.tagName || "").toUpperCase();

            if (previewTagNames.has(tagName)) {
                return true;
            }

            const rawClassName = node.className;
            const className = typeof rawClassName === "string"
                ? rawClassName.toLowerCase()
                : String(rawClassName?.baseVal || "").toLowerCase();

            if (
                className &&
                previewClassNeedles.some((needle) => className.includes(needle))
            ) {
                return true;
            }

            const root = node.getRootNode?.();
            node = node.parentElement || node.assignedSlot || root?.host || null;
            depth += 1;
        }

        return false;
    }

    getLayoutContext(isMulti) {
        const measuredWidth = this.getCardWidth();
        const requestedColumns = String(this.config?.columns || "auto");
        const previewContext = this.isEditorPreviewContext();

        if (!isMulti || !previewContext) {
            return {
                measuredWidth,
                layoutWidth: measuredWidth,
                requestedColumns,
                previewContext,
                previewScaled: false,
                scale: 1
            };
        }

        const previewSimulation = this.getPreviewSimulation(requestedColumns, measuredWidth);

        if (!previewSimulation?.width) {
            return {
                measuredWidth,
                layoutWidth: measuredWidth,
                requestedColumns,
                previewContext,
                previewScaled: false,
                scale: 1
            };
        }

        const simulatedWidth = previewSimulation.width;
        const visiblePreviewWidth = this.getPreviewVisibleWidth() || measuredWidth;
        const scale = Math.min(1, Math.max(0.05, visiblePreviewWidth / simulatedWidth));

        if (scale >= 0.995 && measuredWidth >= simulatedWidth - 4) {
            return {
                measuredWidth,
                layoutWidth: measuredWidth,
                requestedColumns: previewSimulation.requestedColumns || requestedColumns,
                previewContext,
                previewScaled: false,
                scale: 1
            };
        }

        return {
            measuredWidth,
            layoutWidth: simulatedWidth,
            requestedColumns: previewSimulation.requestedColumns || requestedColumns,
            previewContext,
            previewScaled: true,
            scale
        };
    }

    getPreviewSimulation(requestedColumns, measuredWidth) {
        if (requestedColumns === "4") {
            return {
                width: 720,
                requestedColumns: "4"
            };
        }

        if (requestedColumns !== "auto") {
            return null;
        }

        // Conservative editor preview: the native Home Assistant preview does
        // not reliably expose whether the edited card will later live in a
        // panel, section or grid view. To avoid misleading panel-style previews
        // in section/grid dashboards, auto is shown as the same stable four
        // column preview as the manual "4" setting. The real dashboard still
        // uses the actual available width and can render more columns.
        return {
            width: 720,
            requestedColumns: "4"
        };
    }

    getPreviewVisibleWidth() {
        const candidates = [];
        const addCandidate = (element) => {
            if (!element?.getBoundingClientRect) {
                return;
            }

            const rect = element.getBoundingClientRect();
            const width = Math.round(rect.width || 0);

            if (width > 0) {
                candidates.push(width);
            }
        };

        addCandidate(this);
        addCandidate(this.querySelector("ha-card"));
        addCandidate(this.parentElement);

        if (candidates.length === 0) {
            return 0;
        }

        // For scaled editor previews the visible card element is the relevant
        // limit. Parent containers can be wider than the clipped preview pane,
        // so using the maximum here would make the scaled preview too large.
        return Math.min(...candidates);
    }

    renderPreviewScaledContent(content, layoutContext) {
        if (!layoutContext.previewScaled) {
            return content;
        }

        const height = this._previewScaledHeight
            ? `${this._previewScaledHeight}px`
            : "auto";

        return `
            <div
                data-preview-scale-outer
                style="
                    height: ${height};
                    overflow: hidden;
                    width: 100%;
                "
            >
                <div
                    data-preview-scale-inner
                    style="
                        width: ${layoutContext.layoutWidth}px;
                        transform: scale(${layoutContext.scale});
                        transform-origin: top left;
                    "
                >
                    ${content}
                </div>
            </div>
        `;
    }

    updatePreviewScaleHeight() {
        const outer = this.querySelector("[data-preview-scale-outer]");
        const inner = this.querySelector("[data-preview-scale-inner]");

        if (!outer || !inner) {
            this._previewScaledHeight = 0;
            return;
        }

        window.requestAnimationFrame(() => {
            const rect = inner.getBoundingClientRect();
            const height = Math.ceil(rect.height || 0);

            if (!height) {
                return;
            }

            if (Math.abs((this._previewScaledHeight || 0) - height) < 2) {
                outer.style.height = `${height}px`;
                return;
            }

            this._previewScaledHeight = height;
            outer.style.height = `${height}px`;
        });
    }

    getCardWidth() {
        const getWidth = (element) => {
            if (!element?.getBoundingClientRect) {
                return 0;
            }

            return Math.round(element.getBoundingClientRect().width || 0);
        };

        const ownWidth = getWidth(this);
        const cardWidth = getWidth(this.querySelector("ha-card"));
        const storedWidth = this._cardWidth > 0 ? Math.round(this._cardWidth) : 0;
        const previewContext = this.isEditorPreviewContext();

        // In the real dashboard the custom element's own box is the only safe
        // source of truth. Parent containers can be wider than the card itself
        // in tile/section layouts; using them would make plate scaling think it
        // has more horizontal room than the tile actually provides.
        if (!previewContext) {
            return ownWidth || cardWidth || storedWidth || 0;
        }

        const candidates = [ownWidth, cardWidth, storedWidth].filter((width) => width > 0);

        let parent = this.parentElement;
        let depth = 0;

        while (parent && depth < 3) {
            const width = getWidth(parent);

            if (width > 0) {
                candidates.push(width);
            }

            parent = parent.parentElement;
            depth += 1;
        }

        if (candidates.length === 0) {
            return 0;
        }

        // In HA's editor preview the custom element can initially report too
        // small a width. There we still allow nearby preview/container widths,
        // because the result is scaled visually and not used by the real card.
        return Math.max(...candidates);
    }

    refreshMeasuredWidth(forceRender = false) {
        const width = Math.round(this.getCardWidth());

        if (!width) {
            return false;
        }

        const changed = Math.abs((this._cardWidth || 0) - width) >= 4;

        if (changed || forceRender) {
            this._cardWidth = width;

            if (this._hass && this.config) {
                this.hass = this._hass;
            }

            return true;
        }

        return false;
    }

    scheduleWidthRefresh(force = false) {
        if (this._widthRefreshScheduled && !force) {
            return;
        }

        this._widthRefreshScheduled = true;

        const scheduleFrame = (delay, isLast = false) => {
            window.setTimeout(() => {
                window.requestAnimationFrame(() => {
                    this.refreshMeasuredWidth(false);

                    if (isLast) {
                        this._widthRefreshScheduled = false;
                    }
                });
            }, delay);
        };

        // A mix of animation frames and delayed checks catches HA editor
        // preview changes, section reflows and the final dashboard layout
        // after leaving edit mode without changing the actual layout rules.
        window.requestAnimationFrame(() => {
            this.refreshMeasuredWidth(force);

            window.requestAnimationFrame(() => {
                this.refreshMeasuredWidth(false);
            });
        });

        const delays = [80, 180, 360, 750, 1500, 3000];
        delays.forEach((delay, index) => {
            scheduleFrame(delay, index === delays.length - 1);
        });
    }

    getUiState(entityId) {
        return getEntityUiState(this._entityUiState, entityId);
    }

    renderSections(hass, sections, layoutContext) {
        const renderSection = (section) => {
            const entityIds = section.entityIds.filter((entityId) => hass.states[entityId]);

            if (entityIds.length === 0) {
                return "";
            }

            const sectionIsMulti = entityIds.length > 1;
            const layout = calculateLayoutInfo({
                cardWidth: layoutContext.layoutWidth,
                isMulti: sectionIsMulti,
                requestedColumns: layoutContext.requestedColumns || this.config.columns
            });
            const automaticBadgeSize = calculateAutomaticBadgeSize({
                isMulti: sectionIsMulti,
                effectiveColumns: layout.effectiveColumns,
                tileWidth: layout.tileWidth
            });
            const sharedPlateLayout = getSharedPlateLayout({
                entityIds,
                hass,
                tileWidth: layout.tileWidth,
                isGraphicalPlateAvailable: this.isGraphicalPlateAvailable(),
                getLicensePlateMetrics
            });
            const grid = `
                <div style="
                    display: grid;
                    grid-template-columns: ${layout.gridTemplateColumns};
                    gap: ${layout.gap}px;
                    align-items: start;
                ">
                    ${entityIds.map((entityId) => this.renderVehicle(
                        hass,
                        entityId,
                        sectionIsMulti,
                        automaticBadgeSize,
                        layout,
                        sharedPlateLayout,
                        layoutContext.previewContext === true
                    )).join("")}
                </div>
            `;

            if (!section.title) {
                if (section.id === "ungrouped" && sections.some((candidate) => candidate.title)) {
                    return `
                        <section style="min-width:0;">
                            <div style="
                                height: 1px;
                                background: var(--divider-color);
                                opacity: 0.75;
                                margin: 0 0 16px;
                            "></div>
                            ${grid}
                        </section>
                    `;
                }

                return grid;
            }

            const headingColor = section.color || "var(--divider-color)";
            const sectionCountLabel = entityIds.length === 1
                ? this.localize("editor.vehicle_count_one")
                : `${entityIds.length} ${this.localize("editor.vehicle_count_many")}`;

            return `
                <section style="min-width:0;">
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        margin: 0 0 12px;
                        min-width: 0;
                    ">
                        <div style="
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                            min-width: 0;
                            padding: 5px 9px;
                            border-radius: 999px;
                            border: 1px solid color-mix(in srgb, ${headingColor} 34%, transparent);
                            background: color-mix(in srgb, ${headingColor} 12%, transparent);
                            color: ${headingColor};
                            box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08) inset;
                        ">
                            <span style="
                                width: 7px;
                                height: 7px;
                                border-radius: 50%;
                                background: ${headingColor};
                                box-shadow: 0 0 8px ${headingColor};
                                flex: 0 0 auto;
                            "></span>
                            <span style="
                                font-size: 16px;
                                font-weight: 700;
                                line-height: 1.2;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                min-width: 0;
                            ">
                                ${section.title}
                            </span>
                            <span style="
                                font-size: 11px;
                                font-weight: 600;
                                opacity: 0.78;
                                white-space: nowrap;
                            ">
                                ${sectionCountLabel}
                            </span>
                        </div>
                        <div style="
                            height: 1px;
                            background: linear-gradient(90deg, ${headingColor}, transparent);
                            flex: 1 1 auto;
                            opacity: 0.75;
                            min-width: 28px;
                        "></div>
                    </div>
                    ${grid}
                </section>
            `;
        };

        const hasHeadings = sections.some((section) => section.title);

        return `
            <div style="
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: ${hasHeadings ? 22 : 0}px;
            ">
                ${sections.map(renderSection).join("")}
            </div>
        `;
    }

    renderVehicle(hass, entityId, compact, automaticBadgeSize, layout, sharedPlateLayout, previewPlateTuning = false) {
        const entity = hass.states[entityId];

        if (!entity) {
            return renderMissingEntity(entityId, (key) => this.localize(key));
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

        this.updateConfirmationUiState({
            ui,
            pending,
            year,
            rotation
        });

        const showSuccess = Date.now() < (ui.showSuccessUntil || 0);
        const showConfirmOverlay = pending || ui.confirming || showSuccess;
        const isExpired = entity.state === "expired" || attr.status === "expired";

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
            : { year, rotation, blurred };
        const badgeSize = automaticBadgeSize;
        const plateLayout = sharedPlateLayout;
        const overlayStyle = getOverlayStyleOptions({ badgeSize, compact });

        const header = renderVehicleHeader({
            compact,
            vehicleName,
            plate,
            plateLayout,
            renderPlate: () => renderLicensePlate(plate, {
                compact,
                preview: previewPlateTuning,
                maxWidth: plateLayout.maxWidth,
                scale: plateLayout.scale
            })
        });

        const overlay = showConfirmOverlay
            ? renderConfirmOverlay({
                entityId,
                ui,
                showSuccess,
                overlayTitle,
                overlayText,
                buttonText,
                style: overlayStyle
            })
            : "";

        const badgeArea = renderBadgeArea({
            badgeSize,
            badgeLayer: renderBadgeLayer(displayBadge, badgeSize),
            crossfadeLayer: ui.crossfadeBadge ? renderCrossfadeLayer(ui.crossfadeBadge, badgeSize) : "",
            overlay
        });

        const details = renderVehicleDetails({
            showDetails,
            compact,
            huLabel,
            statusColor,
            statusLabel
        });

        return `
            <div style="
                display: flex;
                flex-direction: column;
                gap: 10px;
                align-items: center;
                min-width: 0;
            ">
                ${header}
                ${badgeArea}
                ${details}
            </div>
        `;
    }

    updateConfirmationUiState({ ui, pending, year, rotation }) {
        if (!pending && ui.confirming && !ui.confirmFinishScheduled) {
            ui.confirmFinishScheduled = true;

            const elapsed = Date.now() - (ui.confirmStartedAt || 0);
            const remaining = Math.max(0, CONFIRM_TIMING.minConfirmMs - elapsed);

            window.setTimeout(() => {
                ui.confirming = false;
                ui.confirmFinishScheduled = false;
                ui.showSuccessUntil = Date.now() + CONFIRM_TIMING.successMs;

                ui.crossfadeBadge = {
                    from: ui.frozenBadge,
                    to: {
                        year,
                        rotation,
                        blurred: false
                    },
                    startedAt: Date.now(),
                    duration: CONFIRM_TIMING.crossfadeMs
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
                }, Math.max(CONFIRM_TIMING.successMs, CONFIRM_TIMING.crossfadeMs));
            }, remaining);
        }
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

        startEntityConfirmation(ui, {
            year,
            rotation
        });

        this.hass = this._hass;

        try {
            await this._hass.callService("tuev_reminder", "confirm_passed", {
                entity_id: entityId
            });
        } catch (error) {
            console.error("TÜV confirmation failed", error);

            resetEntityUiStateAfterError(ui);

            if (this._hass) {
                this.hass = this._hass;
            }
        }
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