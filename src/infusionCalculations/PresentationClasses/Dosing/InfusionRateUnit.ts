import { DrugDoseUnit } from './DrugDoseUnit'
import { siUnit } from '../../../db/entities/enums/siUnit'
export class InfusionRateUnit extends DrugDoseUnit
{
	constructor(logSi: number, unit: siUnit, isPerKg: boolean, readonly isPerMin: boolean)
	{
		super(logSi,unit,isPerKg)
	}
	private shortRate(): string
	{
		return this.perSeperator + (this.isPerMin ? "min" : "hr");
	}
	private longRate(): string
	{
		return this.perSeperator + (this.isPerMin ? "minute" : "hour");
	}
	toDrugDoseUnit(): DrugDoseUnit
	{
		return new DrugDoseUnit(this.logSi,this.unit,this.isPerKg);
	}
	toString(): string
	{
		return super.toString() + this.longRate();
	}
	toShortString(): string
	{
		return super.toShortString() + this.shortRate();
	}
	toShortUserSafeString(): string
	{
		return this.isUserSafePrefix ? this.toShortString() : (super.toString() + this.shortRate());
	}
}
