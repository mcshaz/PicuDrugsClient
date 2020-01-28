import { defaultCentiles } from './defaultCentiles';
import { Lms } from '../Lms';
import { CentileRange } from '../CentileRange';
import { lmsChunkAroundAge, ageUnits } from './lmsChunkAroundAge';
import { daysPerMonth, daysPerYear } from '../AgeRange/AgeRange';

interface IAxisLabel { start: number; increment: number; count: number; minorTickIncrement?: number; }
export enum labelAgeUnits { weeks, months, years }
interface ITimeAxisLabel extends IAxisLabel {
    units: labelAgeUnits; startLabelAt: number; incrementLabelBy: number;
}
export interface ICentileLine {centile: number; centileLastY: number; path: string; }
export interface IAnthropometry { ageDays: number; measure: number; }
export enum pathTypes { polyline, quadratic }
export interface ICentileLines {
    lines: ICentileLine[];
    transformX: (x: number) => number;
    transformY: (y: number) => number;
    xLabels: ITimeAxisLabel[];
    yLabels: IAxisLabel;
    minX: number;
}

export function svgPaths(dataPoints: IAnthropometry[],
  gestAgeWeeks: number,
  centiles: CentileRange,
  padL: number,
  padTop: number,
  width: number,
  height: number,
  pathType = pathTypes.polyline): ICentileLines | null {
  const centileChart = lmsChunkAroundAge(dataPoints.map((p) => p.ageDays), gestAgeWeeks, centiles);
  if (centileChart !== null) {
    const dataRange = dataPoints.map((p) => p.measure);
    const minX = centileChart.data[0][0];
    const maxX = centileChart.data[centileChart.data.length - 1][0];
    const xRatio = (width - padL) / (maxX - minX);
    let minY = Math.min(centileChart.data[0][1].paramFromZ(defaultCentiles[0][1]), ...dataRange);
    let maxY = Math.max(centileChart.data[centileChart.data.length - 1][1].paramFromZ(defaultCentiles[defaultCentiles.length - 1][1]), ...dataRange);
    const inc = getMeasureIncrement(maxY);
    minY = Math.floor(minY / inc.increment) * inc.increment;
    maxY = Math.ceil(maxY / inc.increment) * inc.increment;
    const yRatio = (height - padTop) / (maxY - minY);
    const returnVar = {
      transformX: (x: number) => padL + xRatio * (x - minX),
      transformY: (y: number) => height - yRatio * (y - minY),
      minX,
      xLabels: centileChart.units === ageUnits.weeksOfAge
        ? [ weekLabels(minX, maxX) ]
        : [ yearLabels(minX, maxX) ],
      yLabels: Object.assign(inc, getLabel(minY, maxY, inc.increment)),
    } as ICentileLines;
    if (centileChart.units === ageUnits.weeksOfAge && maxX / daysPerMonth >= 6) {
      returnVar.xLabels.push(monthLabels(minX, maxX));
    }
    const cc = centileChart.data.map((c) => [`${returnVar.transformX(c[0]).toString()} `, c[1]] as [string, Lms]);
    returnVar.lines = defaultCentiles.map((dc) => ({
      centile: dc[0],
      centileLastY: returnVar.transformY(cc[cc.length - 1][1].paramFromZ(dc[1])),
      path: pathType === pathTypes.quadratic
      // simple quadratic bezier, begin straight line
      // could definately get facier than straight line beginning
        ? cc.reduce((p: string, c: [string, Lms], indx: number) => {
          const coord = c[0] + returnVar.transformY(c[1].paramFromZ(dc[1])).toString();
          switch (indx) {
            case 0:
              return p + coord + 'Q' + coord;
            case 1:
            default:
              return p + ' ' + coord;
            case 2:
              return p + ' T' + coord;
          }
        }, 'M')
        : cc.reduce((p: string, c: [string, Lms], indx: number) => {
          const coord = c[0] + returnVar.transformY(c[1].paramFromZ(dc[1])).toString();
          if (indx === 0) {
            return p + coord + 'L';
          } else {
            return p + ' ' + coord;
          }
        }, 'M'),
    }));
    return returnVar;
  }
  return null;
}

function getMeasureIncrement(max: number) {
  if (max < 15) {
    return {
      increment: 0.5,
    };
  }
  if (max < 30) {
    return {
      increment: 2,
      minorTickIncrement: 1,
    };
  } // else >= 30
  return {
    increment: 5,
    minorTickIncrement: 1,
  };
}

function getLabel(smallest: number, largest: number, increment: number): IAxisLabel {
  return {
    start: Math.ceil(smallest / increment) * increment,
    increment,
    count: Math.floor((largest - smallest) / increment) + 1,
  };
}

function weekLabels(startDays: number, endDays: number): ITimeAxisLabel {
  const returnVar = getLabel(startDays, endDays, 7 * 4) as ITimeAxisLabel;
  returnVar.units = labelAgeUnits.weeks;
  returnVar.minorTickIncrement = 7;
  returnVar.incrementLabelBy = 4;
  returnVar.startLabelAt = returnVar.start / 7;
  return returnVar;
}

function monthLabels(startDays: number, endDays: number): ITimeAxisLabel {
  const returnVar = getLabel(startDays, endDays, daysPerMonth) as ITimeAxisLabel;
  returnVar.units = labelAgeUnits.months;
  returnVar.incrementLabelBy = 1;
  returnVar.startLabelAt = returnVar.start / daysPerMonth;
  return returnVar;
}

function yearLabels(startDays: number, endDays: number): ITimeAxisLabel {
  const returnVar = getLabel(startDays, endDays, daysPerMonth * 6) as ITimeAxisLabel;
  returnVar.units = labelAgeUnits.years;
  returnVar.minorTickIncrement = daysPerMonth;
  returnVar.incrementLabelBy = 0.5;
  returnVar.startLabelAt = returnVar.start / daysPerYear;
  return returnVar;
}
