import { IEntityUpdated } from '../IEntityUpdated';

export interface IEntityFixedDrug extends IEntityUpdated {
    fixedDrugId: number;
    drugName: string;

    fixedDoses: IEntityFixedDose[];
}

export interface IEntityFixedDose extends IEntityUpdated {
    dose: string;
    minAgeMonths: number;
    maxAgeMonths: number;
}
