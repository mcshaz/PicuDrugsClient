import { IEntityDefibModel } from './IEntityDefibModel';
import { IEntityUpdated } from './IEntityUpdated';

export interface IEntityWard extends IEntityUpdated {
    wardId: number;
    abbrev: string;
    fullname: string;
    defib: IEntityDefibModel;
    isLive: boolean;
    paddingInCm: number;
    bolusChartHeader: string;
    bolusChartFooter: string;
    infusionChartHeader: string;
    defaultBolusOnly: boolean;
    isNicu: boolean;
    lastUpdated: Date;

    infusionDrugIds: number[];
    bolusDrugIds: number[];
}
