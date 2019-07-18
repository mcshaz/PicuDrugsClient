import 'reflect-metadata';
import { IDbAppData } from '../entities/IAppData';
import { IEntityDefibModel } from '../entities/IEntityDefibModel';
import Dexie from '../../../../../Dexie.js/dist/dexie'; // todo - return to node import once fixes released released
import { IEntityWard } from '../entities/IEntityWard';
import { IEntityInfusion } from '../entities/InfusionDrugs/IEntityInfusionDrug';
import { IEntityBolusDrug } from '../entities/BolusDrugs/IEntityBolusDrug';
import { dbTableName } from '../entities/enums/dbTableName';
import { ILogger } from '../Injectables/ILogger';
import { IFetchUpdates } from '../Injectables/IFetch';
import { inject, injectable, decorate } from 'inversify';
import { TYPES } from '../types';
import { IServerChanges } from '../ServerCommunication/IServerChanges';
import { INewServerDeletions } from '../ServerCommunication/IEntityDeletion';
import { appDataType } from '../entities/enums/appDataType';
import { IDrugDB } from '../Injectables/IDrugDB';
// import { IEntityFixedInfusionDrug } from '../entities/InfusionDrugs/IEntityFixedInfusionDrug';

decorate(injectable(), Dexie);
// https://caniuse.com/#search=IndexedDB

@injectable()
export class DrugsDBLocal extends Dexie implements IDrugDB {
    // Declare implicit table properties.
    // (just to inform Typescript. Instanciated by Dexie in stores() method)
    // Declare implicit table properties.
    // (just to inform Typescript. Instanciated by Dexie in stores() method)
    public wards!: Dexie.Table<IEntityWard, number>; // number = type of the primkey
 // number = type of the primkey
    public infusionDrugs!: Dexie.Table<IEntityInfusion, number>;
    public bolusDrugs!: Dexie.Table<IEntityBolusDrug, number>;
    public defibModels!: Dexie.Table<IEntityDefibModel, number>;
    public appData!: Dexie.Table<IDbAppData, number>;
    private readonly updateProvider: IFetchUpdates;
    private readonly logger: ILogger;
    // ...other tables goes here...

    constructor(@inject(TYPES.IFetchUpdates) updateProvider: IFetchUpdates,
                @inject(TYPES.ILogger) logger: ILogger,
                indexedDB: IDBFactory | undefined = void 0,
                dbKeyRange: typeof IDBKeyRange | undefined = void 0) {
        if (indexedDB !== void 0) {
            Dexie.dependencies.indexedDB = indexedDB as IDBFactory;
        }
        if (dbKeyRange !== void 0) {
            Dexie.dependencies.IDBKeyRange = dbKeyRange;
        }
        super('DrugsDBLocal' + process.env.NODE_ENV);
        this.updateProvider = updateProvider;
        this.logger = logger;
        this.version(1).stores({
            wards: 'wardId',
            infusionDrugs: 'infusionDrugId',
            bolusDrugs: 'bolusDrugId',
            defibModels: 'id',
            fixedDrugs: 'fixedDrugId',
            appData: 'dataType',
            // ...other tables goes here...
        });
        let promiseReject: (ev: PromiseRejectionEvent) => void;
        promiseReject = (ev) => {
            window.removeEventListener('unhandledrejection', promiseReject);
            if (ev.reason instanceof Error) {
                throw ev.reason;
            }
            const reason = 'unhandled rejection initializing DrugLocalDb:' + JSON.stringify(getSimpleProperties(ev.reason));
            this.logger.fatal(reason);
        };

        window.addEventListener('unhandledrejection', promiseReject);
        this.on('ready', async () => {
            await this.alignDB();
            window.removeEventListener('unhandledrejection', promiseReject);
        });
        // window.setInterval(update,1000*60*60*12);//look up every 12 hours (in case browser left open, eg in resus bay)
        // this.open();
    }
//    public async allFixedInfusionDrugs() {
//        return this.infusionDrugs.where('isTitratable').equals(false) // boolean not a valid key
//            .toArray() as Promise<IEntityInfusion[]>;
//    }

    private async alignDB() {
        const updateData = await this.appData.get(appDataType.lastFetchServer);
        if (updateData === void 0) {
            this.logger.info('db being seeded from 0 records');
            // block requests & use VIP to place data;
            await this.getPutAndDeleteData(null, true);
            this.logger.debug('database should now be unlocked');
        } else {
            this.logger.info('db being updated from ' + updateData.data);
            const updateChecked = new Date(Date.parse(updateData.data));
            // don't block requests
            this.getPutAndDeleteData(updateChecked);
        }
    }

    private async getPutAndDeleteData(updateChecked: Date | null, vip: boolean = false) {
        const serverData = await this.updateProvider.getDbUpdates(updateChecked);
        this.logger.log(`dbdata returned from server @ ${ serverData.updateCheckStart } consisting of `
            + Object.keys(serverData.data).map((k) => `{${k}:length[${(serverData.data as any)[k].length}]}`)
            .join(','));
        if (vip) {
            await Dexie.vip(async () => {
                await this.alignLocalData(serverData);
            });
        } else {
            await this.alignLocalData(serverData);
        }
    }

    private async alignLocalData(serverData: IServerChanges) {
        await Promise.all([
            this.transaction('rw', this.wards,
                () => this.wards.bulkPut(serverData.data.wards)),
            this.transaction('rw', this.infusionDrugs,
                () => this.infusionDrugs.bulkPut(serverData.data.infusionDrugs)),
            this.transaction('rw', this.bolusDrugs,
                () => this.bolusDrugs.bulkPut(serverData.data.bolusDrugs)),
            this.transaction('rw', this.defibModels,
                () => this.defibModels.bulkPut(serverData.data.defibModels))]);
        this.logger.info(Object.keys(serverData.data).filter((d) => d !== 'deletions')
            .reduce<number>((p, k) => p + (serverData.data as any)[k].length, 0)
            + ' records updated or inserted');
        // running delete after in case records were deleted on the server after the table JSON data was written to stream
        await this.deleteLocalData(serverData.data.deletions);
        this.logger.debug('setting dbUpdatedTime');
        // for native promise/await implementations seems to work, but falls over in IE with promise polyfill unless
        // rewrapped in Dexie.vip
        await Dexie.vip(async () => {
            await this.appData.put({
                dataType: appDataType.lastFetchServer,
                data: serverData.updateCheckStart.toString(),
            });
        });
        this.logger.debug('dbUpdated time set at: ' + serverData.updateCheckStart.toString());
    }

    private async deleteLocalData(deletions: INewServerDeletions[]) {
        this.logger.debug('data server has deleted :'
            +  deletions.reduce((n, d) => n + d.deletionIds.length, 0) + ' Entities');
        const delPromises = deletions.map((d) => {
            switch (d.table) {
                case dbTableName.wards:
                    return this.transaction('rw', this.wards, () => this.wards.bulkDelete(d.deletionIds));
                case dbTableName.bolusDrugs:
                    return this.transaction('rw', this.bolusDrugs, () => this.bolusDrugs.bulkDelete(d.deletionIds));
                case dbTableName.defibModels:
                    return this.transaction('rw', this.defibModels, () => this.defibModels.bulkDelete(d.deletionIds));
                case dbTableName.infusionDrugs:
                    return this.transaction('rw', this.infusionDrugs, () => this.infusionDrugs.bulkDelete(d.deletionIds));
                default:
                    throw new Error('unknown tableName to delete from:' + d.table);
            }
        });
        await Promise.all(delPromises);
        this.logger.debug('deletions successful');
    }
}

function getSimpleProperties(arg: any, refs = new Set<object>()): any {
    const simpleTypes = ['number', 'string', 'boolean', 'undefined'];
    function isSimple(p: any) {
        const pType = typeof p;
        return simpleTypes.includes(pType)
            || (pType === 'object' && (p === null || p instanceof Date));
    }
    if (isSimple(arg)) {
        return arg;
    }
    if (typeof arg.map === 'function') {
        return arg.map((i: any) => {
            if (isSimple(i)) {
                return i;
            }
            if (!refs.has(i)) {
                return getSimpleProperties(i, refs);
            }
        });
    }
    if (typeof arg === 'object') {
        const returnVar = {};
        for (const s in arg) {
            if (typeof s === 'string' && s.length && s[0] !== '_') {
                const v = arg[s];
                if (typeof v !== 'function' && !refs.has(v)) {
                    refs.add(v);
                    const sp = getSimpleProperties(v, refs);
                    (returnVar as any)[s] = sp;
                }
            }
        }
        return returnVar;
    }
}
