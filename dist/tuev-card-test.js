// TÜV Card bundled v0.1.0-a94
// This file is generated from the modular source files. Do not edit manually.

// ---- src/translations/en.js ----
const __m_src_translations_en_js = (() => {
const en = {
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
        "editor.all_entities_added": "All available TÜV entities have already been added.",
        "editor.add_all_new_entities": "Add all",
        "editor.no_new_entities": "No new vehicles found.",

        "editor.automatic": "Automatic",
        "editor.sort_name": "Vehicle name",
        "editor.sort_plate": "License plate",
        "editor.sort_due_date": "Inspection due date",
        "editor.sort_status": "Status",
        "editor.show_details": "Show details",
        "editor.render_plate": "Render license plate graphically",
        "editor.columns": "Maximum columns",
        "editor.columns_current": "Current",
        "editor.columns_fill": "Fill",
        "editor.columns_1": "1 column",
        "editor.columns_2": "2 columns",
        "editor.columns_3": "3 columns",
        "editor.columns_4": "4 columns",
        "editor.columns_1_short": "1",
        "editor.columns_2_short": "2",
        "editor.columns_3_short": "3",
        "editor.columns_4_short": "4",
        "editor.sort": "Sorting"
};

return { en: en };

})();

// ---- src/translations/de.js ----
const __m_src_translations_de_js = (() => {
const de = {
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
        "editor.all_entities_added": "Alle verfügbaren TÜV-Entitäten sind bereits hinzugefügt.",
        "editor.add_all_new_entities": "Alle hinzufügen",
        "editor.no_new_entities": "Keine neuen Fahrzeuge gefunden.",

        "editor.automatic": "Automatisch",
        "editor.sort_name": "Fahrzeugname",
        "editor.sort_plate": "Kennzeichen",
        "editor.sort_due_date": "HU-Fälligkeit",
        "editor.sort_status": "Status",
        "editor.show_details": "Details anzeigen",
        "editor.render_plate": "Kennzeichen grafisch darstellen",
        "editor.columns": "Maximale Spalten",
        "editor.columns_current": "Aktuell",
        "editor.columns_fill": "Ausfüllen",
        "editor.columns_1": "1 Spalte",
        "editor.columns_2": "2 Spalten",
        "editor.columns_3": "3 Spalten",
        "editor.columns_4": "4 Spalten",
        "editor.columns_1_short": "1",
        "editor.columns_2_short": "2",
        "editor.columns_3_short": "3",
        "editor.columns_4_short": "4",
        "editor.sort": "Sortierung"
};

return { de: de };

})();

// ---- src/translations/index.js ----
const __m_src_translations_index_js = (() => {
const { en } = __m_src_translations_en_js;
const { de } = __m_src_translations_de_js;

const TUEV_CARD_TRANSLATIONS = { en, de };

function getTuevCardLanguage(hass) {
    const language = hass?.locale?.language || hass?.language || "en";
    return String(language).toLowerCase().startsWith("de") ? "de" : "en";
}

function localize(hass, key) {
    const language = getTuevCardLanguage(hass);

    return (
        TUEV_CARD_TRANSLATIONS[language]?.[key] ||
        TUEV_CARD_TRANSLATIONS.en[key] ||
        key
    );
}

return { TUEV_CARD_TRANSLATIONS: TUEV_CARD_TRANSLATIONS, getTuevCardLanguage: getTuevCardLanguage, localize: localize };

})();

// ---- src/card/config.js ----
const __m_src_card_config_js = (() => {
const ALLOWED_SORTS = ["name", "plate", "due_date", "status"];
const ALLOWED_COLUMNS = ["auto", "1", "2", "3", "4"];
const ALLOWED_PLATE_STYLES = ["text", "plate"];

const DEFAULT_CARD_CONFIG = {
    columns: "auto",
    sort: "name",
    show_details: true,
    plate_style: "text"
};

function normalizeCardConfig(config = {}, options = {}) {
    const { requireEntity = true } = options;

    if (requireEntity && !config.entity && !config.entities) {
        throw new Error("Please provide entity or entities.");
    }

    const rawColumns = config.columns === undefined || config.columns === null
        ? DEFAULT_CARD_CONFIG.columns
        : String(config.columns);

    const columns = ALLOWED_COLUMNS.includes(rawColumns)
        ? rawColumns
        : DEFAULT_CARD_CONFIG.columns;

    const sort = ALLOWED_SORTS.includes(config.sort)
        ? config.sort
        : DEFAULT_CARD_CONFIG.sort;

    const plateStyle = ALLOWED_PLATE_STYLES.includes(config.plate_style)
        ? config.plate_style
        : DEFAULT_CARD_CONFIG.plate_style;

    const normalizedConfig = {
        ...DEFAULT_CARD_CONFIG,
        ...config,
        columns,
        sort,
        plate_style: plateStyle
    };

    removeLegacyCardConfigOptions(normalizedConfig);

    return normalizedConfig;
}

function removeLegacyCardConfigOptions(config) {
    delete config.layout;
    delete config.auto_add_entities;
    delete config.plate_font;
    delete config.badge_size;
    delete config.compact_badge_size;

    return config;
}

return { ALLOWED_SORTS: ALLOWED_SORTS, ALLOWED_COLUMNS: ALLOWED_COLUMNS, ALLOWED_PLATE_STYLES: ALLOWED_PLATE_STYLES, DEFAULT_CARD_CONFIG: DEFAULT_CARD_CONFIG, normalizeCardConfig: normalizeCardConfig, removeLegacyCardConfigOptions: removeLegacyCardConfigOptions };

})();

// ---- src/card/entities.js ----
const __m_src_card_entities_js = (() => {
function compareText(a, b) {
    return String(a).localeCompare(String(b), undefined, {
        numeric: true,
        sensitivity: "base"
    });
}

function getEntityIdsFromConfig(config = {}) {
    const rawEntityIds = [];

    if (config.entity) {
        rawEntityIds.push(config.entity);
    }

    if (Array.isArray(config.entities)) {
        config.entities.forEach((entry) => {
            if (typeof entry === "string") {
                rawEntityIds.push(entry);
                return;
            }

            if (entry && entry.entity) {
                rawEntityIds.push(entry.entity);
            }
        });
    }

    return [...new Set(rawEntityIds.filter(Boolean))];
}

function isTuevSensorEntity(entityId, entity) {
    return (
        entityId.startsWith("sensor.") &&
        entity?.attributes?.month !== undefined &&
        entity?.attributes?.year !== undefined &&
        entity?.attributes?.plate !== undefined
    );
}

function findFirstTuevEntity(hass) {
    return Object.keys(hass?.states || {}).find((entityId) => (
        isTuevSensorEntity(entityId, hass.states[entityId])
    ));
}

function getAvailableTuevEntities(hass) {
    if (!hass) {
        return [];
    }

    return Object.keys(hass.states)
        .filter((entityId) => isTuevSensorEntity(entityId, hass.states[entityId]))
        .sort((a, b) => compareText(
            getVehicleName(hass.states[a], a),
            getVehicleName(hass.states[b], b)
        ));
}

function getEntityLabel(hass, entityId) {
    const entity = hass?.states?.[entityId];

    if (!entity) {
        return entityId;
    }

    const name = getVehicleName(entity, entityId);
    const plate = entity.attributes?.plate || "";

    return plate
        ? `${name} (${plate})`
        : name;
}

function getVehicleName(entity, fallback = "Vehicle") {
    return entity?.attributes?.vehicle_name || entity?.attributes?.friendly_name || fallback;
}

function getSortedEntityIds(config, hass) {
    const entityIds = getEntityIdsFromConfig(config);
    const sort = config?.sort || "name";

    const statusRank = {
        expired: 0,
        due: 1,
        valid: 2
    };

    return [...entityIds].sort((a, b) => {
        const entityA = hass.states[a];
        const entityB = hass.states[b];

        if (!entityA && !entityB) {
            return 0;
        }

        if (!entityA) {
            return 1;
        }

        if (!entityB) {
            return -1;
        }

        const attrA = entityA.attributes;
        const attrB = entityB.attributes;

        if (sort === "name") {
            return compareText(
                getVehicleName(entityA, a),
                getVehicleName(entityB, b)
            );
        }

        if (sort === "plate") {
            return compareText(attrA.plate || "", attrB.plate || "");
        }

        if (sort === "due_date") {
            return compareText(attrA.due_date || "", attrB.due_date || "");
        }

        if (sort === "status") {
            const rankA = statusRank[entityA.state] ?? statusRank[attrA.status] ?? 99;
            const rankB = statusRank[entityB.state] ?? statusRank[attrB.status] ?? 99;

            if (rankA !== rankB) {
                return rankA - rankB;
            }

            return compareText(attrA.due_date || "", attrB.due_date || "");
        }

        return 0;
    });
}

return { compareText: compareText, getEntityIdsFromConfig: getEntityIdsFromConfig, isTuevSensorEntity: isTuevSensorEntity, findFirstTuevEntity: findFirstTuevEntity, getAvailableTuevEntities: getAvailableTuevEntities, getEntityLabel: getEntityLabel, getVehicleName: getVehicleName, getSortedEntityIds: getSortedEntityIds };

})();

// ---- src/card/layout.js ----
const __m_src_card_layout_js = (() => {
const HORIZONTAL_PADDING = 32;
const MULTI_GAP = 18;
const SINGLE_GAP = 12;

const MIN_TILE_WIDTH = 100;
const MAX_MANUAL_COLUMNS = 4;
const MAX_AUTO_COLUMNS = 16;

function getTileWidth(innerWidth, columns, gap) {
    if (columns <= 1) {
        return innerWidth;
    }

    return Math.max(0, (innerWidth - gap * (columns - 1)) / columns);
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function calculateBestColumns(innerWidth, gap, maxColumns, minTileWidth) {
    const safeMaxColumns = Math.max(1, Math.floor(Number(maxColumns) || 1));

    if (!innerWidth) {
        return 1;
    }

    let columns = Math.max(
        1,
        Math.min(
            safeMaxColumns,
            Math.floor((innerWidth + gap) / (minTileWidth + gap))
        )
    );

    while (columns > 1 && getTileWidth(innerWidth, columns, gap) < minTileWidth) {
        columns -= 1;
    }

    return columns;
}

function calculateLayoutInfo({ cardWidth, isMulti, requestedColumns }) {
    const gap = isMulti ? MULTI_GAP : SINGLE_GAP;
    const innerWidth = Math.max(0, cardWidth - HORIZONTAL_PADDING);

    if (!isMulti) {
        return {
            cardWidth,
            innerWidth,
            gap,
            effectiveColumns: 1,
            tileWidth: innerWidth,
            gridTemplateColumns: "1fr"
        };
    }

    const requested = String(requestedColumns || "auto");
    const maxColumns = requested === "auto"
        ? MAX_AUTO_COLUMNS
        : Math.min(MAX_MANUAL_COLUMNS, Math.max(1, Number(requested) || 1));

    const effectiveColumns = calculateBestColumns(
        innerWidth,
        gap,
        maxColumns,
        MIN_TILE_WIDTH
    );
    const tileWidth = getTileWidth(innerWidth, effectiveColumns, gap);

    return {
        cardWidth,
        innerWidth,
        gap,
        effectiveColumns,
        tileWidth,
        gridTemplateColumns: `repeat(${effectiveColumns}, minmax(0, 1fr))`
    };
}

function calculateAutomaticBadgeSize({ isMulti, effectiveColumns, tileWidth }) {
    if (!isMulti) {
        return 250;
    }

    const safety = effectiveColumns <= 2 ? 18 : 14;
    const dynamicSize = Math.floor(tileWidth - safety);

    if (effectiveColumns <= 1) {
        return clamp(dynamicSize, 170, 220);
    }

    if (effectiveColumns === 2) {
        return clamp(dynamicSize, 140, 175);
    }

    if (effectiveColumns === 3) {
        return clamp(dynamicSize, 105, 145);
    }

    return clamp(dynamicSize, 80, 105);
}

return { getTileWidth: getTileWidth, calculateLayoutInfo: calculateLayoutInfo, calculateAutomaticBadgeSize: calculateAutomaticBadgeSize };

})();

// ---- src/card/plate-layout.js ----
const __m_src_card_plate_layout_js = (() => {
function normalizePlate(plate) {
    return String(plate || "")
        .trim()
        .replace(/[-–—]+/g, " ")
        .replace(/\s+/g, " ")
        .toUpperCase();
}

function getPlateCharacterCount(plate) {
    return normalizePlate(plate)
        .replace(/\s/g, "")
        .length;
}

function getPlateMaxWidth(tileWidth) {
    return Math.max(84, Math.floor(tileWidth - 2));
}

function getSharedPlateScale(entityIds, hass, maxWidth, getLicensePlateMetrics) {
    const widestPlateWidth = entityIds.reduce((widestWidth, entityId) => {
        const plate = hass.states[entityId]?.attributes?.plate || "";
        const metrics = getLicensePlateMetrics(plate);

        return Math.max(widestWidth, metrics.width || 0);
    }, 0);

    if (!widestPlateWidth || !maxWidth) {
        return 1;
    }

    const rawScale = Math.min(1, maxWidth / widestPlateWidth);
    const baseHeight = getLicensePlateMetrics(entityIds
        .map((entityId) => hass.states[entityId]?.attributes?.plate || "")
        .find(Boolean) || "0").height || 38;

    // Snap the shared visible plate height to even pixels. That avoids
    // uneven 1px differences above/below the text in tight tile layouts.
    const snappedHeight = Math.max(18, Math.floor((baseHeight * rawScale) / 2) * 2);

    return Math.min(1, snappedHeight / baseHeight);
}

function getSharedPlateLayout({
    entityIds,
    hass,
    tileWidth,
    isGraphicalPlateAvailable,
    getLicensePlateMetrics
}) {
    if (!isGraphicalPlateAvailable) {
        return null;
    }

    const maxWidth = getPlateMaxWidth(tileWidth);
    const scale = getSharedPlateScale(entityIds, hass, maxWidth, getLicensePlateMetrics);

    return {
        maxWidth,
        scale
    };
}

return { normalizePlate: normalizePlate, getPlateCharacterCount: getPlateCharacterCount, getPlateMaxWidth: getPlateMaxWidth, getSharedPlateScale: getSharedPlateScale, getSharedPlateLayout: getSharedPlateLayout };

})();

// ---- src/card/ui-state.js ----
const __m_src_card_ui_state_js = (() => {
const CONFIRM_TIMING = {
    minConfirmMs: 700,
    successMs: 800,
    crossfadeMs: 800
};

function getEntityUiState(uiStateByEntity, entityId) {
    if (!uiStateByEntity[entityId]) {
        uiStateByEntity[entityId] = {
            confirming: false,
            confirmStartedAt: 0,
            confirmFinishScheduled: false,
            frozenBadge: null,
            crossfadeBadge: null,
            showSuccessUntil: 0
        };
    }

    return uiStateByEntity[entityId];
}

function resetEntityUiStateAfterError(ui) {
    ui.confirming = false;
    ui.confirmFinishScheduled = false;
    ui.frozenBadge = null;
    ui.crossfadeBadge = null;
}

function startEntityConfirmation(ui, badge) {
    ui.confirming = true;
    ui.confirmFinishScheduled = false;
    ui.confirmStartedAt = Date.now();
    ui.crossfadeBadge = null;
    ui.frozenBadge = {
        ...badge,
        blurred: true
    };
}

return { CONFIRM_TIMING: CONFIRM_TIMING, getEntityUiState: getEntityUiState, resetEntityUiStateAfterError: resetEntityUiStateAfterError, startEntityConfirmation: startEntityConfirmation };

})();

// ---- src/badge/digits.js ----
const __m_src_badge_digits_js = (() => {
// Badge digit SVG path data.
// These paths are used for the badge year number and month ring numbers in the TÜV badge renderer.
// They are filled glyph outlines, not stroke digits. Use fill-rule="evenodd" for counters/holes.
//
// Licensing/attribution note:
// This digit artwork/data may be derived from Wikimedia Commons file "Bahnschrift.svg".
// See NOTICE.md and LICENSES/CC-BY-SA-4.0.txt for attribution and license details.

const BADGE_DIGIT_PATHS = {
    "0": {
        d: `m 91.623729,139.15571
q -3.82779,0 -5.81673,-2.04525 -1.97019,-2.04523 -1.97019,-5.70414
v -12.40276
q 0,-3.67769 1.98895,-5.70416 1.98895,-2.04523 5.79797,-2.04523 3.82778,0 5.79796,2.02648 1.98895,2.02647 1.98895,5.72291
v 12.40276
q 0,3.67766 -1.98895,5.72291 -1.98894,2.02648 -5.79796,2.02648
z

m 0,-3.64015
q 2.02647,0 2.98342,-1.05076 0.97571,-1.06953 0.97571,-3.05848
v -12.40276
q 0,-1.98896 -0.95695,-3.03971 -0.95694,-1.06953 -3.00218,-1.06953 -2.04524,0 -3.00219,1.06953 -0.95694,1.05075 -0.95694,3.03971
v 12.40276
q 0,1.98895 0.95694,3.05848 0.97572,1.05076 3.00219,1.05076
z`,
        box: { minX: 83.836809, minY: 111.254170, width: 15.573830, height: 27.901540 }
    },
    "1": {
        d: `m 99.061842,235.22571
h -2.124996
v -12.83332
l -2.156247,1.32292
v -2.19791
l 2.156247,-1.4375
h 2.124996
z`,
        box: { minX: 94.780599, minY: 220.079900, width: 4.281243, height: 15.145810 }
    },
    "2": {
        d: `m 102.25975,233.38196 5.28125,-7.04165
q 0.45833,-0.60417 0.70833,-1.25 0.26041,-0.65625 0.26041,-1.21875
v -0.0208
q 0,-0.90625 -0.53125,-1.40625 -0.53124,-0.5 -1.51041,-0.5 -0.92708,0 -1.5,0.55208 -0.57291,0.54167 -0.69791,1.54167
v 0.0104
h -2.19792
v -0.0104
q 0.1875,-1.30209 0.76042,-2.21875 0.58333,-0.92708 1.5,-1.40625 0.91666,-0.48958 2.11458,-0.48958 1.35416,0 2.31249,0.46875 0.95833,0.45833 1.45833,1.34375 0.5,0.88541 0.5,2.13541
v 0.0104
q 0,0.80208 -0.33333,1.67708 -0.33333,0.875 -0.92708,1.68749
l -4.38541,5.95833
h 5.72916
v 2.02083
h -8.54166
z`,
        box: { minX: 102.072250, minY: 219.923680, width: 8.729160, height: 15.302040 }
    },
    "3": {
        d: `m 117.44723,235.38196
q -1.27083,0 -2.23958,-0.45833 -0.96875,-0.46875 -1.5625,-1.34375 -0.58333,-0.88542 -0.73958,-2.125
v 0
h 2.16666
v 0
q 0.0937,0.64583 0.40625,1.0625 0.3125,0.41666 0.80208,0.625 0.5,0.19791 1.16667,0.19791 1.05208,0 1.63541,-0.56249 0.58334,-0.5625 0.58334,-1.58334
v -0.45833
q 0,-1.13541 -0.55209,-1.75 -0.55208,-0.62499 -1.56249,-0.62499
h -1.07292
v -2.02083
h 1.07292
q 0.88541,0 1.37499,-0.53125 0.48959,-0.53125 0.48959,-1.5
v -0.46875
q 0,-0.89583 -0.52084,-1.38542 -0.51041,-0.48958 -1.45833,-0.48958 -0.54166,0 -0.96875,0.20834 -0.42708,0.19791 -0.72916,0.62499 -0.29167,0.41667 -0.42708,1.05209
v 0
h -2.15625
v 0
q 0.20833,-1.23959 0.78125,-2.125 0.58333,-0.88542 1.46875,-1.34375 0.88541,-0.45833 2.03124,-0.45833 1.95833,0 3.03125,1.03125 1.07291,1.03125 1.07291,2.90624
v 0.25
q 0,1.13542 -0.61458,1.97917 -0.61458,0.84374 -1.73958,1.22916 1.23958,0.27083 1.91666,1.21875 0.6875,0.94791 0.6875,2.41666
v 0.25
q 0,1.32292 -0.51041,2.26041 -0.51042,0.9375 -1.48958,1.42709 -0.96875,0.48958 -2.34375,0.48958
z`,
        box: { minX: 112.905570, minY: 219.923650, width: 8.885400, height: 15.458310 }
    },
    "4": {
        d: `m 124.61388,231.05905 5.08333,-10.96873
h 2.1875
l -4.95833,10.84373
h 7.42707
v 1.96875
h -9.73957
z

m 6.53124,-4.73958
h 2.07292
v 8.91665
h -2.07292
z`,
        box: { minX: 124.613880, minY: 220.090320, width: 9.739570, height: 15.145800 },
        fillRule: "nonzero"
    },
    "5": {
        d: `m 141.17636,235.38196
q -1.14583,0 -2.04167,-0.44792 -0.88541,-0.44791 -1.44791,-1.30208 -0.55208,-0.85416 -0.73958,-2.05208
v -0.0104
h 2.12499
v 0.0104
q 0.11459,0.83333 0.66667,1.30208 0.55208,0.45833 1.4375,0.45833 1.02083,0 1.57291,-0.67708 0.5625,-0.6875 0.5625,-1.92708
v -1.27083
q 0,-1.22916 -0.5625,-1.90625 -0.55208,-0.6875 -1.57291,-0.6875 -0.55208,0 -1.0625,0.3125 -0.51042,0.3125 -0.89583,0.875
h -1.9375
v -7.97915
h 7.71874
v 2.02083
h -5.59374
v 3.40624
q 0.39583,-0.32291 0.88541,-0.5 0.48959,-0.17708 1,-0.17708 1.3125,0 2.23958,0.54167 0.9375,0.54166 1.41667,1.58333 0.48958,1.04166 0.48958,2.51041
v 1.27083
q 0,1.46875 -0.5,2.51041 -0.5,1.04167 -1.45833,1.59375 -0.95833,0.54167 -2.30208,0.54167
z`,
        box: { minX: 136.947200, minY: 220.079900, width: 8.489570, height: 15.302060 }
    },
    "6": {
        d: `m 152.47842,235.38196
q -1.33333,0 -2.28124,-0.53125 -0.94792,-0.54167 -1.44792,-1.5625 -0.48958,-1.03125 -0.48958,-2.47916
v -0.0104
q 0,-0.84375 0.19792,-1.77083 0.19791,-0.92708 0.57291,-1.82291 0.0625,-0.15625 0.13542,-0.30209 0.0729,-0.15625 0.14583,-0.30208
l 3.29166,-6.52082
h 2.29167
l -3.86458,7.55207 0.0104,-0.375
q 0.26041,-0.48958 0.76041,-0.76041 0.5,-0.27084 1.16667,-0.27084 1.17708,0 2.02083,0.53125 0.84374,0.53125 1.28124,1.55208 0.4375,1.01042 0.4375,2.4375
v 0.0104
q 0,1.45833 -0.5,2.49999 -0.48958,1.04167 -1.44791,1.58333 -0.94792,0.54167 -2.28125,0.54167
z

m 0,-2.04167
q 1.01042,0 1.55208,-0.62499 0.55209,-0.625 0.55209,-1.78125
v -0.0104
q 0,-1.27083 -0.57292,-1.95833 -0.57292,-0.69791 -1.63541,-0.69791 -0.94792,0 -1.46875,0.69791 -0.52083,0.69792 -0.52083,1.96875
v 0.0104
q 0,1.15625 0.54166,1.78125 0.55208,0.61458 1.55208,0.61458
z`,
        box: { minX: 148.259680, minY: 220.079920, width: 8.447880, height: 15.302040 }
    },
    "7": {
        d: `m 167.3534,221.97573 -3.91666,13.24998
h -2.26041
l 3.91666,-13.12498
h -3.85416
v 2.17708
h -2.125
v -4.19791
h 8.23957
z`,
        box: { minX: 159.113830, minY: 220.079900, width: 8.239570, height: 15.145810 }
    },
    "8": {
        d: `m 174.71797,235.38196
q -1.375,0 -2.41666,-0.52083 -1.04167,-0.52084 -1.61458,-1.46875 -0.5625,-0.95833 -0.5625,-2.21875
v -0.25
q 0,-1.13541 0.5625,-2.13541 0.57291,-1 1.52083,-1.51042 -0.80208,-0.4375 -1.29167,-1.26041 -0.47916,-0.83333 -0.47916,-1.75
v -0.36458
q 0,-1.1875 0.53125,-2.08333 0.53125,-0.90625 1.49999,-1.39583 0.96875,-0.5 2.25,-0.5 1.28125,0 2.25,0.5 0.96874,0.48958 1.49999,1.39583 0.53125,0.89583 0.53125,2.08333
v 0.36458
q 0,0.9375 -0.5,1.76042 -0.48958,0.82291 -1.30208,1.24999 0.95833,0.52084 1.53125,1.52083 0.58333,0.98959 0.58333,2.125
v 0.25
q 0,1.26042 -0.57291,2.21875 -0.5625,0.94791 -1.60417,1.46875 -1.04166,0.52083 -2.41666,0.52083
z

m 0,-2.04167
q 0.73958,0 1.30208,-0.29166 0.5625,-0.29167 0.86458,-0.8125 0.3125,-0.53125 0.3125,-1.21875
v -0.14583
q 0,-0.69792 -0.3125,-1.21875 -0.30208,-0.53125 -0.86458,-0.82292 -0.5625,-0.29166 -1.30208,-0.29166 -0.73958,0 -1.30208,0.29166 -0.5625,0.29167 -0.875,0.82292 -0.30208,0.53125 -0.30208,1.22916
v 0.15625
q 0,0.6875 0.30208,1.20834 0.3125,0.52083 0.875,0.81249 0.5625,0.28125 1.30208,0.28125
z

m 0,-6.84373
q 0.63542,0 1.125,-0.27084 0.48958,-0.28125 0.76041,-0.79166 0.27084,-0.51042 0.27084,-1.17708
v -0.14584
q 0,-0.63541 -0.27084,-1.125 -0.27083,-0.48958 -0.76041,-0.74999 -0.48958,-0.27084 -1.125,-0.27084 -0.63542,0 -1.125,0.27084 -0.48958,0.26041 -0.76041,0.74999 -0.27084,0.48959 -0.27084,1.13542
v 0.15625
q 0,0.65625 0.27084,1.16666 0.27083,0.5 0.76041,0.78125 0.48958,0.27084 1.125,0.27084
z`,
        box: { minX: 170.124230, minY: 219.923650, width: 9.187480, height: 15.458310 }
    },
    "9": {
        d: `m 187.64504,227.70489 -0.0104,0.375
q -0.26042,0.47916 -0.79167,0.70833 -0.52083,0.21875 -1.23958,0.21875 -1.08333,0 -1.90624,-0.55208 -0.82292,-0.55209 -1.28125,-1.55209 -0.44792,-1.01041 -0.44792,-2.33333
v -0.0104
q 0,-1.46875 0.48958,-2.51041 0.5,-1.04167 1.44792,-1.58334 0.95833,-0.54166 2.29166,-0.54166 1.33333,0 2.28125,0.55208 0.94791,0.55208 1.4375,1.60417 0.5,1.05208 0.5,2.53124
v 0.0104
q 0,0.8125 -0.20834,1.73958 -0.20833,0.91666 -0.59375,1.82291 -0.0625,0.13542 -0.125,0.28125 -0.0625,0.13542 -0.13541,0.27083
l -3.22916,6.48958
h -2.29167
z

m -1.44792,-0.63542
q 1,0 1.54167,-0.67708 0.55208,-0.67708 0.55208,-1.90625
v -0.0104
q 0,-1.19791 -0.55208,-1.85416 -0.54167,-0.65625 -1.54167,-0.65625 -1.01041,0 -1.5625,0.65625 -0.54166,0.65625 -0.54166,1.86458
v 0.0104
q 0,1.22916 0.54166,1.90625 0.55209,0.66666 1.5625,0.66666
z`,
        box: { minX: 181.967980, minY: 219.923660, width: 8.447910, height: 15.302040 }
    },
};

const DEFAULT_YEAR_DIGIT_HEIGHT = 42;
const DEFAULT_YEAR_DIGIT_GAP = 3.5;
const DEFAULT_MONTH_DIGIT_HEIGHT = 42;
const DEFAULT_MONTH_DIGIT_GAP = 2.4;

function digitsForValue(value, padLength = 0) {
    const text = String(value);

    return (padLength > 0 ? text.padStart(padLength, "0") : text).split("");
}

function metricForDigit(digit, targetHeight) {
    const digitData = BADGE_DIGIT_PATHS[digit] ?? BADGE_DIGIT_PATHS["0"];
    const scale = targetHeight / digitData.box.height;

    return {
        data: digitData,
        scale,
        width: digitData.box.width * scale,
        height: targetHeight
    };
}

function getBadgeDigitsWidth(value, options = {}) {
    const targetHeight = options.height ?? DEFAULT_YEAR_DIGIT_HEIGHT;
    const gap = options.gap ?? DEFAULT_YEAR_DIGIT_GAP;
    const padLength = options.padLength ?? 0;
    const digits = digitsForValue(value, padLength);
    const widths = digits.map((digit) => metricForDigit(digit, targetHeight).width);

    return widths.reduce((sum, width) => sum + width, 0) + Math.max(0, digits.length - 1) * gap;
}

function renderBadgeDigits(value, options = {}) {
    const cx = options.cx ?? 150;
    const cy = options.cy ?? 150;
    const targetHeight = options.height ?? DEFAULT_YEAR_DIGIT_HEIGHT;
    const gap = options.gap ?? DEFAULT_YEAR_DIGIT_GAP;
    const xOffset = options.xOffset ?? 0;
    const yOffset = options.yOffset ?? 0;
    const fill = options.fill ?? "black";
    const padLength = options.padLength ?? 0;
    const rotation = options.rotation ?? 0;
    const rotateOriginX = options.rotateOriginX ?? cx;
    const rotateOriginY = options.rotateOriginY ?? cy;
    const digits = digitsForValue(value, padLength);
    const metrics = digits.map((digit) => metricForDigit(digit, targetHeight));
    const totalWidth = metrics.reduce((sum, metric) => sum + metric.width, 0) + Math.max(0, digits.length - 1) * gap;

    let cursorX = -totalWidth / 2;
    const y = -targetHeight / 2;

    const paths = digits.map((digit, index) => {
        const metric = metrics[index];
        const { data, scale } = metric;
        const path = `
            <path
                d="${data.d}"
                fill-rule="${data.fillRule ?? "evenodd"}"
                transform="translate(${cursorX} ${y}) scale(${scale}) translate(${-data.box.minX} ${-data.box.minY})"
            />
        `;

        cursorX += metric.width + gap;
        return path;
    }).join("");

    const translatedDigits = `
        <g transform="translate(${cx + xOffset} ${cy + yOffset})">
            ${paths}
        </g>
    `;

    return rotation
        ? `
            <g transform="rotate(${rotation} ${rotateOriginX} ${rotateOriginY})" fill="${fill}">
                ${translatedDigits}
            </g>
        `
        : `
            <g fill="${fill}">
                ${translatedDigits}
            </g>
        `;
}

function getYearDigitsWidth(value, options = {}) {
    return getBadgeDigitsWidth(value, {
        ...options,
        padLength: 2
    });
}

function renderYearDigits(value, options = {}) {
    return renderBadgeDigits(value, {
        ...options,
        padLength: 2
    });
}

return { BADGE_DIGIT_PATHS: BADGE_DIGIT_PATHS, DEFAULT_YEAR_DIGIT_HEIGHT: DEFAULT_YEAR_DIGIT_HEIGHT, DEFAULT_YEAR_DIGIT_GAP: DEFAULT_YEAR_DIGIT_GAP, DEFAULT_MONTH_DIGIT_HEIGHT: DEFAULT_MONTH_DIGIT_HEIGHT, DEFAULT_MONTH_DIGIT_GAP: DEFAULT_MONTH_DIGIT_GAP, getBadgeDigitsWidth: getBadgeDigitsWidth, renderBadgeDigits: renderBadgeDigits, getYearDigitsWidth: getYearDigitsWidth, renderYearDigits: renderYearDigits };

})();

// ---- src/badge/geometry.js ----
const __m_src_badge_geometry_js = (() => {
function polar(center, deg, radius) {
    const rad = (deg - 90) * Math.PI / 180;

    return {
        x: center.x + Math.cos(rad) * radius,
        y: center.y + Math.sin(rad) * radius
    };
}

function splitMarkerVertical(center, startDeg, endDeg, innerRadius, outerRadius, gapWidth) {
    const halfGap = gapWidth / 2;

    const pStartOuter = polar(center, startDeg, outerRadius);
    const pStartInner = polar(center, startDeg, innerRadius);
    const pEndOuter = polar(center, endDeg, outerRadius);
    const pEndInner = polar(center, endDeg, innerRadius);

    const outerCutLeft = {
        x: center.x - halfGap,
        y: center.y - Math.sqrt(Math.max(0, outerRadius * outerRadius - halfGap * halfGap))
    };

    const outerCutRight = {
        x: center.x + halfGap,
        y: center.y - Math.sqrt(Math.max(0, outerRadius * outerRadius - halfGap * halfGap))
    };

    const innerCutLeft = {
        x: center.x - halfGap,
        y: center.y - Math.sqrt(Math.max(0, innerRadius * innerRadius - halfGap * halfGap))
    };

    const innerCutRight = {
        x: center.x + halfGap,
        y: center.y - Math.sqrt(Math.max(0, innerRadius * innerRadius - halfGap * halfGap))
    };

    const leftPath = `
            M ${pStartOuter.x} ${pStartOuter.y}
            A ${outerRadius} ${outerRadius} 0 0 1 ${outerCutLeft.x} ${outerCutLeft.y}
            L ${innerCutLeft.x} ${innerCutLeft.y}
            A ${innerRadius} ${innerRadius} 0 0 0 ${pStartInner.x} ${pStartInner.y}
            Z
        `;

    const rightPath = `
            M ${outerCutRight.x} ${outerCutRight.y}
            A ${outerRadius} ${outerRadius} 0 0 1 ${pEndOuter.x} ${pEndOuter.y}
            L ${pEndInner.x} ${pEndInner.y}
            A ${innerRadius} ${innerRadius} 0 0 0 ${innerCutRight.x} ${innerCutRight.y}
            Z
        `;

    return { leftPath, rightPath };
}

return { polar: polar, splitMarkerVertical: splitMarkerVertical };

})();

// ---- src/badge/profile.js ----
const __m_src_badge_profile_js = (() => {
const BADGE_CENTER = Object.freeze({
    x: 150,
    y: 150
});

const BADGE_COLORS = Object.freeze([
    "#da6e00",
    "#007cb0",
    "#ddaf27",
    "#8d4931",
    "#d8a0a6",
    "#61993b"
]);

const BADGE_PROFILE = Object.freeze({
    outerRadius: 144,
    lineOuterRadius: 142,
    blackRingRadius: 42,
    centerRadius: 36,
    monthNumberRadius: 91,
    gapInnerRadius: 63.6,
    gapOuterRadius: 117.8,
    monthDigitHeight: 39,
    monthDigitGap: 2.0,
    yearDigitHeight: 42,
    yearDigitGap: 3.5,
    strokeWidth: 5
});

const BADGE_MARKER_PROFILE = Object.freeze({
    outer: Object.freeze({
        startDeg: -31.1,
        endDeg: 31.1,
        innerRadius: 117.1
    }),
    inner: Object.freeze({
        startDeg: -32.1,
        endDeg: 32.1,
        outerRadius: 66.5,
        innerRadius: 40
    })
});

const BADGE_MONTH_LABEL_ORDER = Object.freeze([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);

function tuevColorForYear(year) {
    const index = ((year - 2025) % BADGE_COLORS.length + BADGE_COLORS.length) % BADGE_COLORS.length;
    return BADGE_COLORS[index];
}

return { BADGE_CENTER: BADGE_CENTER, BADGE_COLORS: BADGE_COLORS, BADGE_PROFILE: BADGE_PROFILE, BADGE_MARKER_PROFILE: BADGE_MARKER_PROFILE, BADGE_MONTH_LABEL_ORDER: BADGE_MONTH_LABEL_ORDER, tuevColorForYear: tuevColorForYear };

})();

// ---- src/badge/parts.js ----
const __m_src_badge_parts_js = (() => {
const { renderBadgeDigits } = __m_src_badge_digits_js;
const { polar, splitMarkerVertical } = __m_src_badge_geometry_js;
const { BADGE_CENTER, BADGE_MARKER_PROFILE, BADGE_MONTH_LABEL_ORDER, BADGE_PROFILE } = __m_src_badge_profile_js;

function renderMarkerPaths() {
    const markerGapWidth = BADGE_PROFILE.strokeWidth;

    const outerMarker = splitMarkerVertical(
        BADGE_CENTER,
        BADGE_MARKER_PROFILE.outer.startDeg,
        BADGE_MARKER_PROFILE.outer.endDeg,
        BADGE_MARKER_PROFILE.outer.innerRadius,
        BADGE_PROFILE.outerRadius,
        markerGapWidth
    );

    const innerMarker = splitMarkerVertical(
        BADGE_CENTER,
        BADGE_MARKER_PROFILE.inner.startDeg,
        BADGE_MARKER_PROFILE.inner.endDeg,
        BADGE_MARKER_PROFILE.inner.innerRadius,
        BADGE_MARKER_PROFILE.inner.outerRadius,
        markerGapWidth
    );

    return `
                <path d="${outerMarker.leftPath}" fill="black" />
                <path d="${outerMarker.rightPath}" fill="black" />
                <path d="${innerMarker.leftPath}" fill="black" />
                <path d="${innerMarker.rightPath}" fill="black" />
    `;
}

function renderDividerLines() {
    return Array.from({ length: 12 }, (_, i) => {
        if (i === 0) {
            return "";
        }

        const angle = i * 30;

        const innerA = polar(BADGE_CENTER, angle, BADGE_PROFILE.blackRingRadius);
        const innerB = polar(BADGE_CENTER, angle, BADGE_PROFILE.gapInnerRadius);

        const outerA = polar(BADGE_CENTER, angle, BADGE_PROFILE.gapOuterRadius);
        const outerB = polar(BADGE_CENTER, angle, BADGE_PROFILE.lineOuterRadius);

        return `
            <line
                x1="${innerA.x}" y1="${innerA.y}"
                x2="${innerB.x}" y2="${innerB.y}"
                stroke="black"
                stroke-width="${BADGE_PROFILE.strokeWidth}"
                stroke-linecap="butt"
            />
            <line
                x1="${outerA.x}" y1="${outerA.y}"
                x2="${outerB.x}" y2="${outerB.y}"
                stroke="black"
                stroke-width="${BADGE_PROFILE.strokeWidth}"
                stroke-linecap="butt"
            />
        `;
    }).join("");
}

function renderMonthDigits() {
    return BADGE_MONTH_LABEL_ORDER.map((num, i) => {
        const angle = i * 30;
        const p = polar(BADGE_CENTER, angle, BADGE_PROFILE.monthNumberRadius);

        return renderBadgeDigits(num, {
            cx: p.x,
            cy: p.y,
            height: BADGE_PROFILE.monthDigitHeight,
            gap: BADGE_PROFILE.monthDigitGap,
            rotation: angle,
            rotateOriginX: p.x,
            rotateOriginY: p.y
        });
    }).join("");
}

return { renderMarkerPaths: renderMarkerPaths, renderDividerLines: renderDividerLines, renderMonthDigits: renderMonthDigits };

})();

// ---- src/badge/renderer.js ----
const __m_src_badge_renderer_js = (() => {
const { renderYearDigits: renderYearDigitPaths } = __m_src_badge_digits_js;
const { renderDividerLines, renderMarkerPaths, renderMonthDigits } = __m_src_badge_parts_js;
const { BADGE_CENTER, BADGE_PROFILE, tuevColorForYear } = __m_src_badge_profile_js;

const { tuevColorForYear: __reexport_tuevColorForYear } = __m_src_badge_profile_js;

function getBadgeBlurStyle(blurred) {
    return blurred
        ? "transition: filter 0.5s ease, opacity 0.5s ease; filter: blur(3px); opacity: 0.65;"
        : "transition: filter 0.5s ease, opacity 0.5s ease; filter: blur(0); opacity: 1;";
}

function renderYearDigits(value) {
    return renderYearDigitPaths(value, {
        cx: BADGE_CENTER.x,
        cy: BADGE_CENTER.y,
        height: BADGE_PROFILE.yearDigitHeight,
        gap: BADGE_PROFILE.yearDigitGap
    });
}

function renderBadge(year, rotation, blurred, size = 250) {
    const yearShort = String(year).slice(-2);
    const color = tuevColorForYear(year);
    const blurStyle = getBadgeBlurStyle(blurred);

    return `
        <svg
            viewBox="0 0 300 300"
            width="${size}"
            height="${size}"
            style="${blurStyle}"
        >
            <g transform="rotate(${rotation} 150 150)">
                <circle cx="${BADGE_CENTER.x}" cy="${BADGE_CENTER.y}" r="${BADGE_PROFILE.outerRadius}" fill="${color}" />

                ${renderMarkerPaths()}

                ${renderDividerLines()}
                ${renderMonthDigits()}

                <circle cx="${BADGE_CENTER.x}" cy="${BADGE_CENTER.y}" r="${BADGE_PROFILE.blackRingRadius}" fill="black" />
                <circle cx="${BADGE_CENTER.x}" cy="${BADGE_CENTER.y}" r="${BADGE_PROFILE.centerRadius}" fill="${color}" />

                ${renderYearDigits(yearShort)}

                <circle
                    cx="${BADGE_CENTER.x}"
                    cy="${BADGE_CENTER.y}"
                    r="${BADGE_PROFILE.outerRadius}"
                    fill="none"
                    stroke="black"
                    stroke-width="${BADGE_PROFILE.strokeWidth}"
                />
            </g>
        </svg>
    `;
}

return { tuevColorForYear: __reexport_tuevColorForYear, renderBadge: renderBadge };

})();

// ---- src/card/render-parts.js ----
const __m_src_card_render_parts_js = (() => {
const { renderBadge } = __m_src_badge_renderer_js;

function renderMissingEntity(entityId, localize) {
    return `
        <div style="
            padding: 12px;
            border-radius: 12px;
            background: var(--card-background-color);
            border: 1px solid var(--divider-color);
        ">
            <div style="font-weight: 600; margin-bottom: 4px;">
                ${localize("error.entity_not_found")}
            </div>
            <div style="font-size: 13px; opacity: 0.75;">
                ${entityId}
            </div>
        </div>
    `;
}

function renderVehicleHeader({
    compact,
    vehicleName,
    plate,
    plateLayout,
    renderPlate
}) {
    return `
        <div style="
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 2px;
            text-align: center;
        ">
            <div style="
                font-size: ${compact ? "18px" : "22px"};
                font-weight: 600;
                line-height: 1.2;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            ">
                ${vehicleName}
            </div>

            ${plateLayout && plate ? `
                <div style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    margin-top: 3px;
                    overflow: hidden;
                ">
                    ${renderPlate()}
                </div>
            ` : `
                <div style="
                    font-size: ${compact ? "13px" : "15px"};
                    opacity: 0.75;
                    letter-spacing: 0.08em;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                ">
                    ${plate}
                </div>
            `}
        </div>
    `;
}

function getOverlayStyleOptions({ badgeSize, compact }) {
    const overlayScale = badgeSize <= 115
        ? "tiny"
        : badgeSize <= 140
            ? "small"
            : "normal";

    return {
        minWidth: {
            tiny: 104,
            small: 122,
            normal: compact ? 145 : 170
        }[overlayScale],
        maxWidth: {
            tiny: 126,
            small: 150,
            normal: compact ? 180 : 220
        }[overlayScale],
        padding: {
            tiny: "7px",
            small: "8px",
            normal: compact ? "10px" : "12px"
        }[overlayScale],
        gap: {
            tiny: "5px",
            small: "6px",
            normal: compact ? "7px" : "9px"
        }[overlayScale],
        titleSize: {
            tiny: "11px",
            small: "12px",
            normal: compact ? "14px" : "16px"
        }[overlayScale],
        textSize: {
            tiny: "10px",
            small: "11px",
            normal: compact ? "12px" : "13px"
        }[overlayScale],
        buttonPadding: {
            tiny: "5px 9px",
            small: "6px 10px",
            normal: compact ? "7px 12px" : "8px 15px"
        }[overlayScale],
        buttonFontSize: {
            tiny: "10px",
            small: "11px",
            normal: compact ? "12px" : "13px"
        }[overlayScale]
    };
}

function renderConfirmOverlay({
    entityId,
    ui,
    showSuccess,
    overlayTitle,
    overlayText,
    buttonText,
    style
}) {
    return `
        <div
            style="
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                z-index: 5;
                min-width: ${style.minWidth}px;
                max-width: ${style.maxWidth}px;
                padding: ${style.padding};
                border-radius: 16px;
                background: rgba(20, 20, 20, 0.62);
                border: 1px solid rgba(255, 255, 255, 0.20);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.38);
                backdrop-filter: blur(6px);
                -webkit-backdrop-filter: blur(6px);
                color: white;
                text-align: center;
                display: flex;
                flex-direction: column;
                gap: ${style.gap};
                align-items: center;
                transition:
                    opacity 0.5s ease,
                    transform 0.3s ease;
            "
        >
            <div style="
                font-size: ${style.titleSize};
                font-weight: 700;
                line-height: 1.15;
            ">
                ${overlayTitle}
            </div>

            <div style="
                font-size: ${style.textSize};
                opacity: 0.9;
                line-height: 1.2;
            ">
                ${overlayText}
            </div>

            <button
                data-confirm-entity="${entityId}"
                ${ui.confirming || showSuccess ? "disabled" : ""}
                style="
                    border: none;
                    border-radius: 999px;
                    padding: ${style.buttonPadding};
                    background: ${showSuccess ? "var(--success-color, #43a047)" : "var(--primary-color)"};
                    color: var(--text-primary-color);
                    font-size: ${style.buttonFontSize};
                    font-weight: 700;
                    cursor: ${ui.confirming || showSuccess ? "default" : "pointer"};
                    white-space: nowrap;
                    opacity: ${ui.confirming ? "0.75" : "1"};
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.30);
                "
            >
                ${buttonText}
            </button>
        </div>
    `;
}

function renderVehicleDetails({ showDetails, compact, huLabel, statusColor, statusLabel }) {
    if (!showDetails) {
        return "";
    }

    return `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            font-size: ${compact ? "12px" : "13px"};
            line-height: 1.25;
            opacity: 0.82;
            text-align: center;
        ">
            <div style="font-weight: 600;">
                ${huLabel}
            </div>
            <div style="
                display: inline-flex;
                align-items: center;
                gap: 5px;
            ">
                <span style="
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: ${statusColor};
                    display: inline-block;
                    box-shadow: 0 0 5px ${statusColor};
                    flex: 0 0 auto;
                "></span>
                <span style="color: inherit;">
                    ${statusLabel}
                </span>
            </div>
        </div>
    `;
}

function renderBadgeLayer(badge, size) {
    return `
        <div style="
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 1;
            z-index: 1;
        ">
            ${renderBadge(badge.year, badge.rotation, badge.blurred, size)}
        </div>
    `;
}

function renderCrossfadeLayer(crossfade, size) {
    if (!crossfade.from) {
        return "";
    }

    return `
        <div style="
            position: absolute;
            inset: 0;
            z-index: 2;
            pointer-events: none;
        ">
            <div
                style="
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: tuevFadeOut ${crossfade.duration}ms ease forwards;
                "
            >
                ${renderBadge(crossfade.from.year, crossfade.from.rotation, crossfade.from.blurred, size)}
            </div>

            <div
                style="
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: tuevFadeIn ${crossfade.duration}ms ease forwards;
                "
            >
                ${renderBadge(crossfade.to.year, crossfade.to.rotation, crossfade.to.blurred, size)}
            </div>

            <style>
                @keyframes tuevFadeOut {
                    from { opacity: 1; transform: scale(1); }
                    to { opacity: 0; transform: scale(0.985); }
                }

                @keyframes tuevFadeIn {
                    from { opacity: 0; transform: scale(1.015); }
                    to { opacity: 1; transform: scale(1); }
                }
            </style>
        </div>
    `;
}

function renderBadgeArea({
    badgeSize,
    badgeLayer,
    crossfadeLayer,
    overlay
}) {
    return `
        <div style="
            position: relative;
            width: ${badgeSize}px;
            height: ${badgeSize}px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            ${badgeLayer}
            ${crossfadeLayer}
            ${overlay}
        </div>
    `;
}

return { renderMissingEntity: renderMissingEntity, renderVehicleHeader: renderVehicleHeader, getOverlayStyleOptions: getOverlayStyleOptions, renderConfirmOverlay: renderConfirmOverlay, renderVehicleDetails: renderVehicleDetails, renderBadgeLayer: renderBadgeLayer, renderCrossfadeLayer: renderCrossfadeLayer, renderBadgeArea: renderBadgeArea };

})();

// ---- src/plate/font.js ----
const __m_src_plate_font_js = (() => {
const PLATE_FONT_URL = "/local/EuroPlate.ttf";

let plateFontInjected = false;
let plateFontLoadPromise = null;

async function checkPlateFontAvailable() {
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

function isPlateFontLoaded() {
    if (!document.fonts || typeof document.fonts.check !== "function") {
        return false;
    }

    return document.fonts.check("16px EuroPlate");
}

function ensurePlateFont(onReady) {
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

function injectPlateFont() {
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

return { checkPlateFontAvailable: checkPlateFontAvailable, isPlateFontLoaded: isPlateFontLoaded, ensurePlateFont: ensurePlateFont, injectPlateFont: injectPlateFont };

})();

// ---- src/plate/renderer.js ----
const __m_src_plate_renderer_js = (() => {
const { checkPlateFontAvailable, ensurePlateFont, injectPlateFont, isPlateFontLoaded } = __m_src_plate_font_js;



const EUROPLATE_FONT_FAMILY = '"EuroPlate", "Arial Narrow", Arial, sans-serif';

// Single base geometry for all graphical plates. The card calculates one
// shared scale from the widest plate and the current tile width; every plate
// is then rendered with this same scale. This keeps the visible height, font
// size and vertical padding consistent while allowing shorter plates to remain
// narrower.
const PLATE_GEOMETRY = {
    height: 38,
    minWidth: 118,
    radius: 3,
    euWidth: 19,
    euContentX: 10,
    textGapLeft: 7,
    fontSize: 30,
    textY: 0.515,
    textScaleY: 1.18,
    letterSpacing: 1.1,
    starY: 0.30,
    starRadius: 5.2,
    starDotRadius: 0.75,
    countryY: 0.72,
    countryFontSize: 8.2
};

const CHAR_WIDTH = {
    space: 0.29,
    digit: 0.48,
    wide: 0.61,
    narrow: 0.36,
    default: 0.51
};

let plateFontRequested = false;

function normalizePlate(plate) {
    return String(plate || "")
        .trim()
        .replace(/[-–—]+/g, " ")
        .replace(/\s+/g, " ")
        .toUpperCase();
}

function renderLicensePlate(plate, options = {}) {
    if (!plateFontRequested) {
        plateFontRequested = true;
        injectPlateFont();
    }

    const metrics = getLicensePlateMetrics(plate, options);

    if (!metrics.normalizedPlate) {
        return "";
    }

    const {
        normalizedPlate,
        layout,
        width,
        height,
        textPadLeft,
        textPadRight
    } = metrics;

    const requestedScale = Number(options.scale || 0);
    const maxWidth = Number(options.maxWidth || 0);
    const fallbackScale = Number.isFinite(maxWidth) && maxWidth > 0
        ? maxWidth / width
        : 1;

    // The card should pass one shared scale for all plates. If the renderer is
    // called directly, it still protects a single plate with maxWidth.
    const scale = Number.isFinite(requestedScale) && requestedScale > 0
        ? Math.min(1, requestedScale)
        : Math.min(1, fallbackScale);
    const displayWidth = Math.max(1, Math.round(width * scale));
    const displayHeight = Math.max(1, Math.round(height * scale));

    const textAreaStartX = layout.euWidth + layout.textGapLeft + textPadLeft;
    const textAreaWidth = width - textAreaStartX - textPadRight;
    const textX = textAreaStartX + textAreaWidth / 2;

    const textY = height * layout.textY;
    const textScaleY = layout.textScaleY || 1;
    const textTransform = textScaleY === 1
        ? ""
        : `translate(0 ${textY}) scale(1 ${textScaleY}) translate(0 ${-textY})`;
    const letterSpacing = `${layout.letterSpacing}px`;
    const clipId = `plateClip-${hashString(`${normalizedPlate}-${Math.round(width * 10)}-${Math.round(height * 10)}`)}`;

    return renderPlateSvg({
        normalizedPlate,
        width,
        height,
        displayWidth,
        displayHeight,
        layout,
        textX,
        textY,
        letterSpacing,
        textTransform,
        clipId
    });
}

function getLicensePlateMetrics(plate, options = {}) {
    const normalizedPlate = normalizePlate(plate);

    if (!normalizedPlate) {
        return {
            width: 0,
            height: 0,
            normalizedPlate: ""
        };
    }

    const layout = PLATE_GEOMETRY;
    const plainChars = normalizedPlate.replace(/\s/g, "");
    const charCount = plainChars.length;
    const textPadLeft = getLeftPadding(charCount);
    const textPadRight = getRightPadding(charCount);
    const textWidth = estimatePlateTextWidth(normalizedPlate, layout.fontSize);

    const contentWidth =
        layout.euWidth +
        layout.textGapLeft +
        textPadLeft +
        textWidth +
        textPadRight;

    // Do not cap the measured width. The widest real content width must be
    // allowed to determine the shared card-wide scale.
    const width = Math.max(layout.minWidth, contentWidth);

    return {
        width,
        height: layout.height,
        normalizedPlate,
        layout,
        charCount,
        textPadLeft,
        textPadRight,
        textWidth
    };
}

function getLeftPadding(charCount) {
    return charCount >= 8 ? 7 : charCount <= 4 ? 2 : charCount <= 6 ? 3 : 5;
}

function getRightPadding(charCount) {
    return charCount >= 8 ? 9 : charCount <= 4 ? 8 : charCount <= 6 ? 9 : 10;
}

function estimatePlateTextWidth(text, fontSize) {
    let width = 0;
    const letterSpacing = PLATE_GEOMETRY.letterSpacing || 0;

    for (const char of text) {
        if (char === " ") {
            width += fontSize * CHAR_WIDTH.space;
        } else if (char >= "0" && char <= "9") {
            width += fontSize * CHAR_WIDTH.digit;
        } else if ("MW".includes(char)) {
            width += fontSize * CHAR_WIDTH.wide;
        } else if ("IJ".includes(char)) {
            width += fontSize * CHAR_WIDTH.narrow;
        } else {
            width += fontSize * CHAR_WIDTH.default;
        }
    }

    return width + Math.max(0, text.length - 1) * letterSpacing;
}

function renderPlateSvg({
    normalizedPlate,
    width,
    height,
    displayWidth,
    displayHeight,
    layout,
    textX,
    textY,
    letterSpacing,
    textTransform,
    clipId
}) {
    return `
        <svg
            viewBox="0 0 ${width} ${height}"
            width="${displayWidth}"
            height="${displayHeight}"
            role="img"
            aria-label="${escapeHtml(normalizedPlate)}"
            style="
                display: block;
                width: ${displayWidth}px;
                height: ${displayHeight}px;
                max-width: none;
                flex: 0 0 auto;
            "
        >
            <defs>
                <clipPath id="${clipId}">
                    <rect
                        x="1"
                        y="1"
                        width="${width - 2}"
                        height="${height - 2}"
                        rx="${layout.radius}"
                        ry="${layout.radius}"
                    />
                </clipPath>

                <style>
                    .tuev-plate-text {
                        font-family: ${EUROPLATE_FONT_FAMILY};
                        font-size: ${layout.fontSize}px;
                        font-weight: 700;
                        letter-spacing: ${letterSpacing};
                    }
                </style>
            </defs>

            <g clip-path="url(#${clipId})">
                <rect
                    x="1"
                    y="1"
                    width="${width - 2}"
                    height="${height - 2}"
                    fill="#f7f7f2"
                />

                <rect
                    x="1"
                    y="1"
                    width="${layout.euWidth}"
                    height="${height - 2}"
                    fill="#003399"
                />

                <rect
                    x="${layout.euWidth}"
                    y="1"
                    width="1"
                    height="${height - 2}"
                    fill="#111"
                    opacity="0.10"
                />

                ${renderEuStars(
                    layout.euContentX,
                    height * layout.starY,
                    layout.starRadius,
                    layout.starDotRadius
                )}

                <text
                    x="${layout.euContentX}"
                    y="${height * layout.countryY}"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    font-family="Arial, sans-serif"
                    font-size="${layout.countryFontSize}"
                    font-weight="700"
                    fill="#fff"
                >
                    D
                </text>

                <text
                    class="tuev-plate-text"
                    x="${textX}"
                    y="${textY}"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    transform="${textTransform}"
                    fill="#111"
                >
                    ${escapeHtml(normalizedPlate)}
                </text>
            </g>

            <rect
                x="1"
                y="1"
                width="${width - 2}"
                height="${height - 2}"
                rx="${layout.radius}"
                ry="${layout.radius}"
                fill="none"
                stroke="#111"
                stroke-width="2"
            />
        </svg>
    `;
}

function renderEuStars(cx, cy, radius, starRadius) {
    return Array.from({ length: 12 }, (_, index) => {
        const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;

        return `
            <circle
                cx="${x.toFixed(2)}"
                cy="${y.toFixed(2)}"
                r="${starRadius}"
                fill="#ffcc00"
            />
        `;
    }).join("");
}

function hashString(value) {
    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
        hash = ((hash << 5) - hash) + value.charCodeAt(index);
        hash |= 0;
    }

    return Math.abs(hash);
}

function escapeHtml(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

return { normalizePlate: normalizePlate, renderLicensePlate: renderLicensePlate, getLicensePlateMetrics: getLicensePlateMetrics, checkPlateFontAvailable: checkPlateFontAvailable, ensurePlateFont: ensurePlateFont, isPlateFontLoaded: isPlateFontLoaded };

})();

// ---- src/editor/columns.js ----
const __m_src_editor_columns_js = (() => {
function getColumnSliderValue(columns) {
    const value = String(columns || "auto");

    if (value === "1") {
        return 1;
    }

    if (value === "2") {
        return 2;
    }

    if (value === "3") {
        return 3;
    }

    if (value === "4") {
        return 4;
    }

    return 5;
}

function getColumnsFromSliderValue(value) {
    const sliderValue = Number(value);

    if (sliderValue === 1) {
        return "1";
    }

    if (sliderValue === 2) {
        return "2";
    }

    if (sliderValue === 3) {
        return "3";
    }

    if (sliderValue === 4) {
        return "4";
    }

    return "auto";
}

function getColumnLabel(columns, localize) {
    const value = String(columns || "auto");

    if (value === "1") {
        return localize("editor.columns_1_short");
    }

    if (value === "2") {
        return localize("editor.columns_2_short");
    }

    if (value === "3") {
        return localize("editor.columns_3_short");
    }

    if (value === "4") {
        return localize("editor.columns_4_short");
    }

    return localize("editor.columns_fill");
}

return { getColumnSliderValue: getColumnSliderValue, getColumnsFromSliderValue: getColumnsFromSliderValue, getColumnLabel: getColumnLabel };

})();

// ---- src/editor/render-parts.js ----
const __m_src_editor_render_parts_js = (() => {
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

function renderEditorStyles() {
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

function renderEntitySection({
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

function renderColumnsSection({ showColumnSetting, columnSliderValue, columnLabel, localize }) {
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

function renderSortSection({ sort, localize }) {
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

function renderOptionsSection({ config, canRenderPlate, localize }) {
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

return { renderEditorStyles: renderEditorStyles, renderEntitySection: renderEntitySection, renderColumnsSection: renderColumnsSection, renderSortSection: renderSortSection, renderOptionsSection: renderOptionsSection };

})();

// ---- src/editor/editor.js ----
const __m_src_editor_editor_js = (() => {
const { localize } = __m_src_translations_index_js;
const { normalizeCardConfig, removeLegacyCardConfigOptions } = __m_src_card_config_js;
const { getAvailableTuevEntities, getEntityIdsFromConfig, getEntityLabel } = __m_src_card_entities_js;
const { checkPlateFontAvailable, ensurePlateFont } = __m_src_plate_renderer_js;
const { getColumnLabel, getColumnsFromSliderValue, getColumnSliderValue } = __m_src_editor_columns_js;
const { renderColumnsSection, renderEditorStyles, renderEntitySection, renderOptionsSection, renderSortSection } = __m_src_editor_render_parts_js;

class TuevCardEditor extends HTMLElement {
    setConfig(config) {
        this._config = normalizeCardConfig(config, { requireEntity: false });

        this._plateFontAvailable = false;
        this._draftEntityIds = this.getEntityIdsFromConfig();
        this._pickerOpen = false;
        this._searchText = "";

        this.checkPlateFontAvailability();
        this.render();
    }

    set hass(hass) {
        this._hass = hass;
        this.render();
    }

    localize(key) {
        return localize(this._hass, key);
    }

    checkPlateFontAvailability() {
        checkPlateFontAvailable().then((available) => {
            this._plateFontAvailable = available;

            if (!available) {
                const hadGraphicalPlate = this._config.plate_style === "plate";
                this._config.plate_style = "text";
                removeLegacyCardConfigOptions(this._config);

                if (hadGraphicalPlate) {
                    this.fireConfigChanged();
                }

                this.render();
                return;
            }

            ensurePlateFont(() => {
                this._plateFontAvailable = true;
                this.render();
            });

            this.render();
        }).catch(() => {
            const hadGraphicalPlate = this._config.plate_style === "plate";
            this._plateFontAvailable = false;
            this._config.plate_style = "text";
            removeLegacyCardConfigOptions(this._config);

            if (hadGraphicalPlate) {
                this.fireConfigChanged();
            }

            this.render();
        });
    }

    getEntityIdsFromConfig() {
        return getEntityIdsFromConfig(this._config);
    }

    getAvailableTuevEntities() {
        return getAvailableTuevEntities(this._hass);
    }

    getEntityLabel(entityId) {
        return getEntityLabel(this._hass, entityId);
    }

    getUnselectedEntities() {
        const selected = new Set(this._draftEntityIds.filter(Boolean));
        const search = String(this._searchText || "").trim().toLowerCase();

        return this.getAvailableTuevEntities()
            .filter((entityId) => !selected.has(entityId))
            .filter((entityId) => {
                if (!search) {
                    return true;
                }

                const label = this.getEntityLabel(entityId).toLowerCase();
                return label.includes(search) || entityId.toLowerCase().includes(search);
            });
    }

    render() {
        if (!this._config) {
            return;
        }

        const selectedEntityIds = this._draftEntityIds.filter(Boolean);
        const availableTuevEntities = this.getAvailableTuevEntities();
        const unselectedEntities = this.getUnselectedEntities();
        const hasAvailableToAdd = availableTuevEntities
            .some((entityId) => !selectedEntityIds.includes(entityId));
        const newEntityCount = availableTuevEntities
            .filter((entityId) => !selectedEntityIds.includes(entityId))
            .length;
        const entityHint = availableTuevEntities.length > 0 && !hasAvailableToAdd
            ? this.localize("editor.all_entities_added")
            : this.localize("editor.single_entity_hint");
        const canRenderPlate = this._plateFontAvailable === true;
        const showColumnSetting = selectedEntityIds.length > 1;
        const columnSliderValue = getColumnSliderValue(this._config.columns);
        const columnLabel = getColumnLabel(
            this._config.columns,
            (key) => this.localize(key)
        );

        this.innerHTML = `
            ${renderEditorStyles()}

            <div style="
                display: flex;
                flex-direction: column;
                gap: 18px;
                padding: 4px 0;
            ">
                ${renderEntitySection({
                    selectedEntityIds,
                    unselectedEntities,
                    hasAvailableToAdd,
                    newEntityCount,
                    entityHint,
                    pickerOpen: this._pickerOpen,
                    searchText: this._searchText,
                    localize: (key) => this.localize(key),
                    getEntityLabel: (entityId) => this.getEntityLabel(entityId),
                    escapeHtml: (value) => this.escapeHtml(value)
                })}

                ${renderColumnsSection({
                    showColumnSetting,
                    columnSliderValue,
                    columnLabel,
                    localize: (key) => this.localize(key)
                })}

                ${renderSortSection({
                    sort: this._config.sort,
                    localize: (key) => this.localize(key)
                })}

                ${renderOptionsSection({
                    config: this._config,
                    canRenderPlate,
                    localize: (key) => this.localize(key)
                })}
            </div>
        `;

        this.attachEventListeners(hasAvailableToAdd);
    }

    attachEventListeners(hasAvailableToAdd) {
        this.querySelector("#togglePicker")?.addEventListener("click", () => {
            if (!hasAvailableToAdd) {
                return;
            }

            this._pickerOpen = !this._pickerOpen;
            this._searchText = "";
            this.render();
        });

        this.querySelector("#addAllNewEntities")?.addEventListener("click", () => {
            this.addAllNewEntities();
        });

        this.querySelector("#entitySearch")?.addEventListener("input", (event) => {
            this._searchText = event.target.value || "";
            this.render();
        });

        this.querySelectorAll("[data-add-entity]").forEach((button) => {
            button.addEventListener("click", () => {
                const entityId = button.getAttribute("data-add-entity");

                if (!entityId) {
                    return;
                }

                this._draftEntityIds = [...new Set([
                    ...this._draftEntityIds.filter(Boolean),
                    entityId
                ])];

                this._pickerOpen = false;
                this._searchText = "";
                this.applyEntities();
                this.render();
            });
        });

        this.querySelectorAll("[data-remove-entity]").forEach((button) => {
            button.addEventListener("click", () => {
                const entityId = button.getAttribute("data-remove-entity");

                this._draftEntityIds = this._draftEntityIds
                    .filter((currentEntityId) => currentEntityId !== entityId);

                this.applyEntities();
                this.render();
            });
        });

        this.querySelector("#columns")?.addEventListener("input", () => {
            this.updateConfig();
        });

        this.querySelector("#sort")?.addEventListener("change", () => {
            this.updateConfig();
        });

        this.querySelector("#renderPlate")?.addEventListener("change", () => {
            this.updateConfig();
        });

        this.querySelector("#showDetails")?.addEventListener("change", () => {
            this.updateConfig();
        });
    }

    addAllNewEntities() {
        const selected = new Set(this._draftEntityIds.filter(Boolean));

        const newEntityIds = this.getAvailableTuevEntities()
            .filter((entityId) => !selected.has(entityId));

        if (newEntityIds.length === 0) {
            return;
        }

        this._draftEntityIds = [...new Set([
            ...this._draftEntityIds.filter(Boolean),
            ...newEntityIds
        ])];

        this._pickerOpen = false;
        this._searchText = "";

        this.applyEntities();
        this.render();
    }

    applyEntities() {
        const cleanedEntityIds = [...new Set(
            this._draftEntityIds
                .map((entityId) => String(entityId || "").trim())
                .filter(Boolean)
        )];

        const newConfig = {
            ...this._config
        };

        if (cleanedEntityIds.length === 1) {
            newConfig.entity = cleanedEntityIds[0];
            delete newConfig.entities;
        } else if (cleanedEntityIds.length > 1) {
            newConfig.entities = cleanedEntityIds;
            delete newConfig.entity;
        } else {
            delete newConfig.entity;
            delete newConfig.entities;
        }

        delete newConfig.auto_add_entities;
        delete newConfig.badge_size;
        delete newConfig.compact_badge_size;

        this._config = newConfig;
        this.fireConfigChanged();
    }

    updateConfig() {
        const columnsSlider = this.querySelector("#columns");
        const columns = columnsSlider
            ? getColumnsFromSliderValue(columnsSlider.value)
            : (this._config.columns || "auto");

        const sort = this.querySelector("#sort")?.value || "name";
        const renderPlate = this.querySelector("#renderPlate")?.checked ?? false;
        const showDetails = this.querySelector("#showDetails")?.checked ?? true;
        const newConfig = {
            ...this._config,
            columns,
            sort,
            plate_style: renderPlate ? "plate" : "text",
            show_details: showDetails
        };

        delete newConfig.plate_font;
        delete newConfig.layout;
        delete newConfig.auto_add_entities;

        delete newConfig.badge_size;
        delete newConfig.compact_badge_size;

        this._config = newConfig;
        this.fireConfigChanged();
        this.render();
    }

    fireConfigChanged() {
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: {
                config: this._config
            },
            bubbles: true,
            composed: true
        }));
    }

    escapeHtml(value) {
        return String(value || "")
            .replaceAll("&", "&amp;")
            .replaceAll('"', "&quot;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");
    }
}

return { TuevCardEditor: TuevCardEditor };

})();

// ---- tuev-card.js ----
const __m_tuev_card_js = (() => {
// TÜV Card v0.1.0-a94

const { localize } = __m_src_translations_index_js;
const { normalizeCardConfig } = __m_src_card_config_js;
const { findFirstTuevEntity, getSortedEntityIds } = __m_src_card_entities_js;
const { calculateAutomaticBadgeSize, calculateLayoutInfo } = __m_src_card_layout_js;
const { getSharedPlateLayout } = __m_src_card_plate_layout_js;
const { CONFIRM_TIMING, getEntityUiState, resetEntityUiStateAfterError, startEntityConfirmation } = __m_src_card_ui_state_js;
const { getOverlayStyleOptions, renderBadgeArea, renderBadgeLayer, renderConfirmOverlay, renderCrossfadeLayer, renderMissingEntity, renderVehicleDetails, renderVehicleHeader } = __m_src_card_render_parts_js;
const { checkPlateFontAvailable, ensurePlateFont, getLicensePlateMetrics, isPlateFontLoaded, renderLicensePlate } = __m_src_plate_renderer_js;
const { TuevCardEditor } = __m_src_editor_editor_js;

window.customCards = window.customCards || [];

if (!window.customCards.some((card) => card.type === "tuev-card")) {
    window.customCards.push({
        type: "tuev-card",
        name: "TÜV Reminder",
        description: "Display TÜV / HU inspection reminders as inspection stickers."
    });
}

class TuevCard extends HTMLElement {
    connectedCallback() {
        this.style.display = "block";
        this.style.width = "100%";

        if (!this._onWindowResize) {
            this._onWindowResize = () => this.scheduleWidthRefresh(true);
            window.addEventListener("resize", this._onWindowResize);
        }

        if (!this._plateFontRefreshTimer) {
            this._plateFontRefreshTimer = window.setInterval(() => {
                if (this.config) {
                    this.checkPlateFontAvailability(true);
                }
            }, 15000);
        }

        if (this._resizeObserver || typeof ResizeObserver === "undefined") {
            return;
        }

        this._resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            const width = Math.round(entry?.contentRect?.width || 0);

            if (!width) {
                return;
            }

            if (Math.abs((this._cardWidth || 0) - width) < 4) {
                return;
            }

            this._cardWidth = width;

            if (this._hass && this.config) {
                this.hass = this._hass;
            }
        });

        this._resizeObserver.observe(this);
    }

    disconnectedCallback() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }

        if (this._onWindowResize) {
            window.removeEventListener("resize", this._onWindowResize);
            this._onWindowResize = null;
        }

        if (this._plateFontRefreshTimer) {
            window.clearInterval(this._plateFontRefreshTimer);
            this._plateFontRefreshTimer = null;
        }
    }

    static getConfigElement() {
        return document.createElement("tuev-card-editor");
    }

    static getStubConfig(hass) {
        const entityId = findFirstTuevEntity(hass);

        return {
            type: "custom:tuev-card",
            columns: "auto",
            sort: "name",
            show_details: true,
            ...(entityId ? { entity: entityId } : {})
        };
    }

    localize(key) {
        return localize(this._hass, key);
    }

    setConfig(config) {
        this.config = normalizeCardConfig(config);

        this._entityUiState = this._entityUiState || {};

        this._plateFontAvailable = false;
        this._plateFontLoaded = false;
        this._plateFontCheckInProgress = false;
        this._plateFontLastCheckedAt = 0;

        this.checkPlateFontAvailability(true);
        this.scheduleWidthRefresh(true);
    }

    checkPlateFontAvailability(force = false) {
        const now = Date.now();

        if (this._plateFontCheckInProgress) {
            return;
        }

        if (!force && now - (this._plateFontLastCheckedAt || 0) < 10000) {
            return;
        }

        this._plateFontCheckInProgress = true;
        this._plateFontLastCheckedAt = now;

        checkPlateFontAvailable().then((available) => {
            const changed = this._plateFontAvailable !== available;
            this._plateFontAvailable = available;

            if (!available) {
                this._plateFontLoaded = false;

                if (changed && this._hass) {
                    this.hass = this._hass;
                }

                return;
            }

            this._plateFontLoaded = isPlateFontLoaded();

            ensurePlateFont(() => {
                this._plateFontLoaded = true;

                if (this._hass) {
                    this.hass = this._hass;
                }
            });

            if (changed && this._hass) {
                this.hass = this._hass;
            }
        }).catch(() => {
            const changed = this._plateFontAvailable !== false || this._plateFontLoaded !== false;
            this._plateFontAvailable = false;
            this._plateFontLoaded = false;

            if (changed && this._hass) {
                this.hass = this._hass;
            }
        }).finally(() => {
            this._plateFontCheckInProgress = false;
        });
    }

    isGraphicalPlateAvailable() {
        return (
            this.config?.plate_style === "plate" &&
            this._plateFontAvailable === true &&
            this._plateFontLoaded === true
        );
    }

    set hass(hass) {
        this._hass = hass;
        this._entityUiState = this._entityUiState || {};
        this.checkPlateFontAvailability(false);

        const entityIds = getSortedEntityIds(this.config, hass);

        if (entityIds.length === 0) {
            this.innerHTML = `
                <ha-card style="display:block;width:100%;">
                    <div style="padding:16px;">
                        ${this.localize("error.no_entities")}
                    </div>
                </ha-card>
            `;
            return;
        }

        const isMulti = entityIds.length > 1;
        const layoutContext = this.getLayoutContext(isMulti);
        const layout = calculateLayoutInfo({
            cardWidth: layoutContext.layoutWidth,
            isMulti,
            requestedColumns: layoutContext.requestedColumns || this.config.columns
        });

        const automaticBadgeSize = calculateAutomaticBadgeSize({
            isMulti,
            effectiveColumns: layout.effectiveColumns,
            tileWidth: layout.tileWidth
        });

        const sharedPlateLayout = getSharedPlateLayout({
            entityIds,
            hass,
            tileWidth: layout.tileWidth,
            isGraphicalPlateAvailable: this.isGraphicalPlateAvailable(),
            getLicensePlateMetrics
        });

        const cardContent = `
            <div style="
                padding: 16px;
                display: grid;
                grid-template-columns: ${layout.gridTemplateColumns};
                gap: ${layout.gap}px;
                align-items: start;
            ">
                ${entityIds.map((entityId) => this.renderVehicle(
                    hass,
                    entityId,
                    isMulti,
                    automaticBadgeSize,
                    layout,
                    sharedPlateLayout
                )).join("")}
            </div>
        `;

        this.innerHTML = `
            <ha-card style="display:block;width:100%;overflow:hidden;">
                ${this.renderPreviewScaledContent(cardContent, layoutContext)}
            </ha-card>
        `;

        this.updatePreviewScaleHeight();

        this.querySelectorAll("[data-confirm-entity]").forEach((button) => {
            const entityId = button.getAttribute("data-confirm-entity");

            button.addEventListener("click", async () => {
                await this.confirmPassed(entityId);
            });
        });

        this.scheduleWidthRefresh();
    }

    isEditorPreviewContext() {
        const previewTagNames = new Set([
            "HUI-CARD-PREVIEW",
            "HUI-CARD-ELEMENT-EDITOR",
            "HUI-CARD-EDITOR",
            "HUI-DIALOG-EDIT-CARD",
            "HA-CARD-PREVIEW",
            "HA-DIALOG"
        ]);
        const previewClassNeedles = [
            "preview",
            "card-preview",
            "editor-preview",
            "edit-card",
            "card-editor"
        ];

        let node = this;
        let depth = 0;

        while (node && depth < 32) {
            const tagName = String(node.tagName || "").toUpperCase();

            if (previewTagNames.has(tagName)) {
                return true;
            }

            const rawClassName = node.className;
            const className = typeof rawClassName === "string"
                ? rawClassName.toLowerCase()
                : String(rawClassName?.baseVal || "").toLowerCase();

            if (
                className &&
                previewClassNeedles.some((needle) => className.includes(needle))
            ) {
                return true;
            }

            const root = node.getRootNode?.();
            node = node.parentElement || node.assignedSlot || root?.host || null;
            depth += 1;
        }

        return false;
    }

    getLayoutContext(isMulti) {
        const measuredWidth = this.getCardWidth();
        const requestedColumns = String(this.config?.columns || "auto");
        const previewContext = this.isEditorPreviewContext();

        if (!isMulti || !previewContext) {
            return {
                measuredWidth,
                layoutWidth: measuredWidth,
                requestedColumns,
                previewScaled: false,
                scale: 1
            };
        }

        const previewSimulation = this.getPreviewSimulation(requestedColumns, measuredWidth);

        if (!previewSimulation?.width) {
            return {
                measuredWidth,
                layoutWidth: measuredWidth,
                requestedColumns,
                previewScaled: false,
                scale: 1
            };
        }

        const simulatedWidth = previewSimulation.width;
        const visiblePreviewWidth = this.getPreviewVisibleWidth() || measuredWidth;
        const scale = Math.min(1, Math.max(0.05, visiblePreviewWidth / simulatedWidth));

        if (scale >= 0.995 && measuredWidth >= simulatedWidth - 4) {
            return {
                measuredWidth,
                layoutWidth: measuredWidth,
                requestedColumns: previewSimulation.requestedColumns || requestedColumns,
                previewScaled: false,
                scale: 1
            };
        }

        return {
            measuredWidth,
            layoutWidth: simulatedWidth,
            requestedColumns: previewSimulation.requestedColumns || requestedColumns,
            previewScaled: true,
            scale
        };
    }

    getPreviewSimulation(requestedColumns, measuredWidth) {
        if (requestedColumns === "4") {
            return {
                width: 720,
                requestedColumns: "4"
            };
        }

        if (requestedColumns !== "auto") {
            return null;
        }

        // Conservative editor preview: the native Home Assistant preview does
        // not reliably expose whether the edited card will later live in a
        // panel, section or grid view. To avoid misleading panel-style previews
        // in section/grid dashboards, auto is shown as the same stable four
        // column preview as the manual "4" setting. The real dashboard still
        // uses the actual available width and can render more columns.
        return {
            width: 720,
            requestedColumns: "4"
        };
    }

    getPreviewVisibleWidth() {
        const candidates = [];
        const addCandidate = (element) => {
            if (!element?.getBoundingClientRect) {
                return;
            }

            const rect = element.getBoundingClientRect();
            const width = Math.round(rect.width || 0);

            if (width > 0) {
                candidates.push(width);
            }
        };

        addCandidate(this);
        addCandidate(this.querySelector("ha-card"));
        addCandidate(this.parentElement);

        if (candidates.length === 0) {
            return 0;
        }

        // For scaled editor previews the visible card element is the relevant
        // limit. Parent containers can be wider than the clipped preview pane,
        // so using the maximum here would make the scaled preview too large.
        return Math.min(...candidates);
    }

    renderPreviewScaledContent(content, layoutContext) {
        if (!layoutContext.previewScaled) {
            return content;
        }

        const height = this._previewScaledHeight
            ? `${this._previewScaledHeight}px`
            : "auto";

        return `
            <div
                data-preview-scale-outer
                style="
                    height: ${height};
                    overflow: hidden;
                    width: 100%;
                "
            >
                <div
                    data-preview-scale-inner
                    style="
                        width: ${layoutContext.layoutWidth}px;
                        transform: scale(${layoutContext.scale});
                        transform-origin: top left;
                    "
                >
                    ${content}
                </div>
            </div>
        `;
    }

    updatePreviewScaleHeight() {
        const outer = this.querySelector("[data-preview-scale-outer]");
        const inner = this.querySelector("[data-preview-scale-inner]");

        if (!outer || !inner) {
            this._previewScaledHeight = 0;
            return;
        }

        window.requestAnimationFrame(() => {
            const rect = inner.getBoundingClientRect();
            const height = Math.ceil(rect.height || 0);

            if (!height) {
                return;
            }

            if (Math.abs((this._previewScaledHeight || 0) - height) < 2) {
                outer.style.height = `${height}px`;
                return;
            }

            this._previewScaledHeight = height;
            outer.style.height = `${height}px`;
        });
    }

    getCardWidth() {
        const getWidth = (element) => {
            if (!element?.getBoundingClientRect) {
                return 0;
            }

            return Math.round(element.getBoundingClientRect().width || 0);
        };

        const ownWidth = getWidth(this);
        const cardWidth = getWidth(this.querySelector("ha-card"));
        const storedWidth = this._cardWidth > 0 ? Math.round(this._cardWidth) : 0;
        const previewContext = this.isEditorPreviewContext();

        // In the real dashboard the custom element's own box is the only safe
        // source of truth. Parent containers can be wider than the card itself
        // in tile/section layouts; using them would make plate scaling think it
        // has more horizontal room than the tile actually provides.
        if (!previewContext) {
            return ownWidth || cardWidth || storedWidth || 0;
        }

        const candidates = [ownWidth, cardWidth, storedWidth].filter((width) => width > 0);

        let parent = this.parentElement;
        let depth = 0;

        while (parent && depth < 3) {
            const width = getWidth(parent);

            if (width > 0) {
                candidates.push(width);
            }

            parent = parent.parentElement;
            depth += 1;
        }

        if (candidates.length === 0) {
            return 0;
        }

        // In HA's editor preview the custom element can initially report too
        // small a width. There we still allow nearby preview/container widths,
        // because the result is scaled visually and not used by the real card.
        return Math.max(...candidates);
    }

    refreshMeasuredWidth(forceRender = false) {
        const width = Math.round(this.getCardWidth());

        if (!width) {
            return false;
        }

        const changed = Math.abs((this._cardWidth || 0) - width) >= 4;

        if (changed || forceRender) {
            this._cardWidth = width;

            if (this._hass && this.config) {
                this.hass = this._hass;
            }

            return true;
        }

        return false;
    }

    scheduleWidthRefresh(force = false) {
        if (this._widthRefreshScheduled && !force) {
            return;
        }

        this._widthRefreshScheduled = true;

        const scheduleFrame = (delay, isLast = false) => {
            window.setTimeout(() => {
                window.requestAnimationFrame(() => {
                    this.refreshMeasuredWidth(false);

                    if (isLast) {
                        this._widthRefreshScheduled = false;
                    }
                });
            }, delay);
        };

        // A mix of animation frames and delayed checks catches HA editor
        // preview changes, section reflows and the final dashboard layout
        // after leaving edit mode without changing the actual layout rules.
        window.requestAnimationFrame(() => {
            this.refreshMeasuredWidth(force);

            window.requestAnimationFrame(() => {
                this.refreshMeasuredWidth(false);
            });
        });

        const delays = [80, 180, 360, 750, 1500, 3000];
        delays.forEach((delay, index) => {
            scheduleFrame(delay, index === delays.length - 1);
        });
    }

    getUiState(entityId) {
        return getEntityUiState(this._entityUiState, entityId);
    }

    renderVehicle(hass, entityId, compact, automaticBadgeSize, layout, sharedPlateLayout) {
        const entity = hass.states[entityId];

        if (!entity) {
            return renderMissingEntity(entityId, (key) => this.localize(key));
        }

        const ui = this.getUiState(entityId);
        const attr = entity.attributes;

        const vehicleName = attr.vehicle_name || attr.friendly_name || "Vehicle";
        const plate = attr.plate || "";
        const month = Number(attr.month || 1);
        const year = Number(attr.year || new Date().getFullYear());
        const status = attr.status || entity.state || "";
        const showDetails = this.config.show_details !== false;

        const statusLabel = {
            valid: this.localize("status.valid"),
            due: this.localize("status.due"),
            expired: this.localize("status.expired")
        }[status] || status;

        const statusColor = {
            valid: "var(--success-color, #43a047)",
            due: "var(--warning-color, #ffa000)",
            expired: "var(--error-color, #db4437)"
        }[status] || "var(--secondary-text-color)";

        const huLabel = month && year
            ? `${this.localize("details.next_inspection")}: ${String(month).padStart(2, "0")}/${year}`
            : "";

        const fallbackRotation = (month % 12) * 30;
        const rotation = Number.isFinite(Number(attr.rotation))
            ? Number(attr.rotation)
            : fallbackRotation;

        const blurred = Boolean(attr.blurred);
        const pending =
            entity.state === "due" ||
            entity.state === "expired" ||
            attr.status === "due" ||
            attr.status === "expired" ||
            blurred;

        this.updateConfirmationUiState({
            ui,
            pending,
            year,
            rotation
        });

        const showSuccess = Date.now() < (ui.showSuccessUntil || 0);
        const showConfirmOverlay = pending || ui.confirming || showSuccess;
        const isExpired = entity.state === "expired" || attr.status === "expired";

        const overlayTitle = ui.confirming
            ? this.localize("overlay.updating")
            : showSuccess
                ? this.localize("overlay.updated")
                : isExpired
                    ? this.localize("overlay.expired")
                    : this.localize("overlay.due");

        const overlayText = ui.confirming
            ? this.localize("overlay.updating_text")
            : showSuccess
                ? this.localize("overlay.updated_text")
                : this.localize("overlay.question");

        const buttonText = ui.confirming
            ? this.localize("button.wait")
            : showSuccess
                ? this.localize("button.done")
                : this.localize("button.confirm");

        const displayBadge = ui.frozenBadge
            ? ui.frozenBadge
            : { year, rotation, blurred };
        const badgeSize = automaticBadgeSize;
        const plateLayout = sharedPlateLayout;
        const overlayStyle = getOverlayStyleOptions({ badgeSize, compact });

        const header = renderVehicleHeader({
            compact,
            vehicleName,
            plate,
            plateLayout,
            renderPlate: () => renderLicensePlate(plate, {
                compact,
                maxWidth: plateLayout.maxWidth,
                scale: plateLayout.scale
            })
        });

        const overlay = showConfirmOverlay
            ? renderConfirmOverlay({
                entityId,
                ui,
                showSuccess,
                overlayTitle,
                overlayText,
                buttonText,
                style: overlayStyle
            })
            : "";

        const badgeArea = renderBadgeArea({
            badgeSize,
            badgeLayer: renderBadgeLayer(displayBadge, badgeSize),
            crossfadeLayer: ui.crossfadeBadge ? renderCrossfadeLayer(ui.crossfadeBadge, badgeSize) : "",
            overlay
        });

        const details = renderVehicleDetails({
            showDetails,
            compact,
            huLabel,
            statusColor,
            statusLabel
        });

        return `
            <div style="
                display: flex;
                flex-direction: column;
                gap: 10px;
                align-items: center;
                min-width: 0;
            ">
                ${header}
                ${badgeArea}
                ${details}
            </div>
        `;
    }

    updateConfirmationUiState({ ui, pending, year, rotation }) {
        if (!pending && ui.confirming && !ui.confirmFinishScheduled) {
            ui.confirmFinishScheduled = true;

            const elapsed = Date.now() - (ui.confirmStartedAt || 0);
            const remaining = Math.max(0, CONFIRM_TIMING.minConfirmMs - elapsed);

            window.setTimeout(() => {
                ui.confirming = false;
                ui.confirmFinishScheduled = false;
                ui.showSuccessUntil = Date.now() + CONFIRM_TIMING.successMs;

                ui.crossfadeBadge = {
                    from: ui.frozenBadge,
                    to: {
                        year,
                        rotation,
                        blurred: false
                    },
                    startedAt: Date.now(),
                    duration: CONFIRM_TIMING.crossfadeMs
                };

                ui.frozenBadge = null;

                if (this._hass) {
                    this.hass = this._hass;
                }

                window.setTimeout(() => {
                    ui.showSuccessUntil = 0;
                    ui.crossfadeBadge = null;

                    if (this._hass) {
                        this.hass = this._hass;
                    }
                }, Math.max(CONFIRM_TIMING.successMs, CONFIRM_TIMING.crossfadeMs));
            }, remaining);
        }
    }

    async confirmPassed(entityId) {
        const entity = this._hass.states[entityId];

        if (!entity) {
            return;
        }

        const ui = this.getUiState(entityId);
        const attr = entity.attributes;

        const month = Number(attr.month || 1);
        const year = Number(attr.year || new Date().getFullYear());

        const fallbackRotation = (month % 12) * 30;
        const rotation = Number.isFinite(Number(attr.rotation))
            ? Number(attr.rotation)
            : fallbackRotation;

        if (ui.confirming) {
            return;
        }

        startEntityConfirmation(ui, {
            year,
            rotation
        });

        this.hass = this._hass;

        try {
            await this._hass.callService("tuev_reminder", "confirm_passed", {
                entity_id: entityId
            });
        } catch (error) {
            console.error("TÜV confirmation failed", error);

            resetEntityUiStateAfterError(ui);

            if (this._hass) {
                this.hass = this._hass;
            }
        }
    }

    getCardSize() {
        return 4;
    }
}

if (!customElements.get("tuev-card-editor")) {
    customElements.define("tuev-card-editor", TuevCardEditor);
}

if (!customElements.get("tuev-card")) {
    customElements.define("tuev-card", TuevCard);
}
return {};

})();
