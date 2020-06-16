import { IEntityDefibModel } from './IEntityDefibModel';

export type definedCharts = 'bolus' | 'infusion' | 'svt' | 'anaphylaxis' | 'seizure';

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
    defaultCharts: definedCharts[];
    isNicu: boolean;
    lastUpdated: Date;

    infusionSortOrderings: number[];
    bolusSortOrderings: Array<number | string>;
}
