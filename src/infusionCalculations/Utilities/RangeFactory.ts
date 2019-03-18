import { NumericRange } from './NumericRange'
import { roundingMethod } from './roundingMethod'
export class RangeFactory
{
	precision: number = 2;
	rounding: roundingMethod = roundingMethod.toPrecision;
	create(): NumericRange;
	create(val: number): NumericRange;
	create(val1: number, val2: number): NumericRange;
	create(val1?: number, val2?: number): NumericRange
	{
		let returnVar:NumericRange = new NumericRange(val1,val2);
		returnVar.precision = this.precision;
		returnVar.rounding = this.rounding;
		return returnVar;
	}
}
