function clipNumber(number, min, max) {
    return Math.min(Math.max(number, min), max);
}

function roundNumber(number, decimalPlaces = 0) {
    if (isNaN(number) || isNaN(decimalPlaces)) {
        return NaN; // Return NaN if either argument is not a valid number
    }

    const multiplier = Math.pow(10, decimalPlaces);
    return Math.round(number * multiplier) / multiplier;
}

export { clipNumber, roundNumber };