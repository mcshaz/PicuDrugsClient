
import { IEntityDrugAmpuleConcentration, IInfusionInfo, IEntityFixedConcentration, IDilutionInfo } from '../../../db';

export interface IPatientFixedConcentration extends IEntityFixedConcentration {
    durationMinutes: number;
}

export interface IPatientFixedDilution extends IDilutionInfo {
    concentrations: IPatientFixedConcentration[];
}

export interface IPatientFixedInfusionDrug extends IInfusionInfo {
    dilution: IPatientFixedDilution;
    selectedAmpule: IEntityDrugAmpuleConcentration;
}
