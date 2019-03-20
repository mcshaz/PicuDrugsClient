import { Lms } from "./Lms";
import { searchComparison, binarySearch, searchResult } from "./binarySearch";
type integer = number;
const daysPerYear = 365.25;
export const daysPerMonth = daysPerYear / 12;
const weeksPerMonth = daysPerMonth / 7;
const termGestationWeeks = 40;
const ceaseCorrectingAtDaysOfAge = daysPerMonth * 24;
//const roundingFactor = 0.00001;
const maximumGestationalCorrection = 42;

export class GenderRange<T extends AgeRange> {
    readonly maleRange: T;
    readonly femaleRange: T
    constructor(maleOrUnisexRange: T, femaleRange?: T) {
        this.maleRange = maleOrUnisexRange;
        this.femaleRange = femaleRange || maleOrUnisexRange;
    };
    get(isMale:boolean){
        return isMale ? this.maleRange : this.femaleRange;
    }
}

interface rangeMatchResult {
    matchResult: searchComparison,
    value: number
}

export abstract class AgeRange {
    constructor(readonly min:integer, readonly max:integer) {
        if(!Number.isInteger(min) || !Number.isInteger(max)){
            throw new Error("min and max must both be integers")
        }
        if (min < 0) { throw new RangeError("min must be >=0"); }
        if (max < min) { throw new RangeError("max must be >= min"); }
    };
    protected isValueInRange(value: number): rangeMatchResult {
        if (value < this.min){
            return { matchResult: searchComparison.lessThanMin, value };
        }
        if (value > this.max){
            return { matchResult: searchComparison.greaterThanMax, value };
        }
        return { matchResult: searchComparison.inRange, value: value } ;
    }
    abstract isAgeInRange(ageDaysSinceBirth:integer, gestAgeWeeksAtBirth:integer): rangeMatchResult
}

export class GestAgeWeeksRange extends AgeRange{
    isAgeInRange(ageDaysSinceBirth:integer, gestAgeWeeksAtBirth:integer){
        return this.isValueInRange(gestAgeWeeksAtBirth + ageDaysSinceBirth / 7);
    }
}

export class AgeWeeksSinceTermRange extends AgeRange{
    constructor(min:integer, max:integer){
        if (max > ceaseCorrectingAtDaysOfAge / 7){
            throw new Error("This class does not yet account for cease correcting for gest age - change code to account")
        }
        super(min,max);
    }
    isAgeInRange(ageDaysSinceBirth:integer, gestAgeWeeksAtBirth:integer){
        return this.isValueInRange(ageDaysSinceBirth / 7 - (termGestationWeeks - gestAgeWeeksAtBirth));
    }
}

export class AgeMonthsSinceTerm extends AgeRange{
    isAgeInRange(ageDaysSinceBirth:integer, gestAgeWeeksAtBirth:integer){
        const ageDaysSinceTerm = ageDaysSinceBirth > ceaseCorrectingAtDaysOfAge 
            ? ageDaysSinceBirth 
            : ageDaysSinceBirth - 7 * (termGestationWeeks - gestAgeWeeksAtBirth);
        return this.isValueInRange(ageDaysSinceTerm / daysPerMonth); 
    }
}

interface centileArgs {
    gestAgeRange?: GenderRange<GestAgeWeeksRange>,
    ageWeeksRange?: GenderRange<AgeWeeksSinceTermRange>,
    ageMonthsRange?: GenderRange<AgeMonthsSinceTerm>
}

interface medianMatchResult{ageDays:number, matchType: searchComparison, gestation:number}

export abstract class CentileCollection {
    readonly gestAgeRange: GenderRange<GestAgeWeeksRange>;
    readonly ageWeeksRange: GenderRange<AgeWeeksSinceTermRange>;
    readonly ageMonthsRange: GenderRange<AgeMonthsSinceTerm>;
    abstract lMSForGestAge(lookupGestAgeWeeks: integer, isMale: boolean):Lms;
    abstract lMSForAgeWeeks(lookupAgeWeeksPostBirth: integer, isMale: boolean):Lms;
    abstract lMSForAgeMonths(lookupAgeMonthsPostBirth: integer, isMale: boolean):Lms;
    constructor(argObj?: centileArgs) {
        argObj = argObj || {};
        this.gestAgeRange = argObj.gestAgeRange || new GenderRange(new GestAgeWeeksRange(23, 43));
        this.ageWeeksRange = argObj.ageWeeksRange || new GenderRange(new AgeWeeksSinceTermRange(4, 13));
        this.ageMonthsRange = argObj.ageMonthsRange || new GenderRange(new AgeMonthsSinceTerm(3, 240));
    }

    cumSnormForAge(measure:number, daysOfAge:number, isMale:boolean, totalWeeksGestAtBirth:number = termGestationWeeks) {
        return this.lMSForAge(daysOfAge, isMale, totalWeeksGestAtBirth).cumSnormfromParam(measure);
    };

    zForAge(measure:number, daysOfAge:number, isMale:boolean, totalWeeksGestAtBirth:number = termGestationWeeks) {
        return this.lMSForAge(daysOfAge, isMale, totalWeeksGestAtBirth).zFromParam(measure);
    };

    private linearInterpolateOnDelegate(delegate:(index:number)=>number, bounds:searchResult, target:number){
        const min = delegate(bounds.lowerBound);
        if (bounds.lowerBound === bounds.upperBound){
            return min;
        }
        const max = delegate(bounds.upperBound);
        const fraction = (target-min)/(max-min);
        return bounds.lowerBound + fraction;//should be fraction * (bounds.upperBound - bounds.lowerBound), but this always equals 1
    }

    ageDaysForMedian(median: number, isMale:boolean):medianMatchResult{
        let currentAgeRange = this.gestAgeRange.get(isMale);
        let currentDelegate = (v:number)=>this.lMSForGestAge(v,isMale).m
        let currentHit = binarySearch(currentDelegate,
                median,currentAgeRange.min,currentAgeRange.max);
        switch (currentHit.comparison){
            case searchComparison.lessThanMin:
                return {
                    matchType: searchComparison.lessThanMin,
                    ageDays: 0,
                    gestation:currentAgeRange.min
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
        currentAgeRange = this.ageWeeksRange.get(isMale);
        currentDelegate = (v:number)=>this.lMSForAgeWeeks(v,isMale).m
        currentHit = binarySearch(currentDelegate,
                median,currentAgeRange.min,currentAgeRange.max);
        switch (currentHit.comparison){
            case searchComparison.lessThanMin:
                const max = currentDelegate(currentAgeRange.min);
                let minWeeks = this.gestAgeRange.get(isMale).max
                const min = this.lMSForGestAge(minWeeks,isMale).m;
                minWeeks -= termGestationWeeks
                const fraction = (median-min)/(max - min);
                return {
                    matchType: searchComparison.inRange,
                    ageDays: (minWeeks + fraction * (currentAgeRange.min - minWeeks)) * 7,
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
        currentAgeRange = this.ageMonthsRange.get(isMale);
        currentDelegate = (v:number)=>this.lMSForAgeMonths(v,isMale).m
        currentHit = binarySearch(currentDelegate,
                median,currentAgeRange.min,currentAgeRange.max);
        switch (currentHit.comparison){
            case searchComparison.lessThanMin:
                const max = currentDelegate(currentAgeRange.min);
                const minWeeks = this.ageWeeksRange.get(isMale).max;
                const min = this.lMSForAgeWeeks(minWeeks,isMale).m;
                const fraction = (median-min)/(max - min);
                const maxWeeks = currentAgeRange.min * weeksPerMonth;
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
            ageDays: currentAgeRange.max * daysPerMonth,
            gestation: termGestationWeeks
        };
    }

    ///this currently assumes going up in intervals of 1 - logic breaks down otherwise
    private static interpolate(age:number, isMale:boolean, lookup:(lookupAge:integer, isMale:boolean)=>Lms){
        if (Number.isInteger(age)){
            return lookup(age, isMale);
        }
        const lower = Math.floor(age);
        return lookup(lower, isMale)
            .linearInterpolate(lookup(lower+1, isMale), age - lower);
    }

    lMSForAge(daysSinceBirth: number, isMale: boolean, weeksGestAtBirth: number = termGestationWeeks) {
        if (daysSinceBirth < 0) {
            throw new RangeError("daysOfAge:" + daysSinceBirth + " must be >= 0");
        }
        weeksGestAtBirth = termGestationWeeks > maximumGestationalCorrection 
            ? maximumGestationalCorrection 
            : weeksGestAtBirth;
        let gestRangeMatch = this.gestAgeRange.get(isMale).isAgeInRange(daysSinceBirth,weeksGestAtBirth);
        switch (gestRangeMatch.matchResult){
            case searchComparison.lessThanMin:
                throw new RangeError("totalWeeksGestAtBirth must be greater than gestAgeRange - check property prior to calling");
            case searchComparison.inRange:
                return CentileCollection.interpolate(gestRangeMatch.value, isMale, this.lMSForGestAge);
        }
        let weeksRangeMatch = this.ageWeeksRange.get(isMale).isAgeInRange(daysSinceBirth, weeksGestAtBirth);
        switch (weeksRangeMatch.matchResult){
            case searchComparison.lessThanMin:
                //age is in weeks so interpolation should be fine
                const gestMax = this.gestAgeRange.get(isMale).max;
                const gestLms = this.lMSForGestAge(gestMax,isMale);
                const weeksLms = this.lMSForAgeWeeks(this.ageWeeksRange.get(isMale).min, isMale);
                return gestLms.linearInterpolate(weeksLms,gestRangeMatch.value - gestMax);
            case searchComparison.inRange:
                return CentileCollection.interpolate(weeksRangeMatch.value, isMale, this.lMSForAgeWeeks);
        }

        let monthsRangeMatch = this.ageMonthsRange.get(isMale).isAgeInRange(daysSinceBirth, weeksGestAtBirth);
        switch (monthsRangeMatch.matchResult){
            case searchComparison.lessThanMin:
                //age is in weeks so interpolation should be fine
                let weeksMax = this.ageWeeksRange.get(isMale).max;
                const weeksLms = this.lMSForAgeWeeks(weeksMax,isMale);
                const monthsMin = this.ageMonthsRange.get(isMale).min;
                const monthsLms = this.lMSForAgeMonths(monthsMin, isMale);
                weeksMax *= 4;
                return weeksLms.linearInterpolate(monthsLms,(monthsRangeMatch.value - weeksMax)/(monthsMin - weeksMax));
            case searchComparison.inRange:
                return CentileCollection.interpolate(monthsRangeMatch.value, isMale, this.lMSForAgeMonths);
        }
        return this.lMSForAgeMonths(this.ageMonthsRange.get(isMale).max,isMale);
    };
}