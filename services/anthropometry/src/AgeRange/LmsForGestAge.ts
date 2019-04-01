import { AgeRange, ILookupRange, integer } from './AgeRange';
import { Lms } from '../Lms';

export class LmsForGestAge extends AgeRange {
    constructor(ageRange: ILookupRange, readonly lmsForGestAge: (lookupGestAgeWeeks: integer) => Lms) {
        super(ageRange, lmsForGestAge);
    }
    public lookupAgeDays(ageDaysSinceBirth: integer, gestAgeWeeksAtBirth: integer) {
        return this.isValueInRange(gestAgeWeeksAtBirth + ageDaysSinceBirth / 7);
    }
}
