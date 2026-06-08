export function renderEditorStyles() {
    return `
        <style>
            .tuev-editor-root {
                position: relative;
            }

            .tuev-editor-pill-button {
                border: 1px solid var(--divider-color);
                border-radius: 999px;
                padding: 7px 13px;
                background: var(--secondary-background-color);
                color: var(--primary-text-color);
                cursor: pointer;
                font-weight: 700;
                line-height: 1;
                opacity: 1;
                transition: border-color 120ms ease, background 120ms ease, box-shadow 120ms ease, opacity 120ms ease, transform 120ms ease;
            }

            .tuev-editor-pill-button:not(:disabled):hover,
            .tuev-editor-pill-button:not(:disabled):focus-visible {
                border-color: var(--primary-color);
                background: color-mix(in srgb, var(--primary-color) 18%, var(--secondary-background-color));
                box-shadow: 0 0 0 1px color-mix(in srgb, var(--primary-color) 16%, transparent) inset;
            }

            .tuev-editor-pill-button:not(:disabled):active {
                transform: translateY(1px);
            }

            .tuev-editor-pill-button:disabled,
            .tuev-editor-pill-button.is-inactive {
                cursor: default;
                opacity: 0.55;
                background: color-mix(in srgb, var(--disabled-color, #777) 18%, var(--secondary-background-color));
                color: var(--secondary-text-color, var(--primary-text-color));
            }

            .tuev-editor-display-menu {
                position: relative;
                display: inline-flex;
                align-items: center;
                width: max-content;
                margin: 0 0 -6px 0;
            }

            .tuev-editor-display-badge {
                border: 1px solid var(--divider-color);
                border-radius: 999px;
                padding: 7px 13px;
                background: var(--secondary-background-color);
                color: var(--primary-text-color);
                cursor: pointer;
                font-weight: 800;
                line-height: 1;
            }

            .tuev-editor-display-menu.is-open .tuev-editor-display-badge,
            .tuev-editor-display-badge:hover,
            .tuev-editor-display-badge:focus-visible {
                border-color: var(--primary-color);
                background: color-mix(in srgb, var(--primary-color) 20%, var(--secondary-background-color));
                box-shadow: 0 0 0 1px color-mix(in srgb, var(--primary-color) 18%, transparent) inset;
            }

            .tuev-editor-display-popover {
                left: 0;
                top: calc(100% + 10px);
                width: max-content;
                max-width: min(360px, calc(100vw - 48px));
                box-sizing: border-box;
                align-items: stretch;
                flex-direction: column;
                z-index: 20;
                --tuev-group-accent: var(--primary-color);
                display: none;
            }

            .tuev-editor-display-menu.is-open .tuev-editor-display-popover {
                display: flex;
            }

            .tuev-editor-display-popover-title {
                font-weight: 800;
                font-size: 13px;
                margin-bottom: 2px;
            }

            .tuev-editor-display-chip-row {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                align-items: center;
            }

            .tuev-editor-display-chip {
                border: 1px solid var(--divider-color);
                border-radius: 999px;
                min-width: 34px;
                height: 34px;
                padding: 0 12px;
                background: var(--secondary-background-color);
                color: var(--primary-text-color);
                cursor: pointer;
                font-weight: 800;
            }

            .tuev-editor-display-chip:not([aria-pressed="true"]):hover,
            .tuev-editor-display-chip:not([aria-pressed="true"]):focus-visible {
                border-color: var(--primary-color);
                background: color-mix(in srgb, var(--primary-color) 18%, var(--secondary-background-color));
                box-shadow: 0 0 0 1px color-mix(in srgb, var(--primary-color) 16%, transparent) inset;
            }

            .tuev-editor-display-chip[aria-pressed="true"] {
                border-color: var(--primary-color);
                background: color-mix(in srgb, var(--primary-color) 28%, var(--secondary-background-color));
                box-shadow: 0 0 0 1px color-mix(in srgb, var(--primary-color) 20%, transparent) inset;
            }

            .tuev-editor-display-options {
                display: flex;
                flex-direction: column;
                gap: 9px;
                padding-top: 4px;
            }

            .tuev-editor-display-options label {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                margin: 0;
                font-weight: 700;
                cursor: pointer;
            }

            .tuev-editor-display-options input {
                flex: 0 0 auto;
            }

            .tuev-editor-groups-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .tuev-editor-group-card {
                position: relative;
                border: 1px solid color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 42%, var(--divider-color));
                border-left: 6px solid var(--tuev-group-accent, var(--primary-color));
                border-radius: 14px;
                overflow: hidden;
                background: linear-gradient(
                    135deg,
                    color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 13%, var(--card-background-color)) 0%,
                    var(--card-background-color) 46%
                );
                box-shadow:
                    0 1px 0 rgba(255, 255, 255, 0.06) inset,
                    0 10px 22px rgba(0, 0, 0, 0.16);
            }

            .tuev-editor-group-header {
                position: relative;
                display: grid;
                grid-template-columns: minmax(140px, 1fr) auto;
                grid-template-rows: auto auto;
                gap: 8px 10px;
                align-items: center;
                padding: 13px 13px 11px 16px;
                background: color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 10%, rgba(0, 0, 0, 0.18));
                border-bottom: 1px solid color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 28%, var(--divider-color));
            }

            .tuev-editor-color-toggle-wrap {
                position: relative;
                display: inline-flex;
                align-items: center;
                flex: 0 0 auto;
            }

            .tuev-editor-color-toggle {
                width: 21px;
                height: 21px;
                border-radius: 999px;
                border: 2px solid color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 72%, var(--primary-text-color));
                background: var(--tuev-group-accent, var(--primary-color));
                cursor: pointer;
                padding: 0;
                box-shadow:
                    0 0 0 1px rgba(0, 0, 0, 0.32) inset,
                    0 0 12px color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 55%, transparent);
            }

            .tuev-editor-floating-panel {
                position: absolute;
                z-index: 5;
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

            .tuev-editor-display-popover {
                display: none;
            }

            .tuev-editor-display-menu.is-open .tuev-editor-display-popover {
                display: flex;
            }

            .tuev-editor-color-popover {
                left: 0;
                top: calc(100% + 10px);
                width: max-content;
                max-width: 260px;
            }

            .tuev-editor-group-title {
                grid-column: 1;
                grid-row: 1;
                width: 100%;
                box-sizing: border-box;
                padding: 9px 11px;
                border-radius: 9px;
                border: 1px solid color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 34%, var(--divider-color));
                background: color-mix(in srgb, var(--secondary-background-color) 88%, var(--tuev-group-accent, var(--primary-color)));
                color: var(--primary-text-color);
                font-weight: 700;
            }

            .tuev-editor-group-meta {
                grid-column: 1;
                grid-row: 2;
                display: inline-flex;
                align-items: center;
                gap: 7px;
                width: max-content;
                min-height: 22px;
                padding: 3px 9px 3px 5px;
                border-radius: 999px;
                border: 1px solid color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 32%, transparent);
                background: color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 14%, transparent);
                color: var(--secondary-text-color, var(--primary-text-color));
                font-size: 12px;
                opacity: 0.95;
            }

            .tuev-editor-color-button {
                width: 24px;
                height: 24px;
                border-radius: 999px;
                border: 2px solid color-mix(in srgb, var(--tuev-color-option) 65%, var(--divider-color));
                background: var(--tuev-color-option);
                cursor: pointer;
                padding: 0;
                box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.28) inset;
            }

            .tuev-editor-color-button[aria-pressed="true"] {
                border-color: var(--primary-text-color);
                box-shadow:
                    0 0 0 2px var(--tuev-color-option),
                    0 0 12px color-mix(in srgb, var(--tuev-color-option) 65%, transparent);
            }

            .tuev-editor-group-actions {
                grid-column: 2;
                grid-row: 1;
                display: flex;
                gap: 6px;
                flex-wrap: nowrap;
                justify-content: flex-end;
            }

            .tuev-editor-icon-button {
                border: 1px solid color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 24%, var(--divider-color));
                border-radius: 999px;
                min-width: 32px;
                height: 32px;
                background: color-mix(in srgb, var(--secondary-background-color) 90%, var(--tuev-group-accent, var(--primary-color)));
                color: var(--primary-text-color);
                cursor: pointer;
                font-weight: 800;
                line-height: 1;
            }

            .tuev-editor-icon-button:disabled {
                cursor: default;
                opacity: 0.45;
            }

            .tuev-editor-group-sort-row {
                position: relative;
                grid-column: 2;
                grid-row: 2;
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                justify-content: flex-end;
                gap: 6px;
                margin-top: 0;
            }


            .tuev-editor-entity-card {
                border: 1px solid var(--divider-color);
                border-radius: 14px;
                overflow: hidden;
                background: var(--card-background-color);
                box-shadow: 0 1px 0 rgba(255, 255, 255, 0.04) inset;
            }

            .tuev-editor-entity-header {
                display: grid;
                grid-template-columns: minmax(140px, 1fr) auto;
                gap: 8px 10px;
                align-items: center;
                padding: 12px 13px;
                background: rgba(0, 0, 0, 0.10);
                border-bottom: 1px solid var(--divider-color);
            }

            .tuev-editor-entity-title {
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
                font-weight: 700;
            }

            .tuev-editor-entity-count {
                display: inline-flex;
                align-items: center;
                min-height: 22px;
                padding: 3px 9px;
                border-radius: 999px;
                border: 1px solid var(--divider-color);
                background: var(--secondary-background-color);
                color: var(--secondary-text-color, var(--primary-text-color));
                font-size: 12px;
                font-weight: 600;
            }

            .tuev-editor-ungrouped-sort-row {
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                justify-content: flex-end;
                gap: 6px;
            }

            .tuev-editor-ungrouped-sort-row .tuev-editor-sort-chip,
            .tuev-editor-ungrouped-sort-row .tuev-editor-sort-direction {
                border-color: var(--divider-color);
                background: var(--secondary-background-color);
            }

            .tuev-editor-ungrouped-sort-row .tuev-editor-sort-chip[aria-pressed="true"] {
                border-color: var(--primary-color);
                background: color-mix(in srgb, var(--primary-color) 24%, var(--secondary-background-color));
            }

            .tuev-editor-sort-chip {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                border: 1px solid color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 26%, var(--divider-color));
                border-radius: 999px;
                padding: 0;
                background: color-mix(in srgb, var(--secondary-background-color) 92%, var(--tuev-group-accent, var(--primary-color)));
                color: var(--primary-text-color);
                cursor: pointer;
                font-size: 15px;
                font-weight: 800;
                line-height: 1;
                opacity: 0.82;
            }

            .tuev-editor-sort-chip[aria-pressed="true"] {
                background: color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 36%, var(--secondary-background-color));
                border-color: var(--tuev-group-accent, var(--primary-color));
                opacity: 1;
                box-shadow: 0 0 0 1px color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 24%, transparent) inset;
            }

            .tuev-editor-sort-direction {
                min-width: 32px;
                width: 32px;
                height: 32px;
                border-radius: 999px;
                border: 1px solid color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 30%, var(--divider-color));
                background: color-mix(in srgb, var(--secondary-background-color) 88%, var(--tuev-group-accent, var(--primary-color)));
                color: var(--primary-text-color);
                cursor: pointer;
                font-weight: 800;
                line-height: 1;
            }

            .tuev-editor-sort-direction:disabled {
                cursor: default;
                opacity: 0.38;
            }

            .tuev-editor-sort-confirm {
                right: 0;
                top: calc(100% + 10px);
                min-width: 250px;
                justify-content: center;
                font-size: 12px;
                font-weight: 800;
            }

            .tuev-editor-sort-confirm-message {
                flex-basis: 100%;
                text-align: center;
            }

            .tuev-editor-sort-confirm button {
                border: 1px solid color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 34%, var(--divider-color));
                border-radius: 999px;
                background: color-mix(in srgb, var(--secondary-background-color) 88%, var(--tuev-group-accent, var(--primary-color)));
                color: var(--primary-text-color);
                cursor: pointer;
                font-weight: 800;
                padding: 6px 13px;
            }

            .tuev-editor-chip[draggable="true"] {
                cursor: grab;
            }

            .tuev-editor-chip[draggable="true"]:active,
            .tuev-editor-chip.is-dragging {
                cursor: grabbing;
                opacity: 0.68;
            }

            .tuev-editor-group-entities {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                align-items: center;
                min-height: 42px;
                padding: 13px 13px 13px 16px;
            }

            .tuev-editor-group-footer {
                padding: 11px 13px 13px 16px;
                border-top: 1px solid color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 18%, var(--divider-color));
                background: rgba(0, 0, 0, 0.06);
            }

            .tuev-editor-chip {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                border-radius: 999px;
                padding: 6px 10px;
                background: color-mix(in srgb, var(--secondary-background-color) 92%, var(--tuev-group-accent, var(--primary-color)));
                border: 1px solid color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 26%, var(--divider-color));
                font-size: 13px;
                max-width: 100%;
            }

            .tuev-editor-chip-label {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 260px;
            }

            .tuev-editor-chip-actions {
                display: inline-flex;
                align-items: center;
                gap: 2px;
            }

            .tuev-editor-chip-action,
            .tuev-editor-chip-remove {
                border: none;
                background: transparent;
                color: var(--primary-text-color);
                cursor: pointer;
                font-size: 15px;
                line-height: 1;
                padding: 0 2px;
            }

            .tuev-editor-chip-action:disabled {
                cursor: default;
                opacity: 0.35;
            }

            .tuev-editor-chip-remove {
                font-size: 15px;
            }


            .tuev-editor-color-toggle,
            .tuev-editor-color-button,
            .tuev-editor-icon-button,
            .tuev-editor-sort-chip,
            .tuev-editor-sort-direction,
            .tuev-editor-sort-confirm button,
            .tuev-editor-chip-remove,
            .tuev-editor-chip-action {
                transition: border-color 120ms ease, background 120ms ease, box-shadow 120ms ease, opacity 120ms ease, transform 120ms ease;
            }

            .tuev-editor-color-toggle:hover,
            .tuev-editor-color-toggle:focus-visible {
                border-color: var(--primary-text-color);
                box-shadow:
                    0 0 0 1px rgba(0, 0, 0, 0.32) inset,
                    0 0 0 3px color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 22%, transparent),
                    0 0 14px color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 65%, transparent);
            }

            .tuev-editor-color-button:hover,
            .tuev-editor-color-button:focus-visible {
                border-color: var(--primary-text-color);
                box-shadow:
                    0 0 0 1px rgba(0, 0, 0, 0.28) inset,
                    0 0 0 3px color-mix(in srgb, var(--tuev-color-option) 22%, transparent);
            }

            .tuev-editor-color-button[aria-pressed="true"]:hover,
            .tuev-editor-color-button[aria-pressed="true"]:focus-visible {
                box-shadow:
                    0 0 0 2px var(--tuev-color-option),
                    0 0 0 4px color-mix(in srgb, var(--tuev-color-option) 18%, transparent),
                    0 0 13px color-mix(in srgb, var(--tuev-color-option) 70%, transparent);
            }

            .tuev-editor-icon-button:not(:disabled):hover,
            .tuev-editor-icon-button:not(:disabled):focus-visible,
            .tuev-editor-sort-chip:not([aria-pressed="true"]):hover,
            .tuev-editor-sort-chip:not([aria-pressed="true"]):focus-visible,
            .tuev-editor-sort-direction:not(:disabled):hover,
            .tuev-editor-sort-direction:not(:disabled):focus-visible,
            .tuev-editor-sort-confirm button:hover,
            .tuev-editor-sort-confirm button:focus-visible {
                border-color: var(--tuev-group-accent, var(--primary-color));
                background: color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 22%, var(--secondary-background-color));
                opacity: 1;
                box-shadow: 0 0 0 1px color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 18%, transparent) inset;
            }

            .tuev-editor-ungrouped-sort-row .tuev-editor-sort-chip:not([aria-pressed="true"]):hover,
            .tuev-editor-ungrouped-sort-row .tuev-editor-sort-chip:not([aria-pressed="true"]):focus-visible,
            .tuev-editor-ungrouped-sort-row .tuev-editor-sort-direction:not(:disabled):hover,
            .tuev-editor-ungrouped-sort-row .tuev-editor-sort-direction:not(:disabled):focus-visible {
                border-color: var(--primary-color);
                background: color-mix(in srgb, var(--primary-color) 18%, var(--secondary-background-color));
                box-shadow: 0 0 0 1px color-mix(in srgb, var(--primary-color) 16%, transparent) inset;
            }

            .tuev-editor-icon-button:not(:disabled):active,
            .tuev-editor-sort-chip:not(:disabled):active,
            .tuev-editor-sort-direction:not(:disabled):active,
            .tuev-editor-sort-confirm button:active {
                transform: translateY(1px);
            }

            .tuev-editor-chip-remove:hover,
            .tuev-editor-chip-remove:focus-visible,
            .tuev-editor-chip-action:not(:disabled):hover,
            .tuev-editor-chip-action:not(:disabled):focus-visible {
                border-radius: 999px;
                background: color-mix(in srgb, var(--tuev-group-accent, var(--primary-color)) 20%, transparent);
                opacity: 1;
            }


            @media (max-width: 620px) {
                .tuev-editor-group-header {
                    grid-template-columns: minmax(0, 1fr) auto;
                }

                .tuev-editor-group-sort-row {
                    grid-column: 1 / -1;
                    grid-row: 3;
                    justify-content: flex-start;
                    flex-wrap: wrap;
                }

                .tuev-editor-entity-header {
                    grid-template-columns: minmax(0, 1fr);
                }

                .tuev-editor-ungrouped-sort-row {
                    justify-content: flex-start;
                    flex-wrap: wrap;
                }

                .tuev-editor-group-actions {
                    grid-column: 2;
                    grid-row: 1;
                    justify-content: flex-end;
                }

                .tuev-editor-group-meta {
                    grid-column: 1;
                }
            }

            @media (max-width: 420px) {
                .tuev-editor-group-header {
                    grid-template-columns: minmax(0, 1fr);
                }

                .tuev-editor-group-actions {
                    grid-column: 1;
                    grid-row: 3;
                    justify-content: flex-start;
                }

                .tuev-editor-group-sort-row {
                    grid-column: 1;
                    grid-row: 4;
                }
            }
        </style>
    `;
}
