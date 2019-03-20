import { VariableInfusionDrugVM } from './../PresentationClasses/VariableInfusionDrugVM'
import { NumericRange } from './../Utilities/NumericRange'
import { VariableInfusionView } from './../EntityViewClasses/VariableInfusionView';
import { tranformIInfusion } from './TranformIInfusion';
import { VariableConcentrationDetailVM } from './../PresentationClasses/VariableConcentrationDetailVM';
import { transformViewToRelations } from './transformViewToRelations';

export function transformVariableInfusions(weight: number, infusions: VariableInfusionView[]): VariableInfusionDrugVM[]
{
	let returnVar : VariableInfusionDrugVM[] = [];//(infusions.length);
	for (const i of transformViewToRelations(infusions))
	{
		let Viv = i as VariableInfusionView;

		let d = new VariableInfusionDrugVM();
		d.DrugName = Viv.Fullname;
		d.Link = Viv.HrefBase + Viv.HrefPage;
		d.DoseRange = new NumericRange(Viv.RateMin, Viv.RateMax);
		d.Note = Viv.Note || "";
		d.InfusionDetails = [];
		returnVar.push(d);
		tranformIInfusion(weight,i,d,icc=> {
			var ic = icc as VariableInfusionView;
			var cd = new VariableConcentrationDetailVM();
			cd.DetailName = ic.Category || ic.Abbrev
			d.InfusionDetails.push(cd);
			return cd;
		});
		for (const c of d.InfusionDetails)
		{
			c.FlowRange = NumericRange.op_Division(d.DoseRange,c.OneMlHrDose);
		}
	}
	return returnVar;
}

