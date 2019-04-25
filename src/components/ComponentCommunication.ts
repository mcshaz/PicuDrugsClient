import { ChildAge } from '@/services/infusion-calculations';
import { IEntityWard, IEntityInfusion } from '@/services/db';

export interface IPatientData { name: string; nhi: string; weeksGestation: number; age: ChildAge;
    isMale: null | boolean; weightKg: number; centileHTML: string; }

export interface IChartData extends IPatientData { bolus: boolean; infusion: boolean; ward: IEntityWard; }

export interface IInfusionData extends IPatientData { drug: IEntityInfusion; }
