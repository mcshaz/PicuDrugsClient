import { IVariableDilutionInfo, IInfusionInfo } from '../../../db';

export interface IPatientVariableInfuionDrug extends IInfusionInfo {
    dilution: IVariableDilutionInfo;
}
