import Dexie from 'dexie';
import { IEntityWard } from '../entities/IEntityWard';
import { IContextInfusionDrug } from '../entities/InfusionDrugs/IContextInfusionDrugBase';
import { IContextBolusDrug } from '../entities/BolusDrugs/IContextBolusDrug';
import { IEntityDefibModel } from '../entities/IEntityDefibModel';
import { IFixedDrug } from '../entities/BolusDrugs/IFixedDrug';

export interface IDrugDB {
    wards: Dexie.Table<IEntityWard, number>; // number = type of the primkey
    infusionDrugs: Dexie.Table<IContextInfusionDrug, number>;
    bolusDrugs: Dexie.Table<IContextBolusDrug, number>;
    defibModels: Dexie.Table<IEntityDefibModel, number>;
    fixedDrugs: Dexie.Table<IFixedDrug, number>;
}
