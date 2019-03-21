import { ILastUpdated } from './ILastUpdated';

export interface IContextBolusDrug extends ILastUpdated {
    BolusDrugId: number;
    DrugName: string;
    // DrugName: string;
    Conc_ml: number | null;
    Units: string;
    AdultMax: number;
    Min: number;
    SpecificWardId: number | null;

    BolusDoses: IContextBolusDose[];
}

interface IContextBolusDose {
    MinDosePerKg: number;
    MaxDosePerKg: number;
    WeightMin: number;
    WeightMax: number;
}
