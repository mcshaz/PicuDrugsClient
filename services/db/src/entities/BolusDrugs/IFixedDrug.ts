import { IEntityUpdated } from '../IEntityUpdated';

export interface IFixedDrug extends IEntityUpdated {
    fixedDrugId: number;
    drugName: string;

    fixedDoses: IFixedDose[];
}

export interface IFixedDose extends IEntityUpdated {
    dose: string;
    minAgeMonths: number;
    maxAgeMonths: number;
}
