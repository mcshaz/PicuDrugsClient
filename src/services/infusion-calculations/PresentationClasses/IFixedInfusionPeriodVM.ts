import { MinutesDuration } from './Duration/MinutesDuration'
import { IConcentrationDetailVM } from './Interfaces/IConcentrationDetailVM'

export interface IFixedInfusionPeriodVM extends IConcentrationDetailVM {
  calculatedDose: number;
  infusionRate: number;
  duration: MinutesDuration;
  cumulativeStartTime: MinutesDuration;
}
