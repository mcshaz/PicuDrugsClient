import { fileFetch } from './../../../test-resources/FileFetch';
import { expect } from 'chai';
import { DrugsDBLocal } from '../src/injectableImplementations/DrugsLocalDb';
import { ConsoleLogger } from '../src/injectableImplementations/ConsoleLogger';
import fakedb from 'fake-indexeddb';
import dbKeyRange from 'fake-indexeddb/lib/FDBKeyRange';
import { IFetch } from '..';
import { IServerChanges } from '../src/ServerCommunication/IServerChanges';
import { appDataType } from '../src/entities/enums/appDataType';
import { IAppData } from '../src/entities/IAppData';

describe('setup full local db from JSON', () => {
    const takeUpTo = 3;
    let db: DrugsDBLocal;
    let dbInit: IServerChanges;
    before('initialize db', () => {
        const fetch: IFetch = {
            getUpdates: async () => {
                dbInit = await fileFetch.getUpdates(null);
                for (const p of Object.keys(dbInit.data)) {
                    (dbInit.data as any)[p] = (dbInit.data as any)[p].slice(0, takeUpTo);
                }
                return dbInit;
            },
        };
        const promise = new Promise((resolve, reject) => {
            window.addEventListener('unhandledrejection', (ev) => reject(ev.reason)); // throw instead of reject for better error messages
            db = new DrugsDBLocal(fetch, new ConsoleLogger(), fakedb, dbKeyRange);
            db.on('ready', () => resolve('db ready'));
        });
        return promise;
    });
    describe('data is added appropriately', () => {
        it('has entities added', async () => {
            const wards = await db.wards.toArray();
            expect(wards, 'wards').to.have.deep.members(dbInit.data.wards);
            const boluses = await db.bolusDrugs.toArray();
            expect(boluses, 'boluses').to.have.deep.members(dbInit.data.bolusDrugs);
            const infusionDrugs = await db.infusionDrugs.toArray();
            expect(infusionDrugs, 'infusionDrugs').to.have.deep.members(dbInit.data.infusionDrugs);
            const fixedDrugs = await db.fixedDrugs.toArray();
            expect(fixedDrugs, 'fixedDrugs').to.have.deep.members(dbInit.data.fixedDrugs);
            const defibModels = await db.defibModels.toArray();
            expect(defibModels, 'defibModels').to.have.deep.members(dbInit.data.defibModels);
            const updates = await db.appData.get(appDataType.lastFetchServer) as IAppData;
            expect(updates.data, 'updates.data [date]').to.equal(dbInit.updateCheckStart.toString());
        });

    });
});
    /*
    // using an in memory tester at the moment - will need to reinstate below if using a real database so tests begin in empty state
    after(async () => {
        for (const r of [db.wards, db.bolusDrugs, db.defibModels, db.fixedDrugs, db.appData]) {
            await r.clear();
        }
    });
    */
