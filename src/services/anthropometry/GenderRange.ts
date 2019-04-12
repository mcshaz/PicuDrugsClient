import { ILookupRange } from './AgeRange/AgeRange';

export class GenderRange {
    public readonly maleRange: ILookupRange;
    public readonly femaleRange: ILookupRange;
    constructor(maleOrUnisexRange: ILookupRange, femaleRange?: ILookupRange) {
        this.maleRange = maleOrUnisexRange;
        this.femaleRange = femaleRange || maleOrUnisexRange;
    }
    public get(isMale: boolean) {
        return isMale ? this.maleRange : this.femaleRange;
    }
}
