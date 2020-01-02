import { Lms } from './Lms';
import { termGestationWeeks } from './AgeRange/AgeRange';
import { CentileRange } from './CentileRange';
import { GenderRange } from './GenderRange';
import { LmsForGestAge } from './AgeRange/LmsForGestAge';
import { LmsForAgeWeeks } from './AgeRange/LmsForAgeWeeks';
import { LmsForAgeMonths } from './AgeRange/LmsForAgeMonths';

interface ILmsForAges {
    lmsForGestAgeMale: ReadonlyArray<Lms>;
    lmsForGestAgeFemale: ReadonlyArray<Lms>;
    lmsForAgeWeeksMale: ReadonlyArray<Lms>;
    lmsForAgeMonthsMale: ReadonlyArray<Lms>;
    lmsForAgeWeeksFemale: ReadonlyArray<Lms>;
    lmsForAgeMonthsFemale: ReadonlyArray<Lms>;

    gestAgeWeeksRange?: GenderRange;
    ageWeeksSinceTermRange?: GenderRange;
    ageMonthsSinceTermRange?: GenderRange;
}

export abstract class CentileCollection {
    public readonly maleRange: CentileRange;
    public readonly femaleRange: CentileRange;

    constructor(argObj: ILmsForAges) {
      argObj.gestAgeWeeksRange = argObj.gestAgeWeeksRange || new GenderRange(23);
      argObj.ageWeeksSinceTermRange = argObj.ageWeeksSinceTermRange || new GenderRange(4);
      argObj.ageMonthsSinceTermRange = argObj.ageMonthsSinceTermRange || new GenderRange(3);
      this.maleRange = new CentileRange(new LmsForGestAge(argObj.gestAgeWeeksRange.maleMin, argObj.lmsForGestAgeMale),
        new LmsForAgeWeeks(argObj.ageWeeksSinceTermRange.maleMin, argObj.lmsForAgeWeeksMale),
        new LmsForAgeMonths(argObj.ageMonthsSinceTermRange.maleMin, argObj.lmsForAgeMonthsMale));
      this.femaleRange = new CentileRange(new LmsForGestAge(argObj.gestAgeWeeksRange.femaleMin, argObj.lmsForGestAgeFemale),
        new LmsForAgeWeeks(argObj.ageWeeksSinceTermRange.femaleMin, argObj.lmsForAgeWeeksFemale),
        new LmsForAgeMonths(argObj.ageMonthsSinceTermRange.femaleMin, argObj.lmsForAgeMonthsFemale));
    }

    public cumSnormForAge(measure: number, daysOfAge: number, isMale: boolean, totalWeeksGestAtBirth: number = termGestationWeeks) {
      return this.lmsForAge(daysOfAge, isMale, totalWeeksGestAtBirth).cumSnormfromParam(measure);
    }
    public zForAge(measure: number, daysOfAge: number, isMale: boolean, totalWeeksGestAtBirth: number = termGestationWeeks) {
      return this.lmsForAge(daysOfAge, isMale, totalWeeksGestAtBirth).zFromParam(measure);
    }
    public lmsForAge(daysSinceBirth: number, isMale: boolean, weeksGestAtBirth: number = termGestationWeeks) {
      const range = isMale ? this.maleRange : this.femaleRange;
      return range.lmsForAge(daysSinceBirth, weeksGestAtBirth);
    }
}
