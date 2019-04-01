import { IContextDrug } from '../EntityViewClasses/EntityInterfaces/IContextDrug';
import { IContextConcentration } from '../EntityViewClasses/EntityInterfaces/IContextConcentration';

export function transformViewToRelations(view: Array<IContextDrug & IContextConcentration>): IContextDrug[] {
  const returnVar: IContextDrug[] = []; // view.length
  let d: IContextDrug | null = null;
  let conc: IContextConcentration[] | null = null;
  for (const current of view) {
    if (d === null) {
      conc = [];
    } else if (d.InfusionDrugId !== current.InfusionDrugId) {
      d.Concentrations = conc!;
      returnVar.push(d);
      conc = [];
    }
    conc!.push(current as IContextConcentration);
    d = current;
  }
  if (d !== null) {
    d.Concentrations = conc!;
    returnVar.push(d);
  }
  return returnVar;
}

