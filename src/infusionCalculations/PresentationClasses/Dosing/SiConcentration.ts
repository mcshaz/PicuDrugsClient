import { SiUnitMeasure } from './SiUnitMeasure'
import { siUnit } from '../../../db/entities/enums/siUnit'
export class SiConcentration extends SiUnitMeasure
{
	perSeperator: string;
	constructor(measure: SiUnitMeasure);
	constructor(logSi: number, unit: siUnit);
	constructor(measureOrLogSi: SiUnitMeasure | number, unit?: siUnit)
	{
		if (typeof measureOrLogSi === "number"){
			super(measureOrLogSi, unit);
		} else {
			super(measureOrLogSi.logSi, measureOrLogSi.unit)
		}
		this.perSeperator = "/";
	}
	private rate(): string
	{
		return this.perSeperator + "mL";
	}
	toString(): string
	{
		return super.toString() + this.rate();
	}
	toShortUserSafeString(): string
	{
		return this.isUserSafePrefix ? this.toShortString() : this.toString();
	}
	toShortString(): string
	{
		return super.toShortString() + this.rate();
	}
}
