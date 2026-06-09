import { getGroupAccentColor } from "../card/groups.js?v=b32";
import { renderButton } from "./buttons.js?v=b32";
export function renderEntitySection({
    selectedEntityIds,
    unselectedEntities,
    hasAvailableToAdd,
    newEntityCount,
    entityHint,
    hasUngroupedToRelease,
    pickerOpen,
    searchText,
    sort,
    sortDirection,
    localize,
    getEntityLabel,
    escapeHtml
}) {
    return `
        <div>
            <div class="tuev-editor-entity-card">
                <div class="tuev-editor-entity-header">
                    <div class="tuev-editor-entity-title">
                        <span>${localize("editor.entities")}</span>
                        <span class="tuev-editor-entity-count">${formatGroupEntityCount(selectedEntityIds.length, localize)}</span>
                    </div>
                    ${renderUngroupedSortControls({ sort, sortDirection, localize })}
                </div>

                <div style="
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    align-items: center;
                    min-height: 44px;
                    padding: 10px;
                    background: rgba(0, 0, 0, 0.06);
                ">
                    ${renderSelectedEntityChips({
                        selectedEntityIds,
                        localize,
                        getEntityLabel
                    })}
                </div>

                <div style="
                    padding: 10px;
                    border-top: 1px solid var(--divider-color);
                ">
                    <div style="
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                        align-items: center;
                    ">
                        ${renderButton({
                            id: "togglePicker",
                            disabled: !hasAvailableToAdd,
                            text: pickerOpen ? localize("editor.close_picker") : localize("editor.add")
                        })}

                        ${renderButton({
                            id: "addAllNewEntities",
                            disabled: newEntityCount <= 0,
                            text: localize("editor.add_all_new_entities")
                        })}

                        ${renderButton({
                            id: "releaseUngroupedEntities",
                            disabled: !hasUngroupedToRelease,
                            text: localize("editor.release_ungrouped_entities")
                        })}
                    </div>

                    ${pickerOpen ? renderEntityPicker({
                        unselectedEntities,
                        searchText,
                        localize,
                        getEntityLabel,
                        escapeHtml
                    }) : ""}
                </div>
            </div>

            <div style="
                font-size: 12px;
                opacity: 0.75;
                margin-top: 6px;
            ">
                ${entityHint}
            </div>

            ${newEntityCount === 0 ? `
                <div style="
                    font-size: 12px;
                    opacity: 0.75;
                    margin-top: 6px;
                ">
                    ${localize("editor.no_new_entities")}
                </div>
            ` : ""}
        </div>
    `;
}

function renderUngroupedSortControls({ sort, sortDirection, localize }) {
    const activeSort = sort === "config" || !sort ? "name" : sort;
    const direction = sortDirection === "desc" ? "desc" : "asc";
    const sortOptions = [
        ["name", localize("editor.sort_name_short"), "A"],
        ["plate", localize("editor.sort_plate_short"), "▭"],
        ["due_date", localize("editor.sort_due_date_short"), "◷"],
        ["status", localize("editor.sort_status_short"), "●"]
    ];

    return `
        <div class="tuev-editor-ungrouped-sort-row" aria-label="${localize("editor.sort")}">
            ${sortOptions.map(([value, label, icon]) => `
                <button
                    class="tuev-editor-sort-chip"
                    type="button"
                    data-ungrouped-sort="${value}"
                    aria-pressed="${activeSort === value ? "true" : "false"}"
                    aria-label="${localize("editor.sort")}: ${label}"
                    title="${localize("editor.sort")}: ${label}"
                >${icon}</button>
            `).join("")}
            <button
                class="tuev-editor-sort-direction"
                type="button"
                data-ungrouped-sort-direction="true"
                title="${localize("editor.sort_direction")}" 
            >${direction === "desc" ? "↓" : "↑"}</button>
        </div>
    `;
}

function renderSelectedEntityChips({ selectedEntityIds, localize, getEntityLabel }) {
    if (!selectedEntityIds.length) {
        return `<span style="font-size: 13px; opacity: 0.7;">${localize("editor.no_entity_selected")}</span>`;
    }

    return selectedEntityIds.map((entityId) => `
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
                ${getEntityLabel(entityId)}
            </span>
            <button
                class="tuev-editor-chip-remove"
                type="button"
                data-remove-entity="${entityId}"
                title="${localize("editor.remove")}"
            >×</button>
        </span>
    `).join("");
}

function renderEntityPicker({ unselectedEntities, searchText, localize, getEntityLabel, escapeHtml }) {
    return `
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
                value="${escapeHtml(searchText)}"
                placeholder="${localize("editor.search")}"
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
                ${renderEntityPickerList({
                    unselectedEntities,
                    localize,
                    getEntityLabel
                })}
            </div>
        </div>
    `;
}

function renderEntityPickerList({ unselectedEntities, localize, getEntityLabel }) {
    if (!unselectedEntities.length) {
        return `
            <div style="font-size: 13px; opacity: 0.7; padding: 8px;">
                ${localize("editor.no_more_entities")}
            </div>
        `;
    }

    return unselectedEntities.map((entityId) => `
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
                ${getEntityLabel(entityId)}
            </div>
            <div style="font-size: 12px; opacity: 0.65;">
                ${entityId}
            </div>
        </button>
    `).join("");
}

export function renderDisplayOptionsSection({
    displayOptionsOpen,
    localize
}) {
    return `
        <div class="tuev-editor-display-menu ${displayOptionsOpen ? "is-open" : ""}">
            <button
                id="toggleDisplayOptions"
                class="tuev-editor-display-badge tuev-editor-pill-button"
                type="button"
                title="${localize("editor.display_options")}"
                aria-label="${localize("editor.display_options")}"
            >${localize("editor.display_badge")}</button>
        </div>
    `;
}

export function renderGroupsSection({
    groups,
    pickerOpenKey,
    unselectedEntities,
    searchText,
    pendingGroupSort,
    openGroupColorId,
    localize,
    getEntityLabel,
    escapeHtml
}) {
    return `
        <div>
            <div style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 8px;
            ">
                <label style="font-weight: 600;">
                    ${localize("editor.groups")}
                </label>
                ${renderButton({
                    id: "addGroup",
                    disabled: false,
                    text: localize("editor.add_group")
                })}
            </div>

            <div style="
                font-size: 12px;
                opacity: 0.75;
                margin-bottom: 8px;
            ">
                ${localize("editor.groups_hint")}
            </div>

            <div class="tuev-editor-groups-list">
                ${groups.map((group, index) => renderGroupEditor({
                    group,
                    index,
                    groupCount: groups.length,
                    pickerOpenKey,
                    unselectedEntities,
                    searchText,
                    pendingGroupSort,
                    openGroupColorId,
                    localize,
                    getEntityLabel,
                    escapeHtml
                })).join("")}
            </div>
        </div>
    `;
}


function formatGroupEntityCount(count, localize) {
    if (count === 1) {
        return localize("editor.vehicle_count_one");
    }

    return `${count} ${localize("editor.vehicle_count_many")}`;
}

function renderGroupEditor({
    group,
    index,
    groupCount,
    pickerOpenKey,
    unselectedEntities,
    searchText,
    pendingGroupSort,
    openGroupColorId,
    localize,
    getEntityLabel,
    escapeHtml
}) {
    const isPickerOpen = pickerOpenKey === group.id;

    const accentColor = getGroupAccentColor(group, index);
    const entityCount = (group.entities || []).length;
    const isColorOpen = openGroupColorId === group.id;

    return `
        <div class="tuev-editor-group-card" style="--tuev-group-accent: ${accentColor};">
            <div class="tuev-editor-group-header">
                <input
                    class="tuev-editor-group-title"
                    type="text"
                    data-group-title="${group.id}"
                    value="${escapeHtml(group.title)}"
                    placeholder="${localize("editor.group_title")}"
                >

                ${renderGroupSortControls({ group, pendingGroupSort, localize })}

                <div class="tuev-editor-group-actions">
                    <button class="tuev-editor-icon-button" type="button" data-group-up="${group.id}" ${index === 0 ? "disabled" : ""} title="${localize("editor.move_group_up")}">↑</button>
                    <button class="tuev-editor-icon-button" type="button" data-group-down="${group.id}" ${index >= groupCount - 1 ? "disabled" : ""} title="${localize("editor.move_group_down")}">↓</button>
                    <button class="tuev-editor-icon-button" type="button" data-remove-group="${group.id}" title="${localize("editor.remove_group")}">×</button>
                </div>

                <div class="tuev-editor-group-meta">
                    <span class="tuev-editor-color-toggle-wrap">
                        <button
                            class="tuev-editor-color-toggle"
                            type="button"
                            data-group-color-toggle="${group.id}"
                            title="${localize("editor.group_color")}"
                            aria-label="${localize("editor.group_color")}"
                        ></button>
                    </span>
                    <span>${formatGroupEntityCount(entityCount, localize)}</span>
                </div>
            </div>
            <div class="tuev-editor-group-entities">
                ${renderGroupEntityChips({
                    group,
                    localize,
                    getEntityLabel
                })}
            </div>

            <div class="tuev-editor-group-footer">
                <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
                    <button
                        class="tuev-editor-pill-button"
                        type="button"
                        data-toggle-group-picker="${group.id}"
                        ${unselectedEntities.length === 0 ? "disabled" : ""}
                    >
                        ${isPickerOpen ? localize("editor.close_picker") : localize("editor.add_to_group")}
                    </button>
                </div>

                ${isPickerOpen ? renderGroupEntityPicker({
                    group,
                    unselectedEntities,
                    searchText,
                    pendingGroupSort,
                    localize,
                    getEntityLabel,
                    escapeHtml
                }) : ""}
            </div>
        </div>
    `;
}

function renderGroupSortControls({ group, pendingGroupSort, localize }) {
    const sort = group.sort || "manual";
    const direction = group.sort_direction || "asc";
    const pendingSort = pendingGroupSort?.groupId === group.id ? pendingGroupSort.sort : "";
    const sortOptions = [
        ["name", localize("editor.sort_name_short"), "A"],
        ["plate", localize("editor.sort_plate_short"), "▭"],
        ["due_date", localize("editor.sort_due_date_short"), "◷"],
        ["status", localize("editor.sort_status_short"), "●"],
        ["manual", localize("editor.sort_manual_short"), "↕"]
    ];

    return `
        <div class="tuev-editor-group-sort-row" aria-label="${localize("editor.group_sort")}">
            ${sortOptions.map(([value, label, icon]) => `
                <button
                    class="tuev-editor-sort-chip"
                    type="button"
                    data-group-id="${group.id}"
                    data-group-sort="${value}"
                    aria-pressed="${sort === value ? "true" : "false"}"
                    aria-label="${localize("editor.group_sort")}: ${label}"
                    title="${localize("editor.group_sort")}: ${label}"
                >${icon}</button>
            `).join("")}
            <button
                class="tuev-editor-sort-direction"
                type="button"
                data-group-sort-direction="${group.id}"
                ${sort === "manual" ? "disabled" : ""}
                title="${localize("editor.sort_direction")}"
            >${direction === "desc" ? "↓" : "↑"}</button>
        </div>
    `;
}

function renderGroupEntityChips({ group, localize, getEntityLabel }) {
    if (!group.entities.length) {
        return `<span style="font-size: 13px; opacity: 0.7;">${localize("editor.no_entity_selected")}</span>`;
    }

    const isManual = (group.sort || "manual") === "manual";

    return group.entities.map((entityId) => `
        <span
            class="tuev-editor-chip"
            data-group-entity-chip="${entityId}"
            data-group-id="${group.id}"
            data-entity-id="${entityId}"
            draggable="${isManual ? "true" : "false"}"
            title="${isManual ? localize("editor.sort_manual_short") : ""}"
        >
            <span class="tuev-editor-chip-label">
                ${getEntityLabel(entityId)}
            </span>
            <button
                class="tuev-editor-chip-remove"
                type="button"
                data-remove-group-entity="${entityId}"
                data-group-id="${group.id}"
                title="${localize("editor.remove_from_group")}"
            >×</button>
        </span>
    `).join("");
}

function renderGroupEntityPicker({ group, unselectedEntities, searchText, localize, getEntityLabel, escapeHtml }) {
    return `
        <div style="
            margin-top: 10px;
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            padding: 10px;
            background: var(--card-background-color);
        ">
            <input
                data-group-search="${group.id}"
                type="text"
                value="${escapeHtml(searchText)}"
                placeholder="${localize("editor.search")}"
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
                max-height: 220px;
                overflow-y: auto;
            ">
                ${unselectedEntities.length ? unselectedEntities.map((entityId) => `
                    <button
                        type="button"
                        data-add-group-entity="${entityId}"
                        data-group-id="${group.id}"
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
                            ${getEntityLabel(entityId)}
                        </div>
                        <div style="font-size: 12px; opacity: 0.65;">
                            ${entityId}
                        </div>
                    </button>
                `).join("") : `
                    <div style="font-size: 13px; opacity: 0.7; padding: 8px;">
                        ${localize("editor.no_more_entities")}
                    </div>
                `}
            </div>
        </div>
    `;
}
