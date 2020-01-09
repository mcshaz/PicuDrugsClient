import { EmptyLogger } from '@/services/drugDb/injectableImplementations/EmptyLogger';
import { fileFetch } from '../../test-resources/FileFetch';
import { expect } from 'chai';
import { DrugsDBLocal } from '@/services/drugDb/injectableImplementations/DrugsDBLocal';
import fakedb from 'fake-indexeddb';
import dbKeyRange from 'fake-indexeddb/lib/FDBKeyRange';
import { IFetchUpdates } from '@/services/drugDb';
import { appDataType } from '@/services/drugDb/entities/enums/appDataType';
import { IDbAppData } from '@/services/drugDb/entities/IAppData';
import { DbTestTableHelpers } from './DbTestTableHelpers';

describe('setup full local db from JSON', () => {
  const takeUpTo = 3;
  let db: DrugsDBLocal;
  const allTables = new DbTestTableHelpers();
  let updated: Date;
  before('initialize db', () => {
    const fetch: IFetchUpdates = {
      getDbUpdates: async() => {
        const dbInit = await fileFetch.getDbUpdates(null);
        dbInit.updateCheckStart = updated = new Date();
        allTables.forEach((t) => {
          t.entities = dbInit.data[t.name].slice(0, takeUpTo + 1);
          dbInit.data[t.name] = t.entities;
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
      db = new DrugsDBLocal(fetch, new EmptyLogger(), fakedb, dbKeyRange);
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
      it(`has ${t.name} added`, async() => {
        const removedEntity = t.entities!.pop();
        const dexieEntities = await t.table!.toArray();
        expect(dexieEntities).to.have.same.deep.members(t.entities!);
        expect(dexieEntities).to.not.deep.include(removedEntity);
        expect(dexieEntities.map((e) => t.getId(e))).to.not.include(t.getId(removedEntity));
      });
    });
    it('has updated DB with server time', async() => {
      const updates = await db.appData.get(appDataType.lastFetchServer) as IDbAppData;
      expect(updates.data, 'updates.data [date]').to.equal(updated.toString());
    });
  });
  after('delete db', async() => {
    await db.delete();
  });
});
