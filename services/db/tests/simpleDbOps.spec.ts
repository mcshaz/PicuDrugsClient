import { DrugsDBLocal } from '../src/injectableImplementations/DrugsDBLocal';
import { expect } from 'chai';
import { ConsoleLogger } from '../src/injectableImplementations/ConsoleLogger';
import fakedb from 'fake-indexeddb';
import dbKeyRange from 'fake-indexeddb/lib/FDBKeyRange';
import { Substitute, Arg } from '@fluffy-spoon/substitute';
import { IFetch } from '../src/Injectables/IFetch';
import { fileFetch } from './../../../test-resources/FileFetch';
import { IServerChanges } from '../src/ServerCommunication/IServerChanges';
import { TestTableHelpers } from './TestTableHelpers';
import { tableName } from '../src/entities/enums/tableNames';


describe('simple DB tests', () => {
    const emptyFetch = Substitute.for<IFetch>();
    emptyFetch.getUpdates(null).returns(Promise.resolve<IServerChanges>({
        updateCheckStart: new Date(),
        data: {
            deletions: [],
            wards: [],
            infusionDrugs: [],
            bolusDrugs: [],
            defibModels: [],
            fixedDrugs: [],
        },
    }));
    let db: DrugsDBLocal;
    before('can initialize db', () => {
        const promise = new Promise((resolve, reject) => {
            window.addEventListener('unhandledrejection', (ev) => reject(ev.reason));
            db = new DrugsDBLocal(emptyFetch, new ConsoleLogger(), fakedb, dbKeyRange);
            db.on('ready', () => resolve('db ready'));
        });
        return promise;
    });
    it('empty DB called IFetch exactly once', () => emptyFetch.received(1).getUpdates(Arg.any()));
    it('called IFetch only with null', () => emptyFetch.received(1).getUpdates(null));
    describe('single DB table items can be added', () => {
        const allTables = new TestTableHelpers();
        before('adding single db items', async () => {
            const allData = await fileFetch.getUpdates(null);
            allTables.setDb(db, (e) => {
                switch (e.tableCode) {
                    case tableName.wards:
                        e.entities = allData.data.wards.slice(0, 1);
                        break;
                    case tableName.bolusDrugs:
                        e.entities = allData.data.bolusDrugs.slice(0, 1);
                        break;
                    case tableName.defibModels:
                        e.entities = allData.data.defibModels.slice(0, 1);
                        break;
                    case tableName.fixedDrugs:
                        e.entities = allData.data.fixedDrugs.slice(0, 1);
                        break;
                    case tableName.infusionDrugs:
                        e.entities = allData.data.infusionDrugs.slice(0, 1);
                        break;
                }
            });
        });
        describe('can put, get & delete single items', () => {
            allTables.forEach((t) => {
                it(t.name, async () => {
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
                it(t.name, async () => {
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
    after('delete db', async () => {
        await db.delete();
    });
});
