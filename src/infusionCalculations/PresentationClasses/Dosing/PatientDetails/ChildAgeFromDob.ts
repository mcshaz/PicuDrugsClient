import { ChildAge } from './ChildAge'
import { NumericRange } from './../../../Utilities/NumericRange'
const msPerDay= 86400000; //1000*60*60*24;
interface dateProvider { now() :number };
export class ChildAgeFromDob extends ChildAge {
	private readonly _dateProv : dateProvider;
	public readonly dob:Date;
	constructor(dob: Date, dateProv?:dateProvider){
		if (dateProv === void 0){
			dateProv = Date;
		}
		const today = new Date(dateProv.now());//done to allow mocking
		today.setHours(0,0,0,0);
		if (dob > today) throw new Error("DOB must not be AFTER current system date");
		let years = today.getFullYear() - dob.getFullYear();
		let months = today.getMonth() - dob.getMonth();
		let days = today.getDate() - dob.getDate();
		if (months < 0) { months += 12; }
		if (days < 0)
		{
			days += new Date(today.getFullYear(), today.getMonth() ,0).getDate();
			if (months == 0)
			{
				months = 11;
				years--;
			}
			else { months--; }
		}
		today.setFullYear(today.getFullYear() - years)
		if (dob > today) { years-- };
		super(years,months,days);
		this.dob = dob;
		this._dateProv = dateProv;
	}

	getAgeInDays(): number | null
	{
		const now = new Date(this._dateProv.now());
		const difference_ms =now.getTime() - this.dob.getTime();
		const days = Math.floor(difference_ms/msPerDay);
		// Convert back to days and return
		return days; 
	}

	getAgeRangeInDays() : NumericRange{
		return new NumericRange(this.getAgeInDays());
	}
}
