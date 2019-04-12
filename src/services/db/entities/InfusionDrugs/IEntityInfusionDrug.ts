import { siUnit } from '../enums/siUnit';
import { dilutionMethod } from '../enums/dilutionMethod';

export interface IInfusionInfo {
    fullname: string;
    abbrev: string;
    note: string;
    siPrefix: number;
    siUnitId: siUnit;

    drugReferenceSource: IDrugReference;
    drugRoute: IDrugRoute;
    infusionDiluent: IDiluent;
}

export interface IEntityInfusion extends IInfusionInfo {
    infusionDrugId: number;
}

export interface IAgeWeightSelectable {
    weightMin: number;
    weightMax: number;
    ageMinMonths: number;
    ageMaxMonths: number;
}

export interface IDilutionInfo {
    dilutionMethodId: dilutionMethod;
    siPrefix: number;
    isPerMin: boolean;
    referencePage: string;
}

export interface IEntityDilutionBase extends IAgeWeightSelectable, IDilutionInfo {
}

export interface IEntityConcentration {
    concentration: number;
}

export interface IDrugReference {
    referenceDescription: string;
    abbrev: string;
    hyperlink: string;
}

export interface IDrugRoute {
    description: string;
    abbrev: string;
}

export interface IDiluent {
    diluentType: string;
    abbrev: string;
}
