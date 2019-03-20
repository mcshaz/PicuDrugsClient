import { siUnit, dilutionMethod } from './../../db'
import {IContextDrug } from './EntityInterfaces/IContextDrug'
import {IContextConcentration } from './EntityInterfaces/IContextConcentration'
export interface VariableInfusionView extends IContextDrug, IContextConcentration
{
	InfusionDrugId: number;
	Fullname: string;
	Abbrev: string;
	AmpulePrefix: number;
	Note?: string;
	SiUnit: siUnit;
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
