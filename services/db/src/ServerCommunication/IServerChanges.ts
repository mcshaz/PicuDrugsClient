import { IEntityFixedDrug } from './../entities/BolusDrugs/IFixedDrug';
import { IEntityDefibModel } from '../entities/IEntityDefibModel';
import { INewServerDeletions } from './IEntityDeletion';
import { IEntityWard } from '../entities/IEntityWard';
import { IEntityInfusionDrug } from '../entities/InfusionDrugs/IContextInfusionDrugBase';
import { IEntityBolusDrug } from '../entities/BolusDrugs/IContextBolusDrug';

export interface IServerChanges {
    updateCheckStart: Date;
    data: {
        deletions: INewServerDeletions[];
        wards: IEntityWard[];
        infusionDrugs: IEntityInfusionDrug[];
        bolusDrugs: IEntityBolusDrug[];
        defibModels: IEntityDefibModel[];
        fixedDrugs: IEntityFixedDrug[];
        [index: string]: any[];
    };
}
