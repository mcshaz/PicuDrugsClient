export class GenderRange {
    public readonly maleMin: number;
    public readonly femaleMin: number;
    constructor(maleOrUnisexMin: number, femaleMin?: number) {
      this.maleMin = maleOrUnisexMin;
      this.femaleMin = typeof femaleMin === 'number' ? femaleMin : maleOrUnisexMin;
    }
}
