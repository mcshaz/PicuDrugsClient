import { IDilutionInfo, IInfusionInfo, IEntityConcentration } from '../../../db';

export interface IPatientDilution extends IDilutionInfo {
    concentrations: IEntityConcentration[]
}

export interface IPatientInfuionDrug extends IInfusionInfo {
    dilution: IPatientDilution;
}
