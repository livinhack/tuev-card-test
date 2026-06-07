export function compareText(a, b) {
    return String(a).localeCompare(String(b), undefined, {
        numeric: true,
        sensitivity: "base"
    });
}

export function getEntityIdsFromConfig(config = {}) {
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

export function isTuevSensorEntity(entityId, entity) {
    return (
        entityId.startsWith("sensor.") &&
        entity?.attributes?.month !== undefined &&
        entity?.attributes?.year !== undefined &&
        entity?.attributes?.plate !== undefined
    );
}

export function findFirstTuevEntity(hass) {
    return Object.keys(hass?.states || {}).find((entityId) => (
        isTuevSensorEntity(entityId, hass.states[entityId])
    ));
}

export function getAvailableTuevEntities(hass) {
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

export function getEntityLabel(hass, entityId) {
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

export function getVehicleName(entity, fallback = "Vehicle") {
    return entity?.attributes?.vehicle_name || entity?.attributes?.friendly_name || fallback;
}

export function getSortedEntityIds(config, hass) {
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
