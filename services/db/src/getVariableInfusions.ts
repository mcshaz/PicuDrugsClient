import { IContextVariableInfusionDrug } from './entities/InfusionDrugs/IContextVariableInfusionDrug';
import 'reflect-metadata';
import { IEntityWard } from './entities/IEntityWard';
import { IViewVariableInfuionDrug } from './PatientSpecificViews/IViewVariableInfusionDrug';
import { drugDbContainer } from './inversify.config';
import { IDrugDB } from './Injectables/IDrugDB';
import { TYPES } from './types';
import { minWeight, maxWeight } from './helpers/fieldConstants';
import { filterByAgeWeight, IAgeWeightDetails } from './helpers/ageWeightSelectors';

export async function getVariableInfusions(ward: IEntityWard, ageMonths: number, weightKg: number) {
    if (ward.infusionDrugIds.length === 0) {
        return [];
    }
    if (weightKg > maxWeight) { weightKg = maxWeight; }
    if (weightKg < minWeight) { throw new Error(`weight of ${weightKg * 1000}g below lower limit of ${minWeight * 1000}g`); }
    const ageWt: IAgeWeightDetails = { ageMonths, weightKg };
    const db = drugDbContainer.get<IDrugDB>(TYPES.IDrugDB);
    const infusions = await db.infusionDrugs.where('infusionDrugId')
        .anyOf(ward.infusionDrugIds)
        .toArray() as IContextVariableInfusionDrug[];
    const returnVar: IViewVariableInfuionDrug[] = [];
    for (const i of infusions) {
        const d = filterByAgeWeight(ageWt, i.dilutions);
        if (d.length === 1) {
            (i.dilutions as any) = null;
            const v = (i as unknown as IViewVariableInfuionDrug);
            v.Dilution = d[0];
            returnVar.push(v);
        } else if (d.length > 1) {
            throw Error('Database contains corrupt weight/age ranges for infusion '
             + (i.abbrev || i.fullname));
        }
    }
    return returnVar;
}
