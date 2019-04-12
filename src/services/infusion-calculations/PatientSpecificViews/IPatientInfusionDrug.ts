import { IDilutionInfo, IInfusionInfo, IEntityConcentration } from '@/services/db';

export interface IPatientDilution extends IDilutionInfo {
    concentrations: IEntityConcentration[];
}

export interface IPatientInfuionDrug extends IInfusionInfo {
    dilution: IPatientDilution;
}
