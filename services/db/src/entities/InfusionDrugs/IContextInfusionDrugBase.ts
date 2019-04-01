
import { siUnit } from '../enums/siUnit';
import { IEntityUpdated } from '../IEntityUpdated';

export interface IContextInfusionDrug extends IEntityUpdated {
    infusionDrugId: number;
    fullname: string;
    abbrev: string;
    note: string;
    drugReferenceSource: string;
    drugRoute: string;
    infusionDiluent: string;
    siPrefix: number;
    siUnit: siUnit;
}

export interface IContextDilution {
    siPrefixVal: number;
    weightMin: number;
    weightMax: number;
    ageMinMonths: number;
    ageMaxMonths: number;
    isPerMin: boolean;
    referencePage: string;
}

export interface IContextConcentration {
    concentration: number;
}
