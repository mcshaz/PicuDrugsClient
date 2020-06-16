import { linearInterpolate } from '@/services/anthropometry';
import { maxYears } from '@/services/validation/validators';

const maxRecords: Array<[number, number]> = [[0, 10.8], [13, 55], [24, 94], [36, 101], [84, 222], [156, 250], [216, 314], [480, 635]];
const minRecords: Array<[number, number]> = [[0, 0.25], [216, 2.1], [240, 5.9], [864, 14.5]];
const maxAge = maxYears * 12;

export const exampleWeights: ReadonlyArray<number> = [2.5, 3, 3.5, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80];

export function minWeightRecord(ageMonths?: number) {
  if (!ageMonths) {
    return minRecords[0][1];
  }
  return Number(interpolWt(ageMonths, minRecords).toPrecision(2));
}

export function maxWeightRecord(ageMonths?: number) {
  if (!ageMonths) {
    return maxRecords[maxRecords.length - 1][1];
  }
  return Number(interpolWt(ageMonths, maxRecords).toPrecision(2));
}

function interpolWt(ageMonths: number, weightList: Array<[number, number]>) {
  if (ageMonths < 0 || ageMonths > maxAge) {
    throw new RangeError(`ageMonths must be 0-${maxAge} (actual-value:${ageMonths})`);
  }
  let cur: [number, number];
  for (let i = 0; i < weightList.length; i++) {
    cur = weightList[i];
    if (cur[0] === ageMonths) {
      return cur[1];
    }
    if (cur[0] > ageMonths) {
      const prev = weightList[i - 1];
      return linearInterpolate(prev, cur, ageMonths);
    }
  }
  return cur![1];
}
