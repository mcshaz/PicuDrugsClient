import { NumericRange } from '../../Utilities/NumericRange';

export class EttDetails {
  public InternalDiameter: number = 0;
  public InternalDiameterRange: NumericRange | null = null;
  public LengthAtLip: number = 0;
  public LengthAtNose: number = 0;
  public SuctionWith: number = 0;
  public Note: string = '';
}
