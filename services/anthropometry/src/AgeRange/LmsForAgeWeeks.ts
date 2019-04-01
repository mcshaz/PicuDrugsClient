import { AgeRange, ILookupRange, integer, ceaseCorrectingAtDaysOfAge, termGestationWeeks } from './AgeRange';
import { Lms } from '../Lms';

export class LmsForAgeWeeks extends AgeRange {
    constructor(ageRange: ILookupRange, readonly lmsForAgeWeeks: (lookupAgeWeeksPostBirth: integer) => Lms) {
        super (ageRange, lmsForAgeWeeks);
        if (ageRange.max > ceaseCorrectingAtDaysOfAge / 7) {
            throw new Error('This class does not yet account for cease correcting for gest age - change code to account');
        }
    }
    public lookupAgeDays(ageDaysSinceBirth: integer, gestAgeWeeksAtBirth: integer) {
        return this.isValueInRange(ageDaysSinceBirth / 7 - (termGestationWeeks - gestAgeWeeksAtBirth));
    }
}
