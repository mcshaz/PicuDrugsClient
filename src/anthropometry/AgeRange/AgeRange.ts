import { Lms } from '../Lms';
import {searchComparison} from '../binarySearch';

export type integer = number;
export const termGestationWeeks = 40;
export const daysPerYear = 365.25;
export const daysPerMonth = daysPerYear / 12;
export const ceaseCorrectingAtDaysOfAge = daysPerMonth * 24;

export interface IRangeMatchResult {
    matchResult: searchComparison;
    lookupValue?: number;
    result?: Lms;
}

export interface ILookupRange {min: number; max: number; }

export abstract class AgeRange {

    public readonly minLookup: number;
    public readonly maxLookup: number;
    constructor(range: ILookupRange, readonly lookupAge: (age: number) => Lms) {
        if (!Number.isInteger(range.min) || !Number.isInteger(range.max)) {
            throw new Error('min and max must both be integers');
        }
        if (range.min < 0) { throw new RangeError('min must be >=0'); }
        if (range.max < range.min) { throw new RangeError('max must be >= min'); }
        this.minLookup = range.min;
        this.maxLookup = range.max;
    }
    public isValueInRange(value: number): IRangeMatchResult {
        if (value < this.minLookup) {
            return { matchResult: searchComparison.lessThanMin, lookupValue: value };
        }
        if (value > this.maxLookup) {
            return { matchResult: searchComparison.greaterThanMax, lookupValue: value };
        }
        return { matchResult: searchComparison.inRange, result: this.linearInterpolate(value) } ;
    }

    public abstract lookupAgeDays(ageDaysSinceBirth: integer, gestAgeWeeksAtBirth: integer): IRangeMatchResult;

    public minLms() {
        return this.lookupAge(this.minLookup);
    }

    public maxLms() {
        return this.lookupAge(this.maxLookup);
    }

    protected linearInterpolate(lookupValue: number) {
        if (Number.isInteger(lookupValue)) {
            return this.lookupAge(lookupValue);
        }
        const lower = Math.floor(lookupValue);
        return this.lookupAge(lower)
            .linearInterpolate(this.lookupAge(lower + 1), lookupValue - lower);
    }
}



