import 'reflect-metadata';
import 'whatwg-fetch';
import { injectable } from 'inversify';
import { IFetchUpdates, IRegisterEmail } from '../Injectables/IFetch';
import { IServerChanges } from '../ServerCommunication/IServerChanges';

@injectable()
export class BrowserFetch implements IFetchUpdates, IRegisterEmail {
    private static getDbUpdatesUrl = process.env.VUE_APP_BASE_ROUTE! + process.env.VUE_APP_DBJSON!;
    private static subscribeDbChangesUrl = process.env.VUE_APP_BASE_ROUTE! + process.env.VUE_APP_SubscribeChanges!;

    public async getDbUpdates(lastServerCheckUtc: Date | null) {
      const query = '?lastServerCheckUtc=' + lastServerCheckUtc;
      const response = await fetch(BrowserFetch.getDbUpdatesUrl + query, {
        credentials: 'same-origin', // 'include', default: 'omit'
        method: 'GET', // 'GET', 'PUT', 'DELETE', etc.,
      });
      if (!response.ok) {
        throw new Error(errorData(response));
      }
      return response.json() as Promise<IServerChanges>;
    }

    // http://vuejs-templates.github.io/webpack/proxy.html
    public async notifyOfDbChanges(email: string, WardId: number) {
      switch (process.env.NODE_ENV) {
        case 'production':

          const response = await fetch(BrowserFetch.subscribeDbChangesUrl, {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ email, WardId }),
          });
          if (!response.ok) {
            throw new Error(errorData(response));
          }
          break;
        case 'development':
          return new Promise<void>((resolve) => setTimeout(() => resolve(void 0), 800));
        default:
          throw new Error(`not set for process.env.NODE_ENV==='${process.env.NODE_ENV}'`);
      }
    }
}

function errorData(response: Response) {
  return response.status + ':' + response.statusText;
}
