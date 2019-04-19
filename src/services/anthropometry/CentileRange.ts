import { AgeRange, termGestationWeeks, daysPerMonth } from './AgeRange/AgeRange';

import {binarySearch, searchComparison, ISearchResult} from './binarySearch';
import { LmsForGestAge } from './AgeRange/LmsForGestAge';
import { LmsForAgeWeeks } from './AgeRange/LmsForAgeWeeks';
import { LmsForAgeMonths } from './AgeRange/LmsForAgeMonths';
import { Lms } from './Lms';
import { linearInterpolate } from './linearInterpolate';

export const weeksPerMonth = daysPerMonth / 7;
export const maximumGestationalCorrection = 42;


interface IMedianMatchResult {ageDays: number; matchType: searchComparison; gestation: number; }

export class CentileRange {
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
                const maxGestLookup = this.gestAgeData.maxLookup;
                const fraction = (gestRangeMatch.lookupValue! - maxGestLookup) /
                                    (this.ageWeeksData.minLookup - maxGestLookup + termGestationWeeks);
                return gestLms.linearInterpolate(weeksLms, fraction);
            case searchComparison.inRange:
                return weeksRangeMatch.result as Lms;
        }
        const monthsRangeMatch = this.ageMonthsData.lookupAgeDays(daysSinceBirth, weeksGestAtBirth);
        switch (monthsRangeMatch.matchResult) {
            case searchComparison.lessThanMin:
                // age is in weeks so interpolation should be fine
                const weeksLms = this.ageWeeksData.maxLms();
                const monthsMin = this.ageMonthsData.minLookup;
                const monthsLms = this.ageMonthsData.minLms();
                const weeksMaxInMonths = this.ageWeeksData.maxLookup * weeksPerMonth;
                const fraction = (monthsRangeMatch.lookupValue! - weeksMaxInMonths) / (monthsMin - weeksMaxInMonths);
                return weeksLms.linearInterpolate(monthsLms, fraction);
            case searchComparison.inRange:
                return monthsRangeMatch.result as Lms;
        }
        return this.ageMonthsData.maxLms();
    }
    public ageDaysForMedian(median: number): IMedianMatchResult {
        let currentRange: AgeRange = this.gestAgeData;
        const currentDelegate = (v: number) => currentRange.lookup[v].m;
        const search = () => binarySearch(currentDelegate,
                median, 0, currentRange.lookup.length - 1);
        let hit = search();
        switch (hit.comparison) {
            case searchComparison.lessThanMin:
                return {
                    matchType: searchComparison.lessThanMin,
                    ageDays: 0,
                    gestation: currentRange.minLookup,
                };
            case searchComparison.inRange:
                const interpol = currentRange.minLookup + this.linearInterpolateOnDelegate(currentDelegate, hit, median);
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
        currentRange = this.ageWeeksData;
        hit = search();
        switch (hit.comparison) {
            case searchComparison.lessThanMin:
                return {
                    matchType: searchComparison.inRange,
                    ageDays: 7 * linearInterpolate([this.gestAgeData.maxLms().m, this.gestAgeData.maxLookup - termGestationWeeks],
                                                   [this.ageWeeksData.minLms().m, this.ageWeeksData.minLookup],
                                                   median),
                    gestation: termGestationWeeks,
                };
            case searchComparison.inRange:
                const interpol = currentRange.minLookup + this.linearInterpolateOnDelegate(currentDelegate, hit, median);
                return {
                    matchType: searchComparison.inRange,
                    ageDays: interpol * 7,
                    gestation: termGestationWeeks,
                };
        }
        currentRange = this.ageMonthsData;
        hit = search();
        switch (hit.comparison) {
            case searchComparison.lessThanMin:
                return {
                    matchType: searchComparison.inRange,
                    ageDays: 7 * linearInterpolate([this.ageWeeksData.maxLms().m, this.ageWeeksData.maxLookup],
                                                   [this.ageMonthsData.minLms().m, this.ageMonthsData.minLookup * weeksPerMonth],
                                                   median),
                    gestation: termGestationWeeks,
                };
            case searchComparison.inRange:
                const interpol = currentRange.minLookup + this.linearInterpolateOnDelegate(currentDelegate, hit, median);
                return {
                    matchType: searchComparison.inRange,
                    ageDays: interpol * daysPerMonth,
                    gestation: termGestationWeeks,
                };
        }
        return {
            matchType: searchComparison.greaterThanMax,
            ageDays: currentRange.maxLookup * daysPerMonth,
            gestation: termGestationWeeks,
        };
    }

    private linearInterpolateOnDelegate(delegate: (index: number) => number, bounds: ISearchResult, target: number) {
        if (bounds.lowerBound === bounds.upperBound) {
            return bounds.lowerBound as number;
        }
        return linearInterpolate([delegate(bounds.lowerBound!), bounds.lowerBound!],
                                 [delegate(bounds.upperBound!), bounds.upperBound!],
                                 target);
    }
}