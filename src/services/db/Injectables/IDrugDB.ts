import Dexie from './../../../../../Dexie.js/dist/dexie'; //todo swap this back to dexie
import { IEntityWard } from '../entities/IEntityWard';
import { IEntityInfusion } from '../entities/InfusionDrugs/IEntityInfusionDrug';
import { IEntityBolusDrug } from '../entities/BolusDrugs/IEntityBolusDrug';
import { IEntityDefibModel } from '../entities/IEntityDefibModel';
import { IEntityFixedDrug } from '../entities/BolusDrugs/IFixedDrug';
import { IAppData } from '../entities/IAppData';
// import { IEntityFixedInfusionDrug } from '../entities/InfusionDrugs/IEntityFixedInfusionDrug';

export interface IDrugDB {
    wards: Dexie.Table<IEntityWard, number>; // number = type of the primkey
    infusionDrugs: Dexie.Table<IEntityInfusion, number>;
    bolusDrugs: Dexie.Table<IEntityBolusDrug, number>;
    defibModels: Dexie.Table<IEntityDefibModel, number>;
    fixedDrugs: Dexie.Table<IEntityFixedDrug, number>;
    appData: Dexie.Table<IAppData, number>;
    // allFixedInfusionDrugs: () => Promise<IEntityFixedInfusionDrug[]>;
}
