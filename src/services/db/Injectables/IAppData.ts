export interface IWardDefaults { wardAbbrev: string; boluses: boolean; infusions: boolean; formalSet: boolean; }

export interface IAppData {
    getWardDefaults(): PromiseLike<IWardDefaults | undefined>;
    setWardDefaults(wardDefaults: IWardDefaults): Promise<number | void>;
}
