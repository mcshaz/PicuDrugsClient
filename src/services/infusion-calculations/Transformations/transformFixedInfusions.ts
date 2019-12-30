import { FixedInfusionDrugVM } from '../PresentationClasses/FixedInfusionDrugVM'
import { MinutesDuration } from '../PresentationClasses/Duration/MinutesDuration'
import { tranformIInfusion } from './TranformIInfusion'
import { IPatientFixedInfusionDrug } from '../PatientSpecificViews/IPatientFixedInfusionDrug'
import { diluentFluidName } from '@/services/drugDb'

export function transformFixedInfusions (weight: number, ptDrug: IPatientFixedInfusionDrug): FixedInfusionDrugVM {
  const d = new FixedInfusionDrugVM()
  d.drugName = ptDrug.fullname
  d.infusionDrugId = ptDrug.infusionDrugId
  d.note = ptDrug.note || ''
  d.sourceHref = ptDrug.drugReferenceSource.hyperlink + ptDrug.dilution.referencePage
  d.sourceDescription = ptDrug.drugReferenceSource.referenceDescription
  d.route = ptDrug.drugRoute.description
  d.diluentFluid = diluentFluidName(ptDrug.infusionDiluentId)
  // let cumulativeDuration = new MinutesDuration();
  tranformIInfusion(weight, ptDrug, d)
  const ampConversion = Math.pow(10, ptDrug.dilution.siPrefix - ptDrug.siPrefix)
  for (let i = 0; i < d.concentrations.length; i++) {
    const v = ptDrug.dilution.concentrations[i]
    const p = d.concentrations[i]
    p.infusionRate = v.rate / p.oneMlHrDose
    const unitsPerMin = v.rate / (d.rateUnit!.isPerMin ? 1 : 60)
    p.calculatedDose = unitsPerMin * v.durationMinutes * ampConversion
    // p.diluentVolume = p.finalVolume - p.ampuleMl;
    p.cumulativeStartTime = new MinutesDuration(v.stopMinutes - v.durationMinutes),
    p.duration = new MinutesDuration(v.durationMinutes)
  }
  return d
}
