import { IEntityConcentration, IEntityInfusion, IDilutionInfo, IEntityDilutionBase } from './IEntityInfusionDrug';

export interface IEntityVariableInfusionDrug extends IEntityInfusion {
    variableTimeDilutions: IEntityVariableDilution[];
}

export interface IVariableDilutionInfo extends IDilutionInfo {
    volume: number | null;
    rateMin: number;
    rateMax: number;

    concentrations: IEntityVariableConcentration[];
}

export interface IEntityVariableDilution extends IEntityDilutionBase, IVariableDilutionInfo {
    variableTimeConcentrations: IEntityVariableConcentration[];
}

interface IEntityVariableConcentration extends IEntityConcentration {
    doseCat: string;
}
