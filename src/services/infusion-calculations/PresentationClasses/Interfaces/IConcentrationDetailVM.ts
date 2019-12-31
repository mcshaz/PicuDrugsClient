import { IEntityDrugAmpuleConcentration } from '@/services/drugDb';

export interface IConcentrationDetailVM {
  isNeat: boolean;
  drawingUpDose: number;
  oneMlHrDose: number;
  finalVolume: number;
  ampuleDetails: IDrawingUpDetails[];
}

export interface IDrawingUpDetails extends IEntityDrugAmpuleConcentration {
  drawingUpVolume: number;
}
