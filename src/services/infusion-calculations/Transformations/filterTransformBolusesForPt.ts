import { IEntityBolusDrug } from '@/services/drugDb';
import { maxWeight, minWeight } from '@/services/drugDb/helpers/fieldConstants';
import { IBolusDrugVM } from '../PresentationClasses/Interfaces/IBolusDrugVM';
import { mapProperties } from '../helpers/mapProperties';
import { NumericRange } from '../Utilities/NumericRange';

export function filterTransformBolusesForPt(boluses: IEntityBolusDrug[], weightKg: number): IBolusDrugVM[] {
  if (weightKg > maxWeight) { weightKg = maxWeight; }
  if (weightKg < minWeight) { throw new Error(`weight of ${weightKg * 1000}g below lower limit of ${minWeight * 1000}g`); }
  const returnVar = new Array<IBolusDrugVM>(boluses.length);
  let insert = 0;
  for (const b of boluses) {
    const d = b.bolusDoses.filter((bd) => bd.weightMin < weightKg && weightKg <= bd.weightMax);
    if (d.length === 1) {
      const newVar = mapProperties({} as IBolusDrugVM, b, ['bolusDrugId', 'adultMax', 'concMl', 'units', 'drugName', 'min']);
      newVar.dosePerKg = new NumericRange(d[0].weightMin, d[0].weightMax);
      newVar.patientDose = NumericRange.opMultiply(newVar.dosePerKg, weightKg);
      newVar.patientDose.cap(newVar.adultMax);
      newVar.patientDose.floor(newVar.min);
      if (newVar.concMl) {
        newVar.patientVolume = NumericRange.opDivision(newVar.patientDose, newVar.concMl);
      }
      returnVar[insert++] = newVar;
    } else if (d.length > 1) {
      throw Error('Database contains corrupt weight/age ranges for infusion ' +
                b.drugName);
    }
  }
  returnVar.length = insert;
  return returnVar;
}
