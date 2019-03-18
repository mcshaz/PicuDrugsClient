import Dexie from "dexie";
import { IWard } from "../entities/IWard";
import { IContextInfusionDrug } from "../entities/IContextInfusionDrugBase";
import { IContextBolusDrug } from "../entities/IContextBolusDrug";
import { IDeletionDate } from "../entities/IDeletionDate";

export interface IDrugDB
{
    wards: Dexie.Table<IWard, number>; // number = type of the primkey
    infusionDrugs: Dexie.Table<IContextInfusionDrug, number>;
    bolusDrugs: Dexie.Table<IContextBolusDrug, number>;
    deletionDates: Dexie.Table<IDeletionDate, number>;
}