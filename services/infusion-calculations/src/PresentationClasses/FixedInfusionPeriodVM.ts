import { MinutesDuration } from './Duration/MinutesDuration';
import { IConcentrationDetailVM } from './Interfaces/IConcentrationDetailVM';

export class FixedInfusionPeriodVM implements IConcentrationDetailVM {
  public CalculatedDose: number = 0;
  public InfusionRate: number = 0;
  public DrawingUpDose: number = 0;
  public Duration: MinutesDuration | null = null;
  public CumulativeStartTime: MinutesDuration | null = null;
  public AmpuleMl: number = 0;
  public DiluentVolume: number = 0;
  public FinalVolume: number = 0;
  public IsNeat: boolean = false;
  public OneMlHrDose: number = 0;
}
