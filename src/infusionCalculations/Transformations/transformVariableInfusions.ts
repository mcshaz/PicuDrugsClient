import { VariableInfusionDrugVM } from './../PresentationClasses/VariableInfusionDrugVM';
import { NumericRange } from './../Utilities/NumericRange';
import { IVariableInfusionView } from '../EntityViewClasses/IVariableInfusionView';
import { tranformIInfusion } from './TranformIInfusion';
import { VariableConcentrationDetailVM } from './../PresentationClasses/VariableConcentrationDetailVM';
import { transformViewToRelations } from './transformViewToRelations';

export function transformVariableInfusions(weight: number, infusions: IVariableInfusionView[]): VariableInfusionDrugVM[] {
  const returnVar: VariableInfusionDrugVM[] = []; // (infusions.length);
  for (const i of transformViewToRelations(infusions)) {
    const Viv = i as IVariableInfusionView;

    const d = new VariableInfusionDrugVM();
    d.DrugName = Viv.Fullname;
    d.Link = Viv.HrefBase + Viv.HrefPage;
    d.DoseRange = new NumericRange(Viv.RateMin, Viv.RateMax);
    d.Note = Viv.Note || '';
    d.InfusionDetails = [];
    returnVar.push(d);
    tranformIInfusion(weight, i, d, (icc) => {
      const ic = icc as IVariableInfusionView;
      const cd = new VariableConcentrationDetailVM();
      cd.DetailName = ic.Category || ic.Abbrev;
      d.InfusionDetails.push(cd);
      return cd;
    });
    for (const c of d.InfusionDetails) {
      c.FlowRange = NumericRange.op_Division(d.DoseRange, c.OneMlHrDose);
    }
  }
  return returnVar;
}

