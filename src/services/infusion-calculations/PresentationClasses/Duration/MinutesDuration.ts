export class MinutesDuration {
  public static op_Subtraction (a: MinutesDuration | number, b: MinutesDuration | number): MinutesDuration {
    const atot = typeof a === 'number' ? a : a.totalMins
    const btot = typeof b === 'number' ? b : b.totalMins
    return new MinutesDuration(atot - btot)
  }
  public static op_Addition (a: MinutesDuration | number, b: MinutesDuration | number): MinutesDuration {
    const atot = typeof a === 'number' ? a : a.totalMins
    const btot = typeof b === 'number' ? b : b.totalMins
    return new MinutesDuration(atot + btot)
  }
  public static op_Multiply (a: MinutesDuration | number, b: MinutesDuration | number): MinutesDuration {
    const atot = typeof a === 'number' ? a : a.totalMins
    const btot = typeof b === 'number' ? b : b.totalMins
    return new MinutesDuration(atot * btot)
  }
  public readonly totalMins: number;
  public readonly hours: number;
  public readonly mins: number;
  constructor (totalMins: number = 0) {
    this.totalMins = Math.floor(totalMins)
    this.hours = Math.floor(this.totalMins / 60)
    this.mins = this.totalMins - this.hours * 60
  }
  public toString (): string {
    return this.hours + ':' + ((this.mins > 9) ? this.mins : ('0' + this.mins))
  }
  public toLongString (): string {
    if (this.hours === 0) {
      return this.mins + ' mins'
    }

    if (this.mins === 0) {
      return this.hours + ' hours'
    }
    return `${this.hours} hours ${this.mins} mins`
  }
}
