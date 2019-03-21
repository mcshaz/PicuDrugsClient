import { ChildAge } from './ChildAge';
import { NumericRange } from './../../../Utilities/NumericRange';
const msPerDay = 86400000; // 1000*60*60*24;
interface IDateProvider { now(): number; }
export class ChildAgeFromDob extends ChildAge {
  public readonly dob: Date;
  private readonly dateProv: IDateProvider;
  constructor(dob: Date, dateProv?: IDateProvider) {
    if (dateProv === void 0) {
      dateProv = Date;
    }
    const today = new Date(dateProv.now()); // done to allow mocking
    today.setHours(0, 0, 0, 0);
    if (dob > today) { throw new Error('DOB must not be AFTER current system date'); }
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();
    if (months < 0) { months += 12; }
    if (days < 0) {
      days += new Date(today.getFullYear(), today.getMonth() , 0).getDate();
      if (months === 0) {
        months = 11;
        years--;
      } else { months--; }
    }
    today.setFullYear(today.getFullYear() - years);
    if (dob > today) { years--; }
    super(years, months, days);
    this.dob = dob;
    this.dateProv = dateProv;
  }

  public getAgeInDays(): number {
    const now = new Date(this.dateProv.now());
    const differenceMs = now.getTime() - this.dob.getTime();
    const days = Math.floor(differenceMs / msPerDay);
    // Convert back to days and return
    return days;
  }

  public getAgeRangeInDays(): NumericRange {
    return new NumericRange(this.getAgeInDays());
  }
}
