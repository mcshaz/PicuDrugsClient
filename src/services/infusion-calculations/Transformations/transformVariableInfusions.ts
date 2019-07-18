import { IVariableInfusionDrugVM } from '../PresentationClasses/VariableInfusionDrugVM';
import { NumericRange } from '../Utilities/NumericRange';
import { tranformIInfusion } from './TranformIInfusion';
import { IPatientVariableInfuionDrug } from '../PatientSpecificViews/IPatientVariableInfusionDrug';
import { IVariableConcentrationDetailVM } from '../PresentationClasses/VariableConcentrationDetailVM';
import { diluentFluidName } from '@/services/drugDb';

export function transformVariableInfusions(weight: number, infusions: IPatientVariableInfuionDrug[]): IVariableInfusionDrugVM[] {
  const returnVar: IVariableInfusionDrugVM[] = new Array(infusions.length);
  let nextIndex = 0;
  for (const inf of infusions) {
    const d = {
      drugName: inf.fullname,
      diluent: diluentFluidName(inf.infusionDiluentId),
      link: inf.drugReferenceSource.hyperlink + inf.dilution.referencePage,
      doseRange: new NumericRange(inf.dilution.rateMin, inf.dilution.rateMax),
      note: inf.note || '',
      concentrations: [] as IVariableConcentrationDetailVM[],
    } as IVariableInfusionDrugVM;
    returnVar[nextIndex++] = d;
    tranformIInfusion(weight, inf, d);
    for (let i = 0; i < d.concentrations.length; i++) {
      const c = d.concentrations[i];
      c.flowRange = NumericRange.op_Division(d.doseRange, c.oneMlHrDose);
      c.detailName = inf.dilution.concentrations[i].doseCat || inf.abbrev;
    }
  }
  returnVar.length = nextIndex;
  return returnVar;
}

