import { NumericRange } from './../../Utilities/NumericRange';

export function cvlSizeFrench(weightKg: number): NumericRange {
    if (weightKg < 10) {
        return new NumericRange(4, 4.5);
    }
    if (weightKg < 20) {
        return new NumericRange(4, 5);
    }
    if (weightKg < 40) {
        return new NumericRange(5.5);
    }
    return new NumericRange(7);
}

// assuming inserted 1/2 way between mastoind & sternal notch
// Peres' formula of “height (in cm)/10
// Peres PW. Positioning central venous catheters: A prospective survey. Anesth Intensive Care. 1990;18:536–9. [PubMed] [Google Scholar]
// this is using
// http://110.164.68.227/homelibrary/rj_online/Acta_anes/2006/Vol.50/No.3March/Depth355.pdf Yoon, S. et al Depth of a central venous catheter tip: length of insertion guideline for pediatric patients. Acta Anaesthesiol Scand 2006; 50: 355—357
/*
function getDepthYoonDepthCm(heightCm: number) {
    return 1.7 * (0.07 * heightCm);
}

// for rt IJ best method probably measure to sternal angle - Turk J Anaesthesiol Reanim. 2018 Apr; 46(2): 116–120. Comparative Study of Three Methods for Depth of Central Venous Catheter Placement in Children: An Observational Pilot Study Vaishali Chaskar, Priyanka Pradeep Karnik

// NB this does not include distance from insertion site to the clavicle, and does is to svc/ra junction
// note it is 2cm longer on L to 120cm, then 3cm longer
// Predicting the optimal depth of left-sided central venous cathetersin childrenH. Kim,1C-H. Jeong,2H-J. Byon,3H. K. Shin,4T. J. Yun,5J-H. Lee,6Y-H. Park6and J-T. Kim
function getVesselLengthFromHeight(heightCm: number) {
    return {
        ij: {
            l: 0.068 * heightCm + 2.117,
            r: 0.059 * heightCm + 0.732,
        },
        sc: {
            l: 0.076 * heightCm + 1.952,
            r: 0.067 * heightCm + 0.628,
        }
    };
}

// 2 cm longer until 9+1/2 - 10, then 3
function getVesselLengthFromAge(ageMonths: number) {
    return {
        ij: {
            l: 0.043 * ageMonths + 6.454,
            r: 0.038 * ageMonths + 4.499,
        },
        sc: {
            l: 0.048 * ageMonths + 6.809,
            r: 0.042 * ageMonths + 4.851,
        }
    };
}
*/
