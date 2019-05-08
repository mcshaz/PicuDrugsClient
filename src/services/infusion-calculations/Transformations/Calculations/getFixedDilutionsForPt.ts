import { IEntityFixedInfusionDrug } from '@/services/drugDb';
import { maxWeight, minWeight } from '@/services/drugDb/helpers/fieldConstants';
import { IAgeWeightDetails, filterByAgeWeight } from '../../helpers/ageWeightSelectors';
import { IPatientFixedInfusionDrug, IPatientFixedDilution, IPatientFixedConcentration } from '../../PatientSpecificViews/IPatientFixedInfusionDrug';
import { mapProperties } from '../../helpers/mapProperties';

export function getFixedDilutionsForPt(drug: IEntityFixedInfusionDrug, ageMonths: number, weightKg: number): IPatientFixedInfusionDrug | undefined {
    if (weightKg > maxWeight) { weightKg = maxWeight; }
    if (weightKg < minWeight) { throw new Error(`weight of ${weightKg * 1000}g below lower limit of ${minWeight * 1000}g`); }
    const ageWt: IAgeWeightDetails = { ageMonths, weightKg };
    let newVar: IPatientFixedInfusionDrug | undefined;
    const d = filterByAgeWeight(ageWt, drug.fixedTimeDilutions);
    if (d.length === 1) {
        newVar = mapProperties({} as IPatientFixedInfusionDrug, drug, ['abbrev', 'drugReferenceSource', 'drugRoute', 'fullname',
                                                                      'infusionDiluent', 'note', 'siPrefix', 'siUnitId']);
        newVar.dilution = mapProperties({} as IPatientFixedDilution, d[0], ['dilutionMethodId', 'isPerMin', 'referencePage', 'siPrefix']);
        let lastStopMins = 0;
        newVar.dilution.concentrations = d[0].fixedTimeConcentrations.map((c) => {
            const nc = mapProperties({} as IPatientFixedConcentration, c, ['concentration', 'rate', 'stopMinutes', 'volume']);
            nc.durationMinutes = nc.stopMinutes - lastStopMins;
            lastStopMins = nc.stopMinutes;
            return nc;
        });
    } else if (d.length > 1) {
        throw Error('Database contains corrupt weight/age ranges for infusion '
            + (drug.abbrev || drug.fullname));
    }
    return newVar;
}
