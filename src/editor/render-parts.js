function renderButton({ id, disabled, text, active = true }) {
    const enabled = !disabled;

    return `
        <button
            id="${id}"
            type="button"
            ${enabled ? "" : "disabled"}
            style="
                border: 1px solid var(--divider-color);
                border-radius: 999px;
                padding: 7px 13px;
                background: ${enabled && active ? "var(--secondary-background-color)" : "var(--disabled-color, #777)"};
                color: ${enabled && active ? "var(--primary-text-color)" : "var(--text-primary-color)"};
                cursor: ${enabled && active ? "pointer" : "default"};
                font-weight: 600;
                opacity: ${enabled && active ? "1" : "0.6"};
            "
        >
            ${text}
        </button>
    `;
}

export function renderEditorStyles() {
    return `
        <style>
            .tuev-editor-checkbox-row {
                display: flex;
                flex-wrap: wrap;
                gap: 12px 24px;
                align-items: center;
            }

            .tuev-editor-checkbox-row label {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                min-width: 190px;
                margin: 0;
                font-weight: 600;
                cursor: pointer;
                white-space: nowrap;
            }

            .tuev-editor-checkbox-row input {
                flex: 0 0 auto;
            }
        </style>
    `;
}

export function renderEntitySection({
    selectedEntityIds,
    unselectedEntities,
    hasAvailableToAdd,
    newEntityCount,
    entityHint,
    pickerOpen,
    searchText,
    localize,
    getEntityLabel,
    escapeHtml
}) {
    return `
        <div>
            <label style="
                display: block;
                font-weight: 600;
                margin-bottom: 8px;
            ">
                ${localize("editor.entities")}
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
                type="button"
                data-remove-entity="${entityId}"
                title="${localize("editor.remove")}"
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

export function renderColumnsSection({ showColumnSetting, columnSliderValue, columnLabel, localize }) {
    if (!showColumnSetting) {
        return "";
    }

    return `
        <div>
            <label style="
                display: block;
                font-weight: 600;
                margin-bottom: 6px;
            ">
                ${localize("editor.columns")}
            </label>

            <input
                id="columns"
                type="range"
                min="1"
                max="5"
                step="1"
                value="${columnSliderValue}"
                style="
                    width: 100%;
                    box-sizing: border-box;
                "
            >

            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
                margin-top: 6px;
                font-size: 12px;
                opacity: 0.75;
            ">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>${localize("editor.columns_fill")}</span>
            </div>

            <div
                id="columnsLabel"
                style="
                    font-size: 12px;
                    opacity: 0.75;
                    margin-top: 6px;
                "
            >
                ${localize("editor.columns_current")}: ${columnLabel}
            </div>
        </div>
    `;
}

export function renderSortSection({ sort, localize }) {
    return `
        <div>
            <label style="
                display: block;
                font-weight: 600;
                margin-bottom: 6px;
            ">
                ${localize("editor.sort")}
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
                <option value="name" ${sort === "name" || sort === "config" || !sort ? "selected" : ""}>${localize("editor.sort_name")}</option>
                <option value="plate" ${sort === "plate" ? "selected" : ""}>${localize("editor.sort_plate")}</option>
                <option value="due_date" ${sort === "due_date" ? "selected" : ""}>${localize("editor.sort_due_date")}</option>
                <option value="status" ${sort === "status" ? "selected" : ""}>${localize("editor.sort_status")}</option>
            </select>
        </div>
    `;
}

export function renderOptionsSection({ config, canRenderPlate, localize }) {
    return `
        <div class="tuev-editor-checkbox-row">
            <label>
                <input
                    id="showDetails"
                    type="checkbox"
                    ${config.show_details !== false ? "checked" : ""}
                >
                ${localize("editor.show_details")}
            </label>

            ${canRenderPlate ? `
                <label>
                    <input
                        id="renderPlate"
                        type="checkbox"
                        ${config.plate_style === "plate" ? "checked" : ""}
                    >
                    ${localize("editor.render_plate")}
                </label>
            ` : ""}
        </div>
    `;
}
