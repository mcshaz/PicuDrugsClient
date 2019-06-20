<template>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 968" version="1.1">
        <defs>
            <marker xmlns="http://www.w3.org/2000/svg" id="arrow" orient="auto" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="20" refY="10" refX="7">
            <path fill="#fb3199" d="M0,0 L0,20 L10,10 z"/>
            </marker>
        </defs>
        
        <rect x="0" y="0" width="800" class="title" height="60"/>
        <text class="title-text" x="400" y="42">
            Anaphylaxis
        </text>
      
        <rect x="220" y="70" height="206" width="360" class="blue" rx="10" ry="10"/>
        <text x="400" y="94">
            <tspan class="heading">
                Assess for:
            </tspan>
            <tspan class="strong" dy="1.8em" x="400">
                Upper airway obstruction
            </tspan>
            <tspan dy="1.2em" x="400">
                (stridor, oral swelling)
            </tspan>
            <tspan dy="1.2em" x="400">
                or
            </tspan>
            <tspan class="strong" dy="1.2em" x="400">
                Lower airway obstruction
            </tspan>
            <tspan dy="1.2em" x="400">
                (wheeze, respiratory distress)
            </tspan>
            <tspan dy="1.2em" x="400">
                or
            </tspan>
            <tspan class="strong" dy="1.2em" x="400">
                Shock
            </tspan>
            <tspan dy="1.2em" x="400">
                (dizziness, pale, clammy)
            </tspan>
        </text>
        <line x1="400" y1="276" x2="400" y2="296" marker-end="url(#arrow)"/>
        <rect x="220" height="74" width="360" class="blue" rx="10" ry="10" y="300"/>
        <text x="400" y="320">
            <tspan class="strong">
                Call for help
            </tspan>
            <tspan dy="1.2em" x="400">
                Remove trigger / causitive agent
            </tspan>
            <tspan dy="1.2em" x="400">
                Position flat or sitting, not walking or standing
            </tspan>
        </text>
        <line x1="400" x2="400" marker-end="url(#arrow)" y1="374" y2="394"/>

        <rect x="294" height="66" width="212" class="pink" rx="10" ry="10" y="398"/>
        <text class="decision" x="400" y="439">
            Cardiac arrest?
        </text>
        
        <line y1="431" x1="507" y2="431" x2="605"/>
        <text class="decision" y="439" x="634">
            YES
        </text>
        <line marker-end="url(#arrow)" x1="634" x2="634" y1="444" y2="466"/>
        
        <rect height="84" class="pink" rx="10" ry="10" width="264" x="500" y="470"/>
            <a href="https://www.nzrc.org.nz/assets/Guidelines/Algorithms/Advanced-Life-Support-for-Infants-and-Children-Jan-2016.pdf">
                <text class="strong" x="634" y="504">
                    <tspan>
                        Refer Advanced Life
                    </tspan>
                    <tspan x="634" dy="1.4em">
                        Support algorithm
                    </tspan>
                </text>
            </a>

        <line y1="431" x1="294" y2="431" x2="218"/>
        <text class="decision" y="439" x="195">
            NO
        </text>
        <line marker-end="url(#arrow)" y1="444" y2="466" x1="195" x2="195"/>
        
        <rect class="pink" rx="10" ry="10" width="346" x="20" y="470" height="148"/>
        <text y="499" x="195">
            <tspan class="strong">
                Adrenaline IM:
            </tspan>
            <tspan class="em" dy="1.2em" x="195">
                Use auto injector if available
            </tspan>
            <tspan class="em" dy="1.2em" x="195">
                (preferred injection site upper outer thigh)
            </tspan>
            <tspan class="strong" dy="1.2em" x="195" v-if="adrenalineIM">
                {{adrenalineIM.dose}}{{adrenalineIM.units}} ({{adrenalineIM.ml}}mL of 1:1,000)
            </tspan>
            <tspan class="small em" dy="1.2em" x="195">
                (this is the small 1ml vial)
            </tspan>
            <tspan class="strong" dy="1.2em" x="195">
                Repeat every 5 minutes as needed
            </tspan>
        </text>
        
        <line marker-end="url(#arrow)" x1="195" x2="195" y1="618" y2="638"/>
        <rect class="pink" rx="10" ry="10" x="40" y="642" width="310" height="120"/>
        <text x="195" y="664">
            <tspan>
                Attach cardiac monitoring:
            </tspan>
            <tspan dy="1.2em" x="195">
                High flow oxygen (6-10 L/min)
            </tspan>
            <tspan dy="1.2em" x="195">
                IV access
            </tspan>
            <tspan class="strong" dy="1.4em" x="195">
                For shock:
            </tspan>
            <tspan class="strong" dy="1.2em" x="195">
                0.9% Saline {{volume}}mL rapidly
            </tspan>
        </text>
        
        <line marker-end="url(#arrow)" y1="704" y2="704" x1="350" x2="370"/>
        <rect class="green" x="374" width="106" height="30" rx="10" ry="10" y="689"/>
        <text class="resolve" y="709" x="426">
            RESOLUTION
        </text>
        <line y1="704" y2="704" marker-end="url(#arrow)" x1="480" x2="496"/>
        <rect class="green" x="500" height="143" width="264" rx="10" ry="10" y="628"/> 
        <text x="634" y="654">
            <tspan class="strong">
                Observe (4 hours min)
            </tspan>
            <tspan x="634" dy="1.7em">
                Monitor vital signs, reassess ABC
            </tspan>
        </text>
        <circle r="2px" cx="520" cy="723"/>
        <circle r="2px" cx="520" cy="741"/>
        <text class="list" x="516" y="708">
            <tspan>
                Consider:
            </tspan>
            <tspan class="strong" dy="1.2em" x="528">
                hydrocortisone: {{hydrocortDose}}mg IV
            </tspan>
            <tspan class="strong" dy="1.2em" x="528">
                loratadine: {{loratadineDose}}mg PO
            </tspan>
            <tspan class="small" v-if="wtKg<=12">
                if 12month+
            </tspan>
        </text>
        
        <line marker-end="url(#arrow)" x1="195" y1="762" x2="195" y2="784"/>
        <rect class="pink" rx="10" ry="10" x="40" width="700" y="788" height="142"/>
        <g>
            <text class="strong" x="400" y="814">
                <tspan>
                    Call for specialist advice
                </tspan>
                <tspan x="400" dy="1.2em">
                    Consider:
                </tspan>
            </text>
            <g>
                <circle r="2px" cy="848" cx="60"/>
                <circle r="2px" cy="870" cx="60"/>
                <circle r="2px" cx="60" cy="893"/>
                <text class="list" y="854" x="68">
                    <tspan>
                        Transfer to advanced care setting
                    </tspan>
                    <tspan x="68" dy="1.4em">
                        Further 0.9% saline
                    </tspan>
                    <tspan dy="1.4em" x="68">
                        Nebulised 
                    </tspan>
                    <tspan class="strong">
                        adrenaline:
                    </tspan>
                    <tspan>
                        {{adrenalineNebDose}}mg
                    </tspan>
                    <tspan class="small" dy="1.1em" x="68">
                        {{adrenalineNebDose}} x 1:1,000 (1ml) vials
                    </tspan>
                    <tspan class="small" v-if="adrenalineNebSaline">
                        + {{adrenalineNebSaline}}mL 0.9% saline
                    </tspan>
                </text>
                <circle r="2px" cy="848" cx="348"/>
                <circle r="2px" cy="893" cx="348"/>
                <text class="list" y="854" x="355">
                    <tspan class="strong">
                        Adrenaline
                    </tspan>
                    <tspan>
                        infusion:
                    </tspan>
                    <tspan dy="1.1em" class="small" x="355">
                        mix 1mg (1 vial) of adrenaline in 1,000ml 0.9% saline @ {{dirtyAdrenalineRate}}ml/h
                    </tspan>
                    <tspan class="small" dy="1.1em" x="355">
                        If no infusion pump avalable, ≈{{dirtyAdrenalineDrops}}drops/min
                    </tspan>
                    <tspan dy="1.2em" x="355">
                        Metaraminol or vasopressin infusion
                    </tspan>
                </text>
            </g> 
        </g>
    </svg>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { roundToFixed, roundToNearest } from '@/services/utilities/rounding';

type vueNumber = number | '';

@Component({})
export default class AnaphylaxisSvg extends Vue {
    @Prop({default: ''})
    public wtKg!: vueNumber;

    public get adrenalineNebDose(): vueNumber {
        if (this.wtKg === '') {
            return '';
        }
        return this.wtKg >= 12
            ? 6
            : roundToFixed(0.5 * this.wtKg);
    }

    public get adrenalineNebSaline(): vueNumber {
        if (!this.adrenalineNebDose) {
            return '';
        }
        return this.adrenalineNebDose >= 4
            ? 0
            : roundToFixed(4 - this.adrenalineNebDose);
    }

    public get adrenalineIM() {
        if (this.wtKg === '') {
            return '';
        }
        if (this.wtKg >= 50) {
            return { dose: 0.5, units: 'mg', ml: 0.5 };
        }
        if (this.wtKg < 7.5) {
            return { dose: '5–10', units: 'microg', ml: '0.05–0.1' };
        }
        let dose;
        if (this.wtKg <= 20) {
            dose = roundToNearest(10 * this.wtKg, 50);
            return { dose, units: 'microg', ml: dose / 1000 };
        }
        dose = roundToNearest(10 * this.wtKg, 100);
        return { dose, units: 'microg', ml: dose / 1000 };
    }

    public get dirtyAdrenalineRate() {
        if (this.wtKg === '') {
            return '';
        }
        return this.wtKg >= 100
            ? 500
            : Math.round(5 * this.wtKg);
    }

    public get dirtyAdrenalineDrops() {
        if (!this.dirtyAdrenalineRate) {
            return '';
        }
        return Math.round(this.dirtyAdrenalineRate / 3);
    }

    public get volume() {
        if (this.wtKg === '') {
            return '';
        }
        return this.wtKg >= 50
            ? 1000
            : Math.round(20 * this.wtKg);
    }

    public get loratadineDose() {
        if (this.wtKg === '') {
            return '';
        }
        if (this.wtKg <= 12) {
            return 2.5;
        }
        if (this.wtKg <= 30) {
            return 5;
        }
        return 10;
    }

    public get hydrocortDose() {
        if (this.wtKg === '') {
            return '';
        }
        return this.wtKg >= 25
            ? 100
            : Math.round(this.wtKg * 4);
    }

    public get hydrocortVol() {
        if (!this.hydrocortDose) {
            return '';
        }
        return this.hydrocortDose / 50;
    }
}

</script>
<style scoped>
    /* <![CDATA[ */
	@namespace svg url(http://www.w3.org/2000/svg);
    rect {
	  fill-opacity: 1;
	  stroke-width: 2;
	  stroke-linejoin:round;
	  stroke-opacity: 1;
    }
	text {
		font-size: 12pt;
		font-style: normal;
		font-weight: normal;
		font-family: Arial, Helvetica, sans-serif;
		text-align: center;
		letter-spacing: 0;
		word-spacing: 0;
		writing-mode: lr-tb;
		text-anchor: middle;
	}
	line {
		stroke-width: 5;
		stroke: #fb3199;
	}
	text.list {
		text-anchor: start;
		text-align: left;
	}
	.blue {
		fill: #8ce1fd;
		stroke: #00b9f2;
	}
	.pink {
		fill: #ffd4c5;
		stroke: #fb3199;	
	}
	.green {
		fill: #c5e4c2;
		stroke: #45b348;
	}
	.title {
        fill:#FFF;
		stroke: #0e2c53;
	}
	.title-text {
		fill: #0e2c53;
		font-size: 32pt;
		font-weight: bold;
	}
	.heading {
		font-weight: bold;
		font-size: 16pt;
	}
	.strong {
		font-weight: bold;
	}
	.decision {
		font-size: 20pt;
		font-weight: bold;
	}
	.em {
		font-style: italic;
	}
	.resolve {
		font-size: 10pt;
		font-weight: bold;
	}
	.small {
		font-size: 9pt;
		fill: #444;
	}

	svg|a:link, svg|a:visited {
	  cursor: pointer;
	}

	svg|a text,
	text svg|a {
	  fill: blue; /* Even for text, SVG uses fill over color */
	  text-decoration: underline;
	}
    /* ]]> */
  </style>