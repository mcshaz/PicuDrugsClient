import { ChildAge } from './ChildAge';
import { NumericRange } from './../../../Utilities/NumericRange';
import { MockableDate, IDateProvider } from './MockableDate';
const msPerDay = 86400000; // 1000*60*60*24;

export class ChildAgeFromDob extends ChildAge {
  public readonly dob: Date;

  constructor(dob: Date, dateProv: IDateProvider = new MockableDate()) {
    if (dob > dateProv.today) { throw new Error('DOB must not be AFTER current system date'); }
    let years = dateProv.today.getFullYear() - dob.getFullYear();
    let months = dateProv.today.getMonth() - dob.getMonth();
    let days = dateProv.today.getDate() - dob.getDate();
    if (months < 0) { months += 12; }
    if (days < 0) {
      days += dateProv.daysInPriorMonth();
      if (months === 0) {
        months = 11;
        years--;
      } else {
        months--;
      }
    }
    const workingDate = new Date(dateProv.today);
    workingDate.setFullYear(workingDate.getFullYear() - years);
    if (dob > workingDate) { years--; }
    super(years, months, days, dateProv);
    this.dob = dob;
  }

  public getAgeInDays(): number {
    const differenceMs = this.dateProv.today.getTime() - this.dob.getTime();
    const days = Math.floor(differenceMs / msPerDay);
    // Convert back to days and return
    return days;
  }

  public getAgeRangeInDays(): NumericRange {
    return new NumericRange(this.getAgeInDays());
  }
}
