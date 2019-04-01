import { IEntityUpdated } from '../IEntityUpdated';

export interface IContextBolusDrug extends IEntityUpdated {
    bolusDrugId: number;
    drugName: string;
    // DrugName: string;
    conc_ml: number | null;
    units: string;
    adultMax: number;
    min: number;
    specificWardId: number | null;

    bolusDoses: IContextBolusDose[];
}

interface IContextBolusDose {
    minDosePerKg: number;
    maxDosePerKg: number;
    weightMin: number;
    weightMax: number;
}
