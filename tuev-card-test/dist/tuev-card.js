console.log("TUEV CARD TEST 31");

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
            layout: "auto",
            sort: "config",
            ...(entityId ? { entity: entityId } : {})
        };
    }    

    setConfig(config) {
        const allowedLayouts = ["auto", "horizontal", "vertical"];
        const allowedSorts = ["config", "name", "plate", "due_date", "status"];

        if (!config.entity && !config.entities) {
            throw new Error("Bitte entity oder entities angeben.");
        }

        const layout = allowedLayouts.includes(config.layout)
            ? config.layout
            : "auto";

        const sort = allowedSorts.includes(config.sort)
            ? config.sort
            : "config";

        this.config = {
            ...config,
            layout,
            sort
        };

        this._entityUiState = this._entityUiState || {};
    }

    set hass(hass) {
        this._hass = hass;
        this._entityUiState = this._entityUiState || {};

        const entityIds = this.getSortedEntityIds(hass);

        if (entityIds.length === 0) {
            this.innerHTML = `
                <ha-card>
                    <div style="padding:16px;">
                        Keine TÜV-Entitäten konfiguriert.
                    </div>
                </ha-card>
            `;
            return;
        }

        const isMulti = entityIds.length > 1;

        const layout = this.config.layout || "auto";

        let gridTemplateColumns;

        if (!isMulti || layout === "vertical") {
            gridTemplateColumns = "1fr";
        } else if (layout === "horizontal") {
            gridTemplateColumns = "repeat(auto-fit, minmax(170px, 1fr))";
        } else {
            gridTemplateColumns = "repeat(auto-fit, minmax(210px, 1fr))";
        }

        this.innerHTML = `
            <ha-card>
                <div style="
                    padding: 16px;
                    display: grid;
                    grid-template-columns: ${gridTemplateColumns};
                    gap: ${isMulti ? "18px" : "12px"};
                    align-items: start;
                ">
                    ${entityIds.map((entityId) => this.renderVehicle(hass, entityId, isMulti)).join("")}
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
        const sort = this.config.sort || "config";

        if (sort === "config") {
            return entityIds;
        }

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

    renderVehicle(hass, entityId, compact) {
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
                        Entity nicht gefunden
                    </div>
                    <div style="font-size: 13px; opacity: 0.75;">
                        ${entityId}
                    </div>
                </div>
            `;
        }

        const ui = this.getUiState(entityId);
        const attr = entity.attributes;

        const vehicleName = attr.vehicle_name || attr.friendly_name || "Fahrzeug";
        const plate = attr.plate || "";
        const month = Number(attr.month || 1);
        const year = Number(attr.year || new Date().getFullYear());

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
            ? "Aktualisiere…"
            : showSuccess
                ? "Aktualisiert"
                : isExpired
                    ? "TÜV abgelaufen!"
                    : "TÜV fällig!";

        const overlayText = ui.confirming
            ? "Neue Plakette wird berechnet."
            : showSuccess
                ? "Neue Plakette übernommen."
                : "Prüfung bestanden?";

        const buttonText = ui.confirming
            ? "Bitte warten"
            : showSuccess
                ? "Fertig"
                : "Bestätigen";

        const displayBadge = ui.frozenBadge
            ? ui.frozenBadge
            : {
                year,
                rotation,
                blurred
            };

        const layout = this.config.layout || "auto";
        const badgeSize = compact
            ? layout === "horizontal"
                ? 175
                : 190
            : 250;

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
                                min-width: ${compact ? "145px" : "170px"};
                                max-width: ${compact ? "180px" : "220px"};
                                padding: ${compact ? "10px" : "12px"};
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
                                gap: ${compact ? "7px" : "9px"};
                                align-items: center;
                                transition:
                                    opacity 0.5s ease,
                                    transform 0.3s ease;
                            "
                        >
                            <div style="
                                font-size: ${compact ? "14px" : "16px"};
                                font-weight: 700;
                                line-height: 1.15;
                            ">
                                ${overlayTitle}
                            </div>

                            <div style="
                                font-size: ${compact ? "12px" : "13px"};
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
                                    padding: ${compact ? "7px 12px" : "8px 15px"};
                                    background: ${showSuccess ? "var(--success-color, #43a047)" : "var(--primary-color)"};
                                    color: var(--text-primary-color);
                                    font-size: ${compact ? "12px" : "13px"};
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
                ${this.renderBadge(badge.year, badge.rotation, badge.blurred, size)}
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
                    ${this.renderBadge(crossfade.from.year, crossfade.from.rotation, crossfade.from.blurred, size)}
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
                    ${this.renderBadge(crossfade.to.year, crossfade.to.rotation, crossfade.to.blurred, size)}
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

    tuevColorForYear(year) {
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

    renderBadge(year, rotation, blurred, size = 250) {
        const cx = 150;
        const cy = 150;
        const yearShort = String(year).slice(-2);
        const color = this.tuevColorForYear(year);

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

    getCardSize() {
        return 4;
    }
}

class TuevCardEditor extends HTMLElement {
    setConfig(config) {
        this._config = {
            layout: "auto",
            sort: "config",
            ...config
        };

        this._draftEntityIds = this.getEntityIdsFromConfig();
        this._pickerOpen = false;
        this._searchText = "";

        this.render();
    }

    set hass(hass) {
        this._hass = hass;
        this.render();
    }

    getEntityIdsFromConfig() {
        if (!this._config) {
            return [];
        }

        if (this._config.entity) {
            return [this._config.entity];
        }

        if (Array.isArray(this._config.entities)) {
            return this._config.entities
                .map((entry) => {
                    if (typeof entry === "string") {
                        return entry;
                    }

                    return entry?.entity || "";
                })
                .filter(Boolean);
        }

        return [];
    }

    getAvailableTuevEntities() {
        if (!this._hass) {
            return [];
        }

        return Object.keys(this._hass.states)
            .filter((entityId) => {
                const entity = this._hass.states[entityId];

                return (
                    entityId.startsWith("sensor.") &&
                    entity?.attributes?.month !== undefined &&
                    entity?.attributes?.year !== undefined &&
                    entity?.attributes?.plate !== undefined
                );
            })
            .sort((a, b) => {
                const entityA = this._hass.states[a];
                const entityB = this._hass.states[b];

                const nameA = entityA?.attributes?.vehicle_name || entityA?.attributes?.friendly_name || a;
                const nameB = entityB?.attributes?.vehicle_name || entityB?.attributes?.friendly_name || b;

                return String(nameA).localeCompare(String(nameB), undefined, {
                    numeric: true,
                    sensitivity: "base"
                });
            });
    }

    getEntityLabel(entityId) {
        const entity = this._hass?.states?.[entityId];

        if (!entity) {
            return entityId;
        }

        const name = entity.attributes?.vehicle_name || entity.attributes?.friendly_name || entityId;
        const plate = entity.attributes?.plate || "";

        return plate
            ? `${name} (${plate})`
            : name;
    }

    getUnselectedEntities() {
        const selected = new Set(this._draftEntityIds.filter(Boolean));
        const search = String(this._searchText || "").trim().toLowerCase();

        return this.getAvailableTuevEntities()
            .filter((entityId) => !selected.has(entityId))
            .filter((entityId) => {
                if (!search) {
                    return true;
                }

                const label = this.getEntityLabel(entityId).toLowerCase();
                return label.includes(search) || entityId.toLowerCase().includes(search);
            });
    }

    render() {
        if (!this._config) {
            return;
        }

        const selectedEntityIds = this._draftEntityIds.filter(Boolean);
        const unselectedEntities = this.getUnselectedEntities();
        const hasAvailableToAdd = this.getAvailableTuevEntities()
            .some((entityId) => !selectedEntityIds.includes(entityId));

        this.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                gap: 18px;
                padding: 4px 0;
            ">
                <div>
                    <label style="
                        display: block;
                        font-weight: 600;
                        margin-bottom: 8px;
                    ">
                        TÜV-Entitäten
                    </label>

                    <div style="
                        border: 1px solid var(--divider-color);
                        border-radius: 8px;
                        overflow: hidden;
                        background: var(--card-background-color);
                    ">
                        <div style="
                            display: flex;
                            flex-wrap: wrap;
                            gap: 8px;
                            align-items: center;
                            min-height: 44px;
                            padding: 10px;
                            background: rgba(0, 0, 0, 0.10);
                        ">
                            ${
                                selectedEntityIds.length
                                    ? selectedEntityIds.map((entityId) => `
                                        <span style="
                                            display: inline-flex;
                                            align-items: center;
                                            gap: 6px;
                                            border-radius: 999px;
                                            padding: 6px 9px;
                                            background: var(--secondary-background-color);
                                            border: 1px solid var(--divider-color);
                                            font-size: 13px;
                                            max-width: 100%;
                                        ">
                                            <span style="
                                                overflow: hidden;
                                                text-overflow: ellipsis;
                                                white-space: nowrap;
                                                max-width: 260px;
                                            ">
                                                ${this.getEntityLabel(entityId)}
                                            </span>
                                            <button
                                                type="button"
                                                data-remove-entity="${entityId}"
                                                title="Entfernen"
                                                style="
                                                    border: none;
                                                    background: transparent;
                                                    color: var(--primary-text-color);
                                                    cursor: pointer;
                                                    font-size: 15px;
                                                    line-height: 1;
                                                    padding: 0 2px;
                                                "
                                            >×</button>
                                        </span>
                                    `).join("")
                                    : `<span style="font-size: 13px; opacity: 0.7;">Noch keine Entität ausgewählt.</span>`
                            }
                        </div>

                        <div style="
                            padding: 10px;
                            border-top: 1px solid var(--divider-color);
                        ">
                            <button
                                id="togglePicker"
                                type="button"
                                ${hasAvailableToAdd ? "" : "disabled"}
                                style="
                                    border: none;
                                    border-radius: 999px;
                                    padding: 7px 13px;
                                    background: ${hasAvailableToAdd ? "var(--primary-color)" : "var(--disabled-color, #777)"};
                                    color: var(--text-primary-color);
                                    cursor: ${hasAvailableToAdd ? "pointer" : "default"};
                                    font-weight: 600;
                                    opacity: ${hasAvailableToAdd ? "1" : "0.6"};
                                "
                            >
                                ${this._pickerOpen ? "Auswahl schließen" : "Hinzufügen"}
                            </button>

                            ${this._pickerOpen ? `
                                <div style="
                                    margin-top: 10px;
                                    border: 1px solid var(--divider-color);
                                    border-radius: 8px;
                                    padding: 10px;
                                    background: var(--card-background-color);
                                ">
                                    <input
                                        id="entitySearch"
                                        type="text"
                                        value="${this.escapeHtml(this._searchText)}"
                                        placeholder="Suchen"
                                        style="
                                            width: 100%;
                                            box-sizing: border-box;
                                            padding: 8px 10px;
                                            border-radius: 6px;
                                            border: 1px solid var(--divider-color);
                                            background: var(--secondary-background-color);
                                            color: var(--primary-text-color);
                                            margin-bottom: 8px;
                                        "
                                    >

                                    <div style="
                                        display: flex;
                                        flex-direction: column;
                                        max-height: 260px;
                                        overflow-y: auto;
                                    ">
                                        ${
                                            unselectedEntities.length
                                                ? unselectedEntities.map((entityId) => `
                                                    <button
                                                        type="button"
                                                        data-add-entity="${entityId}"
                                                        style="
                                                            text-align: left;
                                                            border: none;
                                                            background: transparent;
                                                            color: var(--primary-text-color);
                                                            cursor: pointer;
                                                            padding: 9px 8px;
                                                            border-radius: 6px;
                                                            font-size: 14px;
                                                        "
                                                        onmouseover="this.style.background='var(--secondary-background-color)'"
                                                        onmouseout="this.style.background='transparent'"
                                                    >
                                                        <div style="font-weight: 600;">
                                                            ${this.getEntityLabel(entityId)}
                                                        </div>
                                                        <div style="font-size: 12px; opacity: 0.65;">
                                                            ${entityId}
                                                        </div>
                                                    </button>
                                                `).join("")
                                                : `<div style="font-size: 13px; opacity: 0.7; padding: 8px;">
                                                    Keine weiteren passenden TÜV-Entitäten gefunden.
                                                </div>`
                                        }
                                    </div>
                                </div>
                            ` : ""}
                        </div>
                    </div>

                    <div style="
                        font-size: 12px;
                        opacity: 0.75;
                        margin-top: 6px;
                    ">
                        Bei einer Entität wird automatisch die Einzelansicht genutzt.
                    </div>
                </div>

                <div>
                    <label style="
                        display: block;
                        font-weight: 600;
                        margin-bottom: 6px;
                    ">
                        Layout
                    </label>

                    <select
                        id="layout"
                        style="
                            width: 100%;
                            box-sizing: border-box;
                            padding: 8px;
                            border-radius: 6px;
                            border: 1px solid var(--divider-color);
                            background: var(--card-background-color);
                            color: var(--primary-text-color);
                        "
                    >
                        <option value="auto" ${this._config.layout === "auto" ? "selected" : ""}>Automatisch</option>
                        <option value="horizontal" ${this._config.layout === "horizontal" ? "selected" : ""}>Nebeneinander bevorzugen</option>
                        <option value="vertical" ${this._config.layout === "vertical" ? "selected" : ""}>Untereinander</option>
                    </select>
                </div>

                <div>
                    <label style="
                        display: block;
                        font-weight: 600;
                        margin-bottom: 6px;
                    ">
                        Sortierung
                    </label>

                    <select
                        id="sort"
                        style="
                            width: 100%;
                            box-sizing: border-box;
                            padding: 8px;
                            border-radius: 6px;
                            border: 1px solid var(--divider-color);
                            background: var(--card-background-color);
                            color: var(--primary-text-color);
                        "
                    >
                        <option value="config" ${this._config.sort === "config" ? "selected" : ""}>Wie konfiguriert</option>
                        <option value="name" ${this._config.sort === "name" ? "selected" : ""}>Fahrzeugname</option>
                        <option value="plate" ${this._config.sort === "plate" ? "selected" : ""}>Kennzeichen</option>
                        <option value="due_date" ${this._config.sort === "due_date" ? "selected" : ""}>HU-Fälligkeit</option>
                        <option value="status" ${this._config.sort === "status" ? "selected" : ""}>Status</option>
                    </select>
                </div>
            </div>
        `;

        this.querySelector("#togglePicker")?.addEventListener("click", () => {
            if (!hasAvailableToAdd) {
                return;
            }

            this._pickerOpen = !this._pickerOpen;
            this._searchText = "";
            this.render();
        });

        this.querySelector("#entitySearch")?.addEventListener("input", (event) => {
            this._searchText = event.target.value || "";
            this.render();
        });

        this.querySelectorAll("[data-add-entity]").forEach((button) => {
            button.addEventListener("click", () => {
                const entityId = button.getAttribute("data-add-entity");

                if (!entityId) {
                    return;
                }

                this._draftEntityIds = [...new Set([
                    ...this._draftEntityIds.filter(Boolean),
                    entityId
                ])];

                this._pickerOpen = false;
                this._searchText = "";
                this.applyEntities();
                this.render();
            });
        });

        this.querySelectorAll("[data-remove-entity]").forEach((button) => {
            button.addEventListener("click", () => {
                const entityId = button.getAttribute("data-remove-entity");

                this._draftEntityIds = this._draftEntityIds
                    .filter((currentEntityId) => currentEntityId !== entityId);

                this.applyEntities();
                this.render();
            });
        });

        this.querySelector("#layout")?.addEventListener("change", () => {
            this.updateConfig();
        });

        this.querySelector("#sort")?.addEventListener("change", () => {
            this.updateConfig();
        });
    }

    applyEntities() {
        const cleanedEntityIds = [...new Set(
            this._draftEntityIds
                .map((entityId) => String(entityId || "").trim())
                .filter(Boolean)
        )];

        const newConfig = {
            ...this._config
        };

        if (cleanedEntityIds.length === 1) {
            newConfig.entity = cleanedEntityIds[0];
            delete newConfig.entities;
        } else if (cleanedEntityIds.length > 1) {
            newConfig.entities = cleanedEntityIds;
            delete newConfig.entity;
        } else {
            delete newConfig.entity;
            delete newConfig.entities;
        }

        this._config = newConfig;
        this.fireConfigChanged();
    }

    updateConfig() {
        const layout = this.querySelector("#layout")?.value || "auto";
        const sort = this.querySelector("#sort")?.value || "config";

        this._config = {
            ...this._config,
            layout,
            sort
        };

        this.fireConfigChanged();
    }

    fireConfigChanged() {
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: {
                config: this._config
            },
            bubbles: true,
            composed: true
        }));
    }

    escapeHtml(value) {
        return String(value || "")
            .replaceAll("&", "&amp;")
            .replaceAll('"', "&quot;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");
    }
}

if (!customElements.get("tuev-card-editor")) {
    customElements.define("tuev-card-editor", TuevCardEditor);
}

if (!customElements.get("tuev-card")) {
    customElements.define("tuev-card", TuevCard);
}