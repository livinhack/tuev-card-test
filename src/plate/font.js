const PLATE_FONT_URL = "/local/EuroPlate.ttf";

let plateFontInjected = false;
let plateFontLoadPromise = null;

export async function checkPlateFontAvailable() {
    const cacheBuster = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    try {
        const headResponse = await fetch(`${PLATE_FONT_URL}?v=${cacheBuster}`, {
            method: "HEAD",
            cache: "no-store",
            headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache"
            }
        });

        if (headResponse.ok) {
            return true;
        }

        if (headResponse.status && headResponse.status !== 405) {
            return false;
        }
    } catch (error) {
        // Some Home Assistant/static-file setups do not support HEAD reliably.
        // Fall through to a small GET check with its own cache buster.
    }

    try {
        const getResponse = await fetch(`${PLATE_FONT_URL}?v=${cacheBuster}-get`, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache"
            }
        });

        return getResponse.ok;
    } catch (error) {
        return false;
    }
}

export function isPlateFontLoaded() {
    if (!document.fonts || typeof document.fonts.check !== "function") {
        return false;
    }

    return document.fonts.check("16px EuroPlate");
}

export function ensurePlateFont(onReady) {
    injectPlateFont();

    if (!document.fonts || typeof document.fonts.load !== "function") {
        if (typeof onReady === "function") {
            window.setTimeout(onReady, 0);
        }

        return;
    }

    if (!plateFontLoadPromise) {
        plateFontLoadPromise = document.fonts.load("16px EuroPlate");
    }

    plateFontLoadPromise.then(() => {
        if (typeof onReady === "function") {
            onReady();
        }
    }).catch(() => {
        plateFontLoadPromise = null;

        if (typeof onReady === "function") {
            onReady();
        }
    });
}

export function injectPlateFont() {
    if (plateFontInjected) {
        return;
    }

    plateFontInjected = true;

    const style = document.createElement("style");
    style.textContent = `
        @font-face {
            font-family: "EuroPlate";
            src: url("${PLATE_FONT_URL}") format("truetype");
            font-display: swap;
        }
    `;

    document.head.appendChild(style);
}
