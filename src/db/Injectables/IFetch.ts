import { IEntityDeletion } from '../entities/IEntityDeletion';
import { IWard } from '../entities/IWard';
import { IContextInfusionDrug } from '../entities/IContextInfusionDrugBase';
import { IContextBolusDrug } from '../entities/IContextBolusDrug';

export interface IFetch {
    getUpdates: (mods: IdbMods) => Promise<IServerChanges>;
}

export interface IdbMods {
    wardUpdatedUntil: Date | null;
    infusionsUpdatedUntil: Date | null;
    bolusUpdatedUntil: Date | null;
    wardDeletedUntil: Date | null;
    infusionsDeletedUntil: Date | null;
    bolusDeletedUntil: Date | null;
}

export interface IServerChanges {
    deletions: IEntityDeletion[];
    wards: IWard[];
    infusions: IContextInfusionDrug[];
    boluses: IContextBolusDrug[];
    [key: string]: any[];
}
