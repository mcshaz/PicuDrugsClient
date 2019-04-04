import { Dexie } from '../../../../../Dexie.js'; //todo swap this back to dexie
import { IEntityWard } from '../entities/IEntityWard';
import { IEntityInfusionDrug } from '../entities/InfusionDrugs/IContextInfusionDrugBase';
import { IEntityBolusDrug } from '../entities/BolusDrugs/IContextBolusDrug';
import { IEntityDefibModel } from '../entities/IEntityDefibModel';
import { IEntityFixedDrug } from '../entities/BolusDrugs/IFixedDrug';

export interface IDrugDB {
    wards: Dexie.Table<IEntityWard, number>; // number = type of the primkey
    infusionDrugs: Dexie.Table<IEntityInfusionDrug, number>;
    bolusDrugs: Dexie.Table<IEntityBolusDrug, number>;
    defibModels: Dexie.Table<IEntityDefibModel, number>;
    fixedDrugs: Dexie.Table<IEntityFixedDrug, number>;
}
