export interface IEntityBolusDrugBase {
    bolusDrugId: number;
    drugName: string;
    concMl: number | null;
    units: string;
    adultMax: number;
    min: number;
}

export interface IEntityBolusDrug extends IEntityBolusDrugBase {
    specificWardId: number | null;

    bolusDoses: IEntityBolusDose[];
}

interface IEntityBolusDose {
    minDosePerKg: number;
    maxDosePerKg: number;
    weightMin: number;
    weightMax: number;
}
