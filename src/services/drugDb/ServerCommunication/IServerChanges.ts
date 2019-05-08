import { IEntityFixedDrug } from '../entities/BolusDrugs/IFixedDrug';
import { IEntityDefibModel } from '../entities/IEntityDefibModel';
import { INewServerDeletions } from './IEntityDeletion';
import { IEntityWard } from '../entities/IEntityWard';
import { IEntityInfusion } from '../entities/InfusionDrugs/IEntityInfusionDrug';
import { IEntityBolusDrug } from '../entities/BolusDrugs/IEntityBolusDrug';

export interface IServerChanges {
    updateCheckStart: Date;
    data: {
        deletions: INewServerDeletions[];
        wards: IEntityWard[];
        infusionDrugs: IEntityInfusion[];
        bolusDrugs: IEntityBolusDrug[];
        defibModels: IEntityDefibModel[];
        fixedDrugs: IEntityFixedDrug[];
        [index: string]: any[];
    };
}
