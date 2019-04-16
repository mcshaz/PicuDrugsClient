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

export abstract class AgeRange {
    public readonly minLookup: number;
    public readonly maxLookup: number;
    constructor(minAge: number, readonly lookup: ReadonlyArray<Lms>) {
        if (!Number.isInteger(minAge)) {
            throw new Error('min must be an integer');
        }
        if (minAge < 0) { throw new RangeError('min must be >=0'); }
        this.minLookup = minAge;
        this.maxLookup = minAge + lookup.length - 1;
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
        return this.lookup[0];
    }

    public maxLms() {
        return this.lookup[this.lookup.length - 1];
    }

    protected linearInterpolate(lookupValue: number) {
        const min = lookupValue - this.minLookup;
        if (Number.isInteger(min)) {
            return this.lookup[min];
        }
        const minInt = Math.floor(min);
        return this.lookup[minInt]
            .linearInterpolate(this.lookup[minInt + 1], min - minInt);
    }
}



