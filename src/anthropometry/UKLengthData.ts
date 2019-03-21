import { CentileCollection } from './CentileCollection';
import { Lms } from './Lms';
import { GenderRange } from './GenderRange';

export class UKLengthData extends CentileCollection {
    constructor() {
        super({gestAgeWeeksRange: new GenderRange({min: 25, max: 43})});
    }

    public lmsForGestAgeMale(gestAgeWeeks: number) {
            switch (gestAgeWeeks) {
                case 25:
                    return new Lms(1, 35.42414, 0.08132453);
                case 26:
                    return new Lms(1, 36.42492, 0.07862004);
                case 27:
                    return new Lms(1, 37.42772, 0.07590725);
                case 28:
                    return new Lms(1, 38.42789, 0.07314432);
                case 29:
                    return new Lms(1, 39.43673, 0.07025966);
                case 30:
                    return new Lms(1, 40.48008, 0.06722238);
                case 31:
                    return new Lms(1, 41.57838, 0.06404407);
                case 32:
                    return new Lms(1, 42.71663, 0.06080197);
                case 33:
                    return new Lms(1, 43.87082, 0.05758883);
                case 34:
                    return new Lms(1, 45.01804, 0.05449291);
                case 35:
                    return new Lms(1, 46.1415, 0.05158876);
                case 36:
                    return new Lms(1, 47.23352, 0.04895293);
                case 37:
                    return new Lms(1, 48.28677, 0.0466417);
                case 38:
                    return new Lms(1, 49.2766, 0.04469878);
                case 39:
                    return new Lms(1, 50.16595, 0.04315059);
                case 40:
                    return new Lms(1, 50.94454, 0.04197628);
                case 41:
                    return new Lms(1, 51.64579, 0.04100319);
                case 42:
                    return new Lms(1, 52.30513, 0.03994391);
                case 43:
                    return new Lms(1, 53.3905, 0.03609);
                default:
                    throw new RangeError('gestAgeWeeks');
            }
    }
    public lmsForGestAgeFemale(gestAgeWeeks: number) {
        switch (gestAgeWeeks) {
            case 25:
                return new Lms(1, 34.59544, 0.08086044);
            case 26:
                return new Lms(1, 35.59771, 0.07735533);
            case 27:
                return new Lms(1, 36.60905, 0.07386597);
            case 28:
                return new Lms(1, 37.65832, 0.07042367);
            case 29:
                return new Lms(1, 38.76987, 0.06701891);
            case 30:
                return new Lms(1, 39.94117, 0.06362674);
            case 31:
                return new Lms(1, 41.14154, 0.06025431);
            case 32:
                return new Lms(1, 42.34725, 0.0569387);
            case 33:
                return new Lms(1, 43.538, 0.05372271);
            case 34:
                return new Lms(1, 44.69314, 0.05064634);
            case 35:
                return new Lms(1, 45.79079, 0.04773628);
            case 36:
                return new Lms(1, 46.81071, 0.04500635);
            case 37:
                return new Lms(1, 47.73972, 0.04248754);
            case 38:
                return new Lms(1, 48.57771, 0.04026448);
            case 39:
                return new Lms(1, 49.33962, 0.03839778);
            case 40:
                return new Lms(1, 50.01719, 0.0369674);
            case 41:
                return new Lms(1, 50.62523, 0.03608866);
            case 42:
                return new Lms(1, 51.20649, 0.03570984);
            case 43:
                return new Lms(1, 52.4695, 0.03669);
            default:
                throw new RangeError('gestAgeWeeks');
        }
    }

    public lmsForAgeWeeksMale(ageWeeks: number) {
            switch (ageWeeks) {
                case 4:
                    return new Lms(1, 54.3881, 0.0357);
                case 5:
                    return new Lms(1, 55.3374, 0.03534);
                case 6:
                    return new Lms(1, 56.2357, 0.03501);
                case 7:
                    return new Lms(1, 57.0851, 0.0347);
                case 8:
                    return new Lms(1, 57.8889, 0.03442);
                case 9:
                    return new Lms(1, 58.6536, 0.03416);
                case 10:
                    return new Lms(1, 59.3872, 0.03392);
                case 11:
                    return new Lms(1, 60.0894, 0.03369);
                case 12:
                    return new Lms(1, 60.7605, 0.03348);
                case 13:
                    return new Lms(1, 61.4013, 0.03329);
                default:
                    throw new RangeError('ageWeeks');
            }
        }
    public lmsForAgeWeeksFemale(ageWeeks: number) {
        switch (ageWeeks) {
            case 4:
                return new Lms(1, 53.3809, 0.03647);
            case 5:
                return new Lms(1, 54.2454, 0.03627);
            case 6:
                return new Lms(1, 55.0642, 0.03609);
            case 7:
                return new Lms(1, 55.8406, 0.03593);
            case 8:
                return new Lms(1, 56.5767, 0.03578);
            case 9:
                return new Lms(1, 57.2761, 0.03564);
            case 10:
                return new Lms(1, 57.9436, 0.03552);
            case 11:
                return new Lms(1, 58.5816, 0.0354);
            case 12:
                return new Lms(1, 59.1922, 0.0353);
            case 13:
                return new Lms(1, 59.7773, 0.0352);
            default:
                throw new RangeError('ageWeeks');
        }
    }

    public lmsForAgeMonthsMale(ageMonths: number) {
            switch (ageMonths) {
                case 3:
                    return new Lms(1, 61.4292, 0.03328);
                case 4:
                    return new Lms(1, 63.886, 0.03257);
                case 5:
                    return new Lms(1, 65.9026, 0.03204);
                case 6:
                    return new Lms(1, 67.6236, 0.03165);
                case 7:
                    return new Lms(1, 69.1645, 0.03139);
                case 8:
                    return new Lms(1, 70.5994, 0.03124);
                case 9:
                    return new Lms(1, 71.9687, 0.03117);
                case 10:
                    return new Lms(1, 73.2812, 0.03118);
                case 11:
                    return new Lms(1, 74.5388, 0.03125);
                case 12:
                    return new Lms(1, 75.7488, 0.03137);
                case 13:
                    return new Lms(1, 76.9186, 0.03154);
                case 14:
                    return new Lms(1, 78.0497, 0.03174);
                case 15:
                    return new Lms(1, 79.1458, 0.03197);
                case 16:
                    return new Lms(1, 80.2113, 0.03222);
                case 17:
                    return new Lms(1, 81.2487, 0.0325);
                case 18:
                    return new Lms(1, 82.2587, 0.03279);
                case 19:
                    return new Lms(1, 83.2418, 0.0331);
                case 20:
                    return new Lms(1, 84.1996, 0.03342);
                case 21:
                    return new Lms(1, 85.1348, 0.03376);
                case 22:
                    return new Lms(1, 86.0477, 0.0341);
                case 23:
                    return new Lms(1, 86.941, 0.03445);
                case 24:
                    return new Lms(1, 87.8161, 0.03479);
                case 25:
                    return new Lms(1, 87.972, 0.03542);
                case 26:
                    return new Lms(1, 88.8065, 0.03576);
                case 27:
                    return new Lms(1, 89.6197, 0.0361);
                case 28:
                    return new Lms(1, 90.412, 0.03642);
                case 29:
                    return new Lms(1, 91.1828, 0.03674);
                case 30:
                    return new Lms(1, 91.9327, 0.03704);
                case 31:
                    return new Lms(1, 92.6631, 0.03733);
                case 32:
                    return new Lms(1, 93.3753, 0.03761);
                case 33:
                    return new Lms(1, 94.0711, 0.03787);
                case 34:
                    return new Lms(1, 94.7532, 0.03812);
                case 35:
                    return new Lms(1, 95.4236, 0.03836);
                case 36:
                    return new Lms(1, 96.0835, 0.03858);
                case 37:
                    return new Lms(1, 96.7337, 0.03879);
                case 38:
                    return new Lms(1, 97.3749, 0.039);
                case 39:
                    return new Lms(1, 98.0073, 0.03919);
                case 40:
                    return new Lms(1, 98.631, 0.03937);
                case 41:
                    return new Lms(1, 99.2459, 0.03954);
                case 42:
                    return new Lms(1, 99.8515, 0.03971);
                case 43:
                    return new Lms(1, 100.4485, 0.03986);
                case 44:
                    return new Lms(1, 101.0374, 0.04002);
                case 45:
                    return new Lms(1, 101.6186, 0.04016);
                case 46:
                    return new Lms(1, 102.1933, 0.04031);
                case 47:
                    return new Lms(1, 102.7625, 0.04045);
                case 48:
                    return new Lms(1, 103.3273, 0.04059);
                case 49:
                    return new Lms(1, 102.49, 0.04008);
                case 50:
                    return new Lms(1, 103.64, 0.04033);
                case 51:
                    return new Lms(1, 104.22, 0.04045);
                case 52:
                    return new Lms(1, 104.8, 0.04057);
                case 53:
                    return new Lms(1, 105.4, 0.04068);
                case 54:
                    return new Lms(1, 106, 0.04078);
                case 55:
                    return new Lms(1, 106.6, 0.04089);
                case 56:
                    return new Lms(1, 107.21, 0.04098);
                case 57:
                    return new Lms(1, 107.81, 0.04107);
                case 58:
                    return new Lms(1, 108.41, 0.04115);
                case 59:
                    return new Lms(1, 109.01, 0.04123);
                case 60:
                    return new Lms(1, 109.59, 0.04131);
                case 61:
                    return new Lms(1, 110.16, 0.04137);
                case 62:
                    return new Lms(1, 110.73, 0.04144);
                case 63:
                    return new Lms(1, 111.28, 0.04149);
                case 64:
                    return new Lms(1, 111.81, 0.04155);
                case 65:
                    return new Lms(1, 112.35, 0.0416);
                case 66:
                    return new Lms(1, 112.87, 0.04165);
                case 67:
                    return new Lms(1, 113.38, 0.0417);
                case 68:
                    return new Lms(1, 113.9, 0.04174);
                case 69:
                    return new Lms(1, 114.41, 0.04178);
                case 70:
                    return new Lms(1, 114.92, 0.04182);
                case 71:
                    return new Lms(1, 115.43, 0.04186);
                case 72:
                    return new Lms(1, 115.93, 0.0419);
                case 73:
                    return new Lms(1, 116.44, 0.04193);
                case 74:
                    return new Lms(1, 116.94, 0.04197);
                case 75:
                    return new Lms(1, 117.44, 0.042);
                case 76:
                    return new Lms(1, 117.94, 0.04203);
                case 77:
                    return new Lms(1, 118.43, 0.04206);
                case 78:
                    return new Lms(1, 118.93, 0.04209);
                case 79:
                    return new Lms(1, 119.42, 0.04212);
                case 80:
                    return new Lms(1, 119.91, 0.04216);
                case 81:
                    return new Lms(1, 120.41, 0.04219);
                case 82:
                    return new Lms(1, 120.9, 0.04223);
                case 83:
                    return new Lms(1, 121.4, 0.04227);
                case 84:
                    return new Lms(1, 121.9, 0.04231);
                case 85:
                    return new Lms(1, 122.4, 0.04236);
                case 86:
                    return new Lms(1, 122.9, 0.0424);
                case 87:
                    return new Lms(1, 123.4, 0.04245);
                case 88:
                    return new Lms(1, 123.9, 0.04249);
                case 89:
                    return new Lms(1, 124.4, 0.04254);
                case 90:
                    return new Lms(1, 124.9, 0.04259);
                case 91:
                    return new Lms(1, 125.4, 0.04263);
                case 92:
                    return new Lms(1, 125.89, 0.04267);
                case 93:
                    return new Lms(1, 126.39, 0.04272);
                case 94:
                    return new Lms(1, 126.87, 0.04276);
                case 95:
                    return new Lms(1, 127.36, 0.0428);
                case 96:
                    return new Lms(1, 127.85, 0.04284);
                case 97:
                    return new Lms(1, 128.33, 0.04289);
                case 98:
                    return new Lms(1, 128.8, 0.04293);
                case 99:
                    return new Lms(1, 129.27, 0.04297);
                case 100:
                    return new Lms(1, 129.74, 0.04302);
                case 101:
                    return new Lms(1, 130.19, 0.04307);
                case 102:
                    return new Lms(1, 130.64, 0.04312);
                case 103:
                    return new Lms(1, 131.09, 0.04318);
                case 104:
                    return new Lms(1, 131.54, 0.04324);
                case 105:
                    return new Lms(1, 131.97, 0.0433);
                case 106:
                    return new Lms(1, 132.41, 0.04337);
                case 107:
                    return new Lms(1, 132.84, 0.04344);
                case 108:
                    return new Lms(1, 133.28, 0.04351);
                case 109:
                    return new Lms(1, 133.71, 0.04359);
                case 110:
                    return new Lms(1, 134.14, 0.04367);
                case 111:
                    return new Lms(1, 134.57, 0.04376);
                case 112:
                    return new Lms(1, 134.99, 0.04384);
                case 113:
                    return new Lms(1, 135.42, 0.04394);
                case 114:
                    return new Lms(1, 135.84, 0.04403);
                case 115:
                    return new Lms(1, 136.26, 0.04413);
                case 116:
                    return new Lms(1, 136.68, 0.04423);
                case 117:
                    return new Lms(1, 137.1, 0.04433);
                case 118:
                    return new Lms(1, 137.53, 0.04444);
                case 119:
                    return new Lms(1, 137.96, 0.04456);
                case 120:
                    return new Lms(1, 138.39, 0.04468);
                case 121:
                    return new Lms(1, 138.82, 0.0448);
                case 122:
                    return new Lms(1, 139.26, 0.04493);
                case 123:
                    return new Lms(1, 139.69, 0.04506);
                case 124:
                    return new Lms(1, 140.12, 0.0452);
                case 125:
                    return new Lms(1, 140.54, 0.04534);
                case 126:
                    return new Lms(1, 140.96, 0.04548);
                case 127:
                    return new Lms(1, 141.37, 0.04562);
                case 128:
                    return new Lms(1, 141.78, 0.04577);
                case 129:
                    return new Lms(1, 142.18, 0.04592);
                case 130:
                    return new Lms(1, 142.58, 0.04607);
                case 131:
                    return new Lms(1, 142.98, 0.04623);
                case 132:
                    return new Lms(1, 143.37, 0.04638);
                case 133:
                    return new Lms(1, 143.77, 0.04654);
                case 134:
                    return new Lms(1, 144.16, 0.0467);
                case 135:
                    return new Lms(1, 144.55, 0.04687);
                case 136:
                    return new Lms(1, 144.95, 0.04704);
                case 137:
                    return new Lms(1, 145.34, 0.04721);
                case 138:
                    return new Lms(1, 145.75, 0.04738);
                case 139:
                    return new Lms(1, 146.16, 0.04755);
                case 140:
                    return new Lms(1, 146.58, 0.04774);
                case 141:
                    return new Lms(1, 147.02, 0.04792);
                case 142:
                    return new Lms(1, 147.46, 0.0481);
                case 143:
                    return new Lms(1, 147.91, 0.04829);
                case 144:
                    return new Lms(1, 148.36, 0.04848);
                case 145:
                    return new Lms(1, 148.83, 0.04868);
                case 146:
                    return new Lms(1, 149.31, 0.04887);
                case 147:
                    return new Lms(1, 149.81, 0.04906);
                case 148:
                    return new Lms(1, 150.31, 0.04926);
                case 149:
                    return new Lms(1, 150.83, 0.04945);
                case 150:
                    return new Lms(1, 151.35, 0.04964);
                case 151:
                    return new Lms(1, 151.89, 0.04983);
                case 152:
                    return new Lms(1, 152.44, 0.05001);
                case 153:
                    return new Lms(1, 153, 0.05019);
                case 154:
                    return new Lms(1, 153.58, 0.05037);
                case 155:
                    return new Lms(1, 154.17, 0.05053);
                case 156:
                    return new Lms(1, 154.77, 0.05068);
                case 157:
                    return new Lms(1, 155.38, 0.05083);
                case 158:
                    return new Lms(1, 156, 0.05095);
                case 159:
                    return new Lms(1, 156.63, 0.05107);
                case 160:
                    return new Lms(1, 157.27, 0.05116);
                case 161:
                    return new Lms(1, 157.91, 0.05123);
                case 162:
                    return new Lms(1, 158.55, 0.05129);
                case 163:
                    return new Lms(1, 159.2, 0.05132);
                case 164:
                    return new Lms(1, 159.84, 0.05133);
                case 165:
                    return new Lms(1, 160.47, 0.05131);
                case 166:
                    return new Lms(1, 161.11, 0.05126);
                case 167:
                    return new Lms(1, 161.74, 0.0512);
                case 168:
                    return new Lms(1, 162.36, 0.0511);
                case 169:
                    return new Lms(1, 162.97, 0.05098);
                case 170:
                    return new Lms(1, 163.58, 0.05083);
                case 171:
                    return new Lms(1, 164.17, 0.05065);
                case 172:
                    return new Lms(1, 164.75, 0.05045);
                case 173:
                    return new Lms(1, 165.33, 0.05023);
                case 174:
                    return new Lms(1, 165.88, 0.04998);
                case 175:
                    return new Lms(1, 166.43, 0.04971);
                case 176:
                    return new Lms(1, 166.96, 0.04942);
                case 177:
                    return new Lms(1, 167.48, 0.04912);
                case 178:
                    return new Lms(1, 167.98, 0.04879);
                case 179:
                    return new Lms(1, 168.47, 0.04846);
                case 180:
                    return new Lms(1, 168.94, 0.04811);
                case 181:
                    return new Lms(1, 169.4, 0.04776);
                case 182:
                    return new Lms(1, 169.84, 0.0474);
                case 183:
                    return new Lms(1, 170.26, 0.04703);
                case 184:
                    return new Lms(1, 170.67, 0.04666);
                case 185:
                    return new Lms(1, 171.06, 0.0463);
                case 186:
                    return new Lms(1, 171.43, 0.04594);
                case 187:
                    return new Lms(1, 171.79, 0.04558);
                case 188:
                    return new Lms(1, 172.14, 0.04522);
                case 189:
                    return new Lms(1, 172.48, 0.04488);
                case 190:
                    return new Lms(1, 172.79, 0.04454);
                case 191:
                    return new Lms(1, 173.1, 0.04421);
                case 192:
                    return new Lms(1, 173.39, 0.04389);
                case 193:
                    return new Lms(1, 173.66, 0.04358);
                case 194:
                    return new Lms(1, 173.93, 0.04328);
                case 195:
                    return new Lms(1, 174.18, 0.043);
                case 196:
                    return new Lms(1, 174.42, 0.04273);
                case 197:
                    return new Lms(1, 174.64, 0.04246);
                case 198:
                    return new Lms(1, 174.86, 0.04222);
                case 199:
                    return new Lms(1, 175.06, 0.04198);
                case 200:
                    return new Lms(1, 175.25, 0.04175);
                case 201:
                    return new Lms(1, 175.43, 0.04154);
                case 202:
                    return new Lms(1, 175.61, 0.04134);
                case 203:
                    return new Lms(1, 175.77, 0.04114);
                case 204:
                    return new Lms(1, 175.92, 0.04096);
                case 205:
                    return new Lms(1, 176.07, 0.04079);
                case 206:
                    return new Lms(1, 176.21, 0.04063);
                case 207:
                    return new Lms(1, 176.33, 0.04047);
                case 208:
                    return new Lms(1, 176.45, 0.04033);
                case 209:
                    return new Lms(1, 176.57, 0.0402);
                case 210:
                    return new Lms(1, 176.67, 0.04008);
                case 211:
                    return new Lms(1, 176.76, 0.03997);
                case 212:
                    return new Lms(1, 176.85, 0.03987);
                case 213:
                    return new Lms(1, 176.92, 0.03979);
                case 214:
                    return new Lms(1, 176.99, 0.03971);
                case 215:
                    return new Lms(1, 177.04, 0.03964);
                case 216:
                    return new Lms(1, 177.09, 0.03958);
                case 217:
                    return new Lms(1, 177.13, 0.03953);
                case 218:
                    return new Lms(1, 177.17, 0.03948);
                case 219:
                    return new Lms(1, 177.2, 0.03945);
                case 220:
                    return new Lms(1, 177.23, 0.03942);
                case 221:
                    return new Lms(1, 177.25, 0.0394);
                case 222:
                    return new Lms(1, 177.26, 0.03938);
                case 223:
                    return new Lms(1, 177.27, 0.03937);
                case 224:
                    return new Lms(1, 177.27, 0.03936);
                case 225:
                    return new Lms(1, 177.28, 0.03936);
                case 226:
                    return new Lms(1, 177.28, 0.03936);
                case 227:
                    return new Lms(1, 177.28, 0.03936);
                case 228:
                    return new Lms(1, 177.28, 0.03935);
                case 229:
                    return new Lms(1, 177.29, 0.03935);
                case 230:
                    return new Lms(1, 177.29, 0.03934);
                case 231:
                    return new Lms(1, 177.29, 0.03934);
                case 232:
                    return new Lms(1, 177.3, 0.03934);
                case 233:
                    return new Lms(1, 177.3, 0.03934);
                case 234:
                    return new Lms(1, 177.3, 0.03934);
                case 235:
                    return new Lms(1, 177.3, 0.03933);
                case 236:
                    return new Lms(1, 177.3, 0.03933);
                case 237:
                    return new Lms(1, 177.31, 0.03932);
                case 238:
                    return new Lms(1, 177.32, 0.03931);
                case 239:
                    return new Lms(1, 177.33, 0.0393);
                case 240:
                    return new Lms(1, 177.34, 0.03929);
                default:
                    throw new RangeError('ageMonths');
            }
        }
    public lmsForAgeMonthsFemale(ageMonths: number) {
        switch (ageMonths) {
            case 3:
                return new Lms(1, 59.8029, 0.0352);
            case 4:
                return new Lms(1, 62.0899, 0.03486);
            case 5:
                return new Lms(1, 64.0301, 0.03463);
            case 6:
                return new Lms(1, 65.7311, 0.03448);
            case 7:
                return new Lms(1, 67.2873, 0.03441);
            case 8:
                return new Lms(1, 68.7498, 0.0344);
            case 9:
                return new Lms(1, 70.1435, 0.03444);
            case 10:
                return new Lms(1, 71.4818, 0.03452);
            case 11:
                return new Lms(1, 72.771, 0.03464);
            case 12:
                return new Lms(1, 74.015, 0.03479);
            case 13:
                return new Lms(1, 75.2176, 0.03496);
            case 14:
                return new Lms(1, 76.3817, 0.03514);
            case 15:
                return new Lms(1, 77.5099, 0.03534);
            case 16:
                return new Lms(1, 78.6055, 0.03555);
            case 17:
                return new Lms(1, 79.671, 0.03576);
            case 18:
                return new Lms(1, 80.7079, 0.03598);
            case 19:
                return new Lms(1, 81.7182, 0.0362);
            case 20:
                return new Lms(1, 82.7036, 0.03643);
            case 21:
                return new Lms(1, 83.6654, 0.03666);
            case 22:
                return new Lms(1, 84.604, 0.03688);
            case 23:
                return new Lms(1, 85.5202, 0.03711);
            case 24:
                return new Lms(1, 86.4153, 0.03734);
            case 25:
                return new Lms(1, 86.5904, 0.03786);
            case 26:
                return new Lms(1, 87.4462, 0.03808);
            case 27:
                return new Lms(1, 88.283, 0.0383);
            case 28:
                return new Lms(1, 89.1004, 0.03851);
            case 29:
                return new Lms(1, 89.8991, 0.03872);
            case 30:
                return new Lms(1, 90.6797, 0.03893);
            case 31:
                return new Lms(1, 91.443, 0.03913);
            case 32:
                return new Lms(1, 92.1906, 0.03933);
            case 33:
                return new Lms(1, 92.9239, 0.03952);
            case 34:
                return new Lms(1, 93.6444, 0.03971);
            case 35:
                return new Lms(1, 94.3533, 0.03989);
            case 36:
                return new Lms(1, 95.0515, 0.04006);
            case 37:
                return new Lms(1, 95.7399, 0.04024);
            case 38:
                return new Lms(1, 96.4187, 0.04041);
            case 39:
                return new Lms(1, 97.0885, 0.04057);
            case 40:
                return new Lms(1, 97.7493, 0.04073);
            case 41:
                return new Lms(1, 98.4015, 0.04089);
            case 42:
                return new Lms(1, 99.0448, 0.04105);
            case 43:
                return new Lms(1, 99.6795, 0.0412);
            case 44:
                return new Lms(1, 100.3058, 0.04135);
            case 45:
                return new Lms(1, 100.9238, 0.0415);
            case 46:
                return new Lms(1, 101.5337, 0.04164);
            case 47:
                return new Lms(1, 102.136, 0.04179);
            case 48:
                return new Lms(1, 102.7312, 0.04193);
            case 49:
                return new Lms(1, 101.54, 0.03967);
            case 50:
                return new Lms(1, 102.71, 0.03992);
            case 51:
                return new Lms(1, 103.31, 0.04004);
            case 52:
                return new Lms(1, 103.91, 0.04016);
            case 53:
                return new Lms(1, 104.53, 0.04028);
            case 54:
                return new Lms(1, 105.15, 0.04041);
            case 55:
                return new Lms(1, 105.77, 0.04053);
            case 56:
                return new Lms(1, 106.4, 0.04065);
            case 57:
                return new Lms(1, 107.02, 0.04077);
            case 58:
                return new Lms(1, 107.64, 0.04088);
            case 59:
                return new Lms(1, 108.26, 0.04099);
            case 60:
                return new Lms(1, 108.86, 0.0411);
            case 61:
                return new Lms(1, 109.45, 0.0412);
            case 62:
                return new Lms(1, 110.03, 0.0413);
            case 63:
                return new Lms(1, 110.6, 0.0414);
            case 64:
                return new Lms(1, 111.16, 0.04149);
            case 65:
                return new Lms(1, 111.71, 0.04157);
            case 66:
                return new Lms(1, 112.24, 0.04165);
            case 67:
                return new Lms(1, 112.77, 0.04173);
            case 68:
                return new Lms(1, 113.29, 0.0418);
            case 69:
                return new Lms(1, 113.81, 0.04187);
            case 70:
                return new Lms(1, 114.32, 0.04194);
            case 71:
                return new Lms(1, 114.82, 0.042);
            case 72:
                return new Lms(1, 115.33, 0.04206);
            case 73:
                return new Lms(1, 115.83, 0.04212);
            case 74:
                return new Lms(1, 116.33, 0.04217);
            case 75:
                return new Lms(1, 116.82, 0.04222);
            case 76:
                return new Lms(1, 117.31, 0.04227);
            case 77:
                return new Lms(1, 117.81, 0.04232);
            case 78:
                return new Lms(1, 118.3, 0.04237);
            case 79:
                return new Lms(1, 118.79, 0.04241);
            case 80:
                return new Lms(1, 119.28, 0.04246);
            case 81:
                return new Lms(1, 119.77, 0.0425);
            case 82:
                return new Lms(1, 120.26, 0.04254);
            case 83:
                return new Lms(1, 120.77, 0.04258);
            case 84:
                return new Lms(1, 121.27, 0.04261);
            case 85:
                return new Lms(1, 121.77, 0.04265);
            case 86:
                return new Lms(1, 122.28, 0.04268);
            case 87:
                return new Lms(1, 122.79, 0.04271);
            case 88:
                return new Lms(1, 123.31, 0.04273);
            case 89:
                return new Lms(1, 123.82, 0.04276);
            case 90:
                return new Lms(1, 124.33, 0.04278);
            case 91:
                return new Lms(1, 124.84, 0.04281);
            case 92:
                return new Lms(1, 125.34, 0.04284);
            case 93:
                return new Lms(1, 125.85, 0.04287);
            case 94:
                return new Lms(1, 126.35, 0.0429);
            case 95:
                return new Lms(1, 126.85, 0.04293);
            case 96:
                return new Lms(1, 127.34, 0.04298);
            case 97:
                return new Lms(1, 127.82, 0.04302);
            case 98:
                return new Lms(1, 128.3, 0.04308);
            case 99:
                return new Lms(1, 128.76, 0.04314);
            case 100:
                return new Lms(1, 129.23, 0.04321);
            case 101:
                return new Lms(1, 129.69, 0.04328);
            case 102:
                return new Lms(1, 130.14, 0.04336);
            case 103:
                return new Lms(1, 130.59, 0.04345);
            case 104:
                return new Lms(1, 131.03, 0.04354);
            case 105:
                return new Lms(1, 131.48, 0.04364);
            case 106:
                return new Lms(1, 131.92, 0.04375);
            case 107:
                return new Lms(1, 132.37, 0.04387);
            case 108:
                return new Lms(1, 132.82, 0.04399);
            case 109:
                return new Lms(1, 133.27, 0.04412);
            case 110:
                return new Lms(1, 133.73, 0.04426);
            case 111:
                return new Lms(1, 134.19, 0.0444);
            case 112:
                return new Lms(1, 134.65, 0.04455);
            case 113:
                return new Lms(1, 135.12, 0.04471);
            case 114:
                return new Lms(1, 135.59, 0.04487);
            case 115:
                return new Lms(1, 136.06, 0.04504);
            case 116:
                return new Lms(1, 136.53, 0.04521);
            case 117:
                return new Lms(1, 137, 0.04538);
            case 118:
                return new Lms(1, 137.48, 0.04556);
            case 119:
                return new Lms(1, 137.95, 0.04574);
            case 120:
                return new Lms(1, 138.43, 0.04593);
            case 121:
                return new Lms(1, 138.9, 0.04612);
            case 122:
                return new Lms(1, 139.38, 0.0463);
            case 123:
                return new Lms(1, 139.86, 0.04649);
            case 124:
                return new Lms(1, 140.33, 0.04667);
            case 125:
                return new Lms(1, 140.81, 0.04685);
            case 126:
                return new Lms(1, 141.28, 0.04702);
            case 127:
                return new Lms(1, 141.76, 0.04719);
            case 128:
                return new Lms(1, 142.23, 0.04734);
            case 129:
                return new Lms(1, 142.71, 0.04749);
            case 130:
                return new Lms(1, 143.18, 0.04762);
            case 131:
                return new Lms(1, 143.65, 0.04774);
            case 132:
                return new Lms(1, 144.12, 0.04785);
            case 133:
                return new Lms(1, 144.59, 0.04793);
            case 134:
                return new Lms(1, 145.06, 0.048);
            case 135:
                return new Lms(1, 145.53, 0.04805);
            case 136:
                return new Lms(1, 146, 0.04808);
            case 137:
                return new Lms(1, 146.47, 0.04809);
            case 138:
                return new Lms(1, 146.93, 0.04808);
            case 139:
                return new Lms(1, 147.4, 0.04805);
            case 140:
                return new Lms(1, 147.87, 0.04799);
            case 141:
                return new Lms(1, 148.34, 0.04792);
            case 142:
                return new Lms(1, 148.82, 0.04782);
            case 143:
                return new Lms(1, 149.28, 0.0477);
            case 144:
                return new Lms(1, 149.76, 0.04755);
            case 145:
                return new Lms(1, 150.24, 0.04739);
            case 146:
                return new Lms(1, 150.71, 0.04721);
            case 147:
                return new Lms(1, 151.18, 0.04701);
            case 148:
                return new Lms(1, 151.66, 0.0468);
            case 149:
                return new Lms(1, 152.13, 0.04657);
            case 150:
                return new Lms(1, 152.6, 0.04632);
            case 151:
                return new Lms(1, 153.06, 0.04606);
            case 152:
                return new Lms(1, 153.52, 0.04579);
            case 153:
                return new Lms(1, 153.96, 0.04551);
            case 154:
                return new Lms(1, 154.41, 0.04522);
            case 155:
                return new Lms(1, 154.85, 0.04492);
            case 156:
                return new Lms(1, 155.28, 0.04462);
            case 157:
                return new Lms(1, 155.7, 0.04431);
            case 158:
                return new Lms(1, 156.11, 0.044);
            case 159:
                return new Lms(1, 156.52, 0.04369);
            case 160:
                return new Lms(1, 156.91, 0.04338);
            case 161:
                return new Lms(1, 157.28, 0.04307);
            case 162:
                return new Lms(1, 157.65, 0.04276);
            case 163:
                return new Lms(1, 158, 0.04245);
            case 164:
                return new Lms(1, 158.35, 0.04215);
            case 165:
                return new Lms(1, 158.69, 0.04185);
            case 166:
                return new Lms(1, 159.01, 0.04156);
            case 167:
                return new Lms(1, 159.31, 0.04127);
            case 168:
                return new Lms(1, 159.61, 0.041);
            case 169:
                return new Lms(1, 159.89, 0.04073);
            case 170:
                return new Lms(1, 160.16, 0.04046);
            case 171:
                return new Lms(1, 160.42, 0.04021);
            case 172:
                return new Lms(1, 160.67, 0.03997);
            case 173:
                return new Lms(1, 160.9, 0.03974);
            case 174:
                return new Lms(1, 161.12, 0.03952);
            case 175:
                return new Lms(1, 161.32, 0.03931);
            case 176:
                return new Lms(1, 161.52, 0.0391);
            case 177:
                return new Lms(1, 161.71, 0.03892);
            case 178:
                return new Lms(1, 161.88, 0.03874);
            case 179:
                return new Lms(1, 162.03, 0.03858);
            case 180:
                return new Lms(1, 162.18, 0.03842);
            case 181:
                return new Lms(1, 162.32, 0.03828);
            case 182:
                return new Lms(1, 162.44, 0.03815);
            case 183:
                return new Lms(1, 162.56, 0.03803);
            case 184:
                return new Lms(1, 162.66, 0.03792);
            case 185:
                return new Lms(1, 162.76, 0.03782);
            case 186:
                return new Lms(1, 162.85, 0.03772);
            case 187:
                return new Lms(1, 162.92, 0.03764);
            case 188:
                return new Lms(1, 163, 0.03756);
            case 189:
                return new Lms(1, 163.06, 0.03749);
            case 190:
                return new Lms(1, 163.12, 0.03743);
            case 191:
                return new Lms(1, 163.18, 0.03737);
            case 192:
                return new Lms(1, 163.22, 0.03732);
            case 193:
                return new Lms(1, 163.27, 0.03728);
            case 194:
                return new Lms(1, 163.3, 0.03723);
            case 195:
                return new Lms(1, 163.34, 0.0372);
            case 196:
                return new Lms(1, 163.37, 0.03716);
            case 197:
                return new Lms(1, 163.4, 0.03713);
            case 198:
                return new Lms(1, 163.42, 0.03711);
            case 199:
                return new Lms(1, 163.45, 0.03708);
            case 200:
                return new Lms(1, 163.46, 0.03707);
            case 201:
                return new Lms(1, 163.48, 0.03705);
            case 202:
                return new Lms(1, 163.49, 0.03704);
            case 203:
                return new Lms(1, 163.5, 0.03703);
            case 204:
                return new Lms(1, 163.51, 0.03702);
            case 205:
                return new Lms(1, 163.51, 0.03701);
            case 206:
                return new Lms(1, 163.52, 0.03701);
            case 207:
                return new Lms(1, 163.52, 0.03701);
            case 208:
                return new Lms(1, 163.52, 0.03701);
            case 209:
                return new Lms(1, 163.52, 0.037);
            case 210:
                return new Lms(1, 163.53, 0.037);
            case 211:
                return new Lms(1, 163.53, 0.03699);
            case 212:
                return new Lms(1, 163.54, 0.03699);
            case 213:
                return new Lms(1, 163.55, 0.03698);
            case 214:
                return new Lms(1, 163.56, 0.03697);
            case 215:
                return new Lms(1, 163.57, 0.03696);
            case 216:
                return new Lms(1, 163.57, 0.03695);
            case 217:
                return new Lms(1, 163.58, 0.03695);
            case 218:
                return new Lms(1, 163.59, 0.03694);
            case 219:
                return new Lms(1, 163.6, 0.03693);
            case 220:
                return new Lms(1, 163.6, 0.03693);
            case 221:
                return new Lms(1, 163.61, 0.03692);
            case 222:
                return new Lms(1, 163.61, 0.03692);
            case 223:
                return new Lms(1, 163.62, 0.03691);
            case 224:
                return new Lms(1, 163.62, 0.03691);
            case 225:
                return new Lms(1, 163.62, 0.03691);
            case 226:
                return new Lms(1, 163.63, 0.03691);
            case 227:
                return new Lms(1, 163.63, 0.03691);
            case 228:
                return new Lms(1, 163.63, 0.03691);
            case 229:
                return new Lms(1, 163.63, 0.03691);
            case 230:
                return new Lms(1, 163.63, 0.03691);
            case 231:
                return new Lms(1, 163.63, 0.03691);
            case 232:
                return new Lms(1, 163.63, 0.03691);
            case 233:
                return new Lms(1, 163.63, 0.03691);
            case 234:
                return new Lms(1, 163.63, 0.0369);
            case 235:
                return new Lms(1, 163.63, 0.0369);
            case 236:
                return new Lms(1, 163.63, 0.0369);
            case 237:
                return new Lms(1, 163.63, 0.0369);
            case 238:
                return new Lms(1, 163.64, 0.0369);
            case 239:
                return new Lms(1, 163.64, 0.0369);
            case 240:
                return new Lms(1, 163.64, 0.0369);
            default:
                throw new RangeError('ageMonths');
        }
    }
}


