import { ChildAge } from "./ChildAge";
import * as fieldConst from '../../../Utilities/fieldConstants'

export class PatientDetails
{
	Age: ChildAge = null;
	Name: string = null;
	NHI: string = null;
	ActualWeight: number = 0;
	get WorkingWeight(): number
	{
		return (this.ActualWeight > fieldConst.maxWeight) ? fieldConst.maxWeight : this.ActualWeight;
	}
	Centile: string = null;
	WardId: number = 0;
	IsMale: boolean | null = null;
	WeightEstimate: boolean = false;
	GestationAtBirth: number = 0;

}
