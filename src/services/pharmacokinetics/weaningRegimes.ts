import { WeanDay } from './WeanDay';

export function linearWean(startingDose: number, fractionReduction: number, finishingDose = 0) {
  const dt = new Date();
  dt.setHours(0, 0, 0, 0);
  const returnVar = [] as WeanDay[];
  const reduction = fractionReduction * startingDose;
  let i = 0;
  while (startingDose - finishingDose >= 0.05) {
    const wean = new WeanDay(new Date(dt),
      startingDose);
    wean.addDays(i);
    returnVar.push(wean);
    startingDose -= reduction;
    ++i;
  }
  return returnVar;
}

export function alternateWean(startingDose: number, days: number) {
  let returnVar = linearWean(startingDose, 1 / Math.ceil(days / 2));
  const oddCorrection = (days % 2 === 0) ? 0 : 1;
  // 6 over 6 days
  // odd 6 4 4 2 2
  // even 6 6 4 4 2 2
  // date 1 2 3 4
  // even 1,0->1 . 2,1->3 . 3,2->5 . 4,3->7
  // odd 1,0->1 2,1->2 . 3,2->4 . 4,3->6
  returnVar = returnVar.reduce((prev, wd, indx) => {
    prev.push(wd);
    const addDays = indx - oddCorrection;
    if (addDays >= 0) {
      wd.addDays(indx);
      prev.push(wd.cloneForTomorrow());
    }
    return prev;
  }, [] as WeanDay[]);
  return returnVar;
}

export function exponentialWean(startingDose: number, fractionReduction: number, days: number, startDate?: Date) {
  const dt = new Date(startDate as any);
  dt.setHours(0, 0, 0, 0);
  const returnVar = [] as WeanDay[];
  fractionReduction = (1 - fractionReduction);
  for (let i = 0; i < days; ++i) {
    const wean = new WeanDay(new Date(dt),
      startingDose);
    if (wean.regularDose === 0) {
      break;
    }
    wean.addDays(i);
    returnVar.push(wean);
    startingDose *= fractionReduction;
  }
  return returnVar;
}
