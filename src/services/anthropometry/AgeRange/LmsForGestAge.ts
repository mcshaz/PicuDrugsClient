import { AgeRange, integer } from './AgeRange';
import { Lms } from '../Lms';

export class LmsForGestAge extends AgeRange {
    constructor(ageMin: number, lmsForGestAge: ReadonlyArray<Lms>) {
        super(ageMin, lmsForGestAge);
    }
    public lookupAgeDays(ageDaysSinceBirth: integer, gestAgeWeeksAtBirth: integer) {
        return this.isValueInRange(gestAgeWeeksAtBirth + ageDaysSinceBirth / 7);
    }
}
