import { IAppData } from './../entities/IAppData';
import { IEntityDefibModel } from '../entities/IEntityDefibModel';
import Dexie from 'dexie';
import { IEntityWard } from '../entities/IEntityWard';
import { IContextInfusionDrug } from '../entities/InfusionDrugs/IContextInfusionDrugBase';
import { IContextBolusDrug } from '../entities/BolusDrugs/IContextBolusDrug';
import { tableName } from '../entities/enums/tableNames';
import { ILogger } from '../Injectables/ILogger';
import { IFetch } from '../Injectables/IFetch';
import {  inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types';
import { IServerChanges } from '../ServerCommunication/IServerChanges';
import { IFixedDrug } from '../entities/BolusDrugs/IFixedDrug';
import { INewServerDeletions } from '../ServerCommunication/IEntityDeletion';


// https://caniuse.com/#search=IndexedDB
if (!window.indexedDB){
    Dexie.dependencies.indexedDB = require('fake-indexeddb');
    Dexie.dependencies.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');
}
@injectable()
export class DrugsDBLocal extends Dexie {
    // Declare implicit table properties.
    // (just to inform Typescript. Instanciated by Dexie in stores() method)
    // Declare implicit table properties.
    // (just to inform Typescript. Instanciated by Dexie in stores() method)
    public wards!: Dexie.Table<IEntityWard, number>; // number = type of the primkey
 // number = type of the primkey
    public infusionDrugs!: Dexie.Table<IContextInfusionDrug, number>;
    public bolusDrugs!: Dexie.Table<IContextBolusDrug, number>;
    public defibModels!: Dexie.Table<IEntityDefibModel, number>;
    public fixedDrugs!: Dexie.Table<IFixedDrug, number>;
    public appData!: Dexie.Table<IAppData, number>;

    // ...other tables goes here...

    constructor(@inject(TYPES.IFetch)private readonly updateProvider: IFetch,
                @inject(TYPES.ILogger)private readonly logger: ILogger,
                indexedDB?: IDBFactory, IDBKeyRange?: (new () => IDBKeyRange)) {
        super('drugsDBLocal', { indexedDB, IDBKeyRange });
        this.version(1).stores({
            wards: 'wardId,abbrev',
            infusionDrugs: 'infusionDrugId,isTitratable',
            bolusDrugs: 'bolusDrugId',
            defibModels: 'DefibId',
            fixedDrugs: 'fixedDrugId',
            appData: 'dataType',
            // ...other tables goes here...
        });
        this.on('ready', this.alignDB);
        // window.setInterval(update,1000*60*60*12);//look up every 12 hours (in case browser left open, eg in resus bay)
    }

    private async alignDB() {
        let updateChecked: Date | null = null;
        const updateData = await this.appData.get(appDataType.lastFetchServer);
        if (updateData === void 0) {
            this.logger.information('db being populated from 0 records');
        } else {
            this.logger.information('db being updated from ' + updateData.data);
            updateChecked = new Date(Date.parse(updateData.data));
        }
        const serverData = await this.updateProvider.getUpdates(updateChecked);
        this.logger.log(`dbdata returned from server @ ${serverData.updateCheckStart} consisting of `
            + Object.keys(serverData.data).map((k) => `{${k}:length[${(serverData.data as any)[k].length}]}`)
            .join(','));
        await this.putLocalData(serverData);
        await this.deleteLocalData(serverData.data.deletions);
    }

    private async putLocalData(updates: IServerChanges) {
        await Promise.all([
            this.transaction('rw', this.wards, () => this.wards.bulkPut(updates.data.wards)),
            this.transaction('rw', this.infusionDrugs, () => this.infusionDrugs.bulkPut(updates.data.infusionDrugs)),
            this.transaction('rw', this.bolusDrugs, () => this.bolusDrugs.bulkPut(updates.data.bolusDrugs)),
            this.transaction('rw', this.defibModels, () => this.defibModels.bulkPut(updates.data.defibModels)),
            this.transaction('rw', this.fixedDrugs, () => this.fixedDrugs.bulkPut(updates.data.fixedDrugs))]);
        // running delete after in case records were deleted after the table data was populated
        const returnVar = this.appData.put({
            dataType: appDataType.lastFetchServer,
            data: updates.updateCheckStart.toString()});
        this.logger.information(Object.keys(updates.data).filter((d) => d !== 'deletions')
            .reduce<number>((p, k) => p + (updates.data as any)[k].length, 0)
            + ' records updated or inserted');
        return returnVar;
    }

    private async deleteLocalData(deletions: INewServerDeletions[]) {
        this.logger.log('data server has deleted :'
            +  deletions.reduce((n, d) => n + d.deletionIds.length, 0) + ' Entities');
        const delPromises = deletions.map((d) => {
            switch (d.table) {
                case tableName.Wards:
                    return this.transaction('rw', this.wards, () => this.wards.bulkDelete(d.deletionIds));
                case tableName.bolusDrugs:
                    return this.transaction('rw', this.bolusDrugs, () => this.bolusDrugs.bulkDelete(d.deletionIds));
                case tableName.defibModels:
                    return this.transaction('rw', this.defibModels, () => this.defibModels.bulkDelete(d.deletionIds));
                case tableName.fixedDrugs:
                    return this.transaction('rw', this.fixedDrugs, () => this.fixedDrugs.bulkDelete(d.deletionIds));
                case tableName.infusionDrugs:
                    return this.transaction('rw', this.infusionDrugs, () => this.infusionDrugs.bulkDelete(d.deletionIds));
                default:
                    throw new Error('unknown tableName to delete from:' + d.table);
            }
        });
        const returnVar = await Promise.all(delPromises);
        this.logger.log('deletions successful');
        return returnVar;
    }
}
