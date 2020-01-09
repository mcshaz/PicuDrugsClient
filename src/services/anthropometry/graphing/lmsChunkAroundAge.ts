import { CentileRange, weeksPerMonth } from '../CentileRange';
import { searchComparison } from '../binarySearch';
import { Lms } from '../Lms';
import { LmsForAgeMonths } from '../AgeRange/LmsForAgeMonths';
import { LmsForAgeWeeks } from '../AgeRange/LmsForAgeWeeks';
import { daysPerMonth } from '../AgeRange/AgeRange';

export enum ageUnits { weeksOfAge, monthsOfAge }

interface IChartData {
    units: ageUnits;
    data: Array<[number, Lms]>;
}

enum fixedChartBoundaries { gest, zeroTo52Weeks, twelveTo60Months, fiveToTenYears, tenYearsPlus }

export function lmsChunkAroundAge(agesInDays: number[],
  gestAgeWeeks: number,
  centiles: CentileRange): IChartData | null {
// rules will be:
// if single value, as per centile charts
// if min age in weeks, go 1 gest week prior, otherwise go 1 month prior
  let chartBounds = Array.from(getFixedChartBoundaries(agesInDays, gestAgeWeeks, centiles)).sort();
  switch (chartBounds.length) {
    case 0:
      return null;
    case 1:
      return getMOHDefaultChart(chartBounds[0], centiles);
    default:
      chartBounds = [chartBounds[0], chartBounds[chartBounds.length - 1]];
      const minAgeDays = Math.min(...agesInDays);
      const maxAgeMonths = Math.ceil(centiles.ageMonthsData.toAgeUnits(Math.max(...agesInDays), gestAgeWeeks));
      if (chartBounds[0] <= fixedChartBoundaries.zeroTo52Weeks) {
        const minWeeks = Math.floor(gestAgeWeeks - 40 + minAgeDays / 7);
        const units = chartBounds[1] <= fixedChartBoundaries.zeroTo52Weeks
          ? ageUnits.weeksOfAge
          : ageUnits.monthsOfAge;
        return mergeGestAgeToSubsequent(centiles, minWeeks, maxAgeMonths);
      }
      const startMonth = Math.floor(centiles.ageMonthsData.toAgeUnits(minAgeDays, gestAgeWeeks));
      return {
        units: ageUnits.monthsOfAge,
        data: sliceAndMapAges(centiles.ageMonthsData, startMonth, maxAgeMonths),
      };
  }
}

function getMOHDefaultChart(boundary: fixedChartBoundaries, centiles: CentileRange): IChartData | null {
  switch (boundary) {
    case fixedChartBoundaries.gest:
      const startGest = centiles.gestAgeData.minAge - 40;
      return {
        units: ageUnits.weeksOfAge,
        data: centiles.gestAgeData.lookup.map((lms, indx) => [(indx + startGest) * 7, lms]),
      };
    case fixedChartBoundaries.zeroTo52Weeks:
      return mergeGestAgeToSubsequent(centiles, ageUnits.weeksOfAge);
    case fixedChartBoundaries.twelveTo60Months:
      return {
        units: ageUnits.monthsOfAge,
        data: sliceAndMapAges(centiles.ageMonthsData, 12, 60),
      };
    case fixedChartBoundaries.fiveToTenYears:
      return {
        units: ageUnits.monthsOfAge,
        data: sliceAndMapAges(centiles.ageMonthsData, 60, 120),
      };
    case fixedChartBoundaries.tenYearsPlus:
      return {
        units: ageUnits.monthsOfAge,
        data: sliceAndMapAges(centiles.ageMonthsData, 120),
      };
    default:
      return null;
  }
}

function mergeGestAgeToSubsequent(centiles: CentileRange, startWeeks = 0, finishMonths = 12) {
  const sliceStartIndx = 40 - centiles.gestAgeData.maxAge - 1 + startWeeks;
  let data: Lms[];
  let start: number;
  if (sliceStartIndx < 0) {
    data = centiles.gestAgeData.lookup.slice(sliceStartIndx);
    start = -data.length - sliceStartIndx;
  } else {
    data = [];
    start = 0;
  }
  const returnWeeks = {
    units: ageUnits.weeksOfAge,
    data: data.map((lms) => [start++ * 7, lms]),
  } as IChartData;
  returnWeeks.data = returnWeeks.data.concat(sliceAndMapAges(centiles.ageWeeksData, start, 52, ageUnits.weeksOfAge),
    sliceAndMapAges(centiles.ageMonthsData, 0, finishMonths, ageUnits.monthsOfAge));
  return returnWeeks;
}

function getFixedChartBoundaries(agesInDays: number[],
  gestAgeWeeks: number,
  centiles: CentileRange): Set<fixedChartBoundaries> {
  // note for big stata sets iterating every member will not be the most efficient, but it is currently a quick and easy way to
  // get the min and maximum without having to iterate only if the value was not in range
  const returnVar = new Set<fixedChartBoundaries>();
  for (const ageInDays of agesInDays) {
    if (gestAgeWeeks < 37 && (ageInDays / 7 + gestAgeWeeks) < 40) {
      const gestRange = centiles.gestAgeData.isAgeIncluded(ageInDays, gestAgeWeeks);
      if (gestRange !== searchComparison.lessThanMin) {
        returnVar.add(fixedChartBoundaries.gest);
      }
    } else {
      const monthsAge = Math.floor(centiles.ageMonthsData.toAgeUnits(ageInDays, gestAgeWeeks));
      if (monthsAge <= centiles.ageMonthsData.maxAge) {
        if (monthsAge < 12) { // weeks of age, starting 0 weeks to 12 months
          returnVar.add(fixedChartBoundaries.zeroTo52Weeks);
        } else if (monthsAge < 60) {
          returnVar.add(fixedChartBoundaries.twelveTo60Months);
        } else if (monthsAge < 120) {
          returnVar.add(fixedChartBoundaries.fiveToTenYears);
        } else {
          returnVar.add(fixedChartBoundaries.tenYearsPlus);
        }
      }
    }
  }
  return returnVar;
}

// in the units ie age in weeks or months
function sliceAndMapAges(centiles: LmsForAgeMonths | LmsForAgeWeeks, starting: number, ending?: number, units = ageUnits.monthsOfAge): Array<[number, Lms]> {
  let startSlice: number;
  let startIndx: number;
  if (starting <= centiles.minAge) {
    startSlice = 0;
    startIndx = centiles.minAge;
  } else {
    startSlice = starting - centiles.minAge;
    startIndx = starting;
  }
  let sliced: Lms[];
  if (ending === void 0) {
    sliced = centiles.lookup.slice(startSlice);
  } else {
    sliced = centiles.lookup.slice(startSlice, ending - centiles.minAge + 1);
  }
  const conversion = units === ageUnits.weeksOfAge ? 7 : daysPerMonth;
  return sliced.map((lms, indx) => [(startIndx + indx) * conversion, lms]);
}
