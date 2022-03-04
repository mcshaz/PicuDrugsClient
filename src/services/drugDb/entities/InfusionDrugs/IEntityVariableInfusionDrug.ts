import { IEntityConcentration, IEntityInfusion, IDilutionInfo, IEntityDilutionBase } from './IEntityInfusionDrug';

interface IEntityVariableConcentration extends IEntityConcentration {
    doseCat: string;
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

export interface IEntityVariableInfusionDrug extends IEntityInfusion {
    variableTimeDilutions: IEntityVariableDilution[];
}
