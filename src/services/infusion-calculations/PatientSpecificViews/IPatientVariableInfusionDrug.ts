import { IVariableDilutionInfo, IInfusionInfo } from '@/services/drugDb'

export interface IPatientVariableInfuionDrug extends IInfusionInfo {
    dilution: IVariableDilutionInfo;
}
