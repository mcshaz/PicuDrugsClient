import { minWeight, maxWeight } from '@/services/db/helpers/fieldConstants';
import { filterByAgeWeight, IAgeWeightDetails } from '../../helpers/ageWeightSelectors';
import { IPatientVariableInfuionDrug } from '../../PatientSpecificViews/IPatientVariableInfusionDrug';
import { IEntityVariableInfusionDrug } from '@/services/db';
import { mapProperties } from '../../helpers/mapProperties';

export function getVariableInfusionsForPt(infusions: IEntityVariableInfusionDrug[], ageMonths: number, weightKg: number): IPatientVariableInfuionDrug[] {
    if (weightKg > maxWeight) { weightKg = maxWeight; }
    if (weightKg < minWeight) { throw new Error(`weight of ${weightKg * 1000}g below lower limit of ${minWeight * 1000}g`); }
    const ageWt: IAgeWeightDetails = { ageMonths, weightKg };
    const returnVar = new Array<IPatientVariableInfuionDrug>(infusions.length);
    let insert = 0;
    for (const i of infusions) {
        const d = filterByAgeWeight(ageWt, i.variableTimeDilutions);
        if (d.length === 1) {
            const newVar = mapProperties({} as IPatientVariableInfuionDrug, i, ['abbrev', 'drugReferenceSource', 'drugRoute', 'fullname', 'infusionDiluent', 'note', 'siPrefix', 'siUnitId']);
            newVar.dilution = d[0];
            newVar.dilution.concentrations = d[0].variableTimeConcentrations;
            returnVar[insert++] = newVar;
        } else if (d.length > 1) {
            throw Error('Database contains corrupt weight/age ranges for infusion '
             + (i.abbrev || i.fullname));
        }
    }
    returnVar.length = insert;
    return returnVar;
}