import { UKWeightData } from '../UkWeightData';
import { UKLengthData } from '../UKLengthData';
import { searchComparison } from '../binarySearch';
import { UKBMIData } from '../UKBMIData';

export function mcLarenObesityCorrection(
        heightCm: number, isMale: boolean,
        heightData: UKLengthData = new UKLengthData(),
        wtData: UKWeightData = new UKWeightData()) {
    const genderHeightData = isMale ? heightData.maleRange : heightData.femaleRange;
    const genderWtData = isMale ? wtData.maleRange : wtData.femaleRange;
    const match = genderHeightData.ageDaysForMedian(heightCm);
    switch (match.matchType) {
        case searchComparison.greaterThanMax:
            return genderWtData.ageMonthsData.maxLms().m;
        case searchComparison.inRange:
            return genderWtData.lmsForAge(match.ageDays!).m;
        default:
            return NaN; // throw new Error('weight less than smallest median!');
    }
}

export function mooreObesityCorrection(
        heightCm: number, ageDays: number,
        isMale: boolean, heightData: UKLengthData = new UKLengthData(),
        wtData: UKWeightData = new UKWeightData()) {
    const genderHeightData = isMale ? heightData.maleRange : heightData.femaleRange;
    const genderWtData = isMale ? wtData.maleRange : wtData.femaleRange;
    const htZForAge = genderHeightData.lmsForAge(ageDays).zFromParam(heightCm);
    return genderWtData.lmsForAge(ageDays).paramFromZ(htZForAge);
}

export function bmiObesityCorrection(
        heightCm: number, ageDays: number,
        isMale: boolean, bmiData: UKBMIData = new UKBMIData()) {
    const medianBmi = (isMale ? bmiData.maleRange : bmiData.femaleRange).lmsForAge(ageDays).m;
    return medianBmi * Math.pow(heightCm / 100, 2);
}
