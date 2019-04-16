import { linearInterpolate } from '@/services/anthropometry';

const maxRecords: Array<[number, number]> = [[0, 10.8], [13, 55], [24, 94], [36, 101], [84, 222], [156, 250], [216, 314], [480, 635]];
const minRecords: Array<[number, number]> = [[0, 0.24], [216, 2.1], [240, 5.9], [864, 14.5]];
const maxAge = 122 * 12;

export function minWeightRecord(ageMonths?: number) {
    if (!ageMonths) {
        return minRecords[0][1];
    }
    return interpolWt(ageMonths, minRecords);
}

export function maxWeightRecord(ageMonths?: number) {
    if (!ageMonths) {
        return maxRecords[maxRecords.length - 1][1];
    }
    return interpolWt(ageMonths, maxRecords);
}

function interpolWt(ageMonths: number, weightList: Array<[number, number]>) {
    if (ageMonths < 0 || ageMonths > maxAge) {
        throw new RangeError('ageMonths must be 0-' + maxAge);
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
