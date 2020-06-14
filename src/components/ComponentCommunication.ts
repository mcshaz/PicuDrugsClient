import { ChildAge } from '@/services/infusion-calculations';
import { IEntityWard, IEntityInfusion, definedCharts } from '@/services/drugDb';
import { IMedianMatchResult } from '@/services/anthropometry/CentileRange';

export interface IPatientData { name: string; nhi: string; weeksGestation: number | '';
    age: ChildAge | null; isMale: boolean | null; isWtEstimate: boolean; weightKg: number;
    centileString: string; }

export interface IWardChartBase { charts: definedCharts[]; ward: IEntityWard; }

export interface IWardChartData extends IPatientData, IWardChartBase { }

export interface IInfusionData extends IPatientData { drug: IEntityInfusion; age: ChildAge; }

export interface IMultiWeightInfo { estAge: IMedianMatchResult; wtKg: number; }

export interface IMultiWardChartData extends IWardChartBase { weights: IMultiWeightInfo[]; updateEmail: string; }
