export type flowchartTypes = 'svt' | 'anaphylaxis' | 'seizures';

export interface IWardDefaults { wardAbbrev: string; bolusOnly: boolean; flowchartType: flowchartTypes[]; formalSet: boolean; }

export interface IAppData {
    getWardDefaults(): PromiseLike<IWardDefaults | undefined>;
    setWardDefaults(wardDefaults: IWardDefaults): Promise<number | void>;
}
