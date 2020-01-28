export type datePartType = 'day' | 'month' | 'year';
type splitVal = boolean | [string, string];
// tslint:disable-next-line: max-classes-per-file
export class DatePart {
  private static moveDay(day: string): splitVal {
    if (!day.length) {
      return false;
    }
    if (day.length === 2 && day[0] === '0' && day[1] !== '0') {
      return true;
    }
    const dVal = Number(day);
    if (Number.isNaN(dVal)) {
      return false;
    }
    if (dVal > 31) {
      return [day.slice(0, -1), day.slice(-1)];
    }
    if (dVal > 3) {
      return true;
    }
    return false;
  }
  private static moveYear(year: string): splitVal {
    if (year.length < 4) {
      return false;
    }
    const yVal = Number(year);
    if (Number.isNaN(yVal)) {
      return false;
    }
    if (yVal < 1000) {
      return false;
    }
    if (yVal >= 10000) {
      return [year.slice(0, -1), year.slice(-1)];
    }
    return true;
  }
  private static moveMonth(month: string): splitVal {
    if (!month.length) {
      return false;
    }
    if (month.length === 2 && month[0] === '0' && month[1] !== '0') {
      return true;
    }
    const mVal = Number(month);
    if (Number.isNaN(mVal)) {
      return false;
    }
    if (mVal > 12) {
      return [month.slice(0, -1), month.slice(-1)];
    }
    if (mVal > 1) {
      return true;
    }
    return false;
  }
    public readonly placeholder: string;
    public max: number;
    public readonly class: string;
    private pValue: string = '';
    private readonly len: 2 | 4;
    constructor(readonly part: datePartType) {
      this.class = 'FormDate__input--' + part;
      switch (part) {
        case 'day':
          this.max = 31;
          this.len = 2;
          this.placeholder = 'dd';
          break;
        case 'month':
          this.max = 12;
          this.len = 2;
          this.placeholder = 'mm';
          break;
        case 'year':
          this.max = 2099;
          this.len = 4;
          this.placeholder = 'yyyy';
          break;
        default:
          throw new TypeError('part must be 1 of day, month or year');
      }
    }
    public get value() { return this.pValue; }
    // sets the value. If 'overflow' returns the value to add to the next field
    public setValue(no: string, divideOverflow = true) {
      let returnVar: boolean | string = false;
      if (no === '' || no === '0') {
        this.pValue = no;
        return false;
      } else if (divideOverflow) {
        let move: boolean | string[];
        if (this.part === 'day') {
          move = DatePart.moveDay(no);
        } else if (this.part === 'month') {
          move = DatePart.moveMonth(no);
        } else { // year
          move = DatePart.moveYear(no);
        }
        if (typeof move === 'boolean') {
          returnVar = move;
        } else {
          no = move[0];
          returnVar = move[1];
        }
      }
      this.pValue = no.slice(-this.len).padStart(this.len, '0');
      return returnVar;
    }
}
