
import { siUnit } from './enums/siUnit';
import { ILastUpdated } from './ILastUpdated';

export interface IContextInfusionDrug extends ILastUpdated {
    InfusionDrugId: number;
    Fullname: string;
    Abbrev: string;
    Note: string;
    DrugReferenceSource: string;
    DrugRoute: string;
    InfusionDiluent: string;
    SiPrefix: number;
    SiUnit: siUnit;
}

export interface IContextDilution {
    siPrefixVal: number;
    WeightMin: number;
    WeightMax: number;
    AgeMinMonths: number;
    AgeMaxMonths: number;
    IsPerMin: boolean;
    ReferencePage: string;
}

export interface IContextConcentration {
    Concentration: number;
}
