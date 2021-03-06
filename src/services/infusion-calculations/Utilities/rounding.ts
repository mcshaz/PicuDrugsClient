export function roundToFixed(value: number, decimals = 1): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier + Number.EPSILON) / multiplier;
}

export function roundToNearest(value: number, nearest: number): number {
  const inverse = 1 / nearest; // it would make sense to use (Math.round(value/nearest) * value) however, base 2 to base 10 conversion will result in occassional  x.x000000000000002
  return Math.round(value * inverse + Number.EPSILON) / inverse;
}

export function roundToPrecision(value: number, precision: number) {
  const figures = Math.floor(Math.log10(value)) - precision + 1;
  return roundToFixed(value, -figures);
}

export function syringeRounding(ml: number) {
  if (ml <= 1) {
    return roundToFixed(ml, 2);
  }
  if (ml <= 3) {
    return roundToNearest(ml, 0.05);
  }
  if (ml <= 10) {
    return roundToNearest(ml, 0.2);
  }
  return Math.round(ml);
}

export function weightRounding(wtKg: number) {
  if (wtKg < 20) {
    return roundToFixed(wtKg, 1);
  }
  return Math.round(wtKg);
}
