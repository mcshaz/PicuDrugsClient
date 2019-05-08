import { SiUnitMeasure } from '../PresentationClasses/Dosing/SiUnitMeasure';
import { InfusionRateUnit } from '../PresentationClasses/Dosing/InfusionRateUnit';
import { IInfusionDrugVM } from '../PresentationClasses/Interfaces/IInfusionDrugVM';
import { IConcentrationDetailVM } from '../PresentationClasses/Interfaces/IConcentrationDetailVM';
import { getVariableDilutionVolumeMls } from './Calculations/getVariableDilutionVolumeMls';
import { getDilutionMethod } from './Calculations/getDilutionMethod';
import * as fieldConst from '@/services/drugDb/helpers/fieldConstants';
import { IVariableDilutionInfo } from '@/services/drugDb';
import { IPatientInfuionDrug } from '../PatientSpecificViews/IPatientInfusionDrug';
import { IPatientFixedConcentration } from '../PatientSpecificViews/IPatientFixedInfusionDrug';

export function tranformIInfusion(weight: number, drug: IPatientInfuionDrug, newDrug: IInfusionDrugVM): void {
  if (weight < fieldConst.minWeight || weight > fieldConst.maxWeight) {
    throw new Error(fieldConst.wtErr);
  }
  newDrug.drawingUpUnits = new SiUnitMeasure(drug.siPrefix, drug.siUnitId);
  const method = getDilutionMethod(drug.dilution.dilutionMethodId);
  newDrug.rateUnit = new InfusionRateUnit(drug.dilution.siPrefix, drug.siUnitId, method.isPerKg, drug.dilution.isPerMin);
  const ampConvFact = Math.pow(10, drug.dilution.siPrefix - drug.siPrefix);

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

  const volume = (drug.dilution as any as IVariableDilutionInfo).volume;
  for (const c of drug.dilution.concentrations) {
    const getVolume = () => volume === void 0
      ? (c as any as IPatientFixedConcentration).volume // volume === 0 not valid, so falsey fine
      : volume;
    const newConc = {
      isNeat: method.isNeat,
    } as IConcentrationDetailVM;
    newDrug.concentrations.push(newConc);
    if (method.isVaryConcentration) {
      if (!method.isVaryVolume) {
        dilVol = getVolume()!;
      }
      newConc.finalVolume = Math.round(dilVol);
      // uses conc
      newConc.drawingUpDose = c.concentration * dilVol * workingWt * (drug.dilution.isPerMin ? 60 : 1) * ampConvFact;
      newConc.oneMlHrDose = c.concentration;
    } else {
      if (method.isVaryVolume) {
        // vary Volume && !vary Concentration = Volume in mL per kg
        newConc.finalVolume = getVolume()! * weight;
        newConc.drawingUpDose = c.concentration * (drug.dilution.isPerMin ? 60 : 1) * newConc.finalVolume;
        newConc.oneMlHrDose = c.concentration / weight;
      } else {
        newConc.oneMlHrDose = method.isPerKg
          ? (c.concentration / weight)
          : c.concentration;
        if (getVolume()) {
          newConc.finalVolume = getVolume()!;
          newConc.drawingUpDose = newConc.finalVolume * c.concentration * ampConvFact * (drug.dilution.isPerMin ? 60 : 1);
        } else {
          const fixConc = c as any as IPatientFixedConcentration;
          // ??final concentration rather than concentration
          newConc.drawingUpDose = fixConc.rate * ampConvFact * fixConc.durationMinutes * (method.isPerKg ? weight : 1) / (drug.dilution.isPerMin ? 1 : 60);
          newConc.finalVolume = newConc.drawingUpDose / (fixConc.concentration * ampConvFact);
        }
      }
    }
  }
}

