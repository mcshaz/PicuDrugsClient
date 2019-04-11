import { NumericRange } from '../../../Utilities/NumericRange';
import { IDateProvider, MockableDate } from './MockableDate';
const msPerDay = 86400000; // 1000*60*60*24;

const daysPerYear = 365.25;
const daysPerMonth = daysPerYear / 12;
const maxAgeYr = 122;
export { maxAgeYr };

export class ChildAge {
  private static getTotalDays(years: number, months?: number, days?: number): number {
    return years * daysPerYear + (months || 0) * daysPerMonth + (days || 0);
  }

  private pYears?: number;
  private pMonths?: number;
  private pDays?: number;
  private pDob?: Date;

  constructor(protected readonly dateProv: IDateProvider = new MockableDate()) {}

  public get years() { return this.pYears; }
  public set years(years: number | undefined) {
    if (years !== this.pYears) {
      if (years !== void 0) {
        if (years < 0) {
          throw new Error('years must be positive');
        }
        if (years > maxAgeYr) {
          throw new Error('years must be ≤' + maxAgeYr);
        }
        years = Math.floor(years);
      }
      this.pYears = years;
      this.pDob = void 0;
    }
  }

  public get months() { return this.pMonths; }
  public set months(months: number | undefined) {
    if (months !== this.pMonths) {
      if (months !== void 0) {
        if (months < 0) {
          throw new Error('months must be positive');
        }
        if (this.years === void 0) {
          this.years = 0;
        }
        if (months > 12) {
          this.years = this.years + (months / 12);
          months = months % 12;
        }
        months = Math.floor(months);
      }
      this.pMonths = months;
      this.pDob = void 0;
    }
  }

  public get days() { return this.pDays; }
  public set days(days: number | undefined) {
    if (this.pDays !== days) {
      if (days !== void 0) {
        if (this.months === void 0) {
          this.months = 0;
        }
        if (days < 0) {
          throw new Error('days must be positive');
        }
        if (days > 28) {
          const workingDate = new Date(this.dateProv.now());
          let daysInPriorMonth = MockableDate.daysInPriorMonth(workingDate);
          while (days >= daysInPriorMonth) {
            days = days - daysInPriorMonth;
            this.months = (this.months || 0) + 1;
            workingDate.setMonth(workingDate.getMonth() - 1);
            daysInPriorMonth = MockableDate.daysInPriorMonth(workingDate);
          }
        }
      }
      this.pDays = days;
      this.pDob = void 0;
    }
  }

  public get dob() { return this.pDob; }
  public set dob(dob: Date | undefined) {
    if (dob !== void 0 && dob !== this.pDob) {
      const now = this.dateProv.now();
      if (dob > now) { throw new Error('DOB must not be AFTER current system date'); }
      let years = now.getFullYear() - dob.getFullYear();
      let months = now.getMonth() - dob.getMonth();
      let days = now.getDate() - dob.getDate();
      if (months < 0) { months += 12; }
      if (days < 0) {
        days += this.dateProv.daysInPriorMonth();
        if (months === 0) {
          months = 11;
          years--;
        } else {
          months--;
        }
      }
      const workingDate = new Date(now);
      workingDate.setFullYear(workingDate.getFullYear() - years);
      if (dob > workingDate) { years--; }
      this.pYears = years;
      this.pMonths = months;
      this.pDays = days;
    }
    this.pDob = dob;
  }

  public totalMonthsEstimate() {
    if (this.years === void 0 || (this.years === 0 && this.months === void 0)) {
      return NaN;
    }
    return 12 * this.years + (this.months === void 0 ? 6 : this.months);
  }

  public totalMonths() {
    if (this.months === void 0 || this.years === void 0) {
      return NaN;
    }
    return 12 * this.years + this.months;
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
    if (this.years !== void 0) {
      if (this.months !== void 0 && this.days !== void 0) {
        numericRange.lowerBound = numericRange.upperBound = this.getAgeInDays();
      } else if (this.months !== void 0) {
        numericRange.lowerBound = ChildAge.getTotalDays(this.years, this.months, 0);
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        numericRange.upperBound = ChildAge.getTotalDays(this.years, this.months as number, daysInMonth);
      } else {
        numericRange.lowerBound = ChildAge.getTotalDays(this.years, 0, 0);
        numericRange.upperBound = ChildAge.getTotalDays(this.years, 11, 31);
      }
    }
    return numericRange;
  }

  public getAgeInDays() {
    if (this.years === void 0) {
      return NaN;
    }
    if (this.dob !== void 0) {
      const differenceMs = this.dateProv.now().getTime() - this.dob.getTime();
      const days = Math.floor(differenceMs / msPerDay);
      // Convert back to days and return
      return days;
    }
    return ChildAge.getTotalDays(this.years, this.months, this.days);
  }
}
