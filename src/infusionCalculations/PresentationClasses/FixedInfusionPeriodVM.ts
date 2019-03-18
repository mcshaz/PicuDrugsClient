import { MinutesDuration } from './Duration/MinutesDuration';
import { IConcentrationDetailVM } from "./Interfaces/IConcentrationDetailVM";

export class FixedInfusionPeriodVM implements IConcentrationDetailVM
{
	CalculatedDose: number;
	InfusionRate: number;
	DrawingUpDose: number;
	Duration: MinutesDuration;
	CumulativeStartTime: MinutesDuration;
	AmpuleMl: number;
	DiluentVolume: number;
	FinalVolume: number;
	IsNeat: boolean = false;
	OneMlHrDose: number;
}
