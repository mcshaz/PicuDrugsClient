import { IContextDilution, IContextConcentration, IContextInfusionDrug } from "./IContextInfusionDrugBase";

export interface IContextVariableInfusionDrug extends IContextInfusionDrug {
    Dilutions:IVariableDilution[];
}

export interface IVariableDilution extends IContextDilution{
    Volume: number | null;
    RateMin: number;
    RateMax:number;

    Concentrations: IVariableConcentration[];
}

interface IVariableConcentration extends IContextConcentration {
    DoseCat: string;
}
