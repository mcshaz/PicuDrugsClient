import * as fieldConst from '@/services/drugDb/helpers/fieldConstants';
import { ChildAge } from './ChildAge';

export class PatientDetails {
  public Age: ChildAge | null = null;
  public Name = '';
  public NHI = '';
  public ActualWeight = 0;
  get WorkingWeight(): number {
    return (this.ActualWeight > fieldConst.maxWeight) ? fieldConst.maxWeight : this.ActualWeight;
  }

  public Centile = '';
  public WardId = 0;
  public IsMale: boolean | null = null;
  public WeightEstimate = false;
  public GestationAtBirth: number | null = null;
}
