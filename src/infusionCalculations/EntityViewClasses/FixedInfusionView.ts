import { siUnit } from '../../db/entities/enums/siUnit'
import { dilutionMethod } from '../../db/entities/enums/dilutionMethod'
import {IContextDrug } from './EntityInterfaces/IContextDrug'
import {IContextFixedConc } from './EntityInterfaces/IContextFixedConc'
import {IContextConcentration } from './EntityInterfaces/IContextConcentration'
export interface FixedInfusionView extends IContextDrug, IContextFixedConc, IContextConcentration
{
	InfusionDrugId: number;
	Fullname: string;
	Abbrev: string;
	AmpulePrefix: number;
	SiUnitId: siUnit;
	Note?: string;
	ReferenceDescription: string;
	RefAbbrev: string;
	Hyperlink: string;
	RouteDescription: string;
	RouteAbbrev: string;
	DilutionMethod: dilutionMethod;
	InfusionPrefix: number;
	IsPerMin: boolean;
	ReferencePage: string;
	Concentration: number;
	Volume?: number;
	StopMins: number;
	Rate: number;
	DiluentType: string;
	DiluentAbbrev: string;
	AmpuleConcentration: number;
	Concentrations?: IContextConcentration[];
}
