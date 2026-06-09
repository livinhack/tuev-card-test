import { getEntityIdsFromConfig, sortEntityIds } from "./entities.js?v=b32";

export const GROUP_SORTS = ["name", "plate", "due_date", "status", "manual"];
export const GROUP_SORT_DIRECTIONS = ["asc", "desc"];

export const GROUP_ACCENT_COLORS = [
    "#42a5f5",
    "#66bb6a",
    "#ffa726",
    "#ab47bc",
    "#26c6da",
    "#ef5350",
    "#8d6e63"
];

export function normalizeGroupSort(sort) {
    return GROUP_SORTS.includes(sort) ? sort : "manual";
}

export function normalizeGroupSortDirection(direction) {
    return GROUP_SORT_DIRECTIONS.includes(direction) ? direction : "asc";
}

export function normalizeGroupColor(color) {
    const cleaned = String(color || "").trim();

    return GROUP_ACCENT_COLORS.includes(cleaned)
        ? cleaned
        : "";
}

export function getGroupAccentColor(group, index = 0) {
    return normalizeGroupColor(group?.color) || GROUP_ACCENT_COLORS[index % GROUP_ACCENT_COLORS.length];
}

function normalizeEntityList(entities = []) {
    if (!Array.isArray(entities)) {
        return [];
    }

    const result = [];
    const seen = new Set();

    entities.forEach((entry) => {
        const entityId = typeof entry === "string"
            ? entry
            : entry?.entity;
        const cleaned = String(entityId || "").trim();

        if (!cleaned || seen.has(cleaned)) {
            return;
        }

        seen.add(cleaned);
        result.push(cleaned);
    });

    return result;
}

function createFallbackGroupId(index) {
    return `group-${index + 1}`;
}

export function normalizeGroups(groups = []) {
    if (!Array.isArray(groups)) {
        return [];
    }

    const usedIds = new Set();

    return groups.map((group, index) => {
        const rawId = String(group?.id || "").trim() || createFallbackGroupId(index);
        let id = rawId;
        let duplicateIndex = 2;

        while (usedIds.has(id)) {
            id = `${rawId}-${duplicateIndex}`;
            duplicateIndex += 1;
        }

        usedIds.add(id);

        const title = String(group?.title || "").trim();
        const entities = normalizeEntityList(group?.entities || []);
        const color = normalizeGroupColor(group?.color);
        const sort = normalizeGroupSort(group?.sort);
        const sortDirection = normalizeGroupSortDirection(group?.sort_direction);

        return {
            id,
            title,
            ...(color ? { color } : {}),
            ...(sort !== "manual" ? { sort } : {}),
            ...(sort !== "manual" && sortDirection !== "asc" ? { sort_direction: sortDirection } : {}),
            entities
        };
    }).filter((group) => group.title || group.entities.length > 0);
}

export function getGroupedEntityIdsFromConfig(config = {}) {
    return normalizeGroups(config.groups)
        .flatMap((group) => group.entities);
}

export function getUngroupedEntityIdsFromConfig(config = {}) {
    const grouped = new Set(getGroupedEntityIdsFromConfig(config));

    return getEntityIdsFromConfig(config)
        .filter((entityId) => !grouped.has(entityId));
}

export function getAllEntityIdsFromConfig(config = {}) {
    return [...new Set([
        ...getUngroupedEntityIdsFromConfig(config),
        ...getGroupedEntityIdsFromConfig(config)
    ])];
}

export function sortGroupEntityIds(group, hass) {
    const sort = normalizeGroupSort(group?.sort);
    const direction = normalizeGroupSortDirection(group?.sort_direction);
    const entityIds = [...new Set((group?.entities || []).filter(Boolean))];

    if (sort === "manual") {
        return entityIds;
    }

    const sorted = sortEntityIds(entityIds, sort, hass);

    return direction === "desc"
        ? sorted.reverse()
        : sorted;
}

export function getEntitySections(config = {}, hass) {
    const groups = normalizeGroups(config.groups);
    const ungrouped = getUngroupedEntityIdsFromConfig(config);
    const sort = config?.sort || "name";
    const direction = normalizeGroupSortDirection(config?.sort_direction);

    if (groups.length === 0) {
        const sortedEntityIds = sortEntityIds(getEntityIdsFromConfig(config), sort, hass);
        const entityIds = direction === "desc" ? sortedEntityIds.reverse() : sortedEntityIds;

        return entityIds.length > 0
            ? [{ id: "default", title: "", entityIds, grouped: false }]
            : [];
    }

    const sections = groups.map((group, index) => ({
        id: group.id,
        title: group.title,
        color: getGroupAccentColor(group, index),
        entityIds: sortGroupEntityIds(group, hass),
        grouped: true
    })).filter((section) => section.entityIds.length > 0);

    if (ungrouped.length > 0) {
        sections.push({
            id: "ungrouped",
            title: "",
            entityIds: direction === "desc"
                ? sortEntityIds(ungrouped, sort, hass).reverse()
                : sortEntityIds(ungrouped, sort, hass),
            grouped: false
        });
    }

    return sections;
}

export function getNewGroupTitle(localize) {
    return localize ? localize("editor.new_group_title") : "New group";
}

export function createGroup(title) {
    return {
        id: `group-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000).toString(36)}`,
        title: String(title || "").trim() || "New group",
        color: "",
        entities: []
    };
}

export function getGroupLabel(group, fallback) {
    return String(group?.title || "").trim() || fallback || group?.id || "Group";
}
