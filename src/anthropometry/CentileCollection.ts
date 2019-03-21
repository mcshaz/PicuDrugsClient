import { Lms } from "./Lms";
import { lookupRange, integer, termGestationWeeks, LmsForGestAge, LmsForAgeWeeks, LmsForAgeMonths } from "./AgeRange";
import { CentileRange } from "./CentileRange";


export class GenderRange {
    readonly maleRange: lookupRange;
    readonly femaleRange: lookupRange;
    constructor(maleOrUnisexRange: lookupRange, femaleRange?: lookupRange) {
        this.maleRange = maleOrUnisexRange;
        this.femaleRange = femaleRange || maleOrUnisexRange;
    };
    get(isMale:boolean){
        return isMale ? this.maleRange : this.femaleRange;
    }
}

interface centileArgs {
    gestAgeWeeksRange?: GenderRange,
    ageWeeksSinceTermRange?: GenderRange,
    ageMonthsSinceTermRange?: GenderRange
}

export abstract class CentileCollection {
    readonly maleRange:CentileRange;
    readonly femaleRange:CentileRange;
    protected abstract lmsForGestAgeMale(lookupGestAgeWeeks: integer):Lms;
    protected abstract lmsForAgeWeeksMale(lookupAgeWeeksPostBirth: integer):Lms;
    protected abstract lmsForAgeMonthsMale(lookupAgeMonthsPostBirth: integer):Lms;
    protected abstract lmsForGestAgeFemale(lookupGestAgeWeeks: integer):Lms;
    protected abstract lmsForAgeWeeksFemale(lookupAgeWeeksPostBirth: integer):Lms;
    protected abstract lmsForAgeMonthsFemale(lookupAgeMonthsPostBirth: integer):Lms;
    constructor(argObj?: centileArgs) {
        argObj = argObj || {};
        argObj.gestAgeWeeksRange = argObj.gestAgeWeeksRange || new GenderRange({min:23, max:43});
        argObj.ageWeeksSinceTermRange = argObj.ageWeeksSinceTermRange || new GenderRange({min:4, max:13});
        argObj.ageMonthsSinceTermRange = argObj.ageMonthsSinceTermRange || new GenderRange({min:3, max:240});
        this.maleRange = new CentileRange(new LmsForGestAge(argObj.gestAgeWeeksRange.maleRange,this.lmsForGestAgeMale), 
            new LmsForAgeWeeks(argObj.ageWeeksSinceTermRange.maleRange, this.lmsForAgeWeeksMale), 
            new LmsForAgeMonths(argObj.ageMonthsSinceTermRange.maleRange, this.lmsForAgeMonthsMale));
        this.femaleRange = new CentileRange(new LmsForGestAge(argObj.gestAgeWeeksRange.femaleRange,this.lmsForGestAgeFemale), 
            new LmsForAgeWeeks(argObj.ageWeeksSinceTermRange.femaleRange, this.lmsForAgeWeeksFemale), 
            new LmsForAgeMonths(argObj.ageMonthsSinceTermRange.femaleRange, this.lmsForAgeMonthsFemale));
    }

    cumSnormForAge(measure:number, daysOfAge:number, isMale:boolean, totalWeeksGestAtBirth:number = termGestationWeeks) {
        return this.lmsForAge(daysOfAge, isMale, totalWeeksGestAtBirth).cumSnormfromParam(measure);
    };

    zForAge(measure:number, daysOfAge:number, isMale:boolean, totalWeeksGestAtBirth:number = termGestationWeeks) {
        return this.lmsForAge(daysOfAge, isMale, totalWeeksGestAtBirth).zFromParam(measure);
    };

    lmsForAge(daysSinceBirth: number, isMale: boolean, weeksGestAtBirth: number = termGestationWeeks) {
        const range = isMale ? this.maleRange : this.femaleRange;
        return range.lmsForAge(daysSinceBirth,weeksGestAtBirth);
    };
}