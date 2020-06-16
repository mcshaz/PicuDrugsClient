import { NumericRange } from '../../Utilities/NumericRange';

export class EttDetails {
  public InternalDiameter = 0;
  public InternalDiameterRange: NumericRange | null = null;
  public LengthAtLip = 0;
  public LengthAtNose = 0;
  public SuctionWith = 0;
  public Note = '';
}
