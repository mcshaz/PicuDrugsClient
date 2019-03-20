import { CentileData, GenderRange, AgeMonthsSinceTerm } from "./CentileData";
import { Lms } from "./Lms";

export class UKHeadCircumferenceData extends CentileData{
    constructor(){
        super({ ageMonthsRange : new GenderRange(new AgeMonthsSinceTerm(3, 216),new AgeMonthsSinceTerm(3, 204))});
    }   lMSForGestAge(gestAgeWeeks:number, isMale:boolean)
    {
        if (isMale)
        {
            switch (gestAgeWeeks)
            {
                case 23:
                    return new Lms(1, 21.63267, 0.04465746);
                case 24:
                    return new Lms(1, 22.66466, 0.04660628);
                case 25:
                    return new Lms(1, 23.69877, 0.04852065);
                case 26:
                    return new Lms(1, 24.7339, 0.05032903);
                case 27:
                    return new Lms(1, 25.7583, 0.05183461);
                case 28:
                    return new Lms(1, 26.73601, 0.05277836);
                case 29:
                    return new Lms(1, 27.63749, 0.05302389);
                case 30:
                    return new Lms(1, 28.48013, 0.05259097);
                case 31:
                    return new Lms(1, 29.28385, 0.05156045);
                case 32:
                    return new Lms(1, 30.05091, 0.05001475);
                case 33:
                    return new Lms(1, 30.78144, 0.04810781);
                case 34:
                    return new Lms(1, 31.47371, 0.04598968);
                case 35:
                    return new Lms(1, 32.12924, 0.04376877);
                case 36:
                    return new Lms(1, 32.75117, 0.04152338);
                case 37:
                    return new Lms(1, 33.34215, 0.03930918);
                case 38:
                    return new Lms(1, 33.89909, 0.03717904);
                case 39:
                    return new Lms(1, 34.41823, 0.03517313);
                case 40:
                    return new Lms(1, 34.91071, 0.0332788);
                case 41:
                    return new Lms(1, 35.38669, 0.0314591);
                case 42:
                    return new Lms(1, 35.85209, 0.02967462);
                case 43:
                    return new Lms(1, 36.5216, 0.03197);
                default:
                    throw new RangeError("gestAgeWeeks");
            }
        }
        switch (gestAgeWeeks)//Female
        {
            case 23:
                return new Lms(1, 21.10156, 0.0662953);
            case 24:
                return new Lms(1, 22.16809, 0.06482162);
            case 25:
                return new Lms(1, 23.23329, 0.06331395);
            case 26:
                return new Lms(1, 24.29014, 0.06173639);
            case 27:
                return new Lms(1, 25.32564, 0.06007728);
            case 28:
                return new Lms(1, 26.31602, 0.05835389);
            case 29:
                return new Lms(1, 27.25686, 0.05650073);
            case 30:
                return new Lms(1, 28.15286, 0.05443045);
            case 31:
                return new Lms(1, 29.00924, 0.05212006);
            case 32:
                return new Lms(1, 29.81712, 0.04956586);
            case 33:
                return new Lms(1, 30.56807, 0.04687613);
            case 34:
                return new Lms(1, 31.25904, 0.04415755);
            case 35:
                return new Lms(1, 31.88534, 0.04150212);
            case 36:
                return new Lms(1, 32.44534, 0.03897662);
            case 37:
                return new Lms(1, 32.94206, 0.03661936);
            case 38:
                return new Lms(1, 33.38124, 0.0344432);
            case 39:
                return new Lms(1, 33.77464, 0.03242938);
            case 40:
                return new Lms(1, 34.13042, 0.03055761);
            case 41:
                return new Lms(1, 34.4652, 0.02876645);
            case 42:
                return new Lms(1, 34.79057, 0.02701415);
            case 43:
                return new Lms(1, 35.843, 0.03231);
            default:
                throw new RangeError("gestAgeWeeks");
        }
    }

    lMSForAgeWeeks(ageWeeks:number, isMale:boolean)
    {
        if (isMale)
        {
            switch (ageWeeks)
            {
                case 4:
                    return new Lms(1, 37.0926, 0.03148);
                case 5:
                    return new Lms(1, 37.601, 0.03107);
                case 6:
                    return new Lms(1, 38.0609, 0.03072);
                case 7:
                    return new Lms(1, 38.4824, 0.03041);
                case 8:
                    return new Lms(1, 38.8724, 0.03014);
                case 9:
                    return new Lms(1, 39.2368, 0.0299);
                case 10:
                    return new Lms(1, 39.5797, 0.02969);
                case 11:
                    return new Lms(1, 39.9033, 0.0295);
                case 12:
                    return new Lms(1, 40.2096, 0.02933);
                case 13:
                    return new Lms(1, 40.5008, 0.02918);
                default:
                    throw new RangeError("ageWeeks");
            }
        }
        switch (ageWeeks) //Female
        {
            case 4:
                return new Lms(1, 36.3761, 0.03215);
            case 5:
                return new Lms(1, 36.8472, 0.03202);
            case 6:
                return new Lms(1, 37.2711, 0.03191);
            case 7:
                return new Lms(1, 37.6584, 0.03182);
            case 8:
                return new Lms(1, 38.0167, 0.03173);
            case 9:
                return new Lms(1, 38.3516, 0.03166);
            case 10:
                return new Lms(1, 38.6673, 0.03158);
            case 11:
                return new Lms(1, 38.9661, 0.03152);
            case 12:
                return new Lms(1, 39.2501, 0.03146);
            case 13:
                return new Lms(1, 39.521, 0.0314);
            default:
                throw new RangeError("ageWeeks");
        }
    }

    lMSForAgeMonths(ageMonths:number, isMale:boolean)
    {
        if (isMale)
        {
            switch (ageMonths)
            {
                case 3:
                    return new Lms(1, 40.5135, 0.02918);
                case 4:
                    return new Lms(1, 41.6317, 0.02868);
                case 5:
                    return new Lms(1, 42.5576, 0.02837);
                case 6:
                    return new Lms(1, 43.3306, 0.02817);
                case 7:
                    return new Lms(1, 43.9803, 0.02804);
                case 8:
                    return new Lms(1, 44.53, 0.02796);
                case 9:
                    return new Lms(1, 44.9998, 0.02792);
                case 10:
                    return new Lms(1, 45.4051, 0.0279);
                case 11:
                    return new Lms(1, 45.7573, 0.02789);
                case 12:
                    return new Lms(1, 46.0661, 0.02789);
                case 13:
                    return new Lms(1, 46.3395, 0.02789);
                case 14:
                    return new Lms(1, 46.5844, 0.02791);
                case 15:
                    return new Lms(1, 46.806, 0.02792);
                case 16:
                    return new Lms(1, 47.0088, 0.02795);
                case 17:
                    return new Lms(1, 47.1962, 0.02797);
                case 18:
                    return new Lms(1, 47.3711, 0.028);
                case 19:
                    return new Lms(1, 47.5357, 0.02803);
                case 20:
                    return new Lms(1, 47.6919, 0.02806);
                case 21:
                    return new Lms(1, 47.8408, 0.0281);
                case 22:
                    return new Lms(1, 47.9833, 0.02813);
                case 23:
                    return new Lms(1, 48.1201, 0.02817);
                case 24:
                    return new Lms(1, 48.2515, 0.02821);
                case 25:
                    return new Lms(1, 48.3777, 0.02825);
                case 26:
                    return new Lms(1, 48.4989, 0.0283);
                case 27:
                    return new Lms(1, 48.6151, 0.02834);
                case 28:
                    return new Lms(1, 48.7264, 0.02838);
                case 29:
                    return new Lms(1, 48.8331, 0.02842);
                case 30:
                    return new Lms(1, 48.9351, 0.02847);
                case 31:
                    return new Lms(1, 49.0327, 0.02851);
                case 32:
                    return new Lms(1, 49.126, 0.02855);
                case 33:
                    return new Lms(1, 49.2153, 0.02859);
                case 34:
                    return new Lms(1, 49.3007, 0.02863);
                case 35:
                    return new Lms(1, 49.3826, 0.02867);
                case 36:
                    return new Lms(1, 49.4612, 0.02871);
                case 37:
                    return new Lms(1, 49.5367, 0.02875);
                case 38:
                    return new Lms(1, 49.6093, 0.02878);
                case 39:
                    return new Lms(1, 49.6791, 0.02882);
                case 40:
                    return new Lms(1, 49.7465, 0.02886);
                case 41:
                    return new Lms(1, 49.8116, 0.02889);
                case 42:
                    return new Lms(1, 49.8745, 0.02893);
                case 43:
                    return new Lms(1, 49.9354, 0.02896);
                case 44:
                    return new Lms(1, 49.9942, 0.02899);
                case 45:
                    return new Lms(1, 50.0512, 0.02903);
                case 46:
                    return new Lms(1, 50.1064, 0.02906);
                case 47:
                    return new Lms(1, 50.1598, 0.02909);
                case 48:
                    return new Lms(1, 50.2115, 0.02912);
                case 49:
                    return new Lms(1, 52.215, 0.02809);
                case 50:
                    return new Lms(1, 52.315, 0.02818);
                case 51:
                    return new Lms(1, 52.362, 0.02822);
                case 52:
                    return new Lms(1, 52.409, 0.02827);
                case 53:
                    return new Lms(1, 52.455, 0.02831);
                case 54:
                    return new Lms(1, 52.499, 0.02835);
                case 55:
                    return new Lms(1, 52.543, 0.02839);
                case 56:
                    return new Lms(1, 52.585, 0.02842);
                case 57:
                    return new Lms(1, 52.626, 0.02846);
                case 58:
                    return new Lms(1, 52.667, 0.02849);
                case 59:
                    return new Lms(1, 52.708, 0.02852);
                case 60:
                    return new Lms(1, 52.747, 0.02855);
                case 61:
                    return new Lms(1, 52.786, 0.02858);
                case 62:
                    return new Lms(1, 52.823, 0.02861);
                case 63:
                    return new Lms(1, 52.86, 0.02864);
                case 64:
                    return new Lms(1, 52.896, 0.02867);
                case 65:
                    return new Lms(1, 52.932, 0.02869);
                case 66:
                    return new Lms(1, 52.967, 0.02872);
                case 67:
                    return new Lms(1, 53.002, 0.02874);
                case 68:
                    return new Lms(1, 53.036, 0.02876);
                case 69:
                    return new Lms(1, 53.07, 0.02878);
                case 70:
                    return new Lms(1, 53.103, 0.0288);
                case 71:
                    return new Lms(1, 53.136, 0.02883);
                case 72:
                    return new Lms(1, 53.168, 0.02884);
                case 73:
                    return new Lms(1, 53.2, 0.02886);
                case 74:
                    return new Lms(1, 53.232, 0.02888);
                case 75:
                    return new Lms(1, 53.264, 0.0289);
                case 76:
                    return new Lms(1, 53.294, 0.02892);
                case 77:
                    return new Lms(1, 53.325, 0.02893);
                case 78:
                    return new Lms(1, 53.356, 0.02895);
                case 79:
                    return new Lms(1, 53.387, 0.02896);
                case 80:
                    return new Lms(1, 53.416, 0.02898);
                case 81:
                    return new Lms(1, 53.446, 0.02899);
                case 82:
                    return new Lms(1, 53.476, 0.029);
                case 83:
                    return new Lms(1, 53.505, 0.02902);
                case 84:
                    return new Lms(1, 53.534, 0.02903);
                case 85:
                    return new Lms(1, 53.563, 0.02904);
                case 86:
                    return new Lms(1, 53.591, 0.02905);
                case 87:
                    return new Lms(1, 53.62, 0.02907);
                case 88:
                    return new Lms(1, 53.649, 0.02908);
                case 89:
                    return new Lms(1, 53.676, 0.02909);
                case 90:
                    return new Lms(1, 53.704, 0.0291);
                case 91:
                    return new Lms(1, 53.732, 0.02911);
                case 92:
                    return new Lms(1, 53.76, 0.02912);
                case 93:
                    return new Lms(1, 53.787, 0.02913);
                case 94:
                    return new Lms(1, 53.814, 0.02914);
                case 95:
                    return new Lms(1, 53.841, 0.02915);
                case 96:
                    return new Lms(1, 53.867, 0.02916);
                case 97:
                    return new Lms(1, 53.893, 0.02917);
                case 98:
                    return new Lms(1, 53.92, 0.02918);
                case 99:
                    return new Lms(1, 53.946, 0.02919);
                case 100:
                    return new Lms(1, 53.972, 0.0292);
                case 101:
                    return new Lms(1, 53.998, 0.02921);
                case 102:
                    return new Lms(1, 54.024, 0.02922);
                case 103:
                    return new Lms(1, 54.05, 0.02923);
                case 104:
                    return new Lms(1, 54.076, 0.02924);
                case 105:
                    return new Lms(1, 54.101, 0.02925);
                case 106:
                    return new Lms(1, 54.126, 0.02926);
                case 107:
                    return new Lms(1, 54.152, 0.02926);
                case 108:
                    return new Lms(1, 54.178, 0.02927);
                case 109:
                    return new Lms(1, 54.203, 0.02928);
                case 110:
                    return new Lms(1, 54.229, 0.02929);
                case 111:
                    return new Lms(1, 54.254, 0.0293);
                case 112:
                    return new Lms(1, 54.279, 0.02931);
                case 113:
                    return new Lms(1, 54.305, 0.02932);
                case 114:
                    return new Lms(1, 54.33, 0.02933);
                case 115:
                    return new Lms(1, 54.355, 0.02933);
                case 116:
                    return new Lms(1, 54.38, 0.02934);
                case 117:
                    return new Lms(1, 54.406, 0.02935);
                case 118:
                    return new Lms(1, 54.431, 0.02936);
                case 119:
                    return new Lms(1, 54.457, 0.02937);
                case 120:
                    return new Lms(1, 54.482, 0.02938);
                case 121:
                    return new Lms(1, 54.507, 0.02938);
                case 122:
                    return new Lms(1, 54.533, 0.02939);
                case 123:
                    return new Lms(1, 54.558, 0.0294);
                case 124:
                    return new Lms(1, 54.584, 0.02941);
                case 125:
                    return new Lms(1, 54.61, 0.02942);
                case 126:
                    return new Lms(1, 54.635, 0.02943);
                case 127:
                    return new Lms(1, 54.661, 0.02943);
                case 128:
                    return new Lms(1, 54.687, 0.02944);
                case 129:
                    return new Lms(1, 54.713, 0.02945);
                case 130:
                    return new Lms(1, 54.74, 0.02946);
                case 131:
                    return new Lms(1, 54.766, 0.02946);
                case 132:
                    return new Lms(1, 54.793, 0.02947);
                case 133:
                    return new Lms(1, 54.82, 0.02948);
                case 134:
                    return new Lms(1, 54.846, 0.02949);
                case 135:
                    return new Lms(1, 54.874, 0.02949);
                case 136:
                    return new Lms(1, 54.902, 0.0295);
                case 137:
                    return new Lms(1, 54.929, 0.02951);
                case 138:
                    return new Lms(1, 54.956, 0.02952);
                case 139:
                    return new Lms(1, 54.984, 0.02952);
                case 140:
                    return new Lms(1, 55.012, 0.02953);
                case 141:
                    return new Lms(1, 55.04, 0.02954);
                case 142:
                    return new Lms(1, 55.069, 0.02955);
                case 143:
                    return new Lms(1, 55.098, 0.02955);
                case 144:
                    return new Lms(1, 55.126, 0.02956);
                case 145:
                    return new Lms(1, 55.155, 0.02957);
                case 146:
                    return new Lms(1, 55.184, 0.02957);
                case 147:
                    return new Lms(1, 55.214, 0.02958);
                case 148:
                    return new Lms(1, 55.243, 0.02959);
                case 149:
                    return new Lms(1, 55.272, 0.02959);
                case 150:
                    return new Lms(1, 55.302, 0.0296);
                case 151:
                    return new Lms(1, 55.332, 0.02961);
                case 152:
                    return new Lms(1, 55.362, 0.02961);
                case 153:
                    return new Lms(1, 55.392, 0.02962);
                case 154:
                    return new Lms(1, 55.422, 0.02963);
                case 155:
                    return new Lms(1, 55.453, 0.02963);
                case 156:
                    return new Lms(1, 55.484, 0.02964);
                case 157:
                    return new Lms(1, 55.514, 0.02964);
                case 158:
                    return new Lms(1, 55.546, 0.02965);
                case 159:
                    return new Lms(1, 55.576, 0.02966);
                case 160:
                    return new Lms(1, 55.608, 0.02966);
                case 161:
                    return new Lms(1, 55.639, 0.02967);
                case 162:
                    return new Lms(1, 55.67, 0.02967);
                case 163:
                    return new Lms(1, 55.701, 0.02968);
                case 164:
                    return new Lms(1, 55.732, 0.02969);
                case 165:
                    return new Lms(1, 55.764, 0.02969);
                case 166:
                    return new Lms(1, 55.795, 0.0297);
                case 167:
                    return new Lms(1, 55.827, 0.0297);
                case 168:
                    return new Lms(1, 55.858, 0.02971);
                case 169:
                    return new Lms(1, 55.889, 0.02971);
                case 170:
                    return new Lms(1, 55.921, 0.02972);
                case 171:
                    return new Lms(1, 55.953, 0.02972);
                case 172:
                    return new Lms(1, 55.983, 0.02973);
                case 173:
                    return new Lms(1, 56.014, 0.02973);
                case 174:
                    return new Lms(1, 56.046, 0.02974);
                case 175:
                    return new Lms(1, 56.077, 0.02974);
                case 176:
                    return new Lms(1, 56.108, 0.02975);
                case 177:
                    return new Lms(1, 56.139, 0.02975);
                case 178:
                    return new Lms(1, 56.17, 0.02976);
                case 179:
                    return new Lms(1, 56.201, 0.02976);
                case 180:
                    return new Lms(1, 56.232, 0.02977);
                case 181:
                    return new Lms(1, 56.262, 0.02977);
                case 182:
                    return new Lms(1, 56.293, 0.02978);
                case 183:
                    return new Lms(1, 56.324, 0.02978);
                case 184:
                    return new Lms(1, 56.354, 0.02979);
                case 185:
                    return new Lms(1, 56.384, 0.02979);
                case 186:
                    return new Lms(1, 56.414, 0.0298);
                case 187:
                    return new Lms(1, 56.444, 0.0298);
                case 188:
                    return new Lms(1, 56.474, 0.0298);
                case 189:
                    return new Lms(1, 56.503, 0.02981);
                case 190:
                    return new Lms(1, 56.533, 0.02981);
                case 191:
                    return new Lms(1, 56.562, 0.02982);
                case 192:
                    return new Lms(1, 56.591, 0.02982);
                case 193:
                    return new Lms(1, 56.621, 0.02983);
                case 194:
                    return new Lms(1, 56.65, 0.02983);
                case 195:
                    return new Lms(1, 56.679, 0.02984);
                case 196:
                    return new Lms(1, 56.707, 0.02984);
                case 197:
                    return new Lms(1, 56.736, 0.02984);
                case 198:
                    return new Lms(1, 56.764, 0.02985);
                case 199:
                    return new Lms(1, 56.792, 0.02985);
                case 200:
                    return new Lms(1, 56.821, 0.02985);
                case 201:
                    return new Lms(1, 56.849, 0.02986);
                case 202:
                    return new Lms(1, 56.876, 0.02986);
                case 203:
                    return new Lms(1, 56.904, 0.02987);
                case 204:
                    return new Lms(1, 56.932, 0.02987);
                case 205:
                    return new Lms(1, 56.96, 0.02987);
                case 206:
                    return new Lms(1, 56.987, 0.02988);
                case 207:
                    return new Lms(1, 57.014, 0.02988);
                case 208:
                    return new Lms(1, 57.041, 0.02989);
                case 209:
                    return new Lms(1, 57.068, 0.02989);
                case 210:
                    return new Lms(1, 57.095, 0.02989);
                case 211:
                    return new Lms(1, 57.121, 0.0299);
                case 212:
                    return new Lms(1, 57.148, 0.0299);
                case 213:
                    return new Lms(1, 57.174, 0.0299);
                case 214:
                    return new Lms(1, 57.201, 0.02991);
                case 215:
                    return new Lms(1, 57.227, 0.02991);
                case 216:
                    return new Lms(1, 57.26, 0.02991);
                default:
                    throw new RangeError("ageMonths");
            }
        }
        switch (ageMonths)
        {
            case 3:
                return new Lms(1, 39.5328, 0.0314);
            case 4:
                return new Lms(1, 40.5817, 0.03119);
            case 5:
                return new Lms(1, 41.459, 0.03102);
            case 6:
                return new Lms(1, 42.1995, 0.03087);
            case 7:
                return new Lms(1, 42.829, 0.03075);
            case 8:
                return new Lms(1, 43.3671, 0.03063);
            case 9:
                return new Lms(1, 43.83, 0.03053);
            case 10:
                return new Lms(1, 44.2319, 0.03044);
            case 11:
                return new Lms(1, 44.5844, 0.03035);
            case 12:
                return new Lms(1, 44.8965, 0.03027);
            case 13:
                return new Lms(1, 45.1752, 0.03019);
            case 14:
                return new Lms(1, 45.4265, 0.03012);
            case 15:
                return new Lms(1, 45.6551, 0.03006);
            case 16:
                return new Lms(1, 45.865, 0.02999);
            case 17:
                return new Lms(1, 46.0598, 0.02993);
            case 18:
                return new Lms(1, 46.2424, 0.02987);
            case 19:
                return new Lms(1, 46.4152, 0.02982);
            case 20:
                return new Lms(1, 46.5801, 0.02977);
            case 21:
                return new Lms(1, 46.7384, 0.02972);
            case 22:
                return new Lms(1, 46.8913, 0.02967);
            case 23:
                return new Lms(1, 47.0391, 0.02962);
            case 24:
                return new Lms(1, 47.1822, 0.02957);
            case 25:
                return new Lms(1, 47.3204, 0.02953);
            case 26:
                return new Lms(1, 47.4536, 0.02949);
            case 27:
                return new Lms(1, 47.5817, 0.02945);
            case 28:
                return new Lms(1, 47.7045, 0.02941);
            case 29:
                return new Lms(1, 47.8219, 0.02937);
            case 30:
                return new Lms(1, 47.934, 0.02933);
            case 31:
                return new Lms(1, 48.041, 0.02929);
            case 32:
                return new Lms(1, 48.1432, 0.02926);
            case 33:
                return new Lms(1, 48.2408, 0.02922);
            case 34:
                return new Lms(1, 48.3343, 0.02919);
            case 35:
                return new Lms(1, 48.4239, 0.02915);
            case 36:
                return new Lms(1, 48.5099, 0.02912);
            case 37:
                return new Lms(1, 48.5926, 0.02909);
            case 38:
                return new Lms(1, 48.6722, 0.02906);
            case 39:
                return new Lms(1, 48.7489, 0.02903);
            case 40:
                return new Lms(1, 48.8228, 0.029);
            case 41:
                return new Lms(1, 48.8941, 0.02897);
            case 42:
                return new Lms(1, 48.9629, 0.02894);
            case 43:
                return new Lms(1, 49.0294, 0.02891);
            case 44:
                return new Lms(1, 49.0937, 0.02888);
            case 45:
                return new Lms(1, 49.156, 0.02886);
            case 46:
                return new Lms(1, 49.2164, 0.02883);
            case 47:
                return new Lms(1, 49.2751, 0.0288);
            case 48:
                return new Lms(1, 49.3321, 0.02878);
            case 49:
                return new Lms(1, 51.104, 0.02342);
            case 50:
                return new Lms(1, 51.208, 0.02336);
            case 51:
                return new Lms(1, 51.258, 0.02332);
            case 52:
                return new Lms(1, 51.309, 0.02329);
            case 53:
                return new Lms(1, 51.358, 0.02326);
            case 54:
                return new Lms(1, 51.406, 0.02323);
            case 55:
                return new Lms(1, 51.454, 0.02321);
            case 56:
                return new Lms(1, 51.501, 0.02318);
            case 57:
                return new Lms(1, 51.546, 0.02316);
            case 58:
                return new Lms(1, 51.591, 0.02314);
            case 59:
                return new Lms(1, 51.637, 0.02311);
            case 60:
                return new Lms(1, 51.681, 0.02309);
            case 61:
                return new Lms(1, 51.725, 0.02307);
            case 62:
                return new Lms(1, 51.768, 0.02306);
            case 63:
                return new Lms(1, 51.81, 0.02304);
            case 64:
                return new Lms(1, 51.852, 0.02303);
            case 65:
                return new Lms(1, 51.893, 0.02301);
            case 66:
                return new Lms(1, 51.934, 0.023);
            case 67:
                return new Lms(1, 51.975, 0.02299);
            case 68:
                return new Lms(1, 52.014, 0.02298);
            case 69:
                return new Lms(1, 52.053, 0.02297);
            case 70:
                return new Lms(1, 52.092, 0.02296);
            case 71:
                return new Lms(1, 52.131, 0.02295);
            case 72:
                return new Lms(1, 52.169, 0.02294);
            case 73:
                return new Lms(1, 52.207, 0.02294);
            case 74:
                return new Lms(1, 52.244, 0.02293);
            case 75:
                return new Lms(1, 52.281, 0.02293);
            case 76:
                return new Lms(1, 52.318, 0.02293);
            case 77:
                return new Lms(1, 52.355, 0.02293);
            case 78:
                return new Lms(1, 52.391, 0.02292);
            case 79:
                return new Lms(1, 52.427, 0.02292);
            case 80:
                return new Lms(1, 52.462, 0.02292);
            case 81:
                return new Lms(1, 52.498, 0.02293);
            case 82:
                return new Lms(1, 52.533, 0.02293);
            case 83:
                return new Lms(1, 52.568, 0.02293);
            case 84:
                return new Lms(1, 52.604, 0.02293);
            case 85:
                return new Lms(1, 52.638, 0.02294);
            case 86:
                return new Lms(1, 52.673, 0.02294);
            case 87:
                return new Lms(1, 52.707, 0.02295);
            case 88:
                return new Lms(1, 52.741, 0.02296);
            case 89:
                return new Lms(1, 52.775, 0.02296);
            case 90:
                return new Lms(1, 52.809, 0.02297);
            case 91:
                return new Lms(1, 52.842, 0.02298);
            case 92:
                return new Lms(1, 52.876, 0.02299);
            case 93:
                return new Lms(1, 52.909, 0.023);
            case 94:
                return new Lms(1, 52.942, 0.02301);
            case 95:
                return new Lms(1, 52.975, 0.02302);
            case 96:
                return new Lms(1, 53.008, 0.02303);
            case 97:
                return new Lms(1, 53.041, 0.02304);
            case 98:
                return new Lms(1, 53.073, 0.02305);
            case 99:
                return new Lms(1, 53.106, 0.02306);
            case 100:
                return new Lms(1, 53.138, 0.02308);
            case 101:
                return new Lms(1, 53.169, 0.02309);
            case 102:
                return new Lms(1, 53.201, 0.0231);
            case 103:
                return new Lms(1, 53.232, 0.02312);
            case 104:
                return new Lms(1, 53.264, 0.02313);
            case 105:
                return new Lms(1, 53.295, 0.02315);
            case 106:
                return new Lms(1, 53.326, 0.02316);
            case 107:
                return new Lms(1, 53.357, 0.02318);
            case 108:
                return new Lms(1, 53.387, 0.0232);
            case 109:
                return new Lms(1, 53.417, 0.02321);
            case 110:
                return new Lms(1, 53.448, 0.02323);
            case 111:
                return new Lms(1, 53.477, 0.02325);
            case 112:
                return new Lms(1, 53.507, 0.02327);
            case 113:
                return new Lms(1, 53.537, 0.02328);
            case 114:
                return new Lms(1, 53.566, 0.0233);
            case 115:
                return new Lms(1, 53.595, 0.02332);
            case 116:
                return new Lms(1, 53.624, 0.02334);
            case 117:
                return new Lms(1, 53.653, 0.02336);
            case 118:
                return new Lms(1, 53.681, 0.02338);
            case 119:
                return new Lms(1, 53.71, 0.0234);
            case 120:
                return new Lms(1, 53.738, 0.02342);
            case 121:
                return new Lms(1, 53.766, 0.02344);
            case 122:
                return new Lms(1, 53.794, 0.02346);
            case 123:
                return new Lms(1, 53.821, 0.02348);
            case 124:
                return new Lms(1, 53.848, 0.0235);
            case 125:
                return new Lms(1, 53.875, 0.02352);
            case 126:
                return new Lms(1, 53.902, 0.02354);
            case 127:
                return new Lms(1, 53.929, 0.02356);
            case 128:
                return new Lms(1, 53.955, 0.02358);
            case 129:
                return new Lms(1, 53.982, 0.0236);
            case 130:
                return new Lms(1, 54.007, 0.02362);
            case 131:
                return new Lms(1, 54.033, 0.02364);
            case 132:
                return new Lms(1, 54.06, 0.02366);
            case 133:
                return new Lms(1, 54.085, 0.02369);
            case 134:
                return new Lms(1, 54.11, 0.02371);
            case 135:
                return new Lms(1, 54.135, 0.02373);
            case 136:
                return new Lms(1, 54.16, 0.02375);
            case 137:
                return new Lms(1, 54.185, 0.02377);
            case 138:
                return new Lms(1, 54.21, 0.02379);
            case 139:
                return new Lms(1, 54.235, 0.02381);
            case 140:
                return new Lms(1, 54.259, 0.02384);
            case 141:
                return new Lms(1, 54.283, 0.02386);
            case 142:
                return new Lms(1, 54.307, 0.02388);
            case 143:
                return new Lms(1, 54.331, 0.0239);
            case 144:
                return new Lms(1, 54.355, 0.02392);
            case 145:
                return new Lms(1, 54.378, 0.02394);
            case 146:
                return new Lms(1, 54.401, 0.02396);
            case 147:
                return new Lms(1, 54.424, 0.02398);
            case 148:
                return new Lms(1, 54.447, 0.024);
            case 149:
                return new Lms(1, 54.47, 0.02403);
            case 150:
                return new Lms(1, 54.492, 0.02405);
            case 151:
                return new Lms(1, 54.515, 0.02407);
            case 152:
                return new Lms(1, 54.537, 0.02409);
            case 153:
                return new Lms(1, 54.559, 0.02411);
            case 154:
                return new Lms(1, 54.581, 0.02413);
            case 155:
                return new Lms(1, 54.603, 0.02415);
            case 156:
                return new Lms(1, 54.624, 0.02417);
            case 157:
                return new Lms(1, 54.646, 0.02419);
            case 158:
                return new Lms(1, 54.667, 0.02421);
            case 159:
                return new Lms(1, 54.688, 0.02423);
            case 160:
                return new Lms(1, 54.71, 0.02425);
            case 161:
                return new Lms(1, 54.731, 0.02427);
            case 162:
                return new Lms(1, 54.751, 0.02429);
            case 163:
                return new Lms(1, 54.772, 0.02431);
            case 164:
                return new Lms(1, 54.793, 0.02433);
            case 165:
                return new Lms(1, 54.813, 0.02435);
            case 166:
                return new Lms(1, 54.833, 0.02437);
            case 167:
                return new Lms(1, 54.853, 0.02439);
            case 168:
                return new Lms(1, 54.873, 0.02441);
            case 169:
                return new Lms(1, 54.894, 0.02442);
            case 170:
                return new Lms(1, 54.913, 0.02444);
            case 171:
                return new Lms(1, 54.933, 0.02446);
            case 172:
                return new Lms(1, 54.953, 0.02448);
            case 173:
                return new Lms(1, 54.972, 0.0245);
            case 174:
                return new Lms(1, 54.992, 0.02452);
            case 175:
                return new Lms(1, 55.011, 0.02454);
            case 176:
                return new Lms(1, 55.03, 0.02455);
            case 177:
                return new Lms(1, 55.049, 0.02457);
            case 178:
                return new Lms(1, 55.068, 0.02459);
            case 179:
                return new Lms(1, 55.087, 0.02461);
            case 180:
                return new Lms(1, 55.106, 0.02462);
            case 181:
                return new Lms(1, 55.124, 0.02464);
            case 182:
                return new Lms(1, 55.142, 0.02466);
            case 183:
                return new Lms(1, 55.161, 0.02468);
            case 184:
                return new Lms(1, 55.179, 0.0247);
            case 185:
                return new Lms(1, 55.197, 0.02471);
            case 186:
                return new Lms(1, 55.215, 0.02473);
            case 187:
                return new Lms(1, 55.234, 0.02475);
            case 188:
                return new Lms(1, 55.251, 0.02476);
            case 189:
                return new Lms(1, 55.269, 0.02478);
            case 190:
                return new Lms(1, 55.286, 0.0248);
            case 191:
                return new Lms(1, 55.304, 0.02481);
            case 192:
                return new Lms(1, 55.321, 0.02483);
            case 193:
                return new Lms(1, 55.339, 0.02485);
            case 194:
                return new Lms(1, 55.355, 0.02486);
            case 195:
                return new Lms(1, 55.373, 0.02488);
            case 196:
                return new Lms(1, 55.39, 0.02489);
            case 197:
                return new Lms(1, 55.406, 0.02491);
            case 198:
                return new Lms(1, 55.424, 0.02493);
            case 199:
                return new Lms(1, 55.441, 0.02494);
            case 200:
                return new Lms(1, 55.457, 0.02496);
            case 201:
                return new Lms(1, 55.474, 0.02497);
            case 202:
                return new Lms(1, 55.491, 0.02499);
            case 203:
                return new Lms(1, 55.506, 0.02501);
            case 204:
                return new Lms(1, 55.52, 0.02501);
            default:
                throw new RangeError("ageMonths");
        }
    }
}


 