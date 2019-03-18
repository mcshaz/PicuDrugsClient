import { ILogger } from '../Injectables/ILogger';
import { IdbMods, IFetch, IServerChanges } from "../Injectables/IFetch";
import { TYPES } from '../types';
import "reflect-metadata";
import { inject } from 'inversify';

export class BrowserFetch implements IFetch {
    private static url = 'https://test.com.com/api/v1/users'
    @inject(TYPES.ILogger) private log:ILogger;
    async getUpdates(mods: IdbMods){
        const response =await fetch(BrowserFetch.url, {
                                    credentials: 'same-origin', // 'include', default: 'omit'
                                    method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
                                    body: JSON.stringify(mods), // Coordinate the body type with 'Content-Type'
                                    headers: new Headers({
                                    'Content-Type': 'application/json'
                                    }),
                                });
        return await response.json() as IServerChanges;
    }
}