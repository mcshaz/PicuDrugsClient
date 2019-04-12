import { EmptyLogger } from '@/services/db/injectableImplementations/EmptyLogger';
import { fileFetch } from '../../test-resources/FileFetch';
import { expect } from 'chai';
import { DrugsDBLocal } from '@/services/db/injectableImplementations/DrugsDBLocal';
import fakedb from 'fake-indexeddb';
import dbKeyRange from 'fake-indexeddb/lib/FDBKeyRange';
import { IFetch } from '@/services/db';
import { appDataType } from '@/services/db/entities/enums/appDataType';
import { IAppData } from '@/services/db/entities/IAppData';
import { DbTestTableHelpers } from './DbTestTableHelpers';

describe('setup full local db from JSON', () => {
    const takeUpTo = 3;
    let db: DrugsDBLocal;
    const allTables = new DbTestTableHelpers();
    let updated: Date;
    before('initialize db', () => {
        const fetch: IFetch = {
            getUpdates: async () => {
                const dbInit = await fileFetch.getUpdates(null);
                dbInit.updateCheckStart = updated = new Date();
                allTables.forEach((t) => {
                    t.entities = dbInit.data[t.name] = dbInit.data[t.name].slice(0, takeUpTo + 1);
                    dbInit.data.deletions.push({
                        table: t.tableCode,
                        deletionIds: t.entities.slice(-1)
                            .map((d) => t.getId(d)),
                    });
                });
                return dbInit;
            },
        };
        const promise = new Promise((resolve, reject) => {
            window.addEventListener('unhandledrejection', (ev) => reject(ev.reason)); // throw instead of reject for better error messages
            db = new DrugsDBLocal(fetch, new EmptyLogger(), true, fakedb, dbKeyRange);
            allTables.setDb(db);
            db.on('ready', () => resolve('db ready'));
        });
        return promise;
    });
    it('has at least 1 test entity after deleting 1', () => {
        allTables.forEach((t) => {
            expect(t.entities!.length).to.be.gte(2);
        });
    });
    describe('data is added appropriately', () => {
        allTables.forEach((t) => {
            it(`has ${t.name} added`, async () => {
                const removedEntity = t.entities!.pop();
                const dexieEntities = await t.table!.toArray();
                expect(dexieEntities).to.have.same.deep.members(t.entities!);
                expect(dexieEntities).to.not.deep.include(removedEntity);
                expect(dexieEntities.map((e) => t.getId(e))).to.not.include(t.getId(removedEntity));
            });
        });
        it('has updated DB with server time', async () => {
            const updates = await db.appData.get(appDataType.lastFetchServer) as IAppData;
            expect(updates.data, 'updates.data [date]').to.equal(updated.toString());
        });
    });
    after('delete db', async () => {
        await db.delete();
    });
});
