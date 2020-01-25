import { NumericRange } from '../../../Utilities/NumericRange';
export const msPerDay = 86400000; // 1000*60*60*24;
export const daysPerYear = 365.25;
export const daysPerMonth = daysPerYear / 12;
const weeksPerMonth = daysPerMonth / 7;

export interface IChildAge { years: number; months: number | null; days: number | null; }
export interface IChildExactAge { years: number; months: number; days: number; }

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

  constructor(public years: number,
              public months: number | null,
              public days: number | null) {
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
    if (this.months === void 0) {
      return `${this.years} years`;
    }
    if (this.days === void 0) {
      return `${this.years} years ${this.months} months`;
    }
    return `${this.years} years ${this.months} months ${this.days} days`;
  }

  public toShortString(): string {
    return (this.months !== void 0)
      ? `${this.years} y ${this.months} m`
      : `${this.years} y`;
  }

  public valueOf() {
    return this.days === null ? 15.5 : this.days + (this.months === null ? 6.1 : this.months) * 100 +
      this.years * 10000;
  }
}
