import { AgeRange, integer, ceaseCorrectingAtDaysOfAge, termGestationWeeks } from './AgeRange'
import { Lms } from '../Lms'

export class LmsForAgeWeeks extends AgeRange {
  constructor (ageMin: number, lmsForAgeWeeks: ReadonlyArray<Lms>) {
    super(ageMin, lmsForAgeWeeks)
    if (ageMin + LmsForAgeWeeks.length > ceaseCorrectingAtDaysOfAge / 7) {
      throw new Error('This class does not yet account for cease correcting for gest age - change code to account')
    }
  }
  public toAgeUnits (ageDaysSinceBirth: integer, gestAgeWeeksAtBirth: integer) {
    return ageDaysSinceBirth / 7 - (termGestationWeeks - gestAgeWeeksAtBirth)
  }
}
