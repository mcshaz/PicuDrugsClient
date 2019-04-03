import { IEntityDilution, IEntityConcentration, IEntityInfusionDrug } from './IContextInfusionDrugBase';

export interface IContextVariableInfusionDrug extends IEntityInfusionDrug {
    dilutions: IVariableDilution[];
}

export interface IVariableDilution extends IEntityDilution {
    volume: number | null;
    rateMin: number;
    rateMax: number;

    concentrations: IVariableConcentration[];
}

interface IVariableConcentration extends IEntityConcentration {
    doseCat: string;
}
