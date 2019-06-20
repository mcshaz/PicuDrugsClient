export function roundToFixed(value: number, decimals: number = 1): number {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier + Number.EPSILON) / multiplier;
}

export function roundToNearest(value: number, nearest: number): number {
    return Math.round(value / nearest) * nearest;
}
