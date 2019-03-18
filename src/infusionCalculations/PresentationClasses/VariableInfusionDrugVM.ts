import { IInfusionDrugVM } from "./Interfaces/IInfusionDrugVM";
import { NumericRange } from "../Utilities/NumericRange";
import { InfusionRateUnit } from "./Dosing/InfusionRateUnit";
import { SiUnitMeasure } from "./Dosing/SiUnitMeasure";
import { VariableConcentrationDetailVM } from "./VariableConcentrationDetailVM";

export class VariableInfusionDrugVM implements IInfusionDrugVM
{
	DrugName: string;
	DoseRange: NumericRange;
	RateUnit: InfusionRateUnit;
	Link: string;
	Note: string = "";
	DrawingUpUnits: SiUnitMeasure;
	InfusionDetails: VariableConcentrationDetailVM[];
}
