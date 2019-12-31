import { minWeight, maxWeight } from '@/services/drugDb/helpers/fieldConstants';
import { filterByAgeWeight, IAgeWeightDetails } from '../../helpers/ageWeightSelectors';
import { IPatientVariableInfuionDrug } from '../../PatientSpecificViews/IPatientVariableInfusionDrug';
import { IEntityVariableInfusionDrug } from '@/services/drugDb';
import { mapProperties } from '../../helpers/mapProperties';

// 600 chosen as default ageMonths as 1/2 way between min and max
export function filterVariableInfusionsForPt(infusions: IEntityVariableInfusionDrug[], weightKg: number, ageMonths: number = 600): IPatientVariableInfuionDrug[] {
  if (weightKg > maxWeight) { weightKg = maxWeight; }
  if (weightKg < minWeight) { throw new Error(`weight of ${weightKg * 1000}g below lower limit of ${minWeight * 1000}g`); }
  const ageWt: IAgeWeightDetails = { ageMonths, weightKg };
  const returnVar = new Array<IPatientVariableInfuionDrug>(infusions.length);
  let insert = 0;
  for (const i of infusions) {
    const d = filterByAgeWeight(ageWt, i.variableTimeDilutions);
    if (d.length === 1) {
      const newVar = mapProperties({} as IPatientVariableInfuionDrug, i, ['abbrev', 'drugReferenceSource', 'drugRoute', 'fullname', 'infusionDiluentId', 'note', 'siPrefix', 'siUnitId']);
      newVar.dilution = d[0];
      newVar.dilution.concentrations = d[0].variableTimeConcentrations;
      returnVar[insert++] = newVar;
    } else if (d.length > 1) {
      throw Error('Database contains corrupt weight/age ranges for infusion ' +
             (i.abbrev || i.fullname));
    }
  }
  returnVar.length = insert;
  return returnVar;
}
