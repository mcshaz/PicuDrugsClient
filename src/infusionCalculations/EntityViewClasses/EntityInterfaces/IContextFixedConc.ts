import { IContextConcentration } from './IContextConcentration'
export interface IContextFixedConc extends IContextConcentration
{
	StopMins: number;
	Rate: number;
}
