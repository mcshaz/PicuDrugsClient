import { CentileCollection } from './CentileCollection';
import { Lms } from './Lms';
import { GenderRange } from './GenderRange';

export class UKLengthData extends CentileCollection {
    constructor() {
        super({gestAgeWeeksRange: new GenderRange(25),
                lmsForGestAgeMale: [
                    new Lms(1, 35.42414, 0.08132453),
                    new Lms(1, 36.42492, 0.07862004),
                    new Lms(1, 37.42772, 0.07590725),
                    new Lms(1, 38.42789, 0.07314432),
                    new Lms(1, 39.43673, 0.07025966),
                    new Lms(1, 40.48008, 0.06722238),
                    new Lms(1, 41.57838, 0.06404407),
                    new Lms(1, 42.71663, 0.06080197),
                    new Lms(1, 43.87082, 0.05758883),
                    new Lms(1, 45.01804, 0.05449291),
                    new Lms(1, 46.1415, 0.05158876),
                    new Lms(1, 47.23352, 0.04895293),
                    new Lms(1, 48.28677, 0.0466417),
                    new Lms(1, 49.2766, 0.04469878),
                    new Lms(1, 50.16595, 0.04315059),
                    new Lms(1, 50.94454, 0.04197628),
                    new Lms(1, 51.64579, 0.04100319),
                    new Lms(1, 52.30513, 0.03994391),
                    new Lms(1, 53.3905, 0.03609) ],
                lmsForGestAgeFemale: [
                    new Lms(1, 34.59544, 0.08086044),
                    new Lms(1, 35.59771, 0.07735533),
                    new Lms(1, 36.60905, 0.07386597),
                    new Lms(1, 37.65832, 0.07042367),
                    new Lms(1, 38.76987, 0.06701891),
                    new Lms(1, 39.94117, 0.06362674),
                    new Lms(1, 41.14154, 0.06025431),
                    new Lms(1, 42.34725, 0.0569387),
                    new Lms(1, 43.538, 0.05372271),
                    new Lms(1, 44.69314, 0.05064634),
                    new Lms(1, 45.79079, 0.04773628),
                    new Lms(1, 46.81071, 0.04500635),
                    new Lms(1, 47.73972, 0.04248754),
                    new Lms(1, 48.57771, 0.04026448),
                    new Lms(1, 49.33962, 0.03839778),
                    new Lms(1, 50.01719, 0.0369674),
                    new Lms(1, 50.62523, 0.03608866),
                    new Lms(1, 51.20649, 0.03570984),
                    new Lms(1, 52.4695, 0.03669) ],
            lmsForAgeWeeksMale: [
                new Lms(1, 54.3881, 0.0357),
                new Lms(1, 55.3374, 0.03534),
                new Lms(1, 56.2357, 0.03501),
                new Lms(1, 57.0851, 0.0347),
                new Lms(1, 57.8889, 0.03442),
                new Lms(1, 58.6536, 0.03416),
                new Lms(1, 59.3872, 0.03392),
                new Lms(1, 60.0894, 0.03369),
                new Lms(1, 60.7605, 0.03348),
                new Lms(1, 61.4013, 0.03329) ],
            lmsForAgeWeeksFemale: [
                new Lms(1, 53.3809, 0.03647),
                new Lms(1, 54.2454, 0.03627),
                new Lms(1, 55.0642, 0.03609),
                new Lms(1, 55.8406, 0.03593),
                new Lms(1, 56.5767, 0.03578),
                new Lms(1, 57.2761, 0.03564),
                new Lms(1, 57.9436, 0.03552),
                new Lms(1, 58.5816, 0.0354),
                new Lms(1, 59.1922, 0.0353),
                new Lms(1, 59.7773, 0.0352) ],
            lmsForAgeMonthsMale: [
                new Lms(1, 61.4292, 0.03328),
                new Lms(1, 63.886, 0.03257),
                new Lms(1, 65.9026, 0.03204),
                new Lms(1, 67.6236, 0.03165),
                new Lms(1, 69.1645, 0.03139),
                new Lms(1, 70.5994, 0.03124),
                new Lms(1, 71.9687, 0.03117),
                new Lms(1, 73.2812, 0.03118),
                new Lms(1, 74.5388, 0.03125),
                new Lms(1, 75.7488, 0.03137),
                new Lms(1, 76.9186, 0.03154),
                new Lms(1, 78.0497, 0.03174),
                new Lms(1, 79.1458, 0.03197),
                new Lms(1, 80.2113, 0.03222),
                new Lms(1, 81.2487, 0.0325),
                new Lms(1, 82.2587, 0.03279),
                new Lms(1, 83.2418, 0.0331),
                new Lms(1, 84.1996, 0.03342),
                new Lms(1, 85.1348, 0.03376),
                new Lms(1, 86.0477, 0.0341),
                new Lms(1, 86.941, 0.03445),
                new Lms(1, 87.8161, 0.03479),
                new Lms(1, 87.972, 0.03542),
                new Lms(1, 88.8065, 0.03576),
                new Lms(1, 89.6197, 0.0361),
                new Lms(1, 90.412, 0.03642),
                new Lms(1, 91.1828, 0.03674),
                new Lms(1, 91.9327, 0.03704),
                new Lms(1, 92.6631, 0.03733),
                new Lms(1, 93.3753, 0.03761),
                new Lms(1, 94.0711, 0.03787),
                new Lms(1, 94.7532, 0.03812),
                new Lms(1, 95.4236, 0.03836),
                new Lms(1, 96.0835, 0.03858),
                new Lms(1, 96.7337, 0.03879),
                new Lms(1, 97.3749, 0.039),
                new Lms(1, 98.0073, 0.03919),
                new Lms(1, 98.631, 0.03937),
                new Lms(1, 99.2459, 0.03954),
                new Lms(1, 99.8515, 0.03971),
                new Lms(1, 100.4485, 0.03986),
                new Lms(1, 101.0374, 0.04002),
                new Lms(1, 101.6186, 0.04016),
                new Lms(1, 102.1933, 0.04031),
                new Lms(1, 102.7625, 0.04045),
                new Lms(1, 103.3273, 0.04059),
                new Lms(1, 102.49, 0.04008),
                new Lms(1, 103.64, 0.04033),
                new Lms(1, 104.22, 0.04045),
                new Lms(1, 104.8, 0.04057),
                new Lms(1, 105.4, 0.04068),
                new Lms(1, 106, 0.04078),
                new Lms(1, 106.6, 0.04089),
                new Lms(1, 107.21, 0.04098),
                new Lms(1, 107.81, 0.04107),
                new Lms(1, 108.41, 0.04115),
                new Lms(1, 109.01, 0.04123),
                new Lms(1, 109.59, 0.04131),
                new Lms(1, 110.16, 0.04137),
                new Lms(1, 110.73, 0.04144),
                new Lms(1, 111.28, 0.04149),
                new Lms(1, 111.81, 0.04155),
                new Lms(1, 112.35, 0.0416),
                new Lms(1, 112.87, 0.04165),
                new Lms(1, 113.38, 0.0417),
                new Lms(1, 113.9, 0.04174),
                new Lms(1, 114.41, 0.04178),
                new Lms(1, 114.92, 0.04182),
                new Lms(1, 115.43, 0.04186),
                new Lms(1, 115.93, 0.0419),
                new Lms(1, 116.44, 0.04193),
                new Lms(1, 116.94, 0.04197),
                new Lms(1, 117.44, 0.042),
                new Lms(1, 117.94, 0.04203),
                new Lms(1, 118.43, 0.04206),
                new Lms(1, 118.93, 0.04209),
                new Lms(1, 119.42, 0.04212),
                new Lms(1, 119.91, 0.04216),
                new Lms(1, 120.41, 0.04219),
                new Lms(1, 120.9, 0.04223),
                new Lms(1, 121.4, 0.04227),
                new Lms(1, 121.9, 0.04231),
                new Lms(1, 122.4, 0.04236),
                new Lms(1, 122.9, 0.0424),
                new Lms(1, 123.4, 0.04245),
                new Lms(1, 123.9, 0.04249),
                new Lms(1, 124.4, 0.04254),
                new Lms(1, 124.9, 0.04259),
                new Lms(1, 125.4, 0.04263),
                new Lms(1, 125.89, 0.04267),
                new Lms(1, 126.39, 0.04272),
                new Lms(1, 126.87, 0.04276),
                new Lms(1, 127.36, 0.0428),
                new Lms(1, 127.85, 0.04284),
                new Lms(1, 128.33, 0.04289),
                new Lms(1, 128.8, 0.04293),
                new Lms(1, 129.27, 0.04297),
                new Lms(1, 129.74, 0.04302),
                new Lms(1, 130.19, 0.04307),
                new Lms(1, 130.64, 0.04312),
                new Lms(1, 131.09, 0.04318),
                new Lms(1, 131.54, 0.04324),
                new Lms(1, 131.97, 0.0433),
                new Lms(1, 132.41, 0.04337),
                new Lms(1, 132.84, 0.04344),
                new Lms(1, 133.28, 0.04351),
                new Lms(1, 133.71, 0.04359),
                new Lms(1, 134.14, 0.04367),
                new Lms(1, 134.57, 0.04376),
                new Lms(1, 134.99, 0.04384),
                new Lms(1, 135.42, 0.04394),
                new Lms(1, 135.84, 0.04403),
                new Lms(1, 136.26, 0.04413),
                new Lms(1, 136.68, 0.04423),
                new Lms(1, 137.1, 0.04433),
                new Lms(1, 137.53, 0.04444),
                new Lms(1, 137.96, 0.04456),
                new Lms(1, 138.39, 0.04468),
                new Lms(1, 138.82, 0.0448),
                new Lms(1, 139.26, 0.04493),
                new Lms(1, 139.69, 0.04506),
                new Lms(1, 140.12, 0.0452),
                new Lms(1, 140.54, 0.04534),
                new Lms(1, 140.96, 0.04548),
                new Lms(1, 141.37, 0.04562),
                new Lms(1, 141.78, 0.04577),
                new Lms(1, 142.18, 0.04592),
                new Lms(1, 142.58, 0.04607),
                new Lms(1, 142.98, 0.04623),
                new Lms(1, 143.37, 0.04638),
                new Lms(1, 143.77, 0.04654),
                new Lms(1, 144.16, 0.0467),
                new Lms(1, 144.55, 0.04687),
                new Lms(1, 144.95, 0.04704),
                new Lms(1, 145.34, 0.04721),
                new Lms(1, 145.75, 0.04738),
                new Lms(1, 146.16, 0.04755),
                new Lms(1, 146.58, 0.04774),
                new Lms(1, 147.02, 0.04792),
                new Lms(1, 147.46, 0.0481),
                new Lms(1, 147.91, 0.04829),
                new Lms(1, 148.36, 0.04848),
                new Lms(1, 148.83, 0.04868),
                new Lms(1, 149.31, 0.04887),
                new Lms(1, 149.81, 0.04906),
                new Lms(1, 150.31, 0.04926),
                new Lms(1, 150.83, 0.04945),
                new Lms(1, 151.35, 0.04964),
                new Lms(1, 151.89, 0.04983),
                new Lms(1, 152.44, 0.05001),
                new Lms(1, 153, 0.05019),
                new Lms(1, 153.58, 0.05037),
                new Lms(1, 154.17, 0.05053),
                new Lms(1, 154.77, 0.05068),
                new Lms(1, 155.38, 0.05083),
                new Lms(1, 156, 0.05095),
                new Lms(1, 156.63, 0.05107),
                new Lms(1, 157.27, 0.05116),
                new Lms(1, 157.91, 0.05123),
                new Lms(1, 158.55, 0.05129),
                new Lms(1, 159.2, 0.05132),
                new Lms(1, 159.84, 0.05133),
                new Lms(1, 160.47, 0.05131),
                new Lms(1, 161.11, 0.05126),
                new Lms(1, 161.74, 0.0512),
                new Lms(1, 162.36, 0.0511),
                new Lms(1, 162.97, 0.05098),
                new Lms(1, 163.58, 0.05083),
                new Lms(1, 164.17, 0.05065),
                new Lms(1, 164.75, 0.05045),
                new Lms(1, 165.33, 0.05023),
                new Lms(1, 165.88, 0.04998),
                new Lms(1, 166.43, 0.04971),
                new Lms(1, 166.96, 0.04942),
                new Lms(1, 167.48, 0.04912),
                new Lms(1, 167.98, 0.04879),
                new Lms(1, 168.47, 0.04846),
                new Lms(1, 168.94, 0.04811),
                new Lms(1, 169.4, 0.04776),
                new Lms(1, 169.84, 0.0474),
                new Lms(1, 170.26, 0.04703),
                new Lms(1, 170.67, 0.04666),
                new Lms(1, 171.06, 0.0463),
                new Lms(1, 171.43, 0.04594),
                new Lms(1, 171.79, 0.04558),
                new Lms(1, 172.14, 0.04522),
                new Lms(1, 172.48, 0.04488),
                new Lms(1, 172.79, 0.04454),
                new Lms(1, 173.1, 0.04421),
                new Lms(1, 173.39, 0.04389),
                new Lms(1, 173.66, 0.04358),
                new Lms(1, 173.93, 0.04328),
                new Lms(1, 174.18, 0.043),
                new Lms(1, 174.42, 0.04273),
                new Lms(1, 174.64, 0.04246),
                new Lms(1, 174.86, 0.04222),
                new Lms(1, 175.06, 0.04198),
                new Lms(1, 175.25, 0.04175),
                new Lms(1, 175.43, 0.04154),
                new Lms(1, 175.61, 0.04134),
                new Lms(1, 175.77, 0.04114),
                new Lms(1, 175.92, 0.04096),
                new Lms(1, 176.07, 0.04079),
                new Lms(1, 176.21, 0.04063),
                new Lms(1, 176.33, 0.04047),
                new Lms(1, 176.45, 0.04033),
                new Lms(1, 176.57, 0.0402),
                new Lms(1, 176.67, 0.04008),
                new Lms(1, 176.76, 0.03997),
                new Lms(1, 176.85, 0.03987),
                new Lms(1, 176.92, 0.03979),
                new Lms(1, 176.99, 0.03971),
                new Lms(1, 177.04, 0.03964),
                new Lms(1, 177.09, 0.03958),
                new Lms(1, 177.13, 0.03953),
                new Lms(1, 177.17, 0.03948),
                new Lms(1, 177.2, 0.03945),
                new Lms(1, 177.23, 0.03942),
                new Lms(1, 177.25, 0.0394),
                new Lms(1, 177.26, 0.03938),
                new Lms(1, 177.27, 0.03937),
                new Lms(1, 177.27, 0.03936),
                new Lms(1, 177.28, 0.03936),
                new Lms(1, 177.28, 0.03936),
                new Lms(1, 177.28, 0.03936),
                new Lms(1, 177.28, 0.03935),
                new Lms(1, 177.29, 0.03935),
                new Lms(1, 177.29, 0.03934),
                new Lms(1, 177.29, 0.03934),
                new Lms(1, 177.3, 0.03934),
                new Lms(1, 177.3, 0.03934),
                new Lms(1, 177.3, 0.03934),
                new Lms(1, 177.3, 0.03933),
                new Lms(1, 177.3, 0.03933),
                new Lms(1, 177.31, 0.03932),
                new Lms(1, 177.32, 0.03931),
                new Lms(1, 177.33, 0.0393),
                new Lms(1, 177.34, 0.03929) ],
            lmsForAgeMonthsFemale: [
                new Lms(1, 59.8029, 0.0352),
                new Lms(1, 62.0899, 0.03486),
                new Lms(1, 64.0301, 0.03463),
                new Lms(1, 65.7311, 0.03448),
                new Lms(1, 67.2873, 0.03441),
                new Lms(1, 68.7498, 0.0344),
                new Lms(1, 70.1435, 0.03444),
                new Lms(1, 71.4818, 0.03452),
                new Lms(1, 72.771, 0.03464),
                new Lms(1, 74.015, 0.03479),
                new Lms(1, 75.2176, 0.03496),
                new Lms(1, 76.3817, 0.03514),
                new Lms(1, 77.5099, 0.03534),
                new Lms(1, 78.6055, 0.03555),
                new Lms(1, 79.671, 0.03576),
                new Lms(1, 80.7079, 0.03598),
                new Lms(1, 81.7182, 0.0362),
                new Lms(1, 82.7036, 0.03643),
                new Lms(1, 83.6654, 0.03666),
                new Lms(1, 84.604, 0.03688),
                new Lms(1, 85.5202, 0.03711),
                new Lms(1, 86.4153, 0.03734),
                new Lms(1, 86.5904, 0.03786),
                new Lms(1, 87.4462, 0.03808),
                new Lms(1, 88.283, 0.0383),
                new Lms(1, 89.1004, 0.03851),
                new Lms(1, 89.8991, 0.03872),
                new Lms(1, 90.6797, 0.03893),
                new Lms(1, 91.443, 0.03913),
                new Lms(1, 92.1906, 0.03933),
                new Lms(1, 92.9239, 0.03952),
                new Lms(1, 93.6444, 0.03971),
                new Lms(1, 94.3533, 0.03989),
                new Lms(1, 95.0515, 0.04006),
                new Lms(1, 95.7399, 0.04024),
                new Lms(1, 96.4187, 0.04041),
                new Lms(1, 97.0885, 0.04057),
                new Lms(1, 97.7493, 0.04073),
                new Lms(1, 98.4015, 0.04089),
                new Lms(1, 99.0448, 0.04105),
                new Lms(1, 99.6795, 0.0412),
                new Lms(1, 100.3058, 0.04135),
                new Lms(1, 100.9238, 0.0415),
                new Lms(1, 101.5337, 0.04164),
                new Lms(1, 102.136, 0.04179),
                new Lms(1, 102.7312, 0.04193),
                new Lms(1, 101.54, 0.03967),
                new Lms(1, 102.71, 0.03992),
                new Lms(1, 103.31, 0.04004),
                new Lms(1, 103.91, 0.04016),
                new Lms(1, 104.53, 0.04028),
                new Lms(1, 105.15, 0.04041),
                new Lms(1, 105.77, 0.04053),
                new Lms(1, 106.4, 0.04065),
                new Lms(1, 107.02, 0.04077),
                new Lms(1, 107.64, 0.04088),
                new Lms(1, 108.26, 0.04099),
                new Lms(1, 108.86, 0.0411),
                new Lms(1, 109.45, 0.0412),
                new Lms(1, 110.03, 0.0413),
                new Lms(1, 110.6, 0.0414),
                new Lms(1, 111.16, 0.04149),
                new Lms(1, 111.71, 0.04157),
                new Lms(1, 112.24, 0.04165),
                new Lms(1, 112.77, 0.04173),
                new Lms(1, 113.29, 0.0418),
                new Lms(1, 113.81, 0.04187),
                new Lms(1, 114.32, 0.04194),
                new Lms(1, 114.82, 0.042),
                new Lms(1, 115.33, 0.04206),
                new Lms(1, 115.83, 0.04212),
                new Lms(1, 116.33, 0.04217),
                new Lms(1, 116.82, 0.04222),
                new Lms(1, 117.31, 0.04227),
                new Lms(1, 117.81, 0.04232),
                new Lms(1, 118.3, 0.04237),
                new Lms(1, 118.79, 0.04241),
                new Lms(1, 119.28, 0.04246),
                new Lms(1, 119.77, 0.0425),
                new Lms(1, 120.26, 0.04254),
                new Lms(1, 120.77, 0.04258),
                new Lms(1, 121.27, 0.04261),
                new Lms(1, 121.77, 0.04265),
                new Lms(1, 122.28, 0.04268),
                new Lms(1, 122.79, 0.04271),
                new Lms(1, 123.31, 0.04273),
                new Lms(1, 123.82, 0.04276),
                new Lms(1, 124.33, 0.04278),
                new Lms(1, 124.84, 0.04281),
                new Lms(1, 125.34, 0.04284),
                new Lms(1, 125.85, 0.04287),
                new Lms(1, 126.35, 0.0429),
                new Lms(1, 126.85, 0.04293),
                new Lms(1, 127.34, 0.04298),
                new Lms(1, 127.82, 0.04302),
                new Lms(1, 128.3, 0.04308),
                new Lms(1, 128.76, 0.04314),
                new Lms(1, 129.23, 0.04321),
                new Lms(1, 129.69, 0.04328),
                new Lms(1, 130.14, 0.04336),
                new Lms(1, 130.59, 0.04345),
                new Lms(1, 131.03, 0.04354),
                new Lms(1, 131.48, 0.04364),
                new Lms(1, 131.92, 0.04375),
                new Lms(1, 132.37, 0.04387),
                new Lms(1, 132.82, 0.04399),
                new Lms(1, 133.27, 0.04412),
                new Lms(1, 133.73, 0.04426),
                new Lms(1, 134.19, 0.0444),
                new Lms(1, 134.65, 0.04455),
                new Lms(1, 135.12, 0.04471),
                new Lms(1, 135.59, 0.04487),
                new Lms(1, 136.06, 0.04504),
                new Lms(1, 136.53, 0.04521),
                new Lms(1, 137, 0.04538),
                new Lms(1, 137.48, 0.04556),
                new Lms(1, 137.95, 0.04574),
                new Lms(1, 138.43, 0.04593),
                new Lms(1, 138.9, 0.04612),
                new Lms(1, 139.38, 0.0463),
                new Lms(1, 139.86, 0.04649),
                new Lms(1, 140.33, 0.04667),
                new Lms(1, 140.81, 0.04685),
                new Lms(1, 141.28, 0.04702),
                new Lms(1, 141.76, 0.04719),
                new Lms(1, 142.23, 0.04734),
                new Lms(1, 142.71, 0.04749),
                new Lms(1, 143.18, 0.04762),
                new Lms(1, 143.65, 0.04774),
                new Lms(1, 144.12, 0.04785),
                new Lms(1, 144.59, 0.04793),
                new Lms(1, 145.06, 0.048),
                new Lms(1, 145.53, 0.04805),
                new Lms(1, 146, 0.04808),
                new Lms(1, 146.47, 0.04809),
                new Lms(1, 146.93, 0.04808),
                new Lms(1, 147.4, 0.04805),
                new Lms(1, 147.87, 0.04799),
                new Lms(1, 148.34, 0.04792),
                new Lms(1, 148.82, 0.04782),
                new Lms(1, 149.28, 0.0477),
                new Lms(1, 149.76, 0.04755),
                new Lms(1, 150.24, 0.04739),
                new Lms(1, 150.71, 0.04721),
                new Lms(1, 151.18, 0.04701),
                new Lms(1, 151.66, 0.0468),
                new Lms(1, 152.13, 0.04657),
                new Lms(1, 152.6, 0.04632),
                new Lms(1, 153.06, 0.04606),
                new Lms(1, 153.52, 0.04579),
                new Lms(1, 153.96, 0.04551),
                new Lms(1, 154.41, 0.04522),
                new Lms(1, 154.85, 0.04492),
                new Lms(1, 155.28, 0.04462),
                new Lms(1, 155.7, 0.04431),
                new Lms(1, 156.11, 0.044),
                new Lms(1, 156.52, 0.04369),
                new Lms(1, 156.91, 0.04338),
                new Lms(1, 157.28, 0.04307),
                new Lms(1, 157.65, 0.04276),
                new Lms(1, 158, 0.04245),
                new Lms(1, 158.35, 0.04215),
                new Lms(1, 158.69, 0.04185),
                new Lms(1, 159.01, 0.04156),
                new Lms(1, 159.31, 0.04127),
                new Lms(1, 159.61, 0.041),
                new Lms(1, 159.89, 0.04073),
                new Lms(1, 160.16, 0.04046),
                new Lms(1, 160.42, 0.04021),
                new Lms(1, 160.67, 0.03997),
                new Lms(1, 160.9, 0.03974),
                new Lms(1, 161.12, 0.03952),
                new Lms(1, 161.32, 0.03931),
                new Lms(1, 161.52, 0.0391),
                new Lms(1, 161.71, 0.03892),
                new Lms(1, 161.88, 0.03874),
                new Lms(1, 162.03, 0.03858),
                new Lms(1, 162.18, 0.03842),
                new Lms(1, 162.32, 0.03828),
                new Lms(1, 162.44, 0.03815),
                new Lms(1, 162.56, 0.03803),
                new Lms(1, 162.66, 0.03792),
                new Lms(1, 162.76, 0.03782),
                new Lms(1, 162.85, 0.03772),
                new Lms(1, 162.92, 0.03764),
                new Lms(1, 163, 0.03756),
                new Lms(1, 163.06, 0.03749),
                new Lms(1, 163.12, 0.03743),
                new Lms(1, 163.18, 0.03737),
                new Lms(1, 163.22, 0.03732),
                new Lms(1, 163.27, 0.03728),
                new Lms(1, 163.3, 0.03723),
                new Lms(1, 163.34, 0.0372),
                new Lms(1, 163.37, 0.03716),
                new Lms(1, 163.4, 0.03713),
                new Lms(1, 163.42, 0.03711),
                new Lms(1, 163.45, 0.03708),
                new Lms(1, 163.46, 0.03707),
                new Lms(1, 163.48, 0.03705),
                new Lms(1, 163.49, 0.03704),
                new Lms(1, 163.5, 0.03703),
                new Lms(1, 163.51, 0.03702),
                new Lms(1, 163.51, 0.03701),
                new Lms(1, 163.52, 0.03701),
                new Lms(1, 163.52, 0.03701),
                new Lms(1, 163.52, 0.03701),
                new Lms(1, 163.52, 0.037),
                new Lms(1, 163.53, 0.037),
                new Lms(1, 163.53, 0.03699),
                new Lms(1, 163.54, 0.03699),
                new Lms(1, 163.55, 0.03698),
                new Lms(1, 163.56, 0.03697),
                new Lms(1, 163.57, 0.03696),
                new Lms(1, 163.57, 0.03695),
                new Lms(1, 163.58, 0.03695),
                new Lms(1, 163.59, 0.03694),
                new Lms(1, 163.6, 0.03693),
                new Lms(1, 163.6, 0.03693),
                new Lms(1, 163.61, 0.03692),
                new Lms(1, 163.61, 0.03692),
                new Lms(1, 163.62, 0.03691),
                new Lms(1, 163.62, 0.03691),
                new Lms(1, 163.62, 0.03691),
                new Lms(1, 163.63, 0.03691),
                new Lms(1, 163.63, 0.03691),
                new Lms(1, 163.63, 0.03691),
                new Lms(1, 163.63, 0.03691),
                new Lms(1, 163.63, 0.03691),
                new Lms(1, 163.63, 0.03691),
                new Lms(1, 163.63, 0.03691),
                new Lms(1, 163.63, 0.03691),
                new Lms(1, 163.63, 0.0369),
                new Lms(1, 163.63, 0.0369),
                new Lms(1, 163.63, 0.0369),
                new Lms(1, 163.63, 0.0369),
                new Lms(1, 163.64, 0.0369),
                new Lms(1, 163.64, 0.0369),
                new Lms(1, 163.64, 0.0369),
            ],
        });
    }
}


