export function normalizePlate(plate) {
    return String(plate || "")
        .trim()
        .replace(/[-–—]+/g, " ")
        .replace(/\s+/g, " ")
        .toUpperCase();
}

export function getPlateCharacterCount(plate) {
    return normalizePlate(plate)
        .replace(/\s/g, "")
        .length;
}

export function getPlateMaxWidth(tileWidth) {
    return Math.max(84, Math.floor(tileWidth - 2));
}

export function getSharedPlateScale(entityIds, hass, maxWidth, getLicensePlateMetrics) {
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

export function getSharedPlateLayout({
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
