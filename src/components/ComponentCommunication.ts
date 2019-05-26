import { ChildAge } from '@/services/infusion-calculations';
import { IEntityWard, IEntityInfusion } from '@/services/drugDb';
import { IMedianMatchResult } from '@/services/anthropometry/CentileRange';

export interface IPatientData { name: string; nhi: string; weeksGestation: number; age: ChildAge;
    isMale: null | boolean; weightKg: number; centileHTML: string; }

interface IWardChartBase { boluses: boolean; infusions: boolean; ward: IEntityWard; }

export interface IWardChartData extends IPatientData, IWardChartBase {  }

export interface IInfusionData extends IPatientData { drug: IEntityInfusion; }

export interface IMultiWeightInfo { estAge: IMedianMatchResult; wtKg: number; }

export interface IMultiWardChartData extends IWardChartBase { weights: IMultiWeightInfo[]; updateEmail: string; }
