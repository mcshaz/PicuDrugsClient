import { DrugsDBLocal } from '@/services/drugDb/injectableImplementations/DrugsDBLocal';
import { expect } from 'chai';
import fakedb from 'fake-indexeddb';
import dbKeyRange from 'fake-indexeddb/lib/FDBKeyRange';
import { Substitute, Arg } from '@fluffy-spoon/substitute';
import { IFetchUpdates } from '@/services/drugDb/Injectables/IFetch';
import { fileFetch } from '../../test-resources/FileFetch';
import { IServerChanges } from '@/services/drugDb/ServerCommunication/IServerChanges';
import { DbTestTableHelpers } from './DbTestTableHelpers';
import { dbTableName } from '@/services/drugDb/entities/enums/dbTableName';
import { EmptyLogger } from '@/services/drugDb/injectableImplementations/EmptyLogger';

describe('simple DB tests', () => {
  const emptyFetch = Substitute.for<IFetchUpdates>();
  emptyFetch.getDbUpdates(null).returns(Promise.resolve<IServerChanges>({
    updateCheckStart: new Date(),
    data: {
      deletions: [],
      wards: [],
      infusionDrugs: [],
      bolusDrugs: [],
      defibModels: [],
    },
  }));
  let db: DrugsDBLocal;
  before('can initialize db', () => {
    const promise = new Promise((resolve, reject) => {
      window.addEventListener('unhandledrejection', (ev) => reject(ev.reason));
      db = new DrugsDBLocal(emptyFetch, new EmptyLogger(), fakedb, dbKeyRange);
      db.on('ready', () => resolve('db ready'));
    });
    return promise;
  });
  it('empty DB called IFetch exactly once', () => emptyFetch.received(1).getDbUpdates(Arg.any()));
  it('called IFetch only with null', () => emptyFetch.received(1).getDbUpdates(null));
  describe('single DB table items can be added', () => {
    const allTables = new DbTestTableHelpers();
    before('adding single db items', async() => {
      const allData = await fileFetch.getDbUpdates(null);
      allTables.setDb(db, (e) => {
        switch (e.tableCode) {
          case dbTableName.wards:
            e.entities = allData.data.wards.slice(0, 1);
            break;
          case dbTableName.bolusDrugs:
            e.entities = allData.data.bolusDrugs.slice(0, 1);
            break;
          case dbTableName.defibModels:
            e.entities = allData.data.defibModels.slice(0, 1);
            break;
          case dbTableName.infusionDrugs:
            e.entities = allData.data.infusionDrugs.slice(0, 1);
            break;
        }
      });
    });
    describe('can put, get & delete single items', () => {
      allTables.forEach((t) => {
        it(t.name, async() => {
          const entity = t.entities![0];
          const id = t.getId(entity);
          await t.table!.put(entity);
          let found = await t.table!.get(id);
          expect(found, 'get')
            .to.deep.equal(entity);
          await t.table!.delete(id);
          found = await t.table!.get(id);
          expect(found, 'get after delete')
            .to.equal(void 0);
        });
      });
    });
    describe('can bulkput, find anyOf & bulkdelete single items', () => {
      allTables.forEach((t) => {
        it(t.name, async() => {
          const entity = t.entities![0];
          const id = t.getId(entity);
          await t.table!.bulkPut([entity]);
          let found = await t.table!.where(t.idProp).anyOf([id]).toArray();
          expect(found, 'anyof').to.deep.equal([entity]);
          await t.table!.bulkDelete([id]);
          found = await t.table!.where(t.idProp).anyOf([id]).toArray();
          expect(found, 'anyof after delete').to.deep.equal([]);
        });
      });
    });
    describe('can bulkput bulkdelete empty arrays', () => {
      it('using wards as test table', () => {
        db.wards.bulkPut([]);
        db.wards.bulkDelete([]);
      });
    });
  });
  after('delete db', async() => {
    await db.delete();
  });
});
