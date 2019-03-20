import { SiUnitMeasure } from './SiUnitMeasure'
import { siUnit } from './../../../db'
export class DrugDoseUnit extends SiUnitMeasure
{
	perSeperator: string = "/";
	constructor(logSi: number, unit: siUnit, readonly isPerKg: boolean)
	{
		super(logSi, unit);
	}
	private perString(): string
	{
		return this.isPerKg ? (this.perSeperator + "kg") : "";
	}
	tosiUnitMeasure(): SiUnitMeasure
	{
		return new SiUnitMeasure(this.logSi, this.unit);
	}
	toString(): string
	{
		return super.toString() + this.perString();
	}
	toShortString(): string
	{
		return super.toShortString() + this.perString();
	}
	toShortUserSafeString(): string
	{
		return this.isUserSafePrefix ? this.toShortString() : this.toString();
	}
}
