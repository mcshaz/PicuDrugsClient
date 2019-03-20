
import { getPrefix } from './getPrefix'
import { getSiUnitAbbrev} from './getSiUnitAbbrev'
import { siUnit } from './../../../db';
export class SiUnitMeasure
{
	pleuralise: boolean = true;
	get isUserSafePrefix(): boolean
	{
		return this.logSi === -3;
	}
	constructor(readonly logSi: number, readonly unit: siUnit)
	{
		if (logSi > 0 || logSi % 3 !== 0)
		{
			throw new RangeError("logSi must be between -12 and 0, in intervals of 3");
		}
	}
	unitString(abbreviate: boolean = false): string
	{
		if (abbreviate)
		{
			return getSiUnitAbbrev(this.unit);
		}
		return siUnit[this.unit] + (this.pleuralise ? "s" : "");
	}
	static logSiToString(logVal: number): string
	{
		return getPrefix(logVal).fullName;
	}
	static logSiToChar(logVal: number): string
	{
		return getPrefix(logVal).siSymbol;
	}
	toString(): string
	{
		return SiUnitMeasure.logSiToString(this.logSi) + this.unitString(false);
	}
	toShortString(): string
	{
		return SiUnitMeasure.logSiToChar(this.logSi) + this.unitString(true);
	}
	toShortUserSafeString(): string
	{
		return this.isUserSafePrefix ? this.toShortString() : this.toString();
	}
}
