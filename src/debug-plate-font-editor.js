// Debug helper for TÜV Card editor.
// Remove the import line in tuev-card.js to disable this helper.

const DEBUG_CONTROL_ID = "tuev-debug-plate-font-control";

function getLanguage(editor) {
    const language =
        editor?._hass?.locale?.language ||
        editor?._hass?.language ||
        navigator.language ||
        "en";

    return String(language).toLowerCase().startsWith("de") ? "de" : "en";
}

function getLabels(editor) {
    const language = getLanguage(editor);

    if (language === "de") {
        return {
            title: "Debug: Kennzeichenschrift",
            auto: "Automatisch",
            europlate: "EuroPlate",
            fallback: "Bahnschrift / System",
            hint: "Nur Debug. Entfernen: Import-Zeile löschen."
        };
    }

    return {
        title: "Debug: license plate font",
        auto: "Automatic",
        europlate: "EuroPlate",
        fallback: "Bahnschrift / System",
        hint: "Debug only. Remove by deleting the import line."
    };
}

function injectDebugControl(editor) {
    if (!editor || editor.querySelector(`#${DEBUG_CONTROL_ID}`)) {
        return;
    }

    const root = editor.firstElementChild || editor;

    if (!root) {
        return;
    }

    const labels = getLabels(editor);
    const currentValue = editor._config?.plate_font || "auto";

    const container = document.createElement("div");
    container.id = DEBUG_CONTROL_ID;

    container.style.cssText = `
        border-top: 1px dashed var(--divider-color);
        margin-top: 14px;
        padding-top: 14px;
        display: flex;
        flex-direction: column;
        gap: 6px;
    `;

    container.innerHTML = `
        <label style="
            display: block;
            font-weight: 600;
            margin-bottom: 2px;
        ">
            ${labels.title}
        </label>

        <select
            id="tuev-debug-plate-font-select"
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
            <option value="auto" ${currentValue === "auto" || !currentValue ? "selected" : ""}>${labels.auto}</option>
            <option value="europlate" ${currentValue === "europlate" ? "selected" : ""}>${labels.europlate}</option>
            <option value="fallback" ${currentValue === "fallback" ? "selected" : ""}>${labels.fallback}</option>
        </select>

        <div style="
            font-size: 12px;
            opacity: 0.65;
        ">
            ${labels.hint}
        </div>
    `;

    const select = container.querySelector("#tuev-debug-plate-font-select");

    select.addEventListener("change", () => {
        const newConfig = {
            ...(editor._config || {}),
            plate_font: select.value
        };

        editor._config = newConfig;

        editor.dispatchEvent(new CustomEvent("config-changed", {
            detail: {
                config: newConfig
            },
            bubbles: true,
            composed: true
        }));

        if (typeof editor.render === "function") {
            editor.render();
        }
    });

    root.appendChild(container);
}

customElements.whenDefined("tuev-card-editor").then(() => {
    const EditorClass = customElements.get("tuev-card-editor");

    if (!EditorClass || EditorClass.prototype.__tuevDebugPlateFontPatched) {
        return;
    }

    EditorClass.prototype.__tuevDebugPlateFontPatched = true;

    const originalRender = EditorClass.prototype.render;

    EditorClass.prototype.render = function patchedRender(...args) {
        const result = originalRender.apply(this, args);

        window.setTimeout(() => {
            injectDebugControl(this);
        }, 0);

        return result;
    };

    document.querySelectorAll("tuev-card-editor").forEach((editor) => {
        injectDebugControl(editor);
    });
});