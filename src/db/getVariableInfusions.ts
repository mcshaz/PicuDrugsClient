import { IContextVariableInfusionDrug } from './entities/IContextVariableInfusionDrug';
import "reflect-metadata";
import { ChildAge } from './../infusionCalculations';
import { drugsDBLocal } from './injectableImplementations/drugsLocalDb';
import { IWard } from './entities/IWard';
import { IViewVariableInfuionDrug } from './PatientSpecificViews/IViewVariableInfusionDrug';
import { drugDbContainer } from './inversify.config';
import { IDrugDB } from './Injectables/IDrugDB';
import { TYPES } from './types';

export async function getVariableInfusions(ward:IWard, age:ChildAge, weight:number){
    if (ward.infusionDrugIds.length === 0){
        return [];
    }
    const db = drugDbContainer.get<IDrugDB>(TYPES.IDrugDB);
    const infusions = await db.infusionDrugs.where('infusionDrugId')
        .anyOf(ward.infusionDrugIds)
        .toArray() as IContextVariableInfusionDrug[];
    const returnVar: IViewVariableInfuionDrug[] = [];
    for (const i of infusions){
        const ar = age.getAgeRangeInDays();
        //todo logic goes in here
        const d = i.Dilutions.filter(d=>d.AgeMinMonths < ar.lowerBound);
        if (d.length === 1){
            delete i.Dilutions;
            delete i.LastUpdated;
            const v = (i as unknown as IViewVariableInfuionDrug);
            v.Dilution = d[0];
            returnVar.push(v);
        } else if (d.length > 1){
            throw Error('Database contains corrupt weight/age ranges for infusion '
             + (i.Abbrev || i.Fullname));
        }
    }
    return returnVar;
}