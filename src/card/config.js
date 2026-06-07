export const ALLOWED_SORTS = ["name", "plate", "due_date", "status"];
export const ALLOWED_COLUMNS = ["auto", "1", "2", "3", "4"];
export const ALLOWED_PLATE_STYLES = ["text", "plate"];

export const DEFAULT_CARD_CONFIG = {
    columns: "auto",
    sort: "name",
    show_details: true,
    plate_style: "text"
};

export function normalizeCardConfig(config = {}, options = {}) {
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

export function removeLegacyCardConfigOptions(config) {
    delete config.layout;
    delete config.auto_add_entities;
    delete config.plate_font;
    delete config.badge_size;
    delete config.compact_badge_size;

    return config;
}
