import { definedCharts } from '../entities/IEntityWard';

export interface IWardDefaults { wardAbbrev: string; chartTypes: definedCharts[]; formalSet: boolean }

export interface IAppData {
    getWardDefaults(): PromiseLike<IWardDefaults | undefined>;
    setWardDefaults(wardDefaults: IWardDefaults): Promise<number | void>;
}
