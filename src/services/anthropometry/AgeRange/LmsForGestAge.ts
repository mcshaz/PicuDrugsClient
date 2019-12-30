import { AgeRange, integer } from './AgeRange'
import { Lms } from '../Lms'

export class LmsForGestAge extends AgeRange {
  constructor (ageMin: number, lmsForGestAge: ReadonlyArray<Lms>) {
    super(ageMin, lmsForGestAge)
  }
  public toAgeUnits (ageDaysSinceBirth: integer, gestAgeWeeksAtBirth: integer) {
    return gestAgeWeeksAtBirth + ageDaysSinceBirth / 7
  }
}
