export interface IEntityFixedDrug {
    fixedDrugId: number;
    drugName: string;

    fixedDoses: IEntityFixedDose[];
}

export interface IEntityFixedDose {
    dose: string;
    minAgeMonths: number;
    maxAgeMonths: number;
}
