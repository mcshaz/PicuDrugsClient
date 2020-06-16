
type gtlt = '<' | '>' | '';
type suffix = 'th' | 'st' | 'nd' | 'rd' | '';
export interface ICentileVal { prefix: gtlt; val: number; suffix: suffix; alarm: alarmLevel; note: string }
export enum alarmLevel { none, minorWarning, warning, danger }
export function centileString(val: number): ICentileVal {
  if (val < 1) {
    let alarm: alarmLevel;
    if (val < 0.01) {
      val = 0.01;
      alarm = alarmLevel.danger;
    } else if (val < 0.1) {
      val = 0.1;
      alarm = alarmLevel.warning;
    } else {
      val = 1;
      alarm = alarmLevel.minorWarning;
    }
    return {
      prefix: '<',
      suffix: val === 1 ? 'st' : '',
      val,
      alarm,
      note: '',
    };
  }
  if (val > 99) {
    let alarm: alarmLevel;
    if (val > 99.99) {
      val = 99.99;
      alarm = alarmLevel.danger;
    } else if (val > 99.9) {
      val = 99.9;
      alarm = alarmLevel.warning;
    } else {
      val = 99;
      alarm = alarmLevel.minorWarning;
    }
    return {
      prefix: '>',
      suffix: val === 99 ? 'th' : '',
      val,
      alarm,
      note: '',
    };
  }
  val = Math.round(val);
  return {
    prefix: '',
    suffix: getSuffix(val),
    val,
    alarm: alarmLevel.none,
    note: '',
  };
}

const suffixes: suffix[] = ['th', 'st', 'nd', 'rd'];
function getSuffix(val: number): suffix {
  if (val < 1 || val > 99) {
    throw new RangeError('val must be between 1 and 99');
  }
  const lastDigit = val % 10;
  return lastDigit < suffixes.length
    ? suffixes[lastDigit]
    : suffixes[0];
}
