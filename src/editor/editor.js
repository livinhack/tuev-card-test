import { localize } from "../translations/index.js?v=b32";
import { normalizeCardConfig, removeLegacyCardConfigOptions } from "../card/config.js?v=b32";
import { getAvailableTuevEntities, getEntityLabel, sortEntityIds } from "../card/entities.js?v=b32";
import { createGroup, getNewGroupTitle, getUngroupedEntityIdsFromConfig, normalizeGroups, normalizeGroupSort, normalizeGroupSortDirection } from "../card/groups.js?v=b32";
import {
    checkPlateFontAvailable,
    ensurePlateFont
} from "../plate/renderer.js?v=b32";
import {
    getColumnLabel
} from "./columns.js?v=b32";
import {
    renderDisplayOptionsSection,
    renderEntitySection,
    renderGroupsSection
} from "./render-parts.js?v=b32";
import { renderEditorStyles } from "./styles.js?v=b32";
import { renderEditorFloatingPanels } from "./floating-panels.js?v=b32";

export class TuevCardEditor extends HTMLElement {
    setConfig(config) {
        const openGroupColorId = this._openGroupColorId;
        const displayOptionsOpen = this._displayOptionsOpen === true;
        const displayOptionsAnchor = this._displayOptionsAnchor;
        const colorPopoverAnchor = this._colorPopoverAnchor;
        const sortConfirmAnchor = this._sortConfirmAnchor;

        this._config = normalizeCardConfig(config, { requireEntity: false });

        this._plateFontAvailable = this._plateFontAvailable === true;
        this._draftGroups = normalizeGroups(this._config.groups);
        this._draftEntityIds = this.getUngroupedEntityIdsFromConfig();
        this._pickerOpen = false;
        this._pickerOpenKey = null;
        this._searchText = "";
        this._pendingGroupSort = null;
        this._openGroupColorId = this._draftGroups.some((group) => group.id === openGroupColorId)
            ? openGroupColorId
            : null;
        this._displayOptionsOpen = displayOptionsOpen;
        this._displayOptionsAnchor = displayOptionsAnchor || null;
        this._colorPopoverAnchor = this._openGroupColorId ? (colorPopoverAnchor || null) : null;
        this._sortConfirmAnchor = sortConfirmAnchor || null;
        this._draggedGroupEntity = null;

        this.checkPlateFontAvailability();
        this.render();
    }

    connectedCallback() {
        if (!this._boundHandleDocumentClick) {
            this._boundHandleDocumentClick = (event) => this.handleDocumentClick(event);
        }

        document.addEventListener("click", this._boundHandleDocumentClick, true);
    }

    disconnectedCallback() {
        if (this._boundHandleDocumentClick) {
            document.removeEventListener("click", this._boundHandleDocumentClick, true);
        }
    }

    handleDocumentClick(event) {
        const path = typeof event.composedPath === "function" ? event.composedPath() : [];
        const target = event.target;

        const hasClass = (className) => path.some((item) => item?.classList?.contains?.(className));
        const clickedInsideEditor = path.includes(this) || (target instanceof Node && this.contains(target));

        const clickedInsideFloatingControl = hasClass("tuev-editor-display-menu")
            || hasClass("tuev-editor-color-toggle-wrap")
            || hasClass("tuev-editor-floating-layer")
            || hasClass("tuev-editor-floating-panel");

        if (clickedInsideEditor && clickedInsideFloatingControl) {
            return;
        }

        let shouldRender = false;

        if (this._displayOptionsOpen) {
            this._displayOptionsOpen = false;
            this._displayOptionsAnchor = null;
            shouldRender = true;
        }

        if (this._openGroupColorId) {
            this._openGroupColorId = null;
            this._colorPopoverAnchor = null;
            shouldRender = true;
        }

        if (this._pendingGroupSort) {
            this._pendingGroupSort = null;
            this._sortConfirmAnchor = null;
            shouldRender = true;
        }

        if (shouldRender) {
            this.render();
        }
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

    getUngroupedEntityIdsFromConfig() {
        return getUngroupedEntityIdsFromConfig(this._config);
    }

    getAvailableTuevEntities() {
        return getAvailableTuevEntities(this._hass);
    }

    getEntityLabel(entityId) {
        return getEntityLabel(this._hass, entityId);
    }

    getSelectedEntityIds() {
        return [...new Set([
            ...this._draftEntityIds.filter(Boolean),
            ...this._draftGroups.flatMap((group) => group.entities || [])
        ])];
    }

    getUnselectedEntities() {
        const selected = new Set(this.getSelectedEntityIds());
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
        const selectedAllEntityIds = this.getSelectedEntityIds();
        const availableTuevEntities = this.getAvailableTuevEntities();
        const unselectedEntities = this.getUnselectedEntities();
        const hasAvailableToAdd = availableTuevEntities
            .some((entityId) => !selectedAllEntityIds.includes(entityId));
        const newEntityCount = availableTuevEntities
            .filter((entityId) => !selectedAllEntityIds.includes(entityId))
            .length;
        const entityHint = availableTuevEntities.length > 0 && !hasAvailableToAdd
            ? this.localize("editor.all_entities_added")
            : this.localize("editor.single_entity_hint");
        const canRenderPlate = this._plateFontAvailable === true;
        const showColumnSetting = selectedAllEntityIds.length > 1;
        const columnLabel = getColumnLabel(
            this._config.columns,
            (key) => this.localize(key)
        );

        this.innerHTML = `
            ${renderEditorStyles()}

            <div class="tuev-editor-root">
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
                    hasUngroupedToRelease: selectedEntityIds.length > 0,
                    pickerOpen: this._pickerOpen,
                    searchText: this._searchText,
                    sort: this._config.sort,
                    sortDirection: this._config.sort_direction,
                    localize: (key) => this.localize(key),
                    getEntityLabel: (entityId) => this.getEntityLabel(entityId),
                    escapeHtml: (value) => this.escapeHtml(value)
                })}

                ${renderDisplayOptionsSection({
                    displayOptionsOpen: this._displayOptionsOpen,
                    localize: (key) => this.localize(key)
                })}

                ${renderGroupsSection({
                    groups: this._draftGroups,
                    pickerOpenKey: this._pickerOpenKey,
                    unselectedEntities,
                    searchText: this._searchText,
                    pendingGroupSort: this._pendingGroupSort,
                    openGroupColorId: this._openGroupColorId,
                    localize: (key) => this.localize(key),
                    getEntityLabel: (entityId) => this.getEntityLabel(entityId),
                    escapeHtml: (value) => this.escapeHtml(value)
                })}
                </div>

                ${renderEditorFloatingPanels({
                displayOptionsOpen: this._displayOptionsOpen,
                displayAnchor: this._displayOptionsAnchor,
                showColumnSetting,
                columns: this._config.columns,
                config: this._config,
                canRenderPlate,
                openGroupColorId: this._openGroupColorId,
                colorAnchor: this._colorPopoverAnchor,
                groups: this._draftGroups,
                pendingGroupSort: this._pendingGroupSort,
                sortConfirmAnchor: this._sortConfirmAnchor,
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
            this._pickerOpenKey = this._pickerOpen ? null : this._pickerOpenKey;
            this._searchText = "";
            this.render();
        });

        this.querySelector("#addAllNewEntities")?.addEventListener("click", () => {
            this.addAllNewEntities();
        });

        this.querySelector("#releaseUngroupedEntities")?.addEventListener("click", () => {
            this.releaseUngroupedEntities();
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
                this._pickerOpenKey = null;
                this._searchText = "";
                this.applyDraftConfig();
                this.render();
            });
        });

        this.querySelectorAll("[data-remove-entity]").forEach((button) => {
            button.addEventListener("click", () => {
                const entityId = button.getAttribute("data-remove-entity");

                this._draftEntityIds = this._draftEntityIds
                    .filter((currentEntityId) => currentEntityId !== entityId);

                this.applyDraftConfig();
                this.render();
            });
        });

        this.querySelector("#addGroup")?.addEventListener("click", () => {
            this._draftGroups = [
                ...this._draftGroups,
                createGroup(getNewGroupTitle((key) => this.localize(key)))
            ];
            this.applyDraftConfig();
            this.render();
        });

        this.querySelectorAll("[data-group-title]").forEach((input) => {
            const updateDraftTitle = () => {
                const groupId = input.getAttribute("data-group-title");
                this._draftGroups = this._draftGroups.map((group) => (
                    group.id === groupId
                        ? { ...group, title: input.value || "" }
                        : group
                ));
            };

            input.addEventListener("input", () => {
                updateDraftTitle();
            });

            input.addEventListener("change", () => {
                updateDraftTitle();
                this.applyDraftConfig();
            });
        });

        this.querySelectorAll("[data-remove-group]").forEach((button) => {
            button.addEventListener("click", () => {
                const groupId = button.getAttribute("data-remove-group");

                this._draftGroups = this._draftGroups
                    .filter((candidate) => candidate.id !== groupId);
                this._pickerOpenKey = null;
                this._openGroupColorId = null;
                this.applyDraftConfig();
                this.render();
            });
        });

        this.querySelectorAll("[data-group-up]").forEach((button) => {
            button.addEventListener("click", () => {
                this.moveGroup(button.getAttribute("data-group-up"), -1);
            });
        });

        this.querySelectorAll("[data-group-color-toggle]").forEach((button) => {
            button.addEventListener("click", () => {
                const groupId = button.getAttribute("data-group-color-toggle");
                this._pendingGroupSort = null;
                this._displayOptionsOpen = false;
                const willOpen = this._openGroupColorId !== groupId;
                this._openGroupColorId = willOpen ? groupId : null;
                this._colorPopoverAnchor = willOpen ? this.getPopoverAnchor(button) : null;
                this.render();
            });
        });

        this.querySelectorAll("[data-group-color]").forEach((button) => {
            button.addEventListener("click", () => {
                const groupId = button.getAttribute("data-group-color");
                const color = button.getAttribute("data-color");

                if (!groupId || !color) {
                    return;
                }

                this._draftGroups = this._draftGroups.map((group) => (
                    group.id === groupId
                        ? { ...group, color }
                        : group
                ));

                this.applyDraftConfig();
                this.render();
            });
        });

        this.querySelectorAll("[data-group-down]").forEach((button) => {
            button.addEventListener("click", () => {
                this.moveGroup(button.getAttribute("data-group-down"), 1);
            });
        });

        this.querySelectorAll("[data-toggle-group-picker]").forEach((button) => {
            button.addEventListener("click", () => {
                const groupId = button.getAttribute("data-toggle-group-picker");
                this._pickerOpen = false;
                this._displayOptionsOpen = false;
                this._pickerOpenKey = this._pickerOpenKey === groupId ? null : groupId;
                this._searchText = "";
                this.render();
            });
        });

        this.querySelectorAll("[data-group-search]").forEach((input) => {
            input.addEventListener("input", () => {
                this._searchText = input.value || "";
                this.render();
            });
        });

        this.querySelectorAll("[data-add-group-entity]").forEach((button) => {
            button.addEventListener("click", () => {
                const entityId = button.getAttribute("data-add-group-entity");
                const groupId = button.getAttribute("data-group-id");

                if (!entityId || !groupId) {
                    return;
                }

                this._draftEntityIds = this._draftEntityIds
                    .filter((currentEntityId) => currentEntityId !== entityId);
                this._draftGroups = this._draftGroups.map((group) => ({
                    ...group,
                    entities: group.id === groupId
                        ? [...new Set([...(group.entities || []), entityId])]
                        : (group.entities || []).filter((currentEntityId) => currentEntityId !== entityId)
                }));
                this._pickerOpenKey = null;
                this._searchText = "";
                this.applyDraftConfig();
                this.render();
            });
        });

        this.querySelectorAll("[data-ungrouped-sort]").forEach((button) => {
            button.addEventListener("click", () => {
                this.setUngroupedSort(button.getAttribute("data-ungrouped-sort"));
            });
        });

        this.querySelector("[data-ungrouped-sort-direction]")?.addEventListener("click", () => {
            this.toggleUngroupedSortDirection();
        });

        this.querySelectorAll("[data-group-sort]").forEach((button) => {
            button.addEventListener("click", () => {
                this.setGroupSort(
                    button.getAttribute("data-group-id"),
                    button.getAttribute("data-group-sort"),
                    this.getGroupRightPopoverAnchor(button)
                );
            });
        });

        this.querySelectorAll("[data-group-sort-direction]").forEach((button) => {
            button.addEventListener("click", () => {
                this.toggleGroupSortDirection(button.getAttribute("data-group-sort-direction"));
            });
        });

        this.querySelectorAll("[data-confirm-group-sort]").forEach((button) => {
            button.addEventListener("click", () => {
                this.confirmPendingGroupSort(button.getAttribute("data-confirm-group-sort"));
            });
        });

        this.querySelectorAll("[data-cancel-group-sort]").forEach((button) => {
            button.addEventListener("click", () => {
                const groupId = button.getAttribute("data-cancel-group-sort");

                if (this._pendingGroupSort?.groupId === groupId) {
                    this._pendingGroupSort = null;
                    this._sortConfirmAnchor = null;
                    this.render();
                }
            });
        });

        this.querySelectorAll("[data-remove-group-entity]").forEach((button) => {
            button.addEventListener("click", () => {
                const entityId = button.getAttribute("data-remove-group-entity");
                const groupId = button.getAttribute("data-group-id");

                if (!entityId || !groupId) {
                    return;
                }

                this._draftGroups = this._draftGroups.map((group) => (
                    group.id === groupId
                        ? {
                            ...group,
                            entities: (group.entities || [])
                                .filter((currentEntityId) => currentEntityId !== entityId)
                        }
                        : group
                ));
                this.applyDraftConfig();
                this.render();
            });
        });

        this.querySelectorAll("[data-group-entity-chip]").forEach((chip) => {
            chip.addEventListener("dragstart", (event) => {
                const groupId = chip.getAttribute("data-group-id");
                const entityId = chip.getAttribute("data-entity-id");

                if (!groupId || !entityId || chip.getAttribute("draggable") !== "true") {
                    event.preventDefault();
                    return;
                }

                this._draggedGroupEntity = { groupId, entityId };
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", `${groupId}::${entityId}`);
                chip.classList.add("is-dragging");
            });

            chip.addEventListener("dragend", () => {
                this._draggedGroupEntity = null;
                chip.classList.remove("is-dragging");
            });

            chip.addEventListener("dragover", (event) => {
                const groupId = chip.getAttribute("data-group-id");

                if (!this.canDropGroupEntity(groupId)) {
                    return;
                }

                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
            });

            chip.addEventListener("drop", (event) => {
                event.preventDefault();
                this.dropGroupEntity(
                    chip.getAttribute("data-group-id"),
                    chip.getAttribute("data-entity-id")
                );
            });
        });

        this.querySelector("#toggleDisplayOptions")?.addEventListener("click", (event) => {
            const willOpen = !this._displayOptionsOpen;
            this._displayOptionsOpen = willOpen;
            this._displayOptionsAnchor = willOpen ? this.getPopoverAnchor(event.currentTarget) : null;
            this._pickerOpen = false;
            this._pickerOpenKey = null;
            this._openGroupColorId = null;
            this._colorPopoverAnchor = null;
            this._pendingGroupSort = null;
            this._sortConfirmAnchor = null;
            this.render();
        });

        this.querySelectorAll("[data-display-columns]").forEach((button) => {
            button.addEventListener("click", () => {
                this.setColumns(button.getAttribute("data-display-columns"));
            });
        });

        this.querySelector("#renderPlate")?.addEventListener("change", () => {
            this.updateConfig();
        });

        this.querySelector("#showDetails")?.addEventListener("change", () => {
            this.updateConfig();
        });
    }

    setUngroupedSort(sort) {
        const allowed = ["name", "plate", "due_date", "status"];
        const nextSort = allowed.includes(sort) ? sort : "name";

        if (this._config.sort === nextSort) {
            return;
        }

        this._config = {
            ...this._config,
            sort: nextSort
        };
        this.fireConfigChanged();
        this.render();
    }

    toggleUngroupedSortDirection() {
        const nextDirection = this._config.sort_direction === "desc" ? "asc" : "desc";

        this._config = {
            ...this._config,
            sort_direction: nextDirection
        };
        this.fireConfigChanged();
        this.render();
    }

    addAllNewEntities() {
        const selected = new Set(this.getSelectedEntityIds());

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
        this._pickerOpenKey = null;
        this._searchText = "";

        this.applyDraftConfig();
        this.render();
    }

    releaseUngroupedEntities() {
        if (!this._draftEntityIds.filter(Boolean).length) {
            return;
        }

        this._draftEntityIds = [];
        this._pickerOpen = false;
        this._pickerOpenKey = null;
        this._searchText = "";

        this.applyDraftConfig();
        this.render();
    }

    moveGroup(groupId, direction) {
        const index = this._draftGroups.findIndex((group) => group.id === groupId);
        const targetIndex = index + direction;

        if (index < 0 || targetIndex < 0 || targetIndex >= this._draftGroups.length) {
            return;
        }

        const nextGroups = [...this._draftGroups];
        const [group] = nextGroups.splice(index, 1);
        nextGroups.splice(targetIndex, 0, group);

        this._draftGroups = nextGroups;
        this.applyDraftConfig();
        this.render();
    }

    canDropGroupEntity(groupId) {
        if (!this._draggedGroupEntity || !groupId) {
            return false;
        }

        const group = this._draftGroups.find((candidate) => candidate.id === groupId);

        return group?.id === this._draggedGroupEntity.groupId
            && normalizeGroupSort(group.sort) === "manual";
    }

    dropGroupEntity(groupId, targetEntityId) {
        if (!this._draggedGroupEntity || !groupId || !targetEntityId) {
            return;
        }

        const { entityId } = this._draggedGroupEntity;

        if (entityId === targetEntityId) {
            return;
        }

        this._draftGroups = this._draftGroups.map((group) => {
            if (group.id !== groupId || normalizeGroupSort(group.sort) !== "manual") {
                return group;
            }

            const entities = (group.entities || []).filter(Boolean);
            const fromIndex = entities.indexOf(entityId);
            const toIndex = entities.indexOf(targetEntityId);

            if (fromIndex < 0 || toIndex < 0) {
                return group;
            }

            const nextEntities = [...entities];
            const [moved] = nextEntities.splice(fromIndex, 1);
            nextEntities.splice(toIndex, 0, moved);

            return {
                ...group,
                entities: nextEntities
            };
        });

        this._draggedGroupEntity = null;
        this.applyDraftConfig();
        this.render();
    }

    getSortedGroupEntityIds(entityIds, sort, direction) {
        const sorted = sortEntityIds(entityIds || [], sort, this._hass);

        return direction === "desc"
            ? sorted.reverse()
            : sorted;
    }

    setGroupSort(groupId, sort, anchor = null) {
        const nextSort = normalizeGroupSort(sort);

        if (!groupId || !nextSort) {
            return;
        }

        const group = this._draftGroups.find((candidate) => candidate.id === groupId);
        const currentSort = normalizeGroupSort(group?.sort);

        if (currentSort === nextSort) {
            return;
        }

        if (currentSort === "manual" && nextSort !== "manual") {
            this._pendingGroupSort = { groupId, sort: nextSort };
            this._sortConfirmAnchor = anchor;
            this.render();
            return;
        }

        this.applyGroupSort(groupId, nextSort);
    }

    confirmPendingGroupSort(groupId) {
        if (!groupId || this._pendingGroupSort?.groupId !== groupId) {
            return;
        }

        const nextSort = this._pendingGroupSort.sort;
        this._pendingGroupSort = null;
        this._sortConfirmAnchor = null;
        this._openGroupColorId = null;
        this._colorPopoverAnchor = null;
        this._displayOptionsOpen = false;
        this._displayOptionsAnchor = null;
        this._draggedGroupEntity = null;
        this.applyGroupSort(groupId, nextSort);
    }

    applyGroupSort(groupId, sort) {
        const nextSort = normalizeGroupSort(sort);

        this._draftGroups = this._draftGroups.map((group) => {
            if (group.id !== groupId) {
                return group;
            }

            const direction = normalizeGroupSortDirection(group.sort_direction);
            const entities = nextSort === "manual"
                ? [...(group.entities || [])]
                : this.getSortedGroupEntityIds(group.entities, nextSort, direction);

            return {
                ...group,
                sort: nextSort === "manual" ? undefined : nextSort,
                sort_direction: nextSort === "manual" || direction === "asc" ? undefined : direction,
                entities
            };
        });

        this.applyDraftConfig();
        this.render();
    }

    toggleGroupSortDirection(groupId) {
        if (!groupId) {
            return;
        }

        this._draftGroups = this._draftGroups.map((group) => {
            if (group.id !== groupId) {
                return group;
            }

            const sort = normalizeGroupSort(group.sort);

            if (sort === "manual") {
                return group;
            }

            const nextDirection = normalizeGroupSortDirection(group.sort_direction) === "asc"
                ? "desc"
                : "asc";

            return {
                ...group,
                sort,
                sort_direction: nextDirection === "asc" ? undefined : nextDirection,
                entities: this.getSortedGroupEntityIds(group.entities, sort, nextDirection)
            };
        });

        this.applyDraftConfig();
        this.render();
    }

    applyDraftConfig() {
        const cleanList = (entityIds) => [...new Set(
            (entityIds || [])
                .map((entityId) => String(entityId || "").trim())
                .filter(Boolean)
        )];
        const cleanedGroups = normalizeGroups(this._draftGroups)
            .map((group) => ({
                ...group,
                entities: cleanList(group.entities)
            }));
        const groupedIds = new Set(cleanedGroups.flatMap((group) => group.entities));
        const cleanedEntityIds = cleanList(this._draftEntityIds)
            .filter((entityId) => !groupedIds.has(entityId));

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

        if (cleanedGroups.length > 0) {
            newConfig.groups = cleanedGroups;
        } else {
            delete newConfig.groups;
        }

        delete newConfig.auto_add_entities;
        delete newConfig.badge_size;
        delete newConfig.compact_badge_size;

        this._config = newConfig;
        this._draftGroups = cleanedGroups;
        this._draftEntityIds = cleanedEntityIds;
        this.fireConfigChanged();
    }

    setColumns(columns) {
        const value = ["1", "2", "3", "4", "auto"].includes(String(columns))
            ? String(columns)
            : "auto";

        this._config = {
            ...this._config,
            columns: value
        };
        this.fireConfigChanged();
        this.render();
    }

    updateConfig() {
        const columns = this._config.columns || "auto";

        const renderPlate = this.querySelector("#renderPlate")?.checked ?? false;
        const showDetails = this.querySelector("#showDetails")?.checked ?? true;
        const newConfig = {
            ...this._config,
            columns,
            sort: this._config.sort || "name",
            sort_direction: this._config.sort_direction === "desc" ? "desc" : "asc",
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

    getGroupRightPopoverAnchor(element) {
        if (!element || typeof element.getBoundingClientRect !== "function") {
            return null;
        }

        const root = this.querySelector(".tuev-editor-root");
        const rootRect = root?.getBoundingClientRect?.();
        const groupCard = element.closest?.(".tuev-editor-group-card");
        const groupRect = groupCard?.getBoundingClientRect?.();
        const elementRect = element.getBoundingClientRect();

        if (!rootRect || !groupRect) {
            return this.getPopoverAnchor(element);
        }

        return {
            right: Math.max(8, Math.round(rootRect.right - groupRect.right)),
            top: Math.round(elementRect.bottom - rootRect.top + 10),
            containerWidth: Math.round(rootRect.width || this.clientWidth || 360)
        };
    }

    getPopoverAnchor(element) {
        if (!element || typeof element.getBoundingClientRect !== "function") {
            return null;
        }

        const rect = element.getBoundingClientRect();
        const root = this.querySelector(".tuev-editor-root");
        const rootRect = root?.getBoundingClientRect?.();
        const viewportHeight = window.innerHeight || document.documentElement?.clientHeight || 768;
        const margin = 12;

        if (!rootRect) {
            return {
                left: Math.round(rect.left),
                top: Math.round(rect.bottom + 10),
                aboveTop: Math.round(rect.top - 10),
                availableBelow: Math.max(0, Math.round(viewportHeight - rect.bottom - margin)),
                availableAbove: Math.max(0, Math.round(rect.top - margin)),
                containerWidth: Math.round(window.innerWidth || 1024)
            };
        }

        return {
            left: Math.round(rect.left - rootRect.left),
            top: Math.round(rect.bottom - rootRect.top + 10),
            aboveTop: Math.round(rect.top - rootRect.top - 10),
            availableBelow: Math.max(0, Math.round(Math.min(rootRect.bottom, viewportHeight) - rect.bottom - margin)),
            availableAbove: Math.max(0, Math.round(rect.top - Math.max(rootRect.top, 0) - margin)),
            containerWidth: Math.round(rootRect.width || this.clientWidth || 360)
        };
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
