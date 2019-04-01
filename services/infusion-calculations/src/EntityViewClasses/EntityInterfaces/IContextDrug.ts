import { siUnit, dilutionMethod } from './../../../../db';
import {IContextConcentration} from './IContextConcentration';
export interface IContextDrug {
  InfusionDrugId: number;
  AmpulePrefix: number;
  SiUnit: siUnit;
  DilutionMethod: dilutionMethod;
  InfusionPrefix: number;
  IsPerMin: boolean;
  Concentrations?: IContextConcentration[];
}
