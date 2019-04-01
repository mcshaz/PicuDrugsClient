import { IServerChanges } from '../ServerCommunication/IServerChanges';

export interface IFetch {
    getUpdates: (lastServerCheckUtc: Date | null) => Promise<IServerChanges>;
}
