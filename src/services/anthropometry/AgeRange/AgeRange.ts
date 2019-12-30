import { Lms } from '../Lms'
import { searchComparison } from '../binarySearch'

export type integer = number;
export const termGestationWeeks = 40
export const daysPerYear = 365.25
export const daysPerMonth = daysPerYear / 12
export const ceaseCorrectingAtDaysOfAge = daysPerMonth * 24

export interface IRangeMatchResult {
    matchResult: searchComparison;
    lookupValue?: number;
    result?: Lms;
}

export abstract class AgeRange {
    public readonly minAge: number;
    public readonly maxAge: number;
    constructor (minAge: number, readonly lookup: ReadonlyArray<Lms>) {
      if (!Number.isInteger(minAge)) {
        throw new Error('min must be an integer')
      }
      if (minAge < 0) { throw new RangeError('min must be >=0') }
      this.minAge = minAge
      this.maxAge = minAge + lookup.length - 1
    }
    public abstract toAgeUnits(ageDaysSinceBirth: integer, gestAgeWeeksAtBirth: integer): number;
    public lookupAgeDays (ageDaysSinceBirth: integer, gestAgeWeeksAtBirth: integer) {
      const ageUnits = this.toAgeUnits(ageDaysSinceBirth, gestAgeWeeksAtBirth)
      return this.findStats(ageUnits)
    }
    public isAgeIncluded (ageDaysSinceBirth: integer, gestAgeWeeksAtBirth: integer) {
      const ageUnits = this.toAgeUnits(ageDaysSinceBirth, gestAgeWeeksAtBirth)
      return this.isValueInRange(ageUnits)
    }

    public minLms () {
      return this.lookup[0]
    }

    public maxLms () {
      return this.lookup[this.lookup.length - 1]
    }
    protected findStats (value: number): IRangeMatchResult {
      const returnVar = { matchResult: this.isValueInRange(value) } as IRangeMatchResult
      if (returnVar.matchResult === searchComparison.inRange) {
        returnVar.result = this.findAndlinearInterpolate(value)
      } else {
        returnVar.lookupValue = value
      }
      return returnVar
    }
    protected isValueInRange (value: number): searchComparison {
      if (value < this.minAge) {
        return searchComparison.lessThanMin
      }
      if (value > this.maxAge) {
        return searchComparison.greaterThanMax
      }
      return searchComparison.inRange
    }
    protected findAndlinearInterpolate (age: number) {
      const minLookup = age - this.minAge
      if (Number.isInteger(minLookup)) {
        return this.lookup[minLookup]
      }
      const minInt = Math.floor(minLookup)
      return this.lookup[minInt]
        .linearInterpolate(this.lookup[minInt + 1], minLookup - minInt)
    }
}
