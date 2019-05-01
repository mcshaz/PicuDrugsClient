export enum bsaFormulas { DuBois, Mosteller }
export class MassData {
    public readonly heightMeters: number;
    public constructor(public readonly massKg: number, heightCm: number, public readonly isMale: boolean) {
        this.heightMeters = heightCm / 100;
    }

    public bodySurfaceArea(bsaFormula: bsaFormulas = bsaFormulas.Mosteller) {
        switch (bsaFormula) {
            case bsaFormulas.DuBois:
                return 0.007184 * Math.pow(this.massKg, 0.425) * Math.pow(this.heightMeters, 0.725);
            case bsaFormulas.Mosteller:
                return Math.sqrt(this.massKg * this.heightMeters / 36);
        }
        throw new Error('unknown BSA formula');
    }
    public idealBodyMass() {
        const heightCut = 1.524;
        return (this.isMale ? 49.9 : 45.4) + (this.heightMeters <= heightCut
            ? 0
            : ((this.heightMeters - heightCut) * 0.89));
    }
    // Component of TBM that excludes fat mass but includes fat in nonfat mass cell membranes, bone marrow and the central nervous system.
    public leanBodyMass() {
        const bsaFromula = bsaFormulas.DuBois;
        if (this.isMale) {
            return 1.1 * this.massKg - 0.0128 * this.bodySurfaceArea(bsaFromula) * this.massKg;
        }
        return 1.07 * this.massKg - 0.0148 * this.bodySurfaceArea(bsaFromula) * this.massKg;
    }
    // Component of TBM that does not include fat mass
    public fatFreeMass() {
        const whsMax = this.isMale ? 42.92 : 37.99;
        const whs50 = this.isMale ? 30.93 : 35.98;
        const htSquare = Math.pow(this.heightMeters, 2);
        return whsMax * htSquare * this.massKg / (whs50 * htSquare + this.massKg);
    }
    public normalFatMass(fFat: number) {
        const ffm = this.fatFreeMass();
        return ffm + fFat * (this.massKg - ffm);
    }
    // Mass that normalizes non-ideal body mass to IBM
    public adjustedBodyMass() {
        const ibm = this.idealBodyMass();
        return ibm + 0.4 * (this.massKg - ibm);
    }
    // Mass used to predict fentanyl dosing.
    public pharmakoKineticMass() {
        return 52 / (1 + (196.4 * Math.exp(0.025 * this.massKg) - 53.66) / 100);
    }
    // Mass that normalizes non-lean body mass to LBM with a sex specific factor, Fsex.
    public  predictedBodyMass() {
        const fSex = this.isMale ? 0.43 : 0.64;
        const lbm = this.leanBodyMass();
        return lbm + fSex * (this.massKg - lbm);
    }

}