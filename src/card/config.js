import { normalizeGroups } from "./groups.js?v=b51";

export const ALLOWED_SORTS = ["name", "plate", "due_date", "status"];
export const ALLOWED_COLUMNS = ["auto", "1", "2", "3", "4"];
export const ALLOWED_PLATE_STYLES = ["text", "plate"];
export const ALLOWED_SORT_DIRECTIONS = ["asc", "desc"];

export const DEFAULT_CARD_CONFIG = {
    columns: "auto",
    sort: "name",
    show_details: true,
    show_badge: true,
    plate_style: "text",
    sort_direction: "asc"
};

export function normalizeCardConfig(config = {}, options = {}) {
    const { requireEntity = true } = options;

    const normalizedGroups = normalizeGroups(config.groups);

    if (requireEntity && !config.entity && !config.entities && normalizedGroups.length === 0) {
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

    const sortDirection = ALLOWED_SORT_DIRECTIONS.includes(config.sort_direction)
        ? config.sort_direction
        : DEFAULT_CARD_CONFIG.sort_direction;

    const normalizedConfig = {
        ...DEFAULT_CARD_CONFIG,
        ...config,
        columns,
        sort,
        sort_direction: sortDirection,
        plate_style: plateStyle
    };

    if (normalizedGroups.length > 0) {
        normalizedConfig.groups = normalizedGroups;
    } else {
        delete normalizedConfig.groups;
    }

    removeLegacyCardConfigOptions(normalizedConfig);

    return normalizedConfig;
}

export function removeLegacyCardConfigOptions(config) {
    delete config.layout;
    delete config.auto_add_entities;
    delete config.plate_font;
    delete config.badge_size;
    delete config.compact_badge_size;

    return config;
}
