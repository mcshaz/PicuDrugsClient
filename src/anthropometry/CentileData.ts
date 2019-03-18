const daysPerYear = 365.25;
const msPerDay = 86400000 //24 * 60 * 60 * 1000;
const daysPerMonth = daysPerYear / 12;
const weeksPerMonth = daysPerMonth / 7;
const termGestation = 40;
const ceaseCorrectingDaysOfAge = daysPerMonth * 24;
const roundingFactor = 0.00001;
const maximumGestationalCorrection = 43;
export class GenderRange {
    readonly maleRange: AgeDaysRange;
    readonly femaleRange: AgeDaysRange
    constructor(maleOrUnisexRange: AgeDaysRange, femaleRange?: AgeDaysRange) {
        this.maleRange = maleOrUnisexRange;
        this.femaleRange = femaleRange || maleOrUnisexRange;
    };
}

export class AgeDaysRange {
    constructor(readonly min:number, readonly max:number) {
        if (min < 0) { throw new RangeError("min must be >=0"); }
        if (max < min) { throw new RangeError("max must be >= min"); }
    };
}

export class Lms {
    constructor(readonly l: number, readonly m: number, readonly s: number) { }
    linearInterpolate(interpolWith: Lms, fraction:number) {
        if (fraction < 0 || fraction > 1) {
            throw ("fraction must be between 0 and 1");
        }
        var oppFraction = 1 - fraction;
        return new Lms(
            oppFraction * this.l + fraction * interpolWith.l,
            oppFraction * this.m + fraction * interpolWith.m,
            oppFraction * this.s + fraction * interpolWith.s
        );
    }
    zFromParam(param:number) {
        if (this.l == 0) {
            return Math.log(param / this.m) / this.s;
        }
        return (Math.pow(param / this.m, this.l) - 1) / (this.l * this.s);
    }

    cumSnormfromParam(param:number) {
        return cumSnorm(this.zFromParam(param));
    }
}

function cumSnorm(zScore:number) {
    const zAbs = Math.abs(zScore);
    let returnVal:number,
        build:number;
    if (zAbs > 37) {
        return 0;
    } else {
        var Exponential = Math.exp(-Math.pow(zAbs, 2) / 2);
        if (zAbs < 7.07106781186547) {
            build = 3.52624965998911E-02 * zAbs + 0.700383064443688;
            build = build * zAbs + 6.37396220353165;
            build = build * zAbs + 33.912866078383;
            build = build * zAbs + 112.079291497871;
            build = build * zAbs + 221.213596169931;
            build = build * zAbs + 220.206867912376;
            returnVal = Exponential * build;
            build = 8.83883476483184E-02 * zAbs + 1.75566716318264;
            build = build * zAbs + 16.064177579207;
            build = build * zAbs + 86.7807322029461;
            build = build * zAbs + 296.564248779674;
            build = build * zAbs + 637.333633378831;
            build = build * zAbs + 793.826512519948;
            build = build * zAbs + 440.413735824752;
            returnVal = returnVal / build;
        }
        else {
            build = zAbs + 0.65;
            build = zAbs + 4 / build;
            build = zAbs + 3 / build;
            build = zAbs + 2 / build;
            build = zAbs + 1 / build;
            returnVal = Exponential / build / 2.506628274631;
        }
    }
    return (zScore < 0) ? returnVal : 1 - returnVal;
}

interface centileArgs {
    gestAgeRange?: GenderRange,
    ageWeeksRange?: GenderRange,
    ageMonthsRange?: GenderRange
}
export abstract class CentileData {
    readonly gestAgeRange: GenderRange;
    readonly ageWeeksRange: GenderRange;
    readonly ageMonthsRange: GenderRange;
    abstract lMSForGestAge(lookupAge: number, isMale: boolean):Lms;
    abstract lMSForAgeWeeks(lookupAge: number, isMale: boolean):Lms;
    abstract lMSForAgeMonths(lookupAge: number, isMale: boolean):Lms;
    constructor(argObj?: centileArgs) {
        argObj = argObj || {};
        this.gestAgeRange = argObj.gestAgeRange || new GenderRange(new AgeDaysRange(23, 43));
        this.ageWeeksRange = argObj.ageWeeksRange || new GenderRange(new AgeDaysRange(4, 13));
        this.ageMonthsRange = argObj.ageMonthsRange || new GenderRange(new AgeDaysRange(3, 240));
    }
    cumSnormForAge(measure:number, daysOfAge:number, isMale:boolean, totalWeeksGestAtBirth:number) {
        return this.lMSForAge(daysOfAge, isMale, totalWeeksGestAtBirth).cumSnormfromParam(measure);
    };

    zForAge(measure:number, daysOfAge:number, isMale:boolean, totalWeeksGestAtBirth:number) {
        return this.lMSForAge(daysOfAge, isMale, totalWeeksGestAtBirth).zFromParam(measure);
    };

    lMSForAge(daysOfAge: number, isMale: boolean, totalWeeksGestAtBirth: number) {
        var lookupTotalAge, lookupAge, maxVal, nextLookupAge, ageMonthsLookup, fraction;
        if (isMale && (totalWeeksGestAtBirth < this.gestAgeRange.maleRange.min) ||
            (!isMale && totalWeeksGestAtBirth < this.gestAgeRange.femaleRange.min)) {
            throw new RangeError("totalWeeksGestAtBirth must be greater than GestAgeRange - check property prior to calling");
        }
        totalWeeksGestAtBirth = totalWeeksGestAtBirth || termGestation;
        if (totalWeeksGestAtBirth > maximumGestationalCorrection) {
            totalWeeksGestAtBirth = maximumGestationalCorrection;
        }
        if (daysOfAge < 0) {
            throw new RangeError("daysOfAge:" + daysOfAge + " must be >= 0");
        }
        if (daysOfAge > ceaseCorrectingDaysOfAge) {
            totalWeeksGestAtBirth = termGestation;
        }
        lookupTotalAge = daysOfAge / 7 + totalWeeksGestAtBirth;
        lookupAge = Math.floor(lookupTotalAge + roundingFactor);
        maxVal = isMale ? this.gestAgeRange.maleRange.max : this.gestAgeRange.femaleRange.max;
        if (lookupAge == maxVal) {
            nextLookupAge = lookupAge + 1;
            return this.lMSForGestAge(lookupAge, isMale).linearInterpolate(this.lMSForAgeWeeks(nextLookupAge - termGestation, isMale), lookupTotalAge - lookupAge);
        }
        if (lookupAge < maxVal) {
            nextLookupAge = lookupAge + 1;
            return this.lMSForGestAge(lookupAge, isMale).linearInterpolate(
                this.lMSForGestAge(nextLookupAge, isMale),
                lookupTotalAge - lookupAge);
        }
        lookupTotalAge -= termGestation;
        lookupAge = Math.floor(lookupTotalAge + roundingFactor);
        maxVal = isMale ? this.ageWeeksRange.maleRange.max : this.ageWeeksRange.femaleRange.max;
        if (lookupAge == maxVal) {
            ageMonthsLookup = Math.ceil((daysOfAge + totalWeeksGestAtBirth - termGestation) / daysPerMonth);
            fraction = (lookupTotalAge - maxVal) / (ageMonthsLookup * weeksPerMonth - maxVal);
            return this.lMSForAgeWeeks(lookupAge, isMale).linearInterpolate(
                this.lMSForAgeMonths(ageMonthsLookup, isMale),
                fraction);
        }
        if (lookupAge < maxVal) {
            nextLookupAge = lookupAge + 1;
            return this.lMSForAgeWeeks(lookupAge, isMale).linearInterpolate(
                this.lMSForAgeWeeks(nextLookupAge, isMale),
                lookupTotalAge - lookupAge);
        }
        lookupTotalAge = (daysOfAge + totalWeeksGestAtBirth - termGestation) / daysPerMonth;
        lookupAge = Math.floor(lookupTotalAge + roundingFactor);
        maxVal = (isMale ? this.ageMonthsRange.maleRange.max : this.ageMonthsRange.femaleRange.max);
        if (lookupAge > maxVal) {
            return this.lMSForAgeMonths(maxVal, isMale);
        }
        nextLookupAge = lookupAge + 1;
        return this.lMSForAgeMonths(lookupAge, isMale).linearInterpolate(
            this.lMSForAgeMonths(nextLookupAge, isMale),
            lookupTotalAge - lookupAge);
    };
}