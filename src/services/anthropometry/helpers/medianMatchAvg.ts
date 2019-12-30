import { searchComparison } from '../binarySearch'
import { IMedianMatchResult } from '../CentileRange'

export function medianMatchAvg (a: IMedianMatchResult, b: IMedianMatchResult): IMedianMatchResult {
  let matchType = searchComparison.inRange
  if (a.matchType === searchComparison.lessThanMin || b.matchType === searchComparison.lessThanMin) {
    matchType = searchComparison.lessThanMin
  } else if (a.matchType === searchComparison.greaterThanMax || b.matchType === searchComparison.greaterThanMax) {
    matchType = searchComparison.greaterThanMax
  }
  return {
    ageDays: (a.ageDays + b.ageDays) / 2,
    gestation: (a.gestation + b.gestation) / 2,
    matchType
  }
}
