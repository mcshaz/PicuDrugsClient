export class SiPrefix
{
	constructor(readonly logValue: number, readonly fullName: string, readonly siSymbol?: string)
	{
		if (siSymbol === void 0){
			siSymbol = fullName.length > 0
				? fullName[0]
				: fullName
		} else if (siSymbol.length > 1) {
			throw new Error("the symbol argument must be 0 or 1 characters long")
		}
	}
}
