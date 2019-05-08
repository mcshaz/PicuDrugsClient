import 'reflect-metadata';
import { IDrugDB } from '../Injectables/IDrugDB';
import { TYPES } from '../types';
import { inject, injectable } from 'inversify';
import { appDataType } from '../entities/enums/appDataType';
import { IDbAppData } from '../entities/IAppData';
import { IAppData, IWardDefaults } from '../Injectables/IAppData';

@injectable()
export class AppDataFromDexie implements IAppData {
    public constructor(@inject(TYPES.IDrugDB)private readonly db: IDrugDB) {
    }

    public async getWardDefaults() {
        const data = await this.db.appData.get(appDataType.wardDefaults);
        if (data) {
            return JSON.parse(data.data) as IWardDefaults;
        }
        return void 0;
    }
    public async setWardDefaults(wardDefaults: IWardDefaults) {
        if (!wardDefaults.formalSet) {
            const data = await this.getWardDefaults();
            if (data && data.formalSet) {
                return;
            }
        }
        const putData: IDbAppData = {
            dataType: appDataType.wardDefaults,
            data: JSON.stringify(wardDefaults),
        };
        return this.db.appData.put(putData);
    }
}
