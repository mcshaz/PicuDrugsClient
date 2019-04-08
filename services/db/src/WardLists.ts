import { IEntityInfusion } from './entities/InfusionDrugs/IEntityInfusionDrug';
import 'reflect-metadata';
import { IEntityWard } from './entities/IEntityWard';
import { IDrugDB } from './Injectables/IDrugDB';
import { TYPES } from './types';
import { inject } from 'inversify';
import { IEntityBolusDrug } from './entities/BolusDrugs/IEntityBolusDrug';
import { IEntityVariableInfusionDrug } from './entities/InfusionDrugs/IEntityVariableInfusionDrug';
import { toGrouping } from './helpers/toGrouping';
import { IEntityFixedDrug } from './entities/BolusDrugs/IFixedDrug';

export class WardLists {
    public constructor(@inject(TYPES.IDrugDB)private readonly db: IDrugDB) {
    }

    public async getVariableInfusions(ward: IEntityWard): Promise<IEntityVariableInfusionDrug[]> {
        if (ward.infusionDrugIds.length === 0) {
            return [];
        }
        const infusions = await this.db.infusionDrugs.where('infusionDrugId')
            .anyOf(ward.infusionDrugIds)
            .toArray();
        const returnVar = new Map(infusions.map((i) => [i.infusionDrugId, i] as [number, IEntityInfusion]));
        return ward.infusionDrugIds.map((id) => returnVar.get(id) as any as IEntityVariableInfusionDrug);
    }

    public async getBolusDrugs(ward: IEntityWard): Promise<Array<IEntityBolusDrug | IEntityFixedDrug | string>> {
        if (ward.bolusDrugIds.length === 0) {
            return [];
        }
        const bolusIdsGt0 = toGrouping(ward.bolusDrugIds.filter((b) => typeof b === 'number') as number[], (b) => b > 0);
        const boluses = await this.db.bolusDrugs.where('bolusDrugId')
            .anyOf(bolusIdsGt0.get(true)!)
            .toArray();
        const fixed = await this.db.fixedDrugs.where('fixedDrugId')
            .anyOf(bolusIdsGt0.get(false)!.map((id) => -id))
            .toArray();
        const returnVar = new Map<number, IEntityBolusDrug | IEntityFixedDrug>();
        boluses.forEach((b) => returnVar.set(b.bolusDrugId, b));
        fixed.forEach((f) => returnVar.set(-f.fixedDrugId, f));

        return ward.bolusDrugIds.map((id) => typeof id === 'string'
            ? id
            : returnVar.get(id)!);
    }
}
