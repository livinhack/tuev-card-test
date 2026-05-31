import { localize } from "./translations.js?v=42";

export class TuevCardEditor extends HTMLElement {
    setConfig(config) {
        this._config = {
            layout: "auto",
            sort: "config",
            show_details: true,
            plate_style: "text",
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

    localize(key) {
        return localize(this._hass, key);
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

        const badgeSizeValue = this._config.badge_size === undefined || this._config.badge_size === null
            ? ""
            : Number(this._config.badge_size || "");

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
                        ${this.localize("editor.entities")}
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
                                                title="${this.localize("editor.remove")}"
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
                                    : `<span style="font-size: 13px; opacity: 0.7;">${this.localize("editor.no_entity_selected")}</span>`
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
                                ${this._pickerOpen ? this.localize("editor.close_picker") : this.localize("editor.add")}
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
                                        placeholder="${this.localize("editor.search")}"
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
                                                    ${this.localize("editor.no_more_entities")}
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
                        ${this.localize("editor.single_entity_hint")}
                    </div>
                </div>

                <div>
                    <label style="
                        display: block;
                        font-weight: 600;
                        margin-bottom: 6px;
                    ">
                        ${this.localize("editor.layout")}
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
                        <option value="auto" ${this._config.layout === "auto" ? "selected" : ""}>${this.localize("editor.layout_auto")}</option>
                        <option value="horizontal" ${this._config.layout === "horizontal" ? "selected" : ""}>${this.localize("editor.layout_horizontal")}</option>
                        <option value="vertical" ${this._config.layout === "vertical" ? "selected" : ""}>${this.localize("editor.layout_vertical")}</option>
                    </select>
                </div>

                <div>
                    <label style="
                        display: block;
                        font-weight: 600;
                        margin-bottom: 6px;
                    ">
                        ${this.localize("editor.sort")}
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
                        <option value="config" ${this._config.sort === "config" ? "selected" : ""}>${this.localize("editor.sort_config")}</option>
                        <option value="name" ${this._config.sort === "name" ? "selected" : ""}>${this.localize("editor.sort_name")}</option>
                        <option value="plate" ${this._config.sort === "plate" ? "selected" : ""}>${this.localize("editor.sort_plate")}</option>
                        <option value="due_date" ${this._config.sort === "due_date" ? "selected" : ""}>${this.localize("editor.sort_due_date")}</option>
                        <option value="status" ${this._config.sort === "status" ? "selected" : ""}>${this.localize("editor.sort_status")}</option>
                    </select>
                </div>

                <div>
                    <label style="
                        display: block;
                        font-weight: 600;
                        margin-bottom: 6px;
                    ">
                        ${this.localize("editor.plate_style")}
                    </label>

                    <select
                        id="plateStyle"
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
                        <option value="text" ${this._config.plate_style !== "plate" ? "selected" : ""}>${this.localize("editor.plate_style_text")}</option>
                        <option value="plate" ${this._config.plate_style === "plate" ? "selected" : ""}>${this.localize("editor.plate_style_plate")}</option>
                    </select>
                </div>

                <label style="
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    cursor: pointer;
                ">
                    <input
                        id="showDetails"
                        type="checkbox"
                        ${this._config.show_details !== false ? "checked" : ""}
                    >
                    ${this.localize("editor.show_details")}
                </label>

                <div>
                    <label style="
                        display: block;
                        font-weight: 600;
                        margin-bottom: 6px;
                    ">
                        ${this.localize("editor.badge_size")}
                    </label>

                    <input
                        id="badgeSize"
                        type="number"
                        min="120"
                        max="360"
                        step="5"
                        value="${badgeSizeValue}"
                        placeholder="auto"
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

                    <div style="
                        font-size: 12px;
                        opacity: 0.75;
                        margin-top: 6px;
                    ">
                        ${this.localize("editor.badge_size_hint")}
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners(hasAvailableToAdd);
    }

    attachEventListeners(hasAvailableToAdd) {
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

        this.querySelector("#plateStyle")?.addEventListener("change", () => {
            this.updateConfig();
        });

        this.querySelector("#showDetails")?.addEventListener("change", () => {
            this.updateConfig();
        });

        this.querySelector("#badgeSize")?.addEventListener("input", () => {
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
        const plateStyle = this.querySelector("#plateStyle")?.value || "text";
        const showDetails = this.querySelector("#showDetails")?.checked ?? true;
        const badgeSizeRaw = this.querySelector("#badgeSize")?.value;

        const newConfig = {
            ...this._config,
            layout,
            sort,
            plate_style: plateStyle,
            show_details: showDetails
        };

        if (badgeSizeRaw === "" || badgeSizeRaw === undefined || badgeSizeRaw === null) {
            delete newConfig.badge_size;
        } else {
            const badgeSize = Number(badgeSizeRaw);

            if (Number.isFinite(badgeSize) && badgeSize > 0) {
                newConfig.badge_size = badgeSize;
            } else {
                delete newConfig.badge_size;
            }
        }

        delete newConfig.compact_badge_size;

        this._config = newConfig;
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