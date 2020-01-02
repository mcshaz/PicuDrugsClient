export const enum lengthMeasures { metres, feet }
export function pressureInAtm(altitude: number, measure: lengthMeasures) {
  if (measure === lengthMeasures.feet) {
    altitude *= 0.3048;
  }
  return Math.pow(1 - 2.25577e-5 * altitude, 5.25588);
}

export function equivalentFiO2(pressureAtmospheres: number) {
  return 0.938 / (pressureAtmospheres - 0.062);
}
