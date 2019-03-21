import { IDefib } from './IDefib';
import { ILastUpdated } from './ILastUpdated';

export interface IWard extends ILastUpdated {
    WardId: number;
    Abbrev: string;
    Fullname: string;
    Defib: IDefib;
    IsLive: boolean;
    PaddingInCm: number;
    BolusChartHeader: string;
    BolusChartFooter: string;
    InfusionChartHeader: string;
    DefaultBolusOnly: boolean;
    IsNicu: boolean;
    LastUpdated: Date;

    infusionDrugIds: number[];
    bolusDrugIds: number[];
}
