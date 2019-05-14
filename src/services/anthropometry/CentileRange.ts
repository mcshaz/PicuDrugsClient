import { AgeRange, termGestationWeeks, daysPerMonth } from './AgeRange/AgeRange';

import {binarySearch, searchComparison, ISearchResult} from './binarySearch';
import { LmsForGestAge } from './AgeRange/LmsForGestAge';
import { LmsForAgeWeeks } from './AgeRange/LmsForAgeWeeks';
import { LmsForAgeMonths } from './AgeRange/LmsForAgeMonths';
import { Lms } from './Lms';
import { linearInterpolate } from './linearInterpolate';

export const weeksPerMonth = daysPerMonth / 7;
export const maximumGestationalCorrection = 40;


export interface IMedianMatchResult {ageDays: number; matchType: searchComparison; gestation: number; }

export class CentileRange {
    private static linearInterpolateOnDelegate(delegate: (index: number) => number, bounds: ISearchResult, target: number) {
        if (bounds.lowerBound === bounds.upperBound) {
            return bounds.lowerBound as number;
        }
        return linearInterpolate([delegate(bounds.lowerBound!), bounds.lowerBound!],
                                 [delegate(bounds.upperBound!), bounds.upperBound!],
                                 target);
    }

    constructor(readonly gestAgeData: LmsForGestAge, readonly ageWeeksData: LmsForAgeWeeks, readonly ageMonthsData: LmsForAgeMonths) {
    }

    public lmsForAge(daysSinceBirth: number, weeksGestAtBirth: number = termGestationWeeks) {
        if (daysSinceBirth < 0) {
            throw new RangeError('daysOfAge:' + daysSinceBirth + ' must be >= 0');
        }
        weeksGestAtBirth = termGestationWeeks > maximumGestationalCorrection
            ? maximumGestationalCorrection
            : weeksGestAtBirth;
        const gestRangeMatch = this.gestAgeData.lookupAgeDays(daysSinceBirth, weeksGestAtBirth);
        switch (gestRangeMatch.matchResult) {
            case searchComparison.lessThanMin:
                throw new RangeError('totalWeeksGestAtBirth must be greater than gestAgeRange - check property prior to calling');
            case searchComparison.inRange:
                return gestRangeMatch.result as Lms;
        }
        const weeksRangeMatch = this.ageWeeksData.lookupAgeDays(daysSinceBirth, weeksGestAtBirth);
        switch (weeksRangeMatch.matchResult) {
            case searchComparison.lessThanMin:
                // age is in weeks so interpolation should be fine
                const gestLms = this.gestAgeData.maxLms();
                const weeksLms = this.ageWeeksData.minLms();
                const maxGestLookup = this.gestAgeData.maxAge;
                const fraction = (gestRangeMatch.lookupValue! - maxGestLookup) /
                                    (this.ageWeeksData.minAge - maxGestLookup + termGestationWeeks);
                return gestLms.linearInterpolate(weeksLms, fraction);
            case searchComparison.inRange:
                return weeksRangeMatch.result as Lms;
        }
        const monthsRangeMatch = this.ageMonthsData.lookupAgeDays(daysSinceBirth, weeksGestAtBirth);
        switch (monthsRangeMatch.matchResult) {
            case searchComparison.lessThanMin:
                // age is in weeks so interpolation should be fine
                const weeksLms = this.ageWeeksData.maxLms();
                const monthsMin = this.ageMonthsData.minAge;
                const monthsLms = this.ageMonthsData.minLms();
                const weeksMaxInMonths = this.ageWeeksData.maxAge * weeksPerMonth;
                const fraction = (monthsRangeMatch.lookupValue! - weeksMaxInMonths) / (monthsMin - weeksMaxInMonths);
                return weeksLms.linearInterpolate(monthsLms, fraction);
            case searchComparison.inRange:
                return monthsRangeMatch.result as Lms;
        }
        return this.ageMonthsData.maxLms();
    }
    public ageDaysForZ(z: number, param: number) {
        // making a negative a bit of a hack to make monotonically increasing
        return this.ageDaysFor(-z , (ages: AgeRange, indx: number) => -ages.lookup[indx].zFromParam(param));
    }

    public ageDaysForMedian(median: number): IMedianMatchResult {
        return this.ageDaysFor(median , (ages: AgeRange, indx: number) => ages.lookup[indx].m);
    }

    private ageDaysFor(target: number, getTarget: (ages: AgeRange, indx: number) => number) {
        let currentRange!: AgeRange;
        let currentDelegate!: (indx: number) => number;
        const setAndSearchRange = (ages: AgeRange) => {
            currentRange = ages;
            currentDelegate = getTarget.bind(this, currentRange);
            return binarySearch(currentDelegate,
                target, 0, currentRange.lookup.length - 1);
        };
        let hit = setAndSearchRange(this.gestAgeData);
        switch (hit.comparison) {
            case searchComparison.lessThanMin:
                return {
                    matchType: searchComparison.lessThanMin,
                    ageDays: 0,
                    gestation: currentRange.minAge,
                };
            case searchComparison.inRange:
                const interpol = currentRange.minAge + CentileRange.linearInterpolateOnDelegate(currentDelegate, hit, target);
                if (interpol <= termGestationWeeks) {
                    const exactWeeks = Math.floor(interpol);
                    return {
                        matchType: searchComparison.inRange,
                        ageDays: (interpol - exactWeeks) * 7,
                        gestation: exactWeeks,
                    };
                }
                return {
                    matchType: searchComparison.inRange,
                    ageDays: (interpol - termGestationWeeks) * 7,
                    gestation: termGestationWeeks,
                };
        }
        hit = setAndSearchRange(this.ageWeeksData);
        switch (hit.comparison) {
            case searchComparison.lessThanMin:
                return {
                    matchType: searchComparison.inRange,
                    ageDays: 7 * linearInterpolate([this.gestAgeData.maxLms().m, this.gestAgeData.maxAge - termGestationWeeks],
                                                   [this.ageWeeksData.minLms().m, this.ageWeeksData.minAge],
                                                   target),
                    gestation: termGestationWeeks,
                };
            case searchComparison.inRange:
                const interpol = currentRange.minAge + CentileRange.linearInterpolateOnDelegate(currentDelegate, hit, target);
                return {
                    matchType: searchComparison.inRange,
                    ageDays: interpol * 7,
                    gestation: termGestationWeeks,
                };
        }
        hit = setAndSearchRange(this.ageMonthsData);
        switch (hit.comparison) {
            case searchComparison.lessThanMin:
                return {
                    matchType: searchComparison.inRange,
                    ageDays: 7 * linearInterpolate([this.ageWeeksData.maxLms().m, this.ageWeeksData.maxAge],
                                                   [this.ageMonthsData.minLms().m, this.ageMonthsData.minAge * weeksPerMonth],
                                                   target),
                    gestation: termGestationWeeks,
                };
            case searchComparison.inRange:
                const interpol = currentRange.minAge + CentileRange.linearInterpolateOnDelegate(currentDelegate, hit, target);
                return {
                    matchType: searchComparison.inRange,
                    ageDays: interpol * daysPerMonth,
                    gestation: termGestationWeeks,
                };
        }
        return {
            matchType: searchComparison.greaterThanMax,
            ageDays: currentRange.maxAge * daysPerMonth,
            gestation: termGestationWeeks,
        };
    }
}
