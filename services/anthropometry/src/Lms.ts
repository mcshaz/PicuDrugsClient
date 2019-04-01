export class Lms {
    constructor(readonly l: number, readonly m: number, readonly s: number) { }
    public linearInterpolate(interpolWith: Lms, fraction: number) {
        if (fraction < 0 || fraction > 1) {
            throw new Error(('fraction must be between 0 and 1'));
        }
        const oppFraction = 1 - fraction;
        return new Lms(
            oppFraction * this.l + fraction * interpolWith.l,
            oppFraction * this.m + fraction * interpolWith.m,
            oppFraction * this.s + fraction * interpolWith.s,
        );
    }
    public zFromParam(param: number) {
        if (this.l === 0) {
            return Math.log(param / this.m) / this.s;
        }
        return (Math.pow(param / this.m, this.l) - 1) / (this.l * this.s);
    }

    public cumSnormfromParam(param: number) {
        return cumSnorm(this.zFromParam(param));
    }
}

function cumSnorm(zScore: number) {
    const zAbs = Math.abs(zScore);
    let returnVal: number;
    let build: number;
    if (zAbs > 37) {
        return 0;
    } else {
        const Exponential = Math.exp(-Math.pow(zAbs, 2) / 2);
        if (zAbs < 7.07106781186547) {
            build = 3.52624965998911E-02 * zAbs + 0.700383064443688;
            build = build * zAbs + 6.37396220353165;
            build = build * zAbs + 33.912866078383;
            build = build * zAbs + 112.079291497871;
            build = build * zAbs + 221.213596169931;
            build = build * zAbs + 220.206867912376;
            returnVal = Exponential * build;
            build = 8.83883476483184E-02 * zAbs + 1.75566716318264;
            build = build * zAbs + 16.064177579207;
            build = build * zAbs + 86.7807322029461;
            build = build * zAbs + 296.564248779674;
            build = build * zAbs + 637.333633378831;
            build = build * zAbs + 793.826512519948;
            build = build * zAbs + 440.413735824752;
            returnVal = returnVal / build;
        } else {
            build = zAbs + 0.65;
            build = zAbs + 4 / build;
            build = zAbs + 3 / build;
            build = zAbs + 2 / build;
            build = zAbs + 1 / build;
            returnVal = Exponential / build / 2.506628274631;
        }
    }
    return (zScore < 0) ? returnVal : 1 - returnVal;
}
