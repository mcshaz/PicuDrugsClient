import { ChildAge } from '@/services/infusion-calculations';
import { IEntityWard, IEntityInfusion } from '@/services/drugDb';

export interface IPatientData { name: string; nhi: string; weeksGestation: number; age: ChildAge;
    isMale: null | boolean; weightKg: number; centileHTML: string; }

export interface IWardChartData extends IPatientData { boluses: boolean; infusions: boolean; ward: IEntityWard; }

export interface IInfusionData extends IPatientData { drug: IEntityInfusion; }
