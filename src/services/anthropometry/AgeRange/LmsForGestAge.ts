import { AgeRange, integer } from './AgeRange';
import { Lms } from '../Lms';

export class LmsForGestAge extends AgeRange {
  public toAgeUnits(ageDaysSinceBirth: integer, gestAgeWeeksAtBirth: integer) {
    return gestAgeWeeksAtBirth + ageDaysSinceBirth / 7;
  }
}
