import Dexie from 'dexie';
import { IWard } from '../entities/IWard';
import { IDeletionDate } from '../entities/IDeletionDate';
import { IContextInfusionDrug } from '../entities/IContextInfusionDrugBase';
import { IContextBolusDrug } from '../entities/IContextBolusDrug';
import { tableName } from '../entities/enums/tableNames';
import { IEntityDeletion } from '../entities/IEntityDeletion';
import { ILogger } from '../Injectables/ILogger';
import { IFetch, IdbMods, IServerChanges } from '../Injectables/IFetch';
import {  inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "../types";

//Dexie.dependencies.indexedDB = require('fake-indexeddb')
//Dexie.dependencies.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange')

@injectable()
export class drugsDBLocal extends Dexie {
    // Declare implicit table properties.
    // (just to inform Typescript. Instanciated by Dexie in stores() method)
    wards: Dexie.Table<IWard, number>; // number = type of the primkey
    infusionDrugs: Dexie.Table<IContextInfusionDrug, number>;
    bolusDrugs: Dexie.Table<IContextBolusDrug, number>;
    deletionDates: Dexie.Table<IDeletionDate, number>;
    //...other tables goes here...

    constructor (@inject(TYPES.IFetch)private readonly updateProvider:IFetch, 
                @inject(TYPES.ILogger)private readonly logger:ILogger) {
        super("drugsDBLocal");
        this.version(1).stores({
            wards: 'WardId,LastUpdated',
            infusionDrugs: 'InfusionDrugId,IsTitratable,LastUpdateed',
            bolusDrugs: 'BolusDrugId,LastUpdated',
            deletionDates: 'table'
            //...other tables goes here...
        });
        this.on("ready", this.alignDB);
        //window.setInterval(update,1000*60*60*12);//look up every 12 hours (in case browser left open, eg in resus bay)
    }

    private async alignDB(){
        if (await this.wards.count() === 0){
            await this.seedLocalDataFromServer();
        } else {
            this.updateLocalDataFromServer();
        }
    }

    private async updateLocalDataFromServer():Promise<IDeletionDate[]>{
        let dbDates: IdbMods = {} as any;
        return Promise.all([
            this.infusionDrugs.orderBy('LastUpdated').last().then(i=>dbDates.infusionsUpdatedUntil = i.LastUpdated || null),
            this.wards.orderBy('LastUpdated').last().then(w=>dbDates.wardUpdatedUntil = w.LastUpdated || null),
            this.bolusDrugs.orderBy('LastUpdated').last().then(b=>dbDates.bolusUpdatedUntil = b.LastUpdated || null),
            this.deletionDates.toArray().then(d=>d.forEach(a=>{
                switch(a.table){
                    case tableName.boluses:
                        dbDates.bolusDeletedUntil = a.lastDeletion;
                        break;
                    case tableName.infusions:
                        dbDates.infusionsDeletedUntil = a.lastDeletion;
                        break;
                    case tableName.wards:
                        dbDates.wardDeletedUntil = a.lastDeletion;
                        break;
                    default:
                        throw new Error(a.table + " unknown tableName");
                }
            }))
        ]).then(()=>this.updateProvider.getUpdates(dbDates))
            .then((data)=>Promise.all([
                this.putLocalData(data),
                this.deleteLocalData(data.deletions)]))
            .then(s=>this.deletionDates.bulkPut(s[1]))
            .catch(e=>{
                this.logger.error('failed to update local db ' + JSON.stringify(e));
                return e;});
    }

    private async seedLocalDataFromServer(){
        this.logger.information("db being populated from 0 records");
        let updates = await this.updateProvider.getUpdates({
            wardUpdatedUntil: null,
            infusionsUpdatedUntil: null,
            bolusUpdatedUntil:null,
            wardDeletedUntil: null,
            infusionsDeletedUntil: null,
            bolusDeletedUntil: null,
        });
        return this.putLocalData(updates);
    }
    
    private async putLocalData(updates:IServerChanges){
        this.logger.log("new data returned from server :" + Object.keys(updates).map(k=>k+':'+updates[k].length).join(','));
        return Promise.all([this.wards.bulkPut(updates.wards),
                this.infusionDrugs.bulkPut(updates.infusions),
                this.bolusDrugs.bulkPut(updates.boluses)])
            .then(()=>this.logger.information(Object.keys(updates).reduce<number>((p,k)=>p+updates[k].length,0) 
                    + " records updated or inserted"));
    }

    private async deleteLocalData(deletions: IEntityDeletion[]){
        this.logger.log("data server has deleted :" +  deletions.map(d=>JSON.stringify(d)).join(','));
        const sets = toGrouping(deletions, d=>d.Table, d=>d.Id);
        return Promise.all([this.wards.bulkDelete(sets.get(tableName.wards) || []),
                this.infusionDrugs.bulkDelete(sets.get(tableName.infusions) || []),
                this.bolusDrugs.bulkDelete(sets.get(tableName.boluses) || [])])
            .then(()=> {
                this.logger.information(deletions.length + " records deleted");
                return getMaxDates(deletions);
            });
    }
}

function getMaxDates(deletions: IEntityDeletion[]){
    const returnVar: IDeletionDate[] = [];
    toGrouping(deletions, d=>d.Table, d=>d.DeletionDate.getTime())
        .forEach((v,k)=>returnVar.push({ table:k,lastDeletion:new Date(Math.max(...v))}));
    return returnVar;
}

function toGrouping<T,K,V>(data: T[], keyselector: (val:T)=>K, valselector:(val:T)=>V){
    const returnVar = new Map<K,V[]>();
    for (const d of data){
        const k = keyselector(d);
        const v = valselector(d);
        if (returnVar.has(k)){
            returnVar.get(k).push(v);
        } else {
            returnVar.set(k,[v]);
        }
    }
    return returnVar
}

