import { IContextDilution, IContextConcentration, IContextInfusionDrug } from './IContextInfusionDrugBase';

export interface IContextVariableInfusionDrug extends IContextInfusionDrug {
    dilutions: IVariableDilution[];
}

export interface IVariableDilution extends IContextDilution {
    volume: number | null;
    rateMin: number;
    rateMax: number;

    concentrations: IVariableConcentration[];
}

interface IVariableConcentration extends IContextConcentration {
    doseCat: string;
}
