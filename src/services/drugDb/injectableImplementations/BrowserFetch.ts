import 'reflect-metadata';
import 'whatwg-fetch';
import { injectable } from 'inversify';
import { IFetch } from '../Injectables/IFetch';
import { IServerChanges } from '../ServerCommunication/IServerChanges';

@injectable()
export class BrowserFetch implements IFetch {
    private static url = process.env.VUE_APP_BASE_URL! + process.env.VUE_APP_DBJSON!;
    public async getUpdates(lastServerCheckUtc: Date | null) {
        const query = '?lastServerCheckUtc=' + lastServerCheckUtc;
        const response = await fetch(BrowserFetch.url + query, {
                                    credentials: 'same-origin', // 'include', default: 'omit'
                                    method: 'GET', // 'GET', 'PUT', 'DELETE', etc.,
                                });
        return response.json() as Promise<IServerChanges>;
    }
}
