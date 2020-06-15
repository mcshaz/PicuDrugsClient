import { NumericRange } from '../../../Utilities/NumericRange';
export const msPerDay = 86400000; // 1000*60*60*24;
export const daysPerYear = 365.25;
export const daysPerMonth = daysPerYear / 12;
const weeksPerMonth = daysPerMonth / 7;

export interface IChildAge { years: number; months: number | null; days: number | null }
export interface IChildExactAge { years: number; months: number; days: number }

interface IAgeConstructorArgs { years?: number; months?: number; days?: number }
interface IDobConstructorArgs { dob: Date }

export class ChildAge implements IChildAge {
  // public static getAgeRangeInDays(age: IChildAge, now?: Date): NumericRange;
  public static getAgeRangeInDays(dobOrAge: IChildAge | Date, now?: Date): NumericRange {
    if (dobOrAge instanceof Date) {
      return new NumericRange(ChildAge.getMinAgeInDays(dobOrAge, now));
    }
    if (typeof dobOrAge.months === 'number' && typeof dobOrAge.days === 'number') {
      return new NumericRange(ChildAge.getMinTotalDays(dobOrAge));
    }
    return new NumericRange(ChildAge.getMinTotalDays(dobOrAge), ChildAge.getMaxTotalDays(dobOrAge));
  }

  public static getMinAgeInDays(dob: Date, now?: Date): number {
    now = now || new Date();
    const differenceMs = now.getTime() - dob.getTime();
    // Convert back to days and return
    return Math.floor(differenceMs / msPerDay);
  }

  public static getMaxTotalDays(age: IChildAge) {
    return Math.round(age.years * daysPerYear + (typeof age.months === 'number' ? age.months : 11) * daysPerMonth +
                      (typeof age.days === 'number' ? age.days : (daysPerMonth - 1)));
  }

  public static getMinTotalDays(age: IChildAge): number {
    return Math.round(age.years * daysPerYear + (age.months || 0) * daysPerMonth + (age.days || 0));
    /*
    const workingDate = new Date(now);
    workingDate.setFullYear(workingDate.getFullYear() - years);
    workingDate.setMonth(workingDate.getMonth() - (months || 0));
    workingDate.setDate(workingDate.getDate() - (days || 0));
    return Math.floor((now.getTime() - workingDate.getTime()) / msPerDay);
    */
  }

  public static daysInPriorMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), 0).getDate();
  }

  public static ageOnDate(dob: Date, current: Date = new Date()) {
    if (dob > current) {
      throw new RangeError('DOB must be on or before current');
    }
    const returnVar: IChildExactAge = {
      years: current.getFullYear() - dob.getFullYear(),
      months: current.getMonth() - dob.getMonth(),
      days: current.getDate() - dob.getDate(),
    };
    if (returnVar.months < 0) { returnVar.months += 12; }
    if (returnVar.days < 0) {
      returnVar.days += ChildAge.daysInPriorMonth(current);
      if (returnVar.months === 0) {
        returnVar.months = 11;
        returnVar.years--;
      } else {
        returnVar.months--;
      }
    }
    const workingDate = new Date(current);
    workingDate.setFullYear(workingDate.getFullYear() - returnVar.years);
    if (dob > workingDate) { returnVar.years--; }
    return returnVar;
  }

  private pYears!: number;
  private pMonths!: number | null;
  private pDays!: number | null;
  private pDob!: Date | null;

  public get years() { return this.pYears; }
  public set years(value: number) {
    if (value !== this.pYears) {
      if (value < 0 || value > 122) {
        throw new RangeError('years must be between 0 and 122');
      }
      this.pYears = Math.floor(value);
      this.pDob = null;
    }
  }

  public get months() { return this.pMonths; }
  public set months(value: number | null) {
    if (value !== this.pMonths) {
      if (value === null) {
        this.pMonths = null;
      } else if (value < 0) {
        throw new RangeError('months cannot be negative');
      } else {
        if (value > 11) {
          this.pYears += Math.floor(value / 12);
          value = value % 12;
        }
        this.pMonths = Math.floor(value);
      }
      this.pDob = null;
    }
  }

  public get days() { return this.pDays; }
  public set days(value: number | null) {
    if (value !== this.pDays) {
      if (value === null) {
        this.pDays = null;
      } else if (value < 0) {
        throw new RangeError('days cannot be negative');
      } else {
        if (value > 28) {
          const workingDate = new Date();
          let dInPriorMonth = ChildAge.daysInPriorMonth(workingDate);
          while (value >= dInPriorMonth) {
            value -= dInPriorMonth;
            this.pMonths! += 1;
            workingDate.setMonth(workingDate.getMonth() - 1);
            dInPriorMonth = ChildAge.daysInPriorMonth(workingDate);
          }
        }
        this.pDays = value;
      }
      this.pDob = null;
    }
  }

  public get dob() { return this.pDob; }
  public set dob(value: Date | null) {
    this.pDob = value;
    if (value !== null) {
      const ageVars = ChildAge.ageOnDate(value);
      this.pDays = ageVars.days;
      this.pMonths = ageVars.months;
      this.pYears = ageVars.years;
    }
  }

  constructor(ageData: IDobConstructorArgs | IAgeConstructorArgs | ChildAge | number, months?: number, days?: number) {
    if (ageData instanceof ChildAge) {
      this.pDob = ageData.dob;
      this.pDays = ageData.days;
      this.pMonths = ageData.months;
      this.pYears = ageData.years;
    } else if ((ageData as IDobConstructorArgs).dob) {
      this.dob = (ageData as IDobConstructorArgs).dob;
    } else {
      if (arguments.length > 1) {
        ageData = {
          years: ageData as number,
          months,
          days,
        };
      }
      ageData = ageData as IAgeConstructorArgs;
      if (ageData.years === void 0 && ageData.months === void 0 && ageData.days === void 0) {
        throw new TypeError('1 of years, months or days must be provided');
      }
      this.years = ageData.years || 0;
      if (ageData.months === void 0) {
        this.months = ageData.days === void 0 ? null : 0;
      } else {
        this.months = ageData.months;
      }
      this.days = ageData.days === void 0 ? null : ageData.days;
    }
  }

  public getAgeRangeInDays() {
    return ChildAge.getAgeRangeInDays(this);
  }

  public totalMonthsEstimate(gestAge = 40) {
    const returnVar = this.years + (typeof this.months === 'number' ? this.months : 6) +
        (typeof this.days === 'number' ? this.days : 0) / daysPerMonth -
        (this.years >= 2 ? 0 : ((40 - gestAge) / weeksPerMonth));
    return returnVar < 0
      ? 0
      : Math.round(returnVar);
  }

  public toString(): string {
    if (this.months === null) {
      return `${this.pYears} years`;
    }
    if (this.days === null) {
      return `${this.pYears} years ${this.pMonths} months`;
    }
    return `${this.pYears} years ${this.pMonths} months ${this.pDays} days`;
  }

  public toShortString(): string {
    return (this.pMonths !== null)
      ? `${this.pYears} y ${this.pMonths} m`
      : `${this.pYears} y`;
  }

  public valueOf() {
    return (this.pDays === null ? 15.5 : this.pDays) + (this.pMonths === null ? 6.1 : this.pMonths) * 100 +
      this.pYears * 10000 + (this.pDob === null ? 0 : 0.2);
  }
}
