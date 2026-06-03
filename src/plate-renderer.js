import { renderEuroPlateLicensePlate } from "./plate-renderer-europlate.js?v=15";
import { renderSystemLicensePlate } from "./plate-renderer-system.js?v=15";

let plateFontInjected = false;
let plateFontLoaded = false;
let plateFontLoading = false;

export function ensurePlateFont(onLoaded) {
    injectPlateFont();

    if (plateFontLoaded || plateFontLoading || !document.fonts?.load) {
        return plateFontLoaded;
    }

    plateFontLoading = true;

    document.fonts
        .load('28px "EuroPlate"')
        .then(() => {
            plateFontLoaded = document.fonts.check('28px "EuroPlate"');
        })
        .catch(() => {
            plateFontLoaded = false;
        })
        .finally(() => {
            plateFontLoading = false;

            if (plateFontLoaded && typeof onLoaded === "function") {
                onLoaded();
            }
        });

    return plateFontLoaded;
}

export function isPlateFontLoaded() {
    if (document.fonts?.check) {
        plateFontLoaded = document.fonts.check('28px "EuroPlate"');
    }

    return plateFontLoaded;
}

function injectPlateFont() {
    if (plateFontInjected) {
        return;
    }

    plateFontInjected = true;

    const style = document.createElement("style");

    style.textContent = `
        @font-face {
            font-family: "EuroPlate";
            src: url("/local/EuroPlate.ttf") format("truetype");
            font-display: swap;
        }
    `;

    document.head.appendChild(style);
}

export function renderLicensePlate(plate, options = {}) {
    injectPlateFont();

    if (options.fontProfile === "europlate") {
        return renderEuroPlateLicensePlate(plate, options);
    }

    return renderSystemLicensePlate(plate, options);
}