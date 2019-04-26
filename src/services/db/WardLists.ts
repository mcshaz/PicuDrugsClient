import 'reflect-metadata';
import { IEntityInfusion } from './entities/InfusionDrugs/IEntityInfusionDrug';
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
        if (ward.infusionSortOrderings.length === 0) {
            return [];
        }
        const infusions = await this.db.infusionDrugs.where('infusionDrugId')
            .anyOf(ward.infusionSortOrderings)
            .toArray();
        const returnVar = new Map(infusions.map((i) => [i.infusionDrugId, i] as [number, IEntityInfusion]));
        return ward.infusionSortOrderings.map((id) => returnVar.get(id) as any as IEntityVariableInfusionDrug);
    }

    public async getBolusDrugs(ward: IEntityWard): Promise<Array<IEntityBolusDrug | IEntityFixedDrug | string>> {
        if (ward.bolusSortOrderings.length === 0) {
            return [];
        }
        const bolusIdsGt0 = toGrouping(ward.bolusSortOrderings.filter((b) => typeof b === 'number') as number[], (b) => b > 0);
        const boluses = await this.db.bolusDrugs.where('bolusDrugId')
            .anyOf(bolusIdsGt0.get(true)!)
            .toArray();
        if (bolusIdsGt0.get(false)) {
            const fixed = await this.db.fixedDrugs.where('fixedDrugId')
                    .anyOf(bolusIdsGt0.get(false)!.map((id) => -id))
                    .toArray();
            fixed.forEach((f) => returnVar.set(-f.fixedDrugId, f));
        }
        const returnVar = new Map<number, IEntityBolusDrug | IEntityFixedDrug>();
        boluses.forEach((b) => returnVar.set(b.bolusDrugId, b));


        return ward.bolusSortOrderings.map((id) => typeof id === 'string'
            ? id
            : returnVar.get(id)!);
    }
}
