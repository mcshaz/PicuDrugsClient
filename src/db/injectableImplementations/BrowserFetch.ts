import { IdbMods, IFetch, IServerChanges } from "./../Injectables/IFetch";
import { TYPES } from './../types';
import "reflect-metadata";
import { inject } from 'inversify';
import { IEntityDeletion } from "../entities/IEntityDeletion";
import { ILogger } from "./../Injectables/ILogger";
import { IWard } from "./../entities/IWard";
import { IContextInfusionDrug } from "./../entities/IContextInfusionDrugBase";
import { IContextBolusDrug } from "./../entities/IContextBolusDrug";

/*
export class BrowserFetch implements IFetch {
    private static url = 'https://test.com/api/v1/users'
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
        return (await response.json()) as IServerChanges;
    }
}

*/
export class MockFetch implements IFetch {
    private _requests:IdbMods[] = [];
    public get requests():ReadonlyArray<IdbMods> {
        return this._requests;
    }
    async getUpdates(mods: IdbMods){
        this._requests.push(mods);
        return Promise.resolve(this.response);
    }
    constructor(readonly response?: IServerChanges){
        if (!this.response){
            this.response = { deletions: [] as IEntityDeletion[],
                wards: [] as IWard[],
                infusions: [] as IContextInfusionDrug[],
                boluses: [] as IContextBolusDrug[]
            }
        }
    }
}