export const TUEV_CARD_TRANSLATIONS = {
    en: {
        "error.no_entities": "No TÜV entities configured.",
        "error.entity_not_found": "Entity not found",

        "overlay.updating": "Updating…",
        "overlay.updated": "Updated",
        "overlay.expired": "Inspection expired!",
        "overlay.due": "Inspection due!",
        "overlay.updating_text": "Calculating new sticker.",
        "overlay.updated_text": "New sticker applied.",
        "overlay.question": "Inspection passed?",
        "button.wait": "Please wait",
        "button.done": "Done",
        "button.confirm": "Confirm",

        "details.next_inspection": "Next inspection",
        "status.valid": "valid",
        "status.due": "due",
        "status.expired": "expired",

        "editor.entities": "TÜV entities",
        "editor.no_entity_selected": "No entity selected.",
        "editor.remove": "Remove",
        "editor.add": "Add",
        "editor.close_picker": "Close selection",
        "editor.search": "Search",
        "editor.no_more_entities": "No more matching TÜV entities found.",
        "editor.single_entity_hint": "A single entity automatically uses the single-card view.",
        "editor.layout": "Layout",
        "editor.layout_auto": "Automatic",
        "editor.layout_horizontal": "Prefer side by side",
        "editor.layout_vertical": "Stack vertically",
        "editor.sort": "Sorting",
        "editor.sort_config": "As configured",
        "editor.sort_name": "Vehicle name",
        "editor.sort_plate": "License plate",
        "editor.sort_due_date": "Inspection due date",
        "editor.sort_status": "Status",
        "editor.show_details": "Show details",
        "editor.badge_size": "Sticker size",
        "editor.badge_size_hint": "Leave empty for automatic size"
    },
    de: {
        "error.no_entities": "Keine TÜV-Entitäten konfiguriert.",
        "error.entity_not_found": "Entity nicht gefunden",

        "overlay.updating": "Aktualisiere…",
        "overlay.updated": "Aktualisiert",
        "overlay.expired": "TÜV abgelaufen!",
        "overlay.due": "TÜV fällig!",
        "overlay.updating_text": "Neue Plakette wird berechnet.",
        "overlay.updated_text": "Neue Plakette übernommen.",
        "overlay.question": "Prüfung bestanden?",
        "button.wait": "Bitte warten",
        "button.done": "Fertig",
        "button.confirm": "Bestätigen",

        "details.next_inspection": "Nächste HU",
        "status.valid": "gültig",
        "status.due": "fällig",
        "status.expired": "abgelaufen",

        "editor.entities": "TÜV-Entitäten",
        "editor.no_entity_selected": "Noch keine Entität ausgewählt.",
        "editor.remove": "Entfernen",
        "editor.add": "Hinzufügen",
        "editor.close_picker": "Auswahl schließen",
        "editor.search": "Suchen",
        "editor.no_more_entities": "Keine weiteren passenden TÜV-Entitäten gefunden.",
        "editor.single_entity_hint": "Bei einer Entität wird automatisch die Einzelansicht genutzt.",
        "editor.layout": "Layout",
        "editor.layout_auto": "Automatisch",
        "editor.layout_horizontal": "Nebeneinander bevorzugen",
        "editor.layout_vertical": "Untereinander",
        "editor.sort": "Sortierung",
        "editor.sort_config": "Wie konfiguriert",
        "editor.sort_name": "Fahrzeugname",
        "editor.sort_plate": "Kennzeichen",
        "editor.sort_due_date": "HU-Fälligkeit",
        "editor.sort_status": "Status",
        "editor.show_details": "Details anzeigen",
        "editor.badge_size": "Plakettengröße",
        "editor.badge_size_hint": "Leer lassen für automatische Größe"
    }
};

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