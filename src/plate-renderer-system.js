import {
    renderProfiledLicensePlate
} from "./plate-renderer-shared.js?v=a8";

const FONT_PROFILE = {
    fontFamily: '"Bahnschrift SemiCondensed", "Bahnschrift Condensed", "Arial Narrow", sans-serif',
    letterSpacing: {
        normal: "0.7px",
        compact: "0.45px",
        tiny: "0.10px"
    },
    textOffsetX: {
        normal: -4,
        compact: -2.5,
        tiny: 0.0
    },
    textY: {
        normal: 0.60,
        compact: 0.60,
        tiny: 0.58
    },
    charWidth: {
        space: 0.28,
        digit: 0.52,
        wide: 0.68,
        narrow: 0.34,
        default: 0.56
    }
};

const LAYOUT_PROFILES = {
    normal: {
        height: 28,
        euWidth: 16,
        fontSize: 29,
        radius: 4,
        textGapLeft: 17,
        euContentX: 9.2,
        minWidth: 82,
        maxWidth: 320,
        starY: 0.27,
        starRadius: 3.8,
        starDotRadius: 0.64,
        countryY: 0.78,
        countryFontSize: 7.2
    },
    compact: {
        height: 23,
        euWidth: 13,
        fontSize: 23,
        radius: 3,
        textGapLeft: 13,
        euContentX: 7.6,
        minWidth: 64,
        maxWidth: 240,
        starY: 0.27,
        starRadius: 3.1,
        starDotRadius: 0.52,
        countryY: 0.78,
        countryFontSize: 5.8
    },
    tiny: {
        height: 20,
        euWidth: 9,
        fontSize: 17,
        radius: 2.5,
        textGapLeft: 6,
        euContentX: 5.0,
        minWidth: 52,
        maxWidth: 175,
        starY: 0.27,
        starRadius: 2.2,
        starDotRadius: 0.38,
        countryY: 0.78,
        countryFontSize: 4.5
    }
};

export function renderSystemLicensePlate(plate, options = {}) {
    return renderProfiledLicensePlate({
        plate,
        options,
        fontProfile: FONT_PROFILE,
        layoutProfiles: LAYOUT_PROFILES,
        rendererName: "system",
        getLeftPadding,
        getRightPadding
    });
}

function getLeftPadding(charCount, sizeProfileName) {
    if (sizeProfileName === "tiny") {
        return charCount <= 4 ? 0 : charCount <= 6 ? 1 : 2;
    }

    if (sizeProfileName === "compact") {
        return charCount <= 4 ? 1 : charCount <= 6 ? 2 : 3;
    }

    return charCount <= 4 ? 2 : charCount <= 6 ? 3 : 4;
}

function getRightPadding(charCount, sizeProfileName) {
    if (sizeProfileName === "tiny") {
        return charCount <= 4 ? 8 : charCount <= 6 ? 10 : 12;
    }

    if (sizeProfileName === "compact") {
        return charCount <= 4 ? 10 : charCount <= 6 ? 11 : 12;
    }

    return charCount <= 4 ? 13 : charCount <= 6 ? 14 : 15;
}