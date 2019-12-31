
import { IEntityDrugAmpuleConcentration, IInfusionInfo, IEntityFixedConcentration, IDilutionInfo } from '@/services/drugDb';

export interface IPatientFixedConcentration extends IEntityFixedConcentration {
    durationMinutes: number;
}

export interface IPatientFixedDilution extends IDilutionInfo {
    concentrations: IPatientFixedConcentration[];
}

export interface IPatientFixedInfusionDrug extends IInfusionInfo {
    infusionDrugId: number;
    dilution: IPatientFixedDilution;
}
