import { Lms } from "./Lms";
import {searchComparison} from './binarySearch'

export type integer = number;
export const termGestationWeeks = 40;
export const daysPerYear = 365.25;
export const daysPerMonth = daysPerYear / 12;
export const ceaseCorrectingAtDaysOfAge = daysPerMonth * 24;

export interface rangeMatchResult {
    matchResult: searchComparison,
    lookupValue?: number
    result?: Lms
}

export interface lookupRange {min:number, max:number}

export abstract class AgeRange {
    readonly minLookup:number;
    readonly maxLookup:number;
    constructor(range:lookupRange, readonly lookupAge:(age:number)=>Lms) {
        if(!Number.isInteger(range.min) || !Number.isInteger(range.max)){
            throw new Error("min and max must both be integers")
        }
        if (range.min < 0) { throw new RangeError("min must be >=0"); }
        if (range.max < range.min) { throw new RangeError("max must be >= min"); }
        this.minLookup = range.min;
        this.maxLookup = range.max;
    };

    isValueInRange(value: number): rangeMatchResult {
        if (value < this.minLookup){
            return { matchResult: searchComparison.lessThanMin, lookupValue: value };
        }
        if (value > this.maxLookup){
            return { matchResult: searchComparison.greaterThanMax, lookupValue: value };
        }
        return { matchResult: searchComparison.inRange, result: this.linearInterpolate(value) } ;
    }

    protected linearInterpolate(lookupValue:number){
        if (Number.isInteger(lookupValue)){
            return this.lookupAge(lookupValue);
        }
        const lower = Math.floor(lookupValue);
        return this.lookupAge(lower)
            .linearInterpolate(this.lookupAge(lower+1), lookupValue - lower);
    }

    abstract lookupAgeDays(ageDaysSinceBirth:integer, gestAgeWeeksAtBirth:integer): rangeMatchResult

    minLms(){
        return this.lookupAge(this.minLookup);
    }

    maxLms(){
        return this.lookupAge(this.maxLookup);
    }
}

export class LmsForGestAge extends AgeRange{
    constructor(ageRange:lookupRange, readonly lmsForGestAge:(lookupGestAgeWeeks: integer)=>Lms){
        super(ageRange, lmsForGestAge);
    }
    lookupAgeDays(ageDaysSinceBirth:integer, gestAgeWeeksAtBirth:integer){
        return this.isValueInRange(gestAgeWeeksAtBirth + ageDaysSinceBirth / 7);
    }
}

export class LmsForAgeWeeks extends AgeRange{
    constructor(ageRange:lookupRange, readonly lmsForAgeWeeks:(lookupAgeWeeksPostBirth: integer)=>Lms){
        super (ageRange, lmsForAgeWeeks);
        if (ageRange.max > ceaseCorrectingAtDaysOfAge / 7){
            throw new Error("This class does not yet account for cease correcting for gest age - change code to account")
        }
    }
    lookupAgeDays(ageDaysSinceBirth:integer, gestAgeWeeksAtBirth:integer){
        return this.isValueInRange(ageDaysSinceBirth / 7 - (termGestationWeeks - gestAgeWeeksAtBirth));
    }
}

export class LmsForAgeMonths extends AgeRange{
    constructor(ageRange:lookupRange, readonly LmsForAgeMonths:(lookupAgeMonthsPostBirth: integer)=>Lms){
        super (ageRange,LmsForAgeMonths);
    }
    lookupAgeDays(ageDaysSinceBirth:integer, gestAgeWeeksAtBirth:integer){
        const ageDaysSinceTerm = ageDaysSinceBirth > ceaseCorrectingAtDaysOfAge 
            ? ageDaysSinceBirth 
            : ageDaysSinceBirth - 7 * (termGestationWeeks - gestAgeWeeksAtBirth);
        return this.isValueInRange(ageDaysSinceTerm / daysPerMonth); 
    }
}
