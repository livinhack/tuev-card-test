import { GROUP_ACCENT_COLORS, getGroupAccentColor } from "../card/groups.js?v=b45";

function clampPanelPosition(anchor = {}, width = 360) {
    const margin = 8;
    const containerWidth = Math.max(0, Number(anchor.containerWidth || 0));
    const maxLeft = containerWidth > 0
        ? Math.max(margin, containerWidth - width - margin)
        : Number(anchor.left ?? margin);

    return {
        left: Math.max(margin, Math.min(Number(anchor.left ?? margin), maxLeft)),
        top: Math.max(margin, Number(anchor.top ?? margin))
    };
}

function resolveVerticalPanelPosition(anchor = {}, estimatedHeight = 140) {
    const margin = 8;
    const availableBelow = Number(anchor.availableBelow || 0);
    const availableAbove = Number(anchor.availableAbove || 0);
    const shouldOpenAbove = availableBelow < estimatedHeight && availableAbove > availableBelow;

    if (!shouldOpenAbove) {
        return {
            top: Math.max(margin, Number(anchor.top ?? margin)),
            placement: "below"
        };
    }

    return {
        top: Math.max(margin, Number(anchor.aboveTop ?? margin) - estimatedHeight),
        placement: "above"
    };
}

function clampPanelRightPosition(anchor = {}) {
    const margin = 8;
    const containerWidth = Math.max(0, Number(anchor.containerWidth || 0));
    const right = Math.max(margin, Number(anchor.right ?? margin));

    if (!containerWidth) {
        return { right, top: Math.max(margin, Number(anchor.top ?? margin)) };
    }

    return {
        right: Math.min(right, Math.max(margin, containerWidth - margin)),
        top: Math.max(margin, Number(anchor.top ?? margin))
    };
}

export function renderFloatingPanelStyles() {
    return `
        <style>
            .tuev-editor-floating-layer {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 0;
                overflow: visible;
                pointer-events: none;
                z-index: 1000;
            }

            .tuev-editor-floating-layer .tuev-editor-floating-panel {
                pointer-events: auto;
                position: absolute;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 9px;
                padding: 11px 12px;
                border-radius: 15px;
                border: 1px solid color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 42%, var(--divider-color));
                background:
                    radial-gradient(circle at 28% 25%, color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 22%, transparent), transparent 54%),
                    color-mix(in srgb, var(--card-background-color) 84%, rgba(0, 0, 0, 0.78));
                box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45), 0 0 18px color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 16%, transparent);
                backdrop-filter: blur(10px);
            }

            .tuev-editor-floating-layer .tuev-editor-display-popover {
                width: max-content;
                max-width: min(360px, calc(100vw - 48px));
                box-sizing: border-box;
                align-items: stretch;
                flex-direction: column;
                --tuev-group-accent: var(--primary-color);
            }

            .tuev-editor-floating-layer .tuev-editor-color-popover {
                width: max-content;
                max-width: 260px;
            }

            .tuev-editor-floating-layer .tuev-editor-sort-confirm {
                width: max-content;
                max-width: min(320px, calc(100vw - 48px));
            }
        </style>
    `;
}

export function renderEditorFloatingPanels({
    displayOptionsOpen,
    displayAnchor,
    showColumnSetting,
    columns,
    config,
    canRenderPlate,
    openGroupColorId,
    colorAnchor,
    groups,
    pendingGroupSort,
    sortConfirmAnchor,
    localize
}) {
    const panels = [];

    if (displayOptionsOpen) {
        panels.push(renderDisplayOptionsPopover({
            anchor: displayAnchor,
            showColumnSetting,
            columns,
            config,
            canRenderPlate,
            localize
        }));
    }

    if (openGroupColorId) {
        const group = (groups || []).find((candidate) => candidate.id === openGroupColorId);
        if (group) {
            panels.push(renderColorPopover({
                group,
                groups,
                anchor: colorAnchor,
                localize
            }));
        }
    }

    if (pendingGroupSort?.groupId) {
        const group = (groups || []).find((candidate) => candidate.id === pendingGroupSort.groupId);
        if (group) {
            panels.push(renderSortConfirmPopover({
                group,
                anchor: sortConfirmAnchor,
                localize
            }));
        }
    }

    if (!panels.length) {
        return "";
    }

    return `
        ${renderFloatingPanelStyles()}
        <div class="tuev-editor-floating-layer">
            ${panels.join("")}
        </div>
    `;
}

function renderDisplayOptionsPopover({ anchor, showColumnSetting, columns, config, canRenderPlate, localize }) {
    const currentColumns = String(columns || "auto");
    const width = 360;
    const horizontalPosition = clampPanelPosition(anchor, width);
    const estimatedHeight = showColumnSetting
        ? (canRenderPlate ? 186 : 154)
        : (canRenderPlate ? 132 : 98);
    const verticalPosition = resolveVerticalPanelPosition(anchor, estimatedHeight);

    return `
        <div
            class="tuev-editor-floating-panel tuev-editor-display-popover"
            data-placement="${verticalPosition.placement}"
            style="left: ${horizontalPosition.left}px; top: ${verticalPosition.top}px;"
        >
            ${showColumnSetting ? `
                <div class="tuev-editor-display-popover-title">${localize("editor.columns")}</div>
                <div class="tuev-editor-display-chip-row">
                    ${renderDisplayColumnChip("1", currentColumns, localize("editor.columns_1_short"), localize)}
                    ${renderDisplayColumnChip("2", currentColumns, localize("editor.columns_2_short"), localize)}
                    ${renderDisplayColumnChip("3", currentColumns, localize("editor.columns_3_short"), localize)}
                    ${renderDisplayColumnChip("4", currentColumns, localize("editor.columns_4_short"), localize)}
                    ${renderDisplayColumnChip("auto", currentColumns, localize("editor.columns_fill"), localize)}
                </div>
            ` : ""}

            <div class="tuev-editor-display-options">
                <label>
                    <input
                        id="showBadge"
                        type="checkbox"
                        ${config.show_badge !== false ? "checked" : ""}
                    >
                    ${localize("editor.show_badge")}
                </label>

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
        </div>
    `;
}

function renderDisplayColumnChip(value, currentColumns, label, localize) {
    return `
        <button
            class="tuev-editor-display-chip"
            type="button"
            data-display-columns="${value}"
            aria-pressed="${currentColumns === value ? "true" : "false"}"
            title="${localize("editor.columns")}: ${label}"
        >${label}</button>
    `;
}

function renderColorPopover({ group, groups, anchor, localize }) {
    const groupIndex = groups.findIndex((candidate) => candidate.id === group.id);
    const accentColor = getGroupAccentColor(group, groupIndex);
    const width = 260;
    const position = clampPanelPosition(anchor, width);

    return `
        <div
            class="tuev-editor-floating-panel tuev-editor-color-popover"
            style="left: ${position.left}px; top: ${position.top}px; --tuev-group-accent: ${accentColor};"
            aria-label="${localize("editor.group_color")}"
        >
            ${GROUP_ACCENT_COLORS.map((color) => `
                <button
                    class="tuev-editor-color-button"
                    type="button"
                    data-group-color="${group.id}"
                    data-color="${color}"
                    style="--tuev-color-option: ${color};"
                    aria-pressed="${color === accentColor ? "true" : "false"}"
                    title="${localize("editor.group_color")}"
                ></button>
            `).join("")}
        </div>
    `;
}

function renderSortConfirmPopover({ group, anchor, localize }) {
    const position = anchor?.right != null
        ? clampPanelRightPosition(anchor)
        : clampPanelPosition(anchor, 320);
    const accentColor = getGroupAccentColor(group, 0);
    const horizontalStyle = anchor?.right != null
        ? `right: ${position.right}px;`
        : `left: ${position.left}px;`;

    return `
        <div
            class="tuev-editor-floating-panel tuev-editor-sort-confirm"
            style="${horizontalStyle} top: ${position.top}px; --tuev-group-accent: ${accentColor};"
        >
            <span class="tuev-editor-sort-confirm-message">${localize("editor.discard_manual_sort")}</span>
            <button type="button" data-cancel-group-sort="${group.id}">${localize("editor.cancel")}</button>
            <button type="button" data-confirm-group-sort="${group.id}">${localize("editor.yes")}</button>
        </div>
    `;
}
