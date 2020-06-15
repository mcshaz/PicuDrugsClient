import { AgeRange, integer, ceaseCorrectingAtDaysOfAge, termGestationWeeks, daysPerMonth } from './AgeRange';
// import { Lms } from '../Lms';

export class LmsForAgeMonths extends AgeRange {
  public toAgeUnits(ageDaysSinceBirth: integer, gestAgeWeeksAtBirth: integer) {
    const ageDaysSinceTerm = ageDaysSinceBirth > ceaseCorrectingAtDaysOfAge
      ? ageDaysSinceBirth
      : ageDaysSinceBirth - 7 * (termGestationWeeks - gestAgeWeeksAtBirth);
    return ageDaysSinceTerm / daysPerMonth;
  }
}
