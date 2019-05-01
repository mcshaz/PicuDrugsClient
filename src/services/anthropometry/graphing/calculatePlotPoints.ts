import { defaultCentiles } from './defaultCentiles';
import { Lms } from './../Lms';

export interface ICentileLine {centile: number; y: number[]; }

export function calculatePlotPoints(centileData: Lms[]): ICentileLine[] {
    return defaultCentiles.map((c) => ({
        centile: c[0],
        y: centileData.map((d, indx) => d.paramFromZ(c[1])),
    }));
}
