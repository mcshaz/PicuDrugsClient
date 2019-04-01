import { SiUnitMeasure } from './../PresentationClasses/Dosing/SiUnitMeasure';
import { InfusionRateUnit } from './../PresentationClasses/Dosing/InfusionRateUnit';
import { IContextDrug } from './../EntityViewClasses/EntityInterfaces/IContextDrug';
import { IContextConcentration } from './../EntityViewClasses/EntityInterfaces/IContextConcentration';
import { IInfusionDrugVM } from './../PresentationClasses/Interfaces/IInfusionDrugVM';
import { IConcentrationDetailVM } from './../PresentationClasses/Interfaces/IConcentrationDetailVM';
import { getVariableDilutionVolumeMls } from './Calculations/getVariableDilutionVolumeMls';
import { getDilutionMethod } from './Calculations/getDilutionMethod';
import { IContextFixedConc } from './../EntityViewClasses/EntityInterfaces/IContextFixedConc';
import * as fieldConst from './../Utilities/fieldConstants';

export function tranformIInfusion(weight: number, contextDrug: IContextDrug, newDrug: IInfusionDrugVM, makeAndAddNewConcentration: (arg: IContextConcentration) => IConcentrationDetailVM): void {
  if (weight < fieldConst.minWeight || weight > fieldConst.maxWeight) {
    throw new Error(fieldConst.wtErr);
  }

  newDrug.DrawingUpUnits = new SiUnitMeasure(contextDrug.AmpulePrefix, contextDrug.SiUnit);
  const method = getDilutionMethod(contextDrug.DilutionMethod);
  newDrug.RateUnit = new InfusionRateUnit(contextDrug.InfusionPrefix, contextDrug.SiUnit, method.isPerKg, contextDrug.IsPerMin);
  const ampConvFact = Math.pow(10, contextDrug.InfusionPrefix - contextDrug.AmpulePrefix);

  let workingWt = 0;
  let dilVol = 0;
  if (method.isVaryConcentration) {
    if (method.isVaryVolume) {
      workingWt = Math.trunc(weight / 2) * 2; // this decrease in acuracy to round to the weight to the nearest even integer is so that the volumes follow the PICU chart
      dilVol = getVariableDilutionVolumeMls(workingWt);
    } else {
      workingWt = weight;
    }
  }

  for (const contextConcentration of contextDrug.Concentrations!) {
    const newConc = makeAndAddNewConcentration(contextConcentration);
    newConc.IsNeat = method.isNeat;
    if (method.isVaryConcentration) {
      if (!method.isVaryVolume) {
        dilVol = contextConcentration.Volume!;
      }
      newConc.FinalVolume = Math.round(dilVol);
      // uses conc
      newConc.DrawingUpDose = contextConcentration.Concentration * dilVol * workingWt * (contextDrug.IsPerMin ? 60 : 1) * ampConvFact;
      newConc.OneMlHrDose = contextConcentration.Concentration;
    } else {
      if (method.isVaryVolume) {
        // vary Volume && !vary Concentration = Volume in mL per kg
        newConc.FinalVolume = contextConcentration.Volume! * weight;
        newConc.DrawingUpDose = contextConcentration.Concentration * (contextDrug.IsPerMin ? 60 : 1) * newConc.FinalVolume;
        newConc.OneMlHrDose = contextConcentration.Concentration / weight;
      } else {
        newConc.OneMlHrDose = method.isPerKg
          ? (contextConcentration.Concentration / weight)
          : contextConcentration.Concentration;
        if (contextConcentration.Volume) {
          newConc.FinalVolume = contextConcentration.Volume;
          newConc.DrawingUpDose = newConc.FinalVolume * contextConcentration.Concentration * ampConvFact * (contextDrug.IsPerMin ? 60 : 1);
        } else {
          const fixConc = contextConcentration as IContextFixedConc;
          // ??final concentration rather than concentration
          newConc.DrawingUpDose = fixConc.Rate * ampConvFact * fixConc.StopMins * (method.isPerKg ? weight : 1) / (contextDrug.IsPerMin ? 1 : 60);
          newConc.FinalVolume = newConc.DrawingUpDose / (fixConc.Concentration * ampConvFact);
        }
      }
    }
  }
}

