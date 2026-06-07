import { localize } from "../translations/index.js?v=a92";
import { normalizeCardConfig, removeLegacyCardConfigOptions } from "../card/config.js?v=a92";
import { getAvailableTuevEntities, getEntityIdsFromConfig, getEntityLabel } from "../card/entities.js?v=a92";
import {
    checkPlateFontAvailable,
    ensurePlateFont
} from "../plate/renderer.js?v=a92";
import {
    getColumnLabel,
    getColumnsFromSliderValue,
    getColumnSliderValue
} from "./columns.js?v=a92";
import {
    renderColumnsSection,
    renderEditorStyles,
    renderEntitySection,
    renderOptionsSection,
    renderSortSection
} from "./render-parts.js?v=a92";

export class TuevCardEditor extends HTMLElement {
    setConfig(config) {
        this._config = normalizeCardConfig(config, { requireEntity: false });

        this._plateFontAvailable = false;
        this._draftEntityIds = this.getEntityIdsFromConfig();
        this._pickerOpen = false;
        this._searchText = "";

        this.checkPlateFontAvailability();
        this.render();
    }

    set hass(hass) {
        this._hass = hass;
        this.render();
    }

    localize(key) {
        return localize(this._hass, key);
    }

    checkPlateFontAvailability() {
        checkPlateFontAvailable().then((available) => {
            this._plateFontAvailable = available;

            if (!available) {
                const hadGraphicalPlate = this._config.plate_style === "plate";
                this._config.plate_style = "text";
                removeLegacyCardConfigOptions(this._config);

                if (hadGraphicalPlate) {
                    this.fireConfigChanged();
                }

                this.render();
                return;
            }

            ensurePlateFont(() => {
                this._plateFontAvailable = true;
                this.render();
            });

            this.render();
        }).catch(() => {
            const hadGraphicalPlate = this._config.plate_style === "plate";
            this._plateFontAvailable = false;
            this._config.plate_style = "text";
            removeLegacyCardConfigOptions(this._config);

            if (hadGraphicalPlate) {
                this.fireConfigChanged();
            }

            this.render();
        });
    }

    getEntityIdsFromConfig() {
        return getEntityIdsFromConfig(this._config);
    }

    getAvailableTuevEntities() {
        return getAvailableTuevEntities(this._hass);
    }

    getEntityLabel(entityId) {
        return getEntityLabel(this._hass, entityId);
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
        const availableTuevEntities = this.getAvailableTuevEntities();
        const unselectedEntities = this.getUnselectedEntities();
        const hasAvailableToAdd = availableTuevEntities
            .some((entityId) => !selectedEntityIds.includes(entityId));
        const newEntityCount = availableTuevEntities
            .filter((entityId) => !selectedEntityIds.includes(entityId))
            .length;
        const entityHint = availableTuevEntities.length > 0 && !hasAvailableToAdd
            ? this.localize("editor.all_entities_added")
            : this.localize("editor.single_entity_hint");
        const canRenderPlate = this._plateFontAvailable === true;
        const showColumnSetting = selectedEntityIds.length > 1;
        const columnSliderValue = getColumnSliderValue(this._config.columns);
        const columnLabel = getColumnLabel(
            this._config.columns,
            (key) => this.localize(key)
        );

        this.innerHTML = `
            ${renderEditorStyles()}

            <div style="
                display: flex;
                flex-direction: column;
                gap: 18px;
                padding: 4px 0;
            ">
                ${renderEntitySection({
                    selectedEntityIds,
                    unselectedEntities,
                    hasAvailableToAdd,
                    newEntityCount,
                    entityHint,
                    pickerOpen: this._pickerOpen,
                    searchText: this._searchText,
                    localize: (key) => this.localize(key),
                    getEntityLabel: (entityId) => this.getEntityLabel(entityId),
                    escapeHtml: (value) => this.escapeHtml(value)
                })}

                ${renderColumnsSection({
                    showColumnSetting,
                    columnSliderValue,
                    columnLabel,
                    localize: (key) => this.localize(key)
                })}

                ${renderSortSection({
                    sort: this._config.sort,
                    localize: (key) => this.localize(key)
                })}

                ${renderOptionsSection({
                    config: this._config,
                    canRenderPlate,
                    localize: (key) => this.localize(key)
                })}
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

        this.querySelector("#addAllNewEntities")?.addEventListener("click", () => {
            this.addAllNewEntities();
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

        this.querySelector("#columns")?.addEventListener("input", () => {
            this.updateConfig();
        });

        this.querySelector("#sort")?.addEventListener("change", () => {
            this.updateConfig();
        });

        this.querySelector("#renderPlate")?.addEventListener("change", () => {
            this.updateConfig();
        });

        this.querySelector("#showDetails")?.addEventListener("change", () => {
            this.updateConfig();
        });
    }

    addAllNewEntities() {
        const selected = new Set(this._draftEntityIds.filter(Boolean));

        const newEntityIds = this.getAvailableTuevEntities()
            .filter((entityId) => !selected.has(entityId));

        if (newEntityIds.length === 0) {
            return;
        }

        this._draftEntityIds = [...new Set([
            ...this._draftEntityIds.filter(Boolean),
            ...newEntityIds
        ])];

        this._pickerOpen = false;
        this._searchText = "";

        this.applyEntities();
        this.render();
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

        delete newConfig.auto_add_entities;
        delete newConfig.badge_size;
        delete newConfig.compact_badge_size;

        this._config = newConfig;
        this.fireConfigChanged();
    }

    updateConfig() {
        const columnsSlider = this.querySelector("#columns");
        const columns = columnsSlider
            ? getColumnsFromSliderValue(columnsSlider.value)
            : (this._config.columns || "auto");

        const sort = this.querySelector("#sort")?.value || "name";
        const renderPlate = this.querySelector("#renderPlate")?.checked ?? false;
        const showDetails = this.querySelector("#showDetails")?.checked ?? true;
        const newConfig = {
            ...this._config,
            columns,
            sort,
            plate_style: renderPlate ? "plate" : "text",
            show_details: showDetails
        };

        delete newConfig.plate_font;
        delete newConfig.layout;
        delete newConfig.auto_add_entities;

        delete newConfig.badge_size;
        delete newConfig.compact_badge_size;

        this._config = newConfig;
        this.fireConfigChanged();
        this.render();
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
