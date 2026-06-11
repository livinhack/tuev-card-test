const PLATE_FONT_URL = "/local/EuroPlate.ttf";

let plateFontInjected = false;
let plateFontLoadPromise = null;

function hasValidFontSignature(buffer) {
    if (!buffer || buffer.byteLength < 4) {
        return false;
    }

    const bytes = new Uint8Array(buffer.slice(0, 4));
    const signature = String.fromCharCode(...bytes);

    return (
        signature === "ttcf" ||
        signature === "OTTO" ||
        signature === "true" ||
        (bytes[0] === 0x00 && bytes[1] === 0x01 && bytes[2] === 0x00 && bytes[3] === 0x00)
    );
}

export async function checkPlateFontAvailable() {
    const cacheBuster = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    try {
        const response = await fetch(`${PLATE_FONT_URL}?v=${cacheBuster}`, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
                Range: "bytes=0-15"
            }
        });

        if (!response.ok) {
            return false;
        }

        const buffer = await response.arrayBuffer();
        return hasValidFontSignature(buffer);
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
