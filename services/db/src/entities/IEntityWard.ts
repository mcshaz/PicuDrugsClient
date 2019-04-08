import { IEntityDefibModel } from './IEntityDefibModel';

export interface IEntityWard {
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
    bolusDrugIds: Array<number | string>;
}
