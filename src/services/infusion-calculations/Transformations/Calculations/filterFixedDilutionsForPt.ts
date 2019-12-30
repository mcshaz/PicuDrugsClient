import { IEntityFixedInfusionDrug } from '@/services/drugDb'
import { maxWeight, minWeight } from '@/services/drugDb/helpers/fieldConstants'
import { IAgeWeightDetails, filterByAgeWeight } from '../../helpers/ageWeightSelectors'
import { IPatientFixedInfusionDrug, IPatientFixedDilution, IPatientFixedConcentration } from '../../PatientSpecificViews/IPatientFixedInfusionDrug'
import { mapProperties } from '../../helpers/mapProperties'

// default age 600 = 1/2 of max
export function filterFixedDilutionsForPt (drug: IEntityFixedInfusionDrug, weightKg: number, ageMonths?: number): IPatientFixedInfusionDrug | undefined {
  return filterFixedInfusionsForPt([drug], weightKg, ageMonths)[0]
}
export function filterFixedInfusionsForPt (infusions: IEntityFixedInfusionDrug[], weightKg: number, ageMonths: number = 600): IPatientFixedInfusionDrug[] {
  if (weightKg > maxWeight) { weightKg = maxWeight }
  if (weightKg < minWeight) { throw new Error(`weight of ${weightKg * 1000}g below lower limit of ${minWeight * 1000}g`) }
  const ageWt: IAgeWeightDetails = { ageMonths, weightKg }
  const returnVar = new Array<IPatientFixedInfusionDrug>(infusions.length)
  let insert = 0
  for (const i of infusions) {
    const d = filterByAgeWeight(ageWt, i.fixedTimeDilutions)
    if (d.length === 1) {
      const newVar = mapProperties({} as IPatientFixedInfusionDrug, i, ['abbrev', 'drugReferenceSource', 'drugRoute', 'fullname',
        'infusionDiluentId', 'infusionDrugId', 'note', 'siPrefix', 'siUnitId', 'drugAmpuleConcentrations'])
      newVar.dilution = mapProperties({} as IPatientFixedDilution, d[0], ['dilutionMethodId', 'isPerMin', 'referencePage', 'siPrefix'])
      let lastStopMins = 0
      newVar.dilution.concentrations = d[0].fixedTimeConcentrations.map((c) => {
        const nc = mapProperties({} as IPatientFixedConcentration, c, ['concentration', 'rate', 'stopMinutes', 'volume'])
        nc.durationMinutes = nc.stopMinutes - lastStopMins
        lastStopMins = nc.stopMinutes
        return nc
      })
      returnVar[insert++] = newVar
    } else if (d.length > 1) {
      throw Error('Database contains corrupt weight/age ranges for infusion ' +
                (i.abbrev || i.fullname))
    }
  }
  returnVar.length = insert
  return returnVar
}
