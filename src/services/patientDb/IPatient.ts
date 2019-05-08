export interface IGrowthMeasures {
    date: Date;
    hcCm?: number;
    weightKg?: number;
    lengthCm?: number;
}

export interface IPatient {
    nhi: string;
    dob: Date;
    isMale: boolean;
    weeksGestation: number;
    measurements: IGrowthMeasures[];
}
