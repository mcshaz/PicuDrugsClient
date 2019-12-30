import { IServerChanges } from '../ServerCommunication/IServerChanges'

export interface IFetchUpdates {
    getDbUpdates(lastServerCheckUtc: Date | null): Promise<IServerChanges>;
}

export interface IRegisterEmail {
    notifyOfDbChanges(email: string, WardId: number): Promise<void>;
}
