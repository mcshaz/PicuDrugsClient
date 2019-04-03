import { IEntityUpdated } from '../IEntityUpdated';

export interface IEntityBolusDrug extends IEntityUpdated {
    bolusDrugId: number;
    drugName: string;
    // DrugName: string;
    conc_ml: number | null;
    units: string;
    adultMax: number;
    min: number;
    specificWardId: number | null;

    bolusDoses: IEntityBolusDose[];
}

interface IEntityBolusDose {
    minDosePerKg: number;
    maxDosePerKg: number;
    weightMin: number;
    weightMax: number;
}
