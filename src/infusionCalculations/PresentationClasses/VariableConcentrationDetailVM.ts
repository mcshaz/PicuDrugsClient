import {IConcentrationDetailVM } from './Interfaces/IConcentrationDetailVM'
import {NumericRange} from './../Utilities/NumericRange'

export class VariableConcentrationDetailVM implements IConcentrationDetailVM
{
	DetailName: string = "";
	DrawingUpDose: number;
	IsNeat: boolean = false;
	FinalVolume: number;
	OneMlHrDose: number;
	FlowRange: NumericRange;
}

