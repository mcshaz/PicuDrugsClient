import { FixedInfusionDrugVM } from './../PresentationClasses/FixedInfusionDrugVM';
import { MinutesDuration } from './../PresentationClasses/Duration/MinutesDuration';
import { IFixedInfusionView } from '../EntityViewClasses/IFixedInfusionView';
import { tranformIInfusion } from './TranformIInfusion';
import { IContextConcentration } from './../EntityViewClasses/EntityInterfaces/IContextConcentration';
import { FixedInfusionPeriodVM } from './../PresentationClasses/FixedInfusionPeriodVM';
export function transformFixedInfusions(weight: number, views: IFixedInfusionView[]): FixedInfusionDrugVM {
  const v1: IFixedInfusionView = views[0];
  v1.Concentrations = views;
  const d: FixedInfusionDrugVM = new FixedInfusionDrugVM();
  d.DrugName = v1.Fullname;
  d.Note = v1.Note || '';
  d.SourceHref = v1.Hyperlink + v1.ReferencePage;
  d.SourceDescription = v1.ReferenceDescription;
  d.Route = v1.RouteDescription;
  d.DiluentFluid = v1.DiluentType;
  d.InfusionPeriods = [];
  d.AmpuleConcentration = v1.AmpuleConcentration;
  let cumulativeDuration = new MinutesDuration();
  tranformIInfusion(weight, v1, d, (icc: IContextConcentration) => {
    const cd = new FixedInfusionPeriodVM();
    const fiv = icc as IFixedInfusionView;
    cd.Duration = MinutesDuration.op_Subtraction(fiv.StopMins, cumulativeDuration);
    cd.CumulativeStartTime = cumulativeDuration;
    d.InfusionPeriods.push(cd);
    cumulativeDuration = new MinutesDuration(fiv.StopMins);
    return cd;
  });
  const ampConversion = Math.pow(10.0, v1.AmpulePrefix - v1.InfusionPrefix);
  for (let i = 0; i < views.length; i++) {
    const v = views[i];
    const p = d.InfusionPeriods[i];
    p.InfusionRate = v.Rate / p.OneMlHrDose;
    const unitsPerMin = v.Rate / (d.RateUnit!.isPerMin ? 1 : 60);
    p.CalculatedDose = unitsPerMin * p.Duration!.totalMins / ampConversion;
    p.AmpuleMl = p.DrawingUpDose / v1.AmpuleConcentration;
    p.DiluentVolume = p.FinalVolume - p.AmpuleMl;
  }
  return d;
}

