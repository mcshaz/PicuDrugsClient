import { LmsForGestAge, LmsForAgeWeeks, LmsForAgeMonths, AgeRange, termGestationWeeks, daysPerMonth } from "./AgeRange";

import {binarySearch, searchComparison,searchResult} from './binarySearch'

export const weeksPerMonth = daysPerMonth / 7;
export const maximumGestationalCorrection = 42;


interface medianMatchResult{ageDays:number, matchType: searchComparison, gestation:number}

export class CentileRange{
    constructor(readonly gestAgeData:LmsForGestAge, readonly ageWeeksData:LmsForAgeWeeks, readonly ageMonthsData:LmsForAgeMonths){
    }

    lmsForAge(daysSinceBirth: number, weeksGestAtBirth: number = termGestationWeeks) {
        if (daysSinceBirth < 0) {
            throw new RangeError("daysOfAge:" + daysSinceBirth + " must be >= 0");
        }
        weeksGestAtBirth = termGestationWeeks > maximumGestationalCorrection 
            ? maximumGestationalCorrection 
            : weeksGestAtBirth;
        let gestRangeMatch = this.gestAgeData.lookupAgeDays(daysSinceBirth,weeksGestAtBirth);
        switch (gestRangeMatch.matchResult){
            case searchComparison.lessThanMin:
                throw new RangeError("totalWeeksGestAtBirth must be greater than gestAgeRange - check property prior to calling");
            case searchComparison.inRange:
                return gestRangeMatch.result;
        }
        let weeksRangeMatch = this.ageWeeksData.lookupAgeDays(daysSinceBirth, weeksGestAtBirth);
        switch (weeksRangeMatch.matchResult){
            case searchComparison.lessThanMin:
                //age is in weeks so interpolation should be fine
                const gestLms = this.gestAgeData.maxLms();
                const weeksLms = this.ageWeeksData.minLms();
                const maxGestLookup = this.gestAgeData.maxLookup
                const fraction = (gestRangeMatch.lookupValue - maxGestLookup)/
                                    (this.ageWeeksData.minLookup - maxGestLookup + termGestationWeeks);
                return gestLms.linearInterpolate(weeksLms,fraction);
            case searchComparison.inRange:
                return weeksRangeMatch.result;
        }
        let monthsRangeMatch = this.ageMonthsData.lookupAgeDays(daysSinceBirth, weeksGestAtBirth);
        switch (monthsRangeMatch.matchResult){
            case searchComparison.lessThanMin:
                //age is in weeks so interpolation should be fine
                const weeksLms = this.ageWeeksData.maxLms();
                const monthsMin = this.ageMonthsData.minLookup;
                const monthsLms = this.ageMonthsData.minLms();
                const weeksMaxInMonths = this.ageWeeksData.maxLookup * weeksPerMonth;
                const fraction = (monthsRangeMatch.lookupValue - weeksMaxInMonths)/(monthsMin - weeksMaxInMonths);
                return weeksLms.linearInterpolate(monthsLms,fraction);
            case searchComparison.inRange:
                return monthsRangeMatch.result;
        }
        return this.ageMonthsData.maxLms();
    };

    private linearInterpolateOnDelegate(delegate:(index:number)=>number, bounds:searchResult, target:number){
        if (bounds.lowerBound === bounds.upperBound){
            return bounds.lowerBound;
        }
        const min = delegate(bounds.lowerBound);
        const max = delegate(bounds.upperBound);
        const fraction = (target-min)/(max-min);
        return bounds.lowerBound + fraction;//should be fraction / (bounds.upperBound - bounds.lowerBound), but this always equals 1
    }

    ageDaysForMedian(median: number):medianMatchResult{
        let currentRange:AgeRange = this.gestAgeData;
        const currentDelegate = (v:number)=>currentRange.lookupAge(v).m;
        let currentHit = binarySearch(currentDelegate,
                median,currentRange.minLookup,currentRange.maxLookup);
        switch (currentHit.comparison){
            case searchComparison.lessThanMin:
                return {
                    matchType: searchComparison.lessThanMin,
                    ageDays: 0,
                    gestation:currentRange.minLookup
                };
            case searchComparison.inRange:
                const interpol = this.linearInterpolateOnDelegate(currentDelegate,currentHit, median)
                if (interpol <= termGestationWeeks){
                    const exactWeeks = Math.floor(interpol);
                    return {
                        matchType: searchComparison.inRange,
                        ageDays: (interpol - exactWeeks)*7,
                        gestation: exactWeeks
                    };
                }
                return {
                    matchType: searchComparison.inRange,
                    ageDays: (interpol - termGestationWeeks)*7,
                    gestation: termGestationWeeks
                };
        }      
        currentRange = this.ageWeeksData;
        currentHit = binarySearch(currentDelegate,
                median,currentRange.minLookup,currentRange.maxLookup);
        switch (currentHit.comparison){
            case searchComparison.lessThanMin:
                const maxMedian = this.ageWeeksData.minLms().m;
                const minMedian = this.gestAgeData.maxLms().m;
                const fraction = (median-minMedian)/(maxMedian - minMedian);
                let minWeeks = this.gestAgeData.maxLookup - termGestationWeeks;
                return {
                    matchType: searchComparison.inRange,
                    ageDays: (minWeeks + fraction * (currentRange.minLookup - minWeeks)) * 7,
                    gestation:termGestationWeeks
                };
            case searchComparison.inRange:
                let interpol = this.linearInterpolateOnDelegate(currentDelegate,currentHit, median)
                return {
                    matchType: searchComparison.inRange,
                    ageDays: interpol*7,
                    gestation: termGestationWeeks
                };
        }      
        currentRange = this.ageMonthsData;
        currentHit = binarySearch(currentDelegate,
                median,currentRange.minLookup,currentRange.maxLookup);
        switch (currentHit.comparison){
            case searchComparison.lessThanMin:
                const maxMedian = this.ageMonthsData.minLms().m;
                const minMedian = this.ageWeeksData.maxLms().m;
                const fraction = (median-minMedian)/(maxMedian - minMedian);
                const minWeeks = this.ageWeeksData.maxLookup;
                const maxWeeks = this.ageMonthsData.minLookup* weeksPerMonth;
                return {
                    matchType: searchComparison.inRange,
                    ageDays: (minWeeks + fraction * (maxWeeks - minWeeks)) * 7,
                    gestation:termGestationWeeks
                };
            case searchComparison.inRange:
                let interpol = this.linearInterpolateOnDelegate(currentDelegate,currentHit, median)
                return {
                    matchType: searchComparison.inRange,
                    ageDays: interpol*daysPerMonth,
                    gestation: termGestationWeeks
                };
        }
        return {
            matchType: searchComparison.greaterThanMax,
            ageDays: currentRange.maxLookup * daysPerMonth,
            gestation: termGestationWeeks
        };
    }
}