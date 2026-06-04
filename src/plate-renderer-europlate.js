import {
    renderProfiledLicensePlate
} from "./plate-renderer-shared.js?v=a14";

const FONT_PROFILE = {
    fontFamily: '"EuroPlate", sans-serif',
    letterSpacing: {
        normal: "0.22px",
        compact: "0.12px",
        tiny: "0.05px"
    },
    textOffsetX: {
        normal: -6.4,
        compact: -4.4,
        tiny: -3.2
    },
    textY: {
        normal: 0.50,
        compact: 0.50,
        tiny: 0.50
    },
    charWidth: {
        space: 0.34,
        dash: 0.22,
        digit: 0.43,
        wide: 0.54,
        narrow: 0.22,
        default: 0.40
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
        euWidth: 10,
        fontSize: 19,
        radius: 2.5,
        textGapLeft: 9,
        euContentX: 5.8,
        minWidth: 52,
        maxWidth: 190,
        starY: 0.27,
        starRadius: 2.35,
        starDotRadius: 0.42,
        countryY: 0.78,
        countryFontSize: 4.8
    }
};

export function renderEuroPlateLicensePlate(plate, options = {}) {
    return renderProfiledLicensePlate({
        plate,
        options,
        fontProfile: FONT_PROFILE,
        layoutProfiles: LAYOUT_PROFILES,
        rendererName: "europlate",
        getLeftPadding,
        getRightPadding
    });
}

function getLeftPadding(charCount, sizeProfileName) {
    if (sizeProfileName === "tiny") {
        return charCount <= 4 ? 0 : charCount <= 6 ? 1 : 2;
    }

    if (sizeProfileName === "compact") {
        return charCount <= 4 ? 0 : charCount <= 6 ? 1 : 2;
    }

    return charCount <= 4 ? 1 : charCount <= 6 ? 2 : 3;
}

function getRightPadding(charCount, sizeProfileName) {
    if (sizeProfileName === "tiny") {
        return charCount <= 4 ? 4 : charCount <= 6 ? 5 : 7;
    }

    if (sizeProfileName === "compact") {
        return charCount <= 4 ? 5 : charCount <= 6 ? 6 : 8;
    }

    return charCount <= 4 ? 7 : charCount <= 6 ? 8 : 10;
}