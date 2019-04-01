import { AgeRange, ILookupRange, integer, ceaseCorrectingAtDaysOfAge, termGestationWeeks, daysPerMonth } from './AgeRange';
import { Lms } from '../Lms';

export class LmsForAgeMonths extends AgeRange {
    constructor(ageRange: ILookupRange, readonly lmsForAgeMonths: (lookupAgeMonthsPostBirth: integer) => Lms) {
        super (ageRange, lmsForAgeMonths);
    }
    public lookupAgeDays(ageDaysSinceBirth: integer, gestAgeWeeksAtBirth: integer) {
        const ageDaysSinceTerm = ageDaysSinceBirth > ceaseCorrectingAtDaysOfAge
            ? ageDaysSinceBirth
            : ageDaysSinceBirth - 7 * (termGestationWeeks - gestAgeWeeksAtBirth);
        return this.isValueInRange(ageDaysSinceTerm / daysPerMonth);
    }
}
