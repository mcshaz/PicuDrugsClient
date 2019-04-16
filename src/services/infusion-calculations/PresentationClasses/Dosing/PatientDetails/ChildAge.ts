import { NumericRange } from '../../../Utilities/NumericRange';
const msPerDay = 86400000; // 1000*60*60*24;
export const daysPerYear = 365.25;
export const daysPerMonth = daysPerYear / 12;

export interface IChildAge { years: number; months: number | null; days: number | null; }

export class ChildAge implements IChildAge {
  public static getAgeRangeInDays(age: IChildAge, now?: Date): NumericRange;
  public static getAgeRangeInDays(dobOrAge: IChildAge | Date, now?: Date): NumericRange {
    if (dobOrAge instanceof Date) {
      return new NumericRange(ChildAge.getMinAgeInDays(dobOrAge, now));
    }
    if (typeof dobOrAge.months === 'number') {
      if (typeof dobOrAge.days === 'number') {
        return new NumericRange(ChildAge.getMinTotalDays(dobOrAge));
      } else {
        return new NumericRange(ChildAge.getMinTotalDays(dobOrAge), ChildAge.getMaxTotalDays(dobOrAge));
      }
    }
    return new NumericRange();
  }

  public static getMinAgeInDays(dob: Date, now?: Date): number {
    now = now || new Date();
    const differenceMs = now.getTime() - dob.getTime();
    // Convert back to days and return
    return Math.floor(differenceMs / msPerDay);
  }

  public static getMaxTotalDays(age: IChildAge) {
    return Math.round(age.years * daysPerYear + (typeof age.months === 'number' ? age.months : 11) * daysPerMonth +
                      (typeof age.days === 'number' ? age.days : (daysPerMonth - 1) ));
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

  constructor(public years: number,
              public months: number | null,
              public days: number | null) {
  }

  public getAgeRangeInDays() {
    return ChildAge.getAgeRangeInDays(this);
  }

  public totalMonthsEstimate() {
    return this.years + (typeof this.months === 'number' ? this.months : 6);
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
}
