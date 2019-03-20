import { FixedInfusionDrugVM } from './../PresentationClasses/FixedInfusionDrugVM'
import { MinutesDuration } from './../PresentationClasses/Duration/MinutesDuration'
import { FixedInfusionView } from './../EntityViewClasses/FixedInfusionView';
import { tranformIInfusion } from './TranformIInfusion';
import { IContextConcentration } from './../EntityViewClasses/EntityInterfaces/IContextConcentration';
import { FixedInfusionPeriodVM } from './../PresentationClasses/FixedInfusionPeriodVM';
export function transformFixedInfusions(weight: number, views: FixedInfusionView[]): FixedInfusionDrugVM
{
	let v1: FixedInfusionView = views[0];
	v1.Concentrations = views;
	let d: FixedInfusionDrugVM = new FixedInfusionDrugVM();
	d.DrugName = v1.Fullname;
	d.Note = v1.Note;
	d.SourceHref = v1.Hyperlink + v1.ReferencePage;
	d.SourceDescription = v1.ReferenceDescription;
	d.Route = v1.RouteDescription;
	d.DiluentFluid = v1.DiluentType;
	d.InfusionPeriods = [];
	d.AmpuleConcentration = v1.AmpuleConcentration;
	let cumulativeDuration = new MinutesDuration();
	tranformIInfusion(weight, v1, d, (icc: IContextConcentration)=>
	{
		let cd = new FixedInfusionPeriodVM();
		var fiv = icc as FixedInfusionView;
		cd.Duration = MinutesDuration.op_Subtraction(fiv.StopMins, cumulativeDuration);
		cd.CumulativeStartTime = cumulativeDuration;
		d.InfusionPeriods.push(cd);
		cumulativeDuration = new MinutesDuration(fiv.StopMins);
		return cd;
	});
	let ampConversion = Math.pow(10.0, v1.AmpulePrefix - v1.InfusionPrefix);
	for (let i = 0; i < views.length; i++)
	{
		var v = views[i];
		var p = d.InfusionPeriods[i];
		p.InfusionRate = v.Rate / p.OneMlHrDose;
		var unitsPerMin = v.Rate / (d.RateUnit.isPerMin?1:60);
		p.CalculatedDose = unitsPerMin * p.Duration.totalMins / ampConversion;
		p.AmpuleMl = p.DrawingUpDose / v1.AmpuleConcentration;
		p.DiluentVolume = p.FinalVolume - p.AmpuleMl;
	}
	return d;
}

