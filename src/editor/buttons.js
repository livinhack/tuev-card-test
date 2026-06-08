export function renderButton({ id, disabled, text, active = true, extraAttributes = "" }) {
    const enabled = !disabled;
    const activeClass = active ? "" : " is-inactive";

    return `
        <button
            id="${id}"
            class="tuev-editor-pill-button${activeClass}"
            type="button"
            ${extraAttributes}
            ${enabled ? "" : "disabled"}
        >
            ${text}
        </button>
    `;
}
