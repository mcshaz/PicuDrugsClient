import { CentileCollection, GenderRange } from "./CentileCollection";
import { Lms } from "./Lms";

export class UKBMIData extends CentileCollection{
    constructor(){
        super({ gestAgeWeeksRange : new GenderRange({min: 43, max: 43})});
    }
    lmsForGestAgeMale(gestAgeWeeks:number)
    {
        switch (gestAgeWeeks)
        {
            case 43:
                return new Lms(0.3449, 14.2241, 0.0923);
            default:
                throw new RangeError("gestAgeWeeks");
        }
    }
    lmsForGestAgeFemale(gestAgeWeeks:number)
    {
        switch (gestAgeWeeks)
        {
            //Female
            case 43:
                return new Lms(0.4263, 13.9505, 0.09647);
            default:
                throw new RangeError("gestAgeWeeks");
        }
    }

    lmsForAgeWeeksMale(ageWeeks:number)
    {
        switch (ageWeeks)
        {
            case 4:
                return new Lms(0.2881, 14.7714, 0.09072);
            case 5:
                return new Lms(0.2409, 15.2355, 0.08953);
            case 6:
                return new Lms(0.2003, 15.6107, 0.08859);
            case 7:
                return new Lms(0.1645, 15.9169, 0.08782);
            case 8:
                return new Lms(0.1324, 16.1698, 0.08717);
            case 9:
                return new Lms(0.1032, 16.3787, 0.08661);
            case 10:
                return new Lms(0.0766, 16.5494, 0.08612);
            case 11:
                return new Lms(0.052, 16.6882, 0.08569);
            case 12:
                return new Lms(0.0291, 16.8016, 0.08531);
            case 13:
                return new Lms(0.0077, 16.895, 0.08496);
            default:
                throw new RangeError("ageWeeks");
        }
    }
    lmsForAgeWeeksFemale(ageWeeks:number)
    {
        switch (ageWeeks)
        {
            case 4:
                return new Lms(0.3637, 14.4208, 0.09577);
            case 5:
                return new Lms(0.3124, 14.8157, 0.0952);
            case 6:
                return new Lms(0.2688, 15.138, 0.09472);
            case 7:
                return new Lms(0.2306, 15.4063, 0.09431);
            case 8:
                return new Lms(0.1966, 15.6311, 0.09394);
            case 9:
                return new Lms(0.1658, 15.8232, 0.09361);
            case 10:
                return new Lms(0.1377, 15.9874, 0.09332);
            case 11:
                return new Lms(0.1118, 16.1277, 0.09304);
            case 12:
                return new Lms(0.0877, 16.2485, 0.09279);
            case 13:
                return new Lms(0.0652, 16.3531, 0.09255);
            default:
                throw new RangeError("ageWeeks");
        }
    }
    lmsForAgeMonthsMale(ageMonths:number)
    {
        switch (ageMonths)
        {
            case 3:
                return new Lms(0.0068, 16.8987, 0.08495);
            case 4:
                return new Lms (-0.0727, 17.1579, 0.08378);
            case 5:
                return new Lms (-0.137, 17.2919, 0.08296);
            case 6:
                return new Lms (-0.1913, 17.3422, 0.08234);
            case 7:
                return new Lms (-0.2385, 17.3288, 0.08183);
            case 8:
                return new Lms (-0.2802, 17.2647, 0.0814);
            case 9:
                return new Lms (-0.3176, 17.1662, 0.08102);
            case 10:
                return new Lms (-0.3516, 17.0488, 0.08068);
            case 11:
                return new Lms (-0.3828, 16.9239, 0.08037);
            case 12:
                return new Lms (-0.4115, 16.7981, 0.08009);
            case 13:
                return new Lms (-0.4382, 16.6743, 0.07982);
            case 14:
                return new Lms (-0.463, 16.5548, 0.07958);
            case 15:
                return new Lms (-0.4863, 16.4409, 0.07935);
            case 16:
                return new Lms (-0.5082, 16.3335, 0.07913);
            case 17:
                return new Lms (-0.5289, 16.2329, 0.07892);
            case 18:
                return new Lms (-0.5484, 16.1392, 0.07873);
            case 19:
                return new Lms (-0.5669, 16.0528, 0.07854);
            case 20:
                return new Lms (-0.5846, 15.9743, 0.07836);
            case 21:
                return new Lms (-0.6014, 15.9039, 0.07818);
            case 22:
                return new Lms (-0.6174, 15.8412, 0.07802);
            case 23:
                return new Lms (-0.6328, 15.7852, 0.07786);
            case 24:
                return new Lms (-0.6473, 15.7356, 0.07771);
            case 25:
                return new Lms (-0.584, 15.98, 0.07792);
            case 26:
                return new Lms (-0.5497, 15.9414, 0.078);
            case 27:
                return new Lms (-0.5166, 15.9036, 0.07808);
            case 28:
                return new Lms (-0.485, 15.8667, 0.07818);
            case 29:
                return new Lms (-0.4552, 15.8306, 0.07829);
            case 30:
                return new Lms (-0.4274, 15.7953, 0.07841);
            case 31:
                return new Lms (-0.4016, 15.7606, 0.07854);
            case 32:
                return new Lms (-0.3782, 15.7267, 0.07867);
            case 33:
                return new Lms (-0.3572, 15.6934, 0.07882);
            case 34:
                return new Lms (-0.3388, 15.661, 0.07897);
            case 35:
                return new Lms (-0.3231, 15.6294, 0.07914);
            case 36:
                return new Lms (-0.3101, 15.5988, 0.07931);
            case 37:
                return new Lms (-0.3, 15.5693, 0.0795);
            case 38:
                return new Lms (-0.2927, 15.541, 0.07969);
            case 39:
                return new Lms (-0.2884, 15.514, 0.0799);
            case 40:
                return new Lms (-0.2869, 15.4885, 0.08012);
            case 41:
                return new Lms (-0.2881, 15.4645, 0.08036);
            case 42:
                return new Lms (-0.2919, 15.442, 0.08061);
            case 43:
                return new Lms (-0.2981, 15.421, 0.08087);
            case 44:
                return new Lms (-0.3067, 15.4013, 0.08115);
            case 45:
                return new Lms (-0.3174, 15.3827, 0.08144);
            case 46:
                return new Lms (-0.3303, 15.3652, 0.08174);
            case 47:
                return new Lms (-0.3452, 15.3485, 0.08205);
            case 48:
                return new Lms (-0.3622, 15.3326, 0.08238);
            case 49:
                return new Lms (-1.291, 15.752, 0.07684);
            case 50:
                return new Lms (-1.325, 15.704, 0.07692);
            case 51:
                return new Lms (-1.342, 15.682, 0.077);
            case 52:
                return new Lms (-1.359, 15.662, 0.07709);
            case 53:
                return new Lms (-1.375, 15.644, 0.0772);
            case 54:
                return new Lms (-1.391, 15.626, 0.07733);
            case 55:
                return new Lms (-1.407, 15.61, 0.07748);
            case 56:
                return new Lms (-1.422, 15.595, 0.07765);
            case 57:
                return new Lms (-1.437, 15.582, 0.07784);
            case 58:
                return new Lms (-1.452, 15.569, 0.07806);
            case 59:
                return new Lms (-1.467, 15.557, 0.07829);
            case 60:
                return new Lms (-1.481, 15.547, 0.07856);
            case 61:
                return new Lms (-1.495, 15.538, 0.07884);
            case 62:
                return new Lms (-1.509, 15.53, 0.07915);
            case 63:
                return new Lms (-1.523, 15.523, 0.07948);
            case 64:
                return new Lms (-1.536, 15.517, 0.07983);
            case 65:
                return new Lms (-1.549, 15.511, 0.0802);
            case 66:
                return new Lms (-1.562, 15.507, 0.08059);
            case 67:
                return new Lms (-1.575, 15.503, 0.081);
            case 68:
                return new Lms (-1.587, 15.5, 0.08143);
            case 69:
                return new Lms (-1.599, 15.498, 0.08189);
            case 70:
                return new Lms (-1.611, 15.497, 0.08235);
            case 71:
                return new Lms (-1.622, 15.497, 0.08284);
            case 72:
                return new Lms (-1.634, 15.498, 0.08334);
            case 73:
                return new Lms (-1.644, 15.499, 0.08386);
            case 74:
                return new Lms (-1.655, 15.501, 0.08439);
            case 75:
                return new Lms (-1.665, 15.503, 0.08494);
            case 76:
                return new Lms (-1.675, 15.507, 0.08549);
            case 77:
                return new Lms (-1.685, 15.511, 0.08606);
            case 78:
                return new Lms (-1.694, 15.516, 0.08663);
            case 79:
                return new Lms (-1.704, 15.522, 0.08722);
            case 80:
                return new Lms (-1.713, 15.529, 0.08781);
            case 81:
                return new Lms (-1.721, 15.536, 0.08841);
            case 82:
                return new Lms (-1.73, 15.545, 0.08901);
            case 83:
                return new Lms (-1.738, 15.554, 0.08962);
            case 84:
                return new Lms (-1.745, 15.564, 0.09023);
            case 85:
                return new Lms (-1.753, 15.575, 0.09084);
            case 86:
                return new Lms (-1.76, 15.587, 0.09145);
            case 87:
                return new Lms (-1.767, 15.6, 0.09207);
            case 88:
                return new Lms (-1.774, 15.614, 0.09268);
            case 89:
                return new Lms (-1.781, 15.628, 0.0933);
            case 90:
                return new Lms (-1.787, 15.643, 0.09391);
            case 91:
                return new Lms (-1.793, 15.659, 0.09451);
            case 92:
                return new Lms (-1.798, 15.675, 0.09512);
            case 93:
                return new Lms (-1.804, 15.692, 0.09572);
            case 94:
                return new Lms (-1.809, 15.71, 0.09632);
            case 95:
                return new Lms (-1.814, 15.729, 0.09691);
            case 96:
                return new Lms (-1.818, 15.748, 0.09749);
            case 97:
                return new Lms (-1.823, 15.768, 0.09807);
            case 98:
                return new Lms (-1.827, 15.789, 0.09864);
            case 99:
                return new Lms (-1.83, 15.81, 0.0992);
            case 100:
                return new Lms (-1.834, 15.833, 0.09976);
            case 101:
                return new Lms (-1.837, 15.855, 0.1003);
            case 102:
                return new Lms (-1.84, 15.88, 0.10084);
            case 103:
                return new Lms (-1.843, 15.904, 0.10137);
            case 104:
                return new Lms (-1.846, 15.929, 0.10189);
            case 105:
                return new Lms (-1.848, 15.955, 0.1024);
            case 106:
                return new Lms (-1.85, 15.982, 0.1029);
            case 107:
                return new Lms (-1.852, 16.009, 0.1034);
            case 108:
                return new Lms (-1.854, 16.037, 0.10388);
            case 109:
                return new Lms (-1.855, 16.066, 0.10435);
            case 110:
                return new Lms (-1.856, 16.095, 0.10482);
            case 111:
                return new Lms (-1.857, 16.125, 0.10527);
            case 112:
                return new Lms (-1.858, 16.155, 0.10571);
            case 113:
                return new Lms (-1.858, 16.187, 0.10615);
            case 114:
                return new Lms (-1.859, 16.219, 0.10657);
            case 115:
                return new Lms (-1.859, 16.251, 0.10698);
            case 116:
                return new Lms (-1.859, 16.284, 0.10738);
            case 117:
                return new Lms (-1.859, 16.318, 0.10777);
            case 118:
                return new Lms (-1.859, 16.352, 0.10815);
            case 119:
                return new Lms (-1.858, 16.387, 0.10852);
            case 120:
                return new Lms (-1.857, 16.423, 0.10888);
            case 121:
                return new Lms (-1.856, 16.459, 0.10923);
            case 122:
                return new Lms (-1.855, 16.496, 0.10957);
            case 123:
                return new Lms (-1.854, 16.533, 0.1099);
            case 124:
                return new Lms (-1.853, 16.57, 0.11022);
            case 125:
                return new Lms (-1.851, 16.609, 0.11054);
            case 126:
                return new Lms (-1.85, 16.648, 0.11084);
            case 127:
                return new Lms (-1.848, 16.687, 0.11114);
            case 128:
                return new Lms (-1.846, 16.727, 0.11143);
            case 129:
                return new Lms (-1.844, 16.768, 0.1117);
            case 130:
                return new Lms (-1.842, 16.808, 0.11197);
            case 131:
                return new Lms (-1.839, 16.85, 0.11223);
            case 132:
                return new Lms (-1.837, 16.892, 0.11249);
            case 133:
                return new Lms (-1.834, 16.935, 0.11273);
            case 134:
                return new Lms (-1.831, 16.977, 0.11296);
            case 135:
                return new Lms (-1.829, 17.02, 0.11319);
            case 136:
                return new Lms (-1.826, 17.065, 0.11341);
            case 137:
                return new Lms (-1.823, 17.108, 0.11362);
            case 138:
                return new Lms (-1.819, 17.154, 0.11382);
            case 139:
                return new Lms (-1.816, 17.199, 0.11402);
            case 140:
                return new Lms (-1.813, 17.244, 0.1142);
            case 141:
                return new Lms (-1.809, 17.291, 0.11438);
            case 142:
                return new Lms (-1.806, 17.338, 0.11456);
            case 143:
                return new Lms (-1.802, 17.386, 0.11472);
            case 144:
                return new Lms (-1.799, 17.433, 0.11488);
            case 145:
                return new Lms (-1.795, 17.481, 0.11503);
            case 146:
                return new Lms (-1.791, 17.53, 0.11517);
            case 147:
                return new Lms (-1.787, 17.579, 0.11532);
            case 148:
                return new Lms (-1.783, 17.629, 0.11545);
            case 149:
                return new Lms (-1.78, 17.679, 0.11558);
            case 150:
                return new Lms (-1.776, 17.729, 0.1157);
            case 151:
                return new Lms (-1.771, 17.779, 0.11581);
            case 152:
                return new Lms (-1.767, 17.83, 0.11592);
            case 153:
                return new Lms (-1.763, 17.881, 0.11603);
            case 154:
                return new Lms (-1.759, 17.933, 0.11613);
            case 155:
                return new Lms (-1.755, 17.985, 0.11622);
            case 156:
                return new Lms (-1.75, 18.037, 0.11631);
            case 157:
                return new Lms (-1.746, 18.089, 0.11639);
            case 158:
                return new Lms (-1.742, 18.142, 0.11647);
            case 159:
                return new Lms (-1.738, 18.194, 0.11655);
            case 160:
                return new Lms (-1.733, 18.247, 0.11662);
            case 161:
                return new Lms (-1.729, 18.3, 0.11668);
            case 162:
                return new Lms (-1.724, 18.354, 0.11674);
            case 163:
                return new Lms (-1.72, 18.407, 0.1168);
            case 164:
                return new Lms (-1.715, 18.46, 0.11685);
            case 165:
                return new Lms (-1.711, 18.514, 0.1169);
            case 166:
                return new Lms (-1.707, 18.567, 0.11695);
            case 167:
                return new Lms (-1.702, 18.621, 0.11699);
            case 168:
                return new Lms (-1.697, 18.675, 0.11703);
            case 169:
                return new Lms (-1.693, 18.729, 0.11706);
            case 170:
                return new Lms (-1.689, 18.783, 0.1171);
            case 171:
                return new Lms (-1.684, 18.836, 0.11712);
            case 172:
                return new Lms (-1.68, 18.89, 0.11715);
            case 173:
                return new Lms (-1.675, 18.944, 0.11717);
            case 174:
                return new Lms (-1.671, 18.997, 0.11719);
            case 175:
                return new Lms (-1.666, 19.051, 0.11721);
            case 176:
                return new Lms (-1.661, 19.104, 0.11722);
            case 177:
                return new Lms (-1.657, 19.158, 0.11723);
            case 178:
                return new Lms (-1.652, 19.211, 0.11724);
            case 179:
                return new Lms (-1.648, 19.264, 0.11724);
            case 180:
                return new Lms (-1.643, 19.317, 0.11725);
            case 181:
                return new Lms (-1.639, 19.37, 0.11725);
            case 182:
                return new Lms (-1.635, 19.423, 0.11725);
            case 183:
                return new Lms (-1.63, 19.475, 0.11724);
            case 184:
                return new Lms (-1.626, 19.528, 0.11724);
            case 185:
                return new Lms (-1.621, 19.579, 0.11723);
            case 186:
                return new Lms (-1.617, 19.632, 0.11722);
            case 187:
                return new Lms (-1.612, 19.683, 0.11721);
            case 188:
                return new Lms (-1.608, 19.735, 0.11719);
            case 189:
                return new Lms (-1.603, 19.786, 0.11718);
            case 190:
                return new Lms (-1.599, 19.837, 0.11716);
            case 191:
                return new Lms (-1.595, 19.887, 0.11714);
            case 192:
                return new Lms (-1.59, 19.938, 0.11712);
            case 193:
                return new Lms (-1.586, 19.988, 0.1171);
            case 194:
                return new Lms (-1.582, 20.038, 0.11708);
            case 195:
                return new Lms (-1.577, 20.087, 0.11706);
            case 196:
                return new Lms (-1.573, 20.137, 0.11703);
            case 197:
                return new Lms (-1.569, 20.186, 0.117);
            case 198:
                return new Lms (-1.564, 20.234, 0.11698);
            case 199:
                return new Lms (-1.56, 20.282, 0.11695);
            case 200:
                return new Lms (-1.556, 20.33, 0.11692);
            case 201:
                return new Lms (-1.551, 20.378, 0.11689);
            case 202:
                return new Lms (-1.547, 20.425, 0.11686);
            case 203:
                return new Lms (-1.543, 20.472, 0.11683);
            case 204:
                return new Lms (-1.538, 20.519, 0.1168);
            case 205:
                return new Lms (-1.534, 20.565, 0.11677);
            case 206:
                return new Lms (-1.53, 20.611, 0.11674);
            case 207:
                return new Lms (-1.526, 20.656, 0.1167);
            case 208:
                return new Lms (-1.521, 20.702, 0.11667);
            case 209:
                return new Lms (-1.517, 20.746, 0.11663);
            case 210:
                return new Lms (-1.513, 20.791, 0.1166);
            case 211:
                return new Lms (-1.509, 20.836, 0.11657);
            case 212:
                return new Lms (-1.505, 20.879, 0.11653);
            case 213:
                return new Lms (-1.501, 20.923, 0.11649);
            case 214:
                return new Lms (-1.496, 20.967, 0.11646);
            case 215:
                return new Lms (-1.492, 21.009, 0.11642);
            case 216:
                return new Lms (-1.488, 21.052, 0.11639);
            case 217:
                return new Lms (-1.484, 21.095, 0.11635);
            case 218:
                return new Lms (-1.48, 21.136, 0.11631);
            case 219:
                return new Lms (-1.476, 21.178, 0.11628);
            case 220:
                return new Lms (-1.472, 21.22, 0.11624);
            case 221:
                return new Lms (-1.467, 21.26, 0.1162);
            case 222:
                return new Lms (-1.463, 21.301, 0.11617);
            case 223:
                return new Lms (-1.459, 21.342, 0.11613);
            case 224:
                return new Lms (-1.455, 21.382, 0.11609);
            case 225:
                return new Lms (-1.451, 21.422, 0.11605);
            case 226:
                return new Lms (-1.447, 21.461, 0.11602);
            case 227:
                return new Lms (-1.443, 21.501, 0.11598);
            case 228:
                return new Lms (-1.439, 21.54, 0.11594);
            case 229:
                return new Lms (-1.435, 21.578, 0.11591);
            case 230:
                return new Lms (-1.431, 21.617, 0.11587);
            case 231:
                return new Lms (-1.427, 21.655, 0.11583);
            case 232:
                return new Lms (-1.423, 21.693, 0.1158);
            case 233:
                return new Lms (-1.419, 21.73, 0.11576);
            case 234:
                return new Lms (-1.415, 21.768, 0.11572);
            case 235:
                return new Lms (-1.412, 21.805, 0.11569);
            case 236:
                return new Lms (-1.408, 21.842, 0.11565);
            case 237:
                return new Lms (-1.404, 21.878, 0.11561);
            case 238:
                return new Lms (-1.4, 21.914, 0.11558);
            case 239:
                return new Lms (-1.396, 21.951, 0.11554);
            case 240:
                return new Lms (-1.392, 21.986, 0.11551);
            default:
                throw new RangeError("ageMonths");
        }
    }
    lmsForAgeMonthsFemale(ageMonths:number)
    {
        switch (ageMonths)
        {
            case 3:
                return new Lms(0.0643, 16.3574, 0.09254);
            case 4:
                return new Lms (-0.0191, 16.6703, 0.09166);
            case 5:
                return new Lms (-0.0864, 16.8386, 0.09096);
            case 6:
                return new Lms (-0.1429, 16.9083, 0.09036);
            case 7:
                return new Lms (-0.1916, 16.902, 0.08984);
            case 8:
                return new Lms (-0.2344, 16.8404, 0.08939);
            case 9:
                return new Lms (-0.2725, 16.7406, 0.08898);
            case 10:
                return new Lms (-0.3068, 16.6184, 0.08861);
            case 11:
                return new Lms (-0.3381, 16.4875, 0.08828);
            case 12:
                return new Lms (-0.3667, 16.3568, 0.08797);
            case 13:
                return new Lms (-0.3932, 16.2311, 0.08768);
            case 14:
                return new Lms (-0.4177, 16.1128, 0.08741);
            case 15:
                return new Lms (-0.4407, 16.0028, 0.08716);
            case 16:
                return new Lms (-0.4623, 15.9017, 0.08693);
            case 17:
                return new Lms (-0.4825, 15.8096, 0.08671);
            case 18:
                return new Lms (-0.5017, 15.7263, 0.0865);
            case 19:
                return new Lms (-0.5199, 15.6517, 0.0863);
            case 20:
                return new Lms (-0.5372, 15.5855, 0.08612);
            case 21:
                return new Lms (-0.5537, 15.5278, 0.08594);
            case 22:
                return new Lms (-0.5695, 15.4787, 0.08577);
            case 23:
                return new Lms (-0.5846, 15.438, 0.0856);
            case 24:
                return new Lms (-0.5989, 15.4052, 0.08545);
            case 25:
                return new Lms (-0.5684, 15.659, 0.08452);
            case 26:
                return new Lms (-0.5684, 15.6308, 0.08449);
            case 27:
                return new Lms (-0.5684, 15.6037, 0.08446);
            case 28:
                return new Lms (-0.5684, 15.5777, 0.08444);
            case 29:
                return new Lms (-0.5684, 15.5523, 0.08443);
            case 30:
                return new Lms (-0.5684, 15.5276, 0.08444);
            case 31:
                return new Lms (-0.5684, 15.5034, 0.08448);
            case 32:
                return new Lms (-0.5684, 15.4798, 0.08455);
            case 33:
                return new Lms (-0.5684, 15.4572, 0.08467);
            case 34:
                return new Lms (-0.5684, 15.4356, 0.08484);
            case 35:
                return new Lms (-0.5684, 15.4155, 0.08506);
            case 36:
                return new Lms (-0.5684, 15.3968, 0.08535);
            case 37:
                return new Lms (-0.5684, 15.3796, 0.08569);
            case 38:
                return new Lms (-0.5684, 15.3638, 0.08609);
            case 39:
                return new Lms (-0.5684, 15.3493, 0.08654);
            case 40:
                return new Lms (-0.5684, 15.3358, 0.08704);
            case 41:
                return new Lms (-0.5684, 15.3233, 0.08757);
            case 42:
                return new Lms (-0.5684, 15.3116, 0.08813);
            case 43:
                return new Lms (-0.5684, 15.3007, 0.08872);
            case 44:
                return new Lms (-0.5684, 15.2905, 0.08931);
            case 45:
                return new Lms (-0.5684, 15.2814, 0.08991);
            case 46:
                return new Lms (-0.5684, 15.2732, 0.09051);
            case 47:
                return new Lms (-0.5684, 15.2661, 0.0911);
            case 48:
                return new Lms (-0.5684, 15.2602, 0.09168);
            case 49:
                return new Lms (-1.151, 15.656, 0.08728);
            case 50:
                return new Lms (-1.163, 15.622, 0.08814);
            case 51:
                return new Lms (-1.169, 15.605, 0.0886);
            case 52:
                return new Lms (-1.175, 15.589, 0.08906);
            case 53:
                return new Lms (-1.181, 15.573, 0.08954);
            case 54:
                return new Lms (-1.187, 15.557, 0.09004);
            case 55:
                return new Lms (-1.193, 15.542, 0.09054);
            case 56:
                return new Lms (-1.198, 15.528, 0.09106);
            case 57:
                return new Lms (-1.204, 15.515, 0.0916);
            case 58:
                return new Lms (-1.209, 15.503, 0.09214);
            case 59:
                return new Lms (-1.215, 15.492, 0.0927);
            case 60:
                return new Lms (-1.22, 15.483, 0.09326);
            case 61:
                return new Lms (-1.225, 15.475, 0.09384);
            case 62:
                return new Lms (-1.231, 15.468, 0.09443);
            case 63:
                return new Lms (-1.236, 15.463, 0.09503);
            case 64:
                return new Lms (-1.241, 15.46, 0.09563);
            case 65:
                return new Lms (-1.245, 15.457, 0.09624);
            case 66:
                return new Lms (-1.25, 15.457, 0.09686);
            case 67:
                return new Lms (-1.255, 15.458, 0.09749);
            case 68:
                return new Lms (-1.26, 15.461, 0.09812);
            case 69:
                return new Lms (-1.264, 15.465, 0.09875);
            case 70:
                return new Lms (-1.269, 15.47, 0.0994);
            case 71:
                return new Lms (-1.273, 15.477, 0.10004);
            case 72:
                return new Lms (-1.277, 15.485, 0.10069);
            case 73:
                return new Lms (-1.281, 15.494, 0.10135);
            case 74:
                return new Lms (-1.286, 15.506, 0.102);
            case 75:
                return new Lms (-1.289, 15.517, 0.10266);
            case 76:
                return new Lms (-1.293, 15.53, 0.10332);
            case 77:
                return new Lms (-1.297, 15.544, 0.10397);
            case 78:
                return new Lms (-1.301, 15.56, 0.10463);
            case 79:
                return new Lms (-1.304, 15.577, 0.10529);
            case 80:
                return new Lms (-1.308, 15.596, 0.10595);
            case 81:
                return new Lms (-1.311, 15.614, 0.1066);
            case 82:
                return new Lms (-1.314, 15.635, 0.10725);
            case 83:
                return new Lms (-1.317, 15.656, 0.10789);
            case 84:
                return new Lms (-1.32, 15.677, 0.10854);
            case 85:
                return new Lms (-1.323, 15.7, 0.10918);
            case 86:
                return new Lms (-1.325, 15.723, 0.10981);
            case 87:
                return new Lms (-1.328, 15.748, 0.11044);
            case 88:
                return new Lms (-1.33, 15.772, 0.11106);
            case 89:
                return new Lms (-1.332, 15.798, 0.11167);
            case 90:
                return new Lms (-1.334, 15.824, 0.11228);
            case 91:
                return new Lms (-1.336, 15.85, 0.11288);
            case 92:
                return new Lms (-1.338, 15.877, 0.11346);
            case 93:
                return new Lms (-1.339, 15.905, 0.11404);
            case 94:
                return new Lms (-1.341, 15.934, 0.11461);
            case 95:
                return new Lms (-1.342, 15.963, 0.11517);
            case 96:
                return new Lms (-1.344, 15.993, 0.11572);
            case 97:
                return new Lms (-1.345, 16.022, 0.11625);
            case 98:
                return new Lms (-1.345, 16.054, 0.11679);
            case 99:
                return new Lms (-1.346, 16.085, 0.1173);
            case 100:
                return new Lms (-1.347, 16.118, 0.1178);
            case 101:
                return new Lms (-1.347, 16.15, 0.1183);
            case 102:
                return new Lms (-1.348, 16.184, 0.11879);
            case 103:
                return new Lms (-1.348, 16.218, 0.11926);
            case 104:
                return new Lms (-1.348, 16.253, 0.11972);
            case 105:
                return new Lms (-1.349, 16.288, 0.12017);
            case 106:
                return new Lms (-1.349, 16.324, 0.1206);
            case 107:
                return new Lms (-1.348, 16.361, 0.12103);
            case 108:
                return new Lms (-1.348, 16.399, 0.12144);
            case 109:
                return new Lms (-1.348, 16.437, 0.12185);
            case 110:
                return new Lms (-1.347, 16.475, 0.12223);
            case 111:
                return new Lms (-1.347, 16.515, 0.12261);
            case 112:
                return new Lms (-1.346, 16.555, 0.12298);
            case 113:
                return new Lms (-1.346, 16.596, 0.12333);
            case 114:
                return new Lms (-1.345, 16.637, 0.12367);
            case 115:
                return new Lms (-1.344, 16.679, 0.124);
            case 116:
                return new Lms (-1.343, 16.722, 0.12432);
            case 117:
                return new Lms (-1.342, 16.765, 0.12462);
            case 118:
                return new Lms (-1.341, 16.809, 0.12492);
            case 119:
                return new Lms (-1.34, 16.853, 0.1252);
            case 120:
                return new Lms (-1.339, 16.898, 0.12547);
            case 121:
                return new Lms (-1.338, 16.943, 0.12573);
            case 122:
                return new Lms (-1.337, 16.99, 0.12598);
            case 123:
                return new Lms (-1.336, 17.036, 0.12622);
            case 124:
                return new Lms (-1.334, 17.083, 0.12644);
            case 125:
                return new Lms (-1.333, 17.131, 0.12666);
            case 126:
                return new Lms (-1.332, 17.179, 0.12687);
            case 127:
                return new Lms (-1.33, 17.227, 0.12706);
            case 128:
                return new Lms (-1.329, 17.277, 0.12725);
            case 129:
                return new Lms (-1.327, 17.327, 0.12742);
            case 130:
                return new Lms (-1.326, 17.377, 0.12759);
            case 131:
                return new Lms (-1.324, 17.427, 0.12774);
            case 132:
                return new Lms (-1.322, 17.478, 0.12789);
            case 133:
                return new Lms (-1.321, 17.53, 0.12803);
            case 134:
                return new Lms (-1.319, 17.581, 0.12816);
            case 135:
                return new Lms (-1.318, 17.634, 0.12827);
            case 136:
                return new Lms (-1.316, 17.687, 0.12838);
            case 137:
                return new Lms (-1.314, 17.739, 0.12849);
            case 138:
                return new Lms (-1.312, 17.793, 0.12858);
            case 139:
                return new Lms (-1.311, 17.846, 0.12866);
            case 140:
                return new Lms (-1.309, 17.9, 0.12875);
            case 141:
                return new Lms (-1.307, 17.954, 0.12882);
            case 142:
                return new Lms (-1.306, 18.008, 0.12888);
            case 143:
                return new Lms (-1.304, 18.062, 0.12894);
            case 144:
                return new Lms (-1.302, 18.117, 0.12899);
            case 145:
                return new Lms (-1.3, 18.172, 0.12903);
            case 146:
                return new Lms (-1.299, 18.227, 0.12907);
            case 147:
                return new Lms (-1.297, 18.281, 0.1291);
            case 148:
                return new Lms (-1.295, 18.337, 0.12913);
            case 149:
                return new Lms (-1.293, 18.391, 0.12915);
            case 150:
                return new Lms (-1.291, 18.446, 0.12917);
            case 151:
                return new Lms (-1.29, 18.5, 0.12918);
            case 152:
                return new Lms (-1.288, 18.555, 0.12918);
            case 153:
                return new Lms (-1.286, 18.61, 0.12919);
            case 154:
                return new Lms (-1.284, 18.664, 0.12919);
            case 155:
                return new Lms (-1.283, 18.718, 0.12918);
            case 156:
                return new Lms (-1.281, 18.772, 0.12917);
            case 157:
                return new Lms (-1.279, 18.825, 0.12916);
            case 158:
                return new Lms (-1.277, 18.88, 0.12914);
            case 159:
                return new Lms (-1.276, 18.932, 0.12913);
            case 160:
                return new Lms (-1.274, 18.985, 0.1291);
            case 161:
                return new Lms (-1.272, 19.038, 0.12908);
            case 162:
                return new Lms (-1.271, 19.09, 0.12905);
            case 163:
                return new Lms (-1.269, 19.142, 0.12902);
            case 164:
                return new Lms (-1.267, 19.194, 0.12899);
            case 165:
                return new Lms (-1.266, 19.244, 0.12895);
            case 166:
                return new Lms (-1.264, 19.295, 0.12892);
            case 167:
                return new Lms (-1.262, 19.345, 0.12888);
            case 168:
                return new Lms (-1.261, 19.395, 0.12884);
            case 169:
                return new Lms (-1.259, 19.445, 0.12879);
            case 170:
                return new Lms (-1.258, 19.493, 0.12875);
            case 171:
                return new Lms (-1.256, 19.542, 0.1287);
            case 172:
                return new Lms (-1.254, 19.589, 0.12866);
            case 173:
                return new Lms (-1.253, 19.637, 0.12861);
            case 174:
                return new Lms (-1.251, 19.684, 0.12856);
            case 175:
                return new Lms (-1.25, 19.73, 0.12851);
            case 176:
                return new Lms (-1.248, 19.776, 0.12846);
            case 177:
                return new Lms (-1.247, 19.822, 0.1284);
            case 178:
                return new Lms (-1.245, 19.866, 0.12835);
            case 179:
                return new Lms (-1.244, 19.911, 0.1283);
            case 180:
                return new Lms (-1.242, 19.955, 0.12824);
            case 181:
                return new Lms (-1.241, 19.998, 0.12819);
            case 182:
                return new Lms (-1.239, 20.041, 0.12813);
            case 183:
                return new Lms (-1.238, 20.083, 0.12807);
            case 184:
                return new Lms (-1.236, 20.124, 0.12802);
            case 185:
                return new Lms (-1.235, 20.166, 0.12796);
            case 186:
                return new Lms (-1.233, 20.206, 0.1279);
            case 187:
                return new Lms (-1.232, 20.246, 0.12785);
            case 188:
                return new Lms (-1.231, 20.285, 0.12779);
            case 189:
                return new Lms (-1.229, 20.324, 0.12773);
            case 190:
                return new Lms (-1.228, 20.363, 0.12768);
            case 191:
                return new Lms (-1.226, 20.401, 0.12762);
            case 192:
                return new Lms (-1.225, 20.438, 0.12757);
            case 193:
                return new Lms (-1.224, 20.475, 0.12751);
            case 194:
                return new Lms (-1.222, 20.511, 0.12745);
            case 195:
                return new Lms (-1.221, 20.547, 0.1274);
            case 196:
                return new Lms (-1.22, 20.582, 0.12734);
            case 197:
                return new Lms (-1.218, 20.617, 0.12729);
            case 198:
                return new Lms (-1.217, 20.652, 0.12723);
            case 199:
                return new Lms (-1.216, 20.685, 0.12718);
            case 200:
                return new Lms (-1.214, 20.718, 0.12712);
            case 201:
                return new Lms (-1.213, 20.751, 0.12707);
            case 202:
                return new Lms (-1.212, 20.783, 0.12702);
            case 203:
                return new Lms (-1.21, 20.816, 0.12696);
            case 204:
                return new Lms (-1.209, 20.847, 0.12691);
            case 205:
                return new Lms (-1.208, 20.878, 0.12686);
            case 206:
                return new Lms (-1.206, 20.908, 0.12681);
            case 207:
                return new Lms (-1.205, 20.938, 0.12676);
            case 208:
                return new Lms (-1.204, 20.968, 0.12671);
            case 209:
                return new Lms (-1.203, 20.997, 0.12666);
            case 210:
                return new Lms (-1.201, 21.026, 0.1266);
            case 211:
                return new Lms (-1.2, 21.054, 0.12656);
            case 212:
                return new Lms (-1.199, 21.082, 0.1265);
            case 213:
                return new Lms (-1.197, 21.11, 0.12646);
            case 214:
                return new Lms (-1.196, 21.137, 0.12641);
            case 215:
                return new Lms (-1.195, 21.164, 0.12636);
            case 216:
                return new Lms (-1.194, 21.19, 0.12631);
            case 217:
                return new Lms (-1.193, 21.216, 0.12627);
            case 218:
                return new Lms (-1.191, 21.242, 0.12622);
            case 219:
                return new Lms (-1.19, 21.267, 0.12617);
            case 220:
                return new Lms (-1.189, 21.293, 0.12613);
            case 221:
                return new Lms (-1.188, 21.317, 0.12608);
            case 222:
                return new Lms (-1.186, 21.342, 0.12604);
            case 223:
                return new Lms (-1.185, 21.366, 0.126);
            case 224:
                return new Lms (-1.184, 21.39, 0.12595);
            case 225:
                return new Lms (-1.183, 21.413, 0.12591);
            case 226:
                return new Lms (-1.181, 21.436, 0.12587);
            case 227:
                return new Lms (-1.18, 21.459, 0.12582);
            case 228:
                return new Lms (-1.179, 21.482, 0.12578);
            case 229:
                return new Lms (-1.178, 21.504, 0.12574);
            case 230:
                return new Lms (-1.177, 21.527, 0.1257);
            case 231:
                return new Lms (-1.175, 21.548, 0.12566);
            case 232:
                return new Lms (-1.174, 21.57, 0.12561);
            case 233:
                return new Lms (-1.173, 21.591, 0.12558);
            case 234:
                return new Lms (-1.172, 21.612, 0.12554);
            case 235:
                return new Lms (-1.171, 21.633, 0.1255);
            case 236:
                return new Lms (-1.169, 21.653, 0.12546);
            case 237:
                return new Lms (-1.168, 21.674, 0.12542);
            case 238:
                return new Lms (-1.167, 21.695, 0.12538);
            case 239:
                return new Lms (-1.166, 21.715, 0.12534);
            case 240:
                return new Lms (-1.165, 21.735, 0.1253);
            default:
                throw new RangeError("ageMonths");
        }
    }
}