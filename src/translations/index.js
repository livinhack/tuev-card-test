import { en } from "./en.js?v=b48";
import { de } from "./de.js?v=b48";

export const TUEV_CARD_TRANSLATIONS = { en, de };

export function getTuevCardLanguage(hass) {
    const language = hass?.locale?.language || hass?.language || "en";
    return String(language).toLowerCase().startsWith("de") ? "de" : "en";
}

export function localize(hass, key) {
    const language = getTuevCardLanguage(hass);

    return (
        TUEV_CARD_TRANSLATIONS[language]?.[key] ||
        TUEV_CARD_TRANSLATIONS.en[key] ||
        key
    );
}
