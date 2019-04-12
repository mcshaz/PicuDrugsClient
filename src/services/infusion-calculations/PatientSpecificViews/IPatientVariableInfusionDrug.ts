import { IVariableDilutionInfo, IInfusionInfo } from '@/services/db';

export interface IPatientVariableInfuionDrug extends IInfusionInfo {
    dilution: IVariableDilutionInfo;
}
