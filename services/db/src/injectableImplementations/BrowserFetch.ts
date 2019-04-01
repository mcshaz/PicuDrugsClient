import { IFetch } from '../Injectables/IFetch';
import { IServerChanges } from '../ServerCommunication/IServerChanges';
/*
import { TYPES } from './../types';
import 'reflect-metadata';
import { inject } from 'inversify';
import { IEntityDeletion } from '../entities/IEntityDeletion';
import { ILogger } from './../Injectables/ILogger';
import { IWard } from './../entities/IWard';
import { IContextInfusionDrug } from './../entities/IContextInfusionDrugBase';
import { IContextBolusDrug } from './../entities/IContextBolusDrug';
*/

export class BrowserFetch implements IFetch {
    private static url = 'https://test.com/api/v1/users';
    // @inject(TYPES.ILogger) private log:ILogger;
    public async getUpdates(lastServerCheckUtc: Date | null) {
        const url = '?lastServerCheckUtc=' + lastServerCheckUtc;
        const response = await fetch(BrowserFetch.url, {
                                    credentials: 'same-origin', // 'include', default: 'omit'
                                    method: 'GET', // 'GET', 'PUT', 'DELETE', etc.,
                                });
        return response.json() as Promise<IServerChanges>;
    }
}
