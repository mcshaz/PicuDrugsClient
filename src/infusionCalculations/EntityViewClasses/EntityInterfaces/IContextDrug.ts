import { siUnit } from '../../../db/entities/enums/siUnit'
import { dilutionMethod } from '../../../db/entities/enums/dilutionMethod'
import {IContextConcentration} from './IContextConcentration'
export interface IContextDrug
{
	InfusionDrugId: number;
	AmpulePrefix: number;
	SiUnitId: siUnit;
	DilutionMethod: dilutionMethod;
	InfusionPrefix: number;
	IsPerMin: boolean;
	Concentrations?: IContextConcentration[];
}
