export function getColumnSliderValue(columns) {
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

export function getColumnsFromSliderValue(value) {
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

export function getColumnLabel(columns, localize) {
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
