import { siUnit } from '../../db/entities/enums/siUnit'
import { dilutionMethod } from '../../db/entities/enums/dilutionMethod'
import {IContextDrug } from './EntityInterfaces/IContextDrug'
import {IContextConcentration } from './EntityInterfaces/IContextConcentration'
export interface VariableInfusionView extends IContextDrug, IContextConcentration
{
	InfusionDrugId: number;
	Fullname: string;
	Abbrev: string;
	AmpulePrefix: number;
	Note?: string;
	SiUnitId: siUnit;
	Category?: string;
	DilutionMethod: dilutionMethod;
	InfusionPrefix: number;
	Volume?: number | null;
	RateMin: number;
	RateMax: number;
	IsPerMin: boolean;
	Concentration: number;
	HrefBase: string;
	HrefPage: string;
	Concentrations?: IContextConcentration[];
}
