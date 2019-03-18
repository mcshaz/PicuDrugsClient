import { SiConcentration } from './Dosing/SiConcentration'
import { IInfusionDrugVM } from './Interfaces/IInfusionDrugVM';
import { DrugDoseUnit } from './Dosing/DrugDoseUnit';
import { InfusionRateUnit } from './Dosing/InfusionRateUnit';
import { SiUnitMeasure } from './Dosing/SiUnitMeasure';
import { FixedInfusionPeriodVM } from './FixedInfusionPeriodVM';
export class FixedInfusionDrugVM implements IInfusionDrugVM
{
	DrugName: string;
	SourceDescription: string;
	SourceHref: string;
	Route: string;
	Note: string = "";
	AmpuleConcentration: number;
	AmpuleUnits: SiConcentration;
	DiluentFluid: string;
	get CalculatedDoseUnit(): DrugDoseUnit
	{
		return this.RateUnit.toDrugDoseUnit();
	}
	RateUnit: InfusionRateUnit;
	set DrawingUpUnits(value: SiUnitMeasure)
	{
		this.AmpuleUnits = new SiConcentration(value);
	}
	get DrawingUpUnits(): SiUnitMeasure
	{
		return this.AmpuleUnits;
	}
	InfusionPeriods: FixedInfusionPeriodVM[];
}
