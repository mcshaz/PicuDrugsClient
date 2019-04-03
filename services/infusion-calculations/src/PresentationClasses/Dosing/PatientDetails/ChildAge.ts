import { NumericRange } from './../../../Utilities/NumericRange';
import { IDateProvider, MockableDate } from './MockableDate';
const daysPerYear: number = 365.25;
const daysPerMonth: number = daysPerYear / 12;

export class ChildAge {
  private static getTotalDays(years: number, months?: number, days?: number): number {
    return years * daysPerYear + (months || 0) * daysPerMonth + (days || 0);
  }

  constructor(readonly years: number, readonly months?: number, readonly days?: number, protected readonly dateProv: IDateProvider = new MockableDate()) {
    if (years < 0 || months! < 0 || days! < 0) {
      throw new Error('years, months and days must all be positive');
    }
    this.days = days;
    this.months = months;
    this.years = years;

    if (this.days! > 28) {
      const workingDate = new Date(dateProv.today);
      let daysInPriorMonth = MockableDate.daysInPriorMonth(workingDate);
      while (this.days! >= daysInPriorMonth) {
        this.days = this.days! - daysInPriorMonth;
        this.months = (this.months || 0) + 1;
        workingDate.setMonth(workingDate.getMonth() - 1);
        daysInPriorMonth = MockableDate.daysInPriorMonth(workingDate);
      }
    }
    if (this.months! > 12) {
      this.years = this.years + (this.months! / 12);
      this.months = this.months! % 12;
    }
  }

  get totalMonthsEstimate(): number {
    return 12 * this.years + (this.months === void 0 ? 6 : this.months);
  }
  get totalMonths(): number | null {
    if (typeof this.months === void 0) {
      return null;
    }
    return 12 * this.years + this.months!;
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
  public getAgeRangeInDays(): NumericRange {
    const numericRange = new NumericRange();
    if (this.months !== void 0 && this.days !== void 0) {
      numericRange.lowerBound = numericRange.upperBound = ChildAge.getTotalDays(this.years, this.months, this.days);
    } else if (this.months !== void 0) {
      numericRange.lowerBound = ChildAge.getTotalDays(this.years, this.months, 0);
      const today = new Date();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      numericRange.upperBound = ChildAge.getTotalDays(this.years, this.months as number, daysInMonth);
    } else {
      numericRange.lowerBound = ChildAge.getTotalDays(this.years, 0, 0);
      numericRange.upperBound = ChildAge.getTotalDays(this.years, 11, 31);
    }
    return numericRange;
  }
  public getAgeInDays(): number | null {
    return ChildAge.getTotalDays(this.years, this.months, this.days);
  }
}

