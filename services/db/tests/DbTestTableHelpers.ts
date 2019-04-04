import { DrugsDBLocal } from './..';
import { IEntityFixedDrug } from './../src/entities/BolusDrugs/IFixedDrug';
import { IEntityBolusDrug } from './../src/entities/BolusDrugs/IContextBolusDrug';
import { IEntityDefibModel } from './../src/entities/IEntityDefibModel';
import { IEntityInfusionDrug } from './../src/entities/InfusionDrugs/IContextInfusionDrugBase';
import { IEntityWard } from './../src/entities/IEntityWard';
import { dbTableName } from './../src/entities/enums/tableNames';

export interface IDexieTable<Tentity> {
    name: keyof DrugsDBLocal & keyof typeof dbTableName;
    entities?: Tentity[];
    table?: Dexie.Table<Tentity, number>;
    idProp: string & keyof Tentity;
    tableCode: dbTableName;
    getId: (entity: Tentity) => number;
}

export class DbTestTableHelpers {
    private readonly pAllTables: Map<string, IDexieTable<any>>;
    constructor() {
        this.pAllTables = new Map();
        [new DrugDBTable<IEntityWard>('wards', 'wardId'),
         new DrugDBTable<IEntityFixedDrug>('fixedDrugs', 'fixedDrugId'),
         new DrugDBTable<IEntityBolusDrug>('bolusDrugs', 'bolusDrugId'),
         new DrugDBTable<IEntityDefibModel>('defibModels', 'id'),
         new DrugDBTable<IEntityInfusionDrug>('infusionDrugs', 'infusionDrugId')]
         .forEach((i) => this.pAllTables.set(i.name, i));
    }

    public get(table: (keyof DrugsDBLocal & keyof typeof dbTableName) | dbTableName) {
        const returnVar = this.pAllTables.get(typeof table === 'string'
            ? table
            : dbTableName[table]);
        if (returnVar === void 0) {
            throw new Error(`tableName does not exist on DrugsLocalDB`);
        }
        return returnVar;
    }

    public setDb(db: DrugsDBLocal, delegate: (arg: IDexieTable<any>) => void = this.noop) {
        this.forEach((t) => {
            t.table = db[t.name];
            delegate(t);
        });
    }

    public forEach(delegate: (arg: IDexieTable<any>) => void) {
        const it = this.pAllTables.values();
        let r: IteratorResult<IDexieTable<any>>;
        while (!(r = it.next()).done) {
            delegate(r.value);
        }
    }

    // tslint:disable-next-line:no-empty
    private noop() {}
}


// tslint:disable-next-line:max-classes-per-file
class DrugDBTable<Tentity> implements IDexieTable<Tentity> {
    public entities?: Tentity[];
    public table?: Dexie.Table<Tentity, number>;
    public readonly tableCode: dbTableName;
    constructor(public readonly name: keyof DrugsDBLocal & keyof typeof dbTableName,
                public readonly idProp: string & keyof Tentity) {
        this.tableCode = dbTableName[this.name];
    }
    public getId(entity: Tentity): number {
        return entity[this.idProp] as any as number;
    }
}