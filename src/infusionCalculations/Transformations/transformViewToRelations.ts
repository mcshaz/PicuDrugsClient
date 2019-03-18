import { IContextDrug } from "../EntityViewClasses/EntityInterfaces/IContextDrug";
import { IContextConcentration } from "../EntityViewClasses/EntityInterfaces/IContextConcentration";

export function transformViewToRelations(view: (IContextDrug & IContextConcentration)[]): IContextDrug[]
{
	let returnVar: IContextDrug[] = []; //view.length
	let d: IContextDrug = null;
	let conc: IContextConcentration[] = null;
	for(const current of view) {
		if (d === null)
		{
			conc = [];
		}
		else if (d.InfusionDrugId !== current.InfusionDrugId)
		{
			d.Concentrations = conc;
			returnVar.push(d);
			conc = [];
		}
		conc.push(current as IContextConcentration);
		d = current;
	}
	if (d !== null)
	{
		d.Concentrations = conc;
		returnVar.push(d);
	}
	return returnVar;
}

