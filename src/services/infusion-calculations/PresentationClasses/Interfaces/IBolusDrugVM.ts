import { IEntityBolusDrugBase } from '@/services/drugDb'
import { NumericRange } from '../../Utilities/NumericRange'

export interface IBolusDrugVM extends IEntityBolusDrugBase {
    dosePerKg: NumericRange;
    patientDose: NumericRange;
    patientVolume?: NumericRange;
}
