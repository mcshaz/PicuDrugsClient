
import { inverseCumSNorm } from './inverseCumSNorm';

const centileZTuppleHalf: Array<[number, number]> = [ 0.4, 2, 9, 25 ].map((cent) =>
        [cent, inverseCumSNorm(cent / 100)]);

const defaultCentiles: Array<[number, number]>  = (centileZTuppleHalf.concat(
        [[50, 0]],
        centileZTuppleHalf.slice().reverse().map((n) => [100 - n[0], -n[1]])));

export { defaultCentiles };

