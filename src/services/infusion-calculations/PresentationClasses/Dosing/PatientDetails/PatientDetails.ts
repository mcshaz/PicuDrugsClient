import * as fieldConst from '@/services/db/helpers/fieldConstants';
import { ChildAge } from './ChildAge';

export class PatientDetails {
  public Age: ChildAge | null = null;
  public Name: string  = '';
  public NHI: string = '';
  public ActualWeight: number = 0;
  get WorkingWeight(): number {
    return (this.ActualWeight > fieldConst.maxWeight) ? fieldConst.maxWeight : this.ActualWeight;
  }
  public Centile: string = '';
  public WardId: number = 0;
  public IsMale: boolean | null = null;
  public WeightEstimate: boolean = false;
  public GestationAtBirth: number | null = null;
}