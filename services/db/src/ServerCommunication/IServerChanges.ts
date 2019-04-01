import { IFixedDrug } from './../entities/BolusDrugs/IFixedDrug';
import { IEntityDefibModel } from '../entities/IEntityDefibModel';
import { INewServerDeletions } from './IEntityDeletion';
import { IEntityWard } from '../entities/IEntityWard';
import { IContextInfusionDrug } from '../entities/InfusionDrugs/IContextInfusionDrugBase';
import { IContextBolusDrug } from '../entities/BolusDrugs/IContextBolusDrug';

export interface IServerChanges {
    updateCheckStart: Date;
    data: {
        deletions: INewServerDeletions[];
        wards: IEntityWard[];
        infusionDrugs: IContextInfusionDrug[];
        bolusDrugs: IContextBolusDrug[];
        defibModels: IEntityDefibModel[];
        fixedDrugs: IFixedDrug[];
    };
}
