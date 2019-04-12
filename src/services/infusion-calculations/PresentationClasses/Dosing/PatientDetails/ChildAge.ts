import { NumericRange } from '../../../Utilities/NumericRange';
const msPerDay = 86400000; // 1000*60*60*24;
const daysPerYear = 365.25;
const daysPerMonth = daysPerYear / 12;

export interface IChildAge { years: number; months: number | null; days: number | null; }

export class ChildAge implements IChildAge {
  public static getAgeRangeInDays(age: IChildAge, now?: Date): NumericRange;
  public static getAgeRangeInDays(dobOrAge: IChildAge | Date, now?: Date): NumericRange {
    if (dobOrAge instanceof Date) {
      return new NumericRange(ChildAge.getAgeInDays(dobOrAge, now));
    }
    const numericRange = new NumericRange();
    if (typeof dobOrAge.months === 'number') {
      if (typeof dobOrAge.days === 'number') {
        numericRange.lowerBound = numericRange.upperBound = ChildAge.getAgeInDays(dobOrAge, now);
      } else {
        numericRange.lowerBound = ChildAge.getTotalDays(dobOrAge.years, dobOrAge.months, 0);
        now = now || new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        numericRange.upperBound = ChildAge.getTotalDays(dobOrAge.years, dobOrAge.months, daysInMonth);
      }
    } else {
      numericRange.lowerBound = ChildAge.getTotalDays(dobOrAge.years, 0, 0);
      numericRange.upperBound = ChildAge.getTotalDays(dobOrAge.years, 11, 28);
    }
    return numericRange;
  }

  public static getAgeInDays(yearsOrAge: IChildAge | Date, now?: Date): number {
    if (yearsOrAge instanceof Date) {
      now = now || new Date();
      const differenceMs = now.getTime() - yearsOrAge.getTime();
      // Convert back to days and return
      return Math.floor(differenceMs / msPerDay);
    } else {
      return ChildAge.getTotalDays(yearsOrAge.years, yearsOrAge.months, yearsOrAge.days);
    }
  }

  private static getTotalDays(years: number, months?: number | null, days?: number | null): number {
    return Math.round(years * daysPerYear + (months || 0) * daysPerMonth + (days || 0));
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

  public getAgeInDays() {
    return ChildAge.getAgeInDays(this);
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
