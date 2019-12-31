import { IMedianMatchResult } from '../anthropometry/CentileRange';
import { searchComparison } from '../anthropometry';
import { daysPerMonth } from '../infusion-calculations';
import { daysPerYear } from '../infusion-calculations/PresentationClasses/Dosing/PatientDetails/ChildAge';

const monthCut = daysPerYear * 2;
const halfCut = daysPerYear * 12;

export function ageString(minGestation: number, match: IMedianMatchResult, abbrev = false) {
  switch (match.matchType) {
    case searchComparison.greaterThanMax:
      return '> max';
    case searchComparison.lessThanMin:
      return `&lt; ${minGestation}/40`;
    case searchComparison.inRange:
      const roundDays = Math.round(match.ageDays);
      if (match.gestation < 40) {
        if (roundDays >= 7) {
          return `${match.gestation + 1}/40`;
        }
        if (roundDays === 0) {
          return `${match.gestation}/40`;
        }
        return `${match.gestation}<sup>+${roundDays}</sup>/40`;
      }
      if (roundDays <= 30) {
        return `${roundDays} day${roundDays === 1 ? '' : 's'}`;
      }
      if (roundDays < monthCut) {
        const mth = Math.round(roundDays * 2 / daysPerMonth) / 2;
        const pleural = mth % 1 === 0;
        return pleural
          ? `${mth} ${abbrev ? 'mo' : 'month'}${mth === 1 ? '' : 's'}${abbrev ? '.' : ''}`
          : `${(mth - 0.5)}½ ${abbrev ? 'mos.' : 'months'}`;
      }
      if (roundDays < halfCut) {
        const yrs = Math.round(roundDays * 2 / daysPerYear) / 2;
        const yrString = abbrev ? ' yrs.' : ' years';
        return yrs % 1 === 0
          ? yrs + yrString
          : (yrs - 0.5) + '½' + yrString;
      }
      return (roundDays / daysPerYear).toFixed() + ' years';
    default:
      throw new Error('unrecognised result');
  }
}
