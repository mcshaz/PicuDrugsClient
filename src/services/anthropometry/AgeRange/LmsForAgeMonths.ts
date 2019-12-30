import { AgeRange, integer, ceaseCorrectingAtDaysOfAge, termGestationWeeks, daysPerMonth } from './AgeRange'
import { Lms } from '../Lms'

export class LmsForAgeMonths extends AgeRange {
  constructor (ageMin: number, lmsForAgeMonths: ReadonlyArray<Lms>) {
    super(ageMin, lmsForAgeMonths)
  }
  public toAgeUnits (ageDaysSinceBirth: integer, gestAgeWeeksAtBirth: integer) {
    const ageDaysSinceTerm = ageDaysSinceBirth > ceaseCorrectingAtDaysOfAge
      ? ageDaysSinceBirth
      : ageDaysSinceBirth - 7 * (termGestationWeeks - gestAgeWeeksAtBirth)
    return ageDaysSinceTerm / daysPerMonth
  }
}
