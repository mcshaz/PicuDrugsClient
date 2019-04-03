import { DrugsDBLocal } from './../src/injectableImplementations/DrugsLocalDb';
import { IEntityWard } from './../src/entities/IEntityWard';
import { expect } from 'chai';
import { ConsoleLogger } from '../src/injectableImplementations/ConsoleLogger';
import fakedb from 'fake-indexeddb';
import dbKeyRange from 'fake-indexeddb/lib/FDBKeyRange';
import { Substitute, Arg } from '@fluffy-spoon/substitute';
import { IFetch } from '../src/Injectables/IFetch';
import { fileFetch } from './../../../test-resources/FileFetch';
import { IServerChanges } from '../src/ServerCommunication/IServerChanges';
import { IEntityFixedDrug } from '../src/entities/BolusDrugs/IFixedDrug';
import { IEntityBolusDrug } from '../src/entities/BolusDrugs/IContextBolusDrug';
import { IEntityDefibModel } from '../src/entities/IEntityDefibModel';
import { IEntityInfusionDrug } from '../src/entities/InfusionDrugs/IContextInfusionDrugBase';

interface IDexieTable<Tentity> {
    name: keyof DrugsDBLocal;
    entities: Tentity[];
    table: Dexie.Table<Tentity, number>;
    idProp: string & keyof Tentity;
}

describe('simple DB tests', () => {
    const emptyFetch = Substitute.for<IFetch>();
    const now = new Date();
    emptyFetch.getUpdates(null).returns(Promise.resolve({
            updateCheckStart: now,
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
    describe('single DB table items can be added', () => {
        const allTables: Array<IDexieTable<any>> = [{
                name: 'wards',
                idProp: 'wardId',
            } as IDexieTable<IEntityWard>, {
                name: 'fixedDrugs',
                idProp: 'fixedDrugId',
            } as IDexieTable<IEntityFixedDrug>, {
                name: 'bolusDrugs',
                idProp: 'bolusDrugId',
            } as IDexieTable<IEntityBolusDrug>, {
                name: 'defibModels',
                idProp: 'id',
            } as IDexieTable<IEntityDefibModel>, {
                name: 'infusionDrugs',
                idProp: 'infusionDrugId',
            } as IDexieTable<IEntityInfusionDrug>,
        ];
        before('adding single db items', async () => {
            const allData = await fileFetch.getUpdates(null);
            const wardTable = (allTables.find((t) => t.name === 'wards') as IDexieTable<IEntityWard>);
            wardTable.entities = allData.data.wards.slice(0, 1);
            wardTable.table = db.wards;
            const fixTable = (allTables.find((t) => t.name === 'fixedDrugs') as IDexieTable<IEntityFixedDrug>);
            fixTable.entities = allData.data.fixedDrugs.slice(0, 1);
            fixTable.table = db.fixedDrugs;
            const bolusTable = (allTables.find((t) => t.name === 'bolusDrugs') as IDexieTable<IEntityBolusDrug>);
            bolusTable.entities = allData.data.bolusDrugs.slice(0, 1);
            bolusTable.table = db.bolusDrugs;
            const defibTable = (allTables.find((t) => t.name === 'defibModels') as IDexieTable<IEntityDefibModel>);
            defibTable.entities = allData.data.defibModels.slice(0, 1);
            defibTable.table = db.defibModels;
            const infusionTable = (allTables.find((t) => t.name === 'infusionDrugs') as IDexieTable<IEntityInfusionDrug>);
            infusionTable.entities = allData.data.infusionDrugs.slice(0, 1);
            infusionTable.table = db.infusionDrugs;
        });
        describe('can put, get & delete single items', () => {
            for (const t of allTables) {
                it(t.name, async () => {
                    const entity = t.entities[0];
                    const id = entity[t.idProp];
                    await t.table.put(entity);
                    let found = await t.table.get(id);
                    expect(found, 'get')
                        .to.deep.equal(entity);
                    await t.table.delete(id);
                    found = await t.table.get(id);
                    expect(found, 'get after delete')
                        .to.equal(void 0);
                });
            }
        });
        describe('can bulkput, find anyOf & bulkdelete single items', () => {
            for (const t of allTables) {
                it(t.name, async () => {
                    const entity = t.entities[0];
                    const id = entity[t.idProp];
                    await t.table.bulkPut([entity]);
                    let found = await t.table.where(t.idProp).anyOf([id]).toArray();
                    expect(found, 'anyof').to.deep.equal([entity]);
                    await t.table.bulkDelete([id]);
                    found = await t.table.where(t.idProp).anyOf([id]).toArray();
                    expect(found, 'anyof after delete').to.deep.equal([]);
                });
            }
        });
        describe('can bulkput bulkdelete empty arrays', () => {
            it('using wards as test table', () => {
                db.wards.bulkPut([]);
                db.wards.bulkDelete([]);
            });
        });
    });
});
