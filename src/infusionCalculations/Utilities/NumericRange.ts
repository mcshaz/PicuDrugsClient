import { roundingMethod } from './roundingMethod'
export class NumericRange
{
	private _lowerBound: number | undefined ;
	private _upperBound: number | undefined ;
	private _precision: number = 2;

	rounding: roundingMethod = roundingMethod.noRounding;

	set precision(value: number)
	{
		if (value <= 0 || value > 8)
		{
			throw new RangeError("Precision must be between 1 - 8");
		}
		this._precision = value;
	}
	get precision(): number
	{
		return this._precision;
	}
	
	get lowerBound(): number
	{
		return this._lowerBound || 0;
	}
	set lowerBound(value: number)
	{
		if (this._upperBound < value)
		{
			throw new RangeError("upperBound must be greater than lowerBound");
		}
		this._lowerBound = value;
	}
	get upperBound(): number
	{
		return this._upperBound || 0;
	}
	set upperBound(value: number)
	{
		if (this._lowerBound > value)
		{
			throw new RangeError("upperBound must be greater than lowerBound");
		}
		this._upperBound = value;
	}
	separator: string = "–";
	constructor();
	constructor(val: number);
	constructor(val1: number, val2: number);
	constructor(val1?: number, val2?: number)
	{
		if (val1 !== void 0)
		{
			if (val2 !== void 0)
			{
				if (val1 < val2){
					this._lowerBound = val1;
					this._upperBound = val2;
				}
				else{
					this._lowerBound = val2;
					this._upperBound = val1;
				} 
			} else {
				this._lowerBound = this._upperBound = val1;
			}
		}
	}
	private makeString(val :number):string
	{
		switch (this.rounding){
			case roundingMethod.noRounding:
				return val.toString();
			case roundingMethod.fixedDecimalPlaces:
				return val.toFixed(this.precision)
			case roundingMethod.toPrecision:
				let returnVar = val.toPrecision(this.precision);
				return returnVar.includes('e') 
					? parseFloat(returnVar).toString()
					: returnVar;
			default:
				throw new Error("unknown Rounding type");
		}
	}
	toString(): string
	{
		if (this._lowerBound === void 0 && this._upperBound === void 0){
			throw new Error("toString called without upper or lower set")
		}
		if (this._lowerBound === void 0  || this._upperBound === this._lowerBound)
		{
			return this.makeString(this._upperBound as number);
		}
		if (this._upperBound === void 0){
			return this.makeString(this._lowerBound as number);
		}
		return this.makeString(this._lowerBound as number) + this.separator + this.makeString(this._upperBound as number);
	}
	static op_Multiply(rng: NumericRange, multiplier: number): NumericRange
	{
		return new NumericRange(rng.lowerBound * multiplier, rng.upperBound * multiplier);
	}
	static op_Division(rng: NumericRange, divisor: number): NumericRange
	{
		return new NumericRange(rng.lowerBound / divisor, rng.upperBound / divisor);
	}
}
