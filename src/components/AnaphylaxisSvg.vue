<template>
    <svg xmlns="http://www.w3.org/2000/svg"
            xmlns:svg="http://www.w3.org/2000/svg"
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
            xmlns:dc="http://purl.org/dc/elements/1.1/" 
            xmlns:cc="http://creativecommons.org/ns#"  
            viewBox="0 0 748 904" version="1.1">
        <metadata>
            <rdf:RDF>
                <cc:Work
                    rdf:about="">
                    <dc:format>image/svg+xml</dc:format>
                    <dc:type
                    rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                    <dc:title>Anaphylaxis</dc:title>
                </cc:Work>
            </rdf:RDF>
        </metadata>
        <defs>
            <marker id="arrow" orient="auto" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="20" refY="10" refX="7">
            <path fill="#fb3199" d="M0,0 L0,20 L10,10 z"/>
            </marker>
        </defs>
        
        <rect x="2" y="2" width="744" class="title" height="56"/>
        <text class="title-text" x="382" y="42">
            Anaphylaxis
        </text>
      
        <rect x="202" y="70" height="206" width="360" class="blue" rx="10" ry="10"/>
        <text x="382" y="94">
            <tspan class="heading">
                Assess for:
            </tspan>
            <tspan class="strong" dy="1.8em" x="382">
                Upper airway obstruction
            </tspan>
            <tspan dy="1.2em" x="382">
                (stridor, oral swelling)
            </tspan>
            <tspan dy="1.2em" x="382">
                or
            </tspan>
            <tspan class="strong" dy="1.2em" x="382">
                Lower airway obstruction
            </tspan>
            <tspan dy="1.2em" x="382">
                (wheeze, respiratory distress)
            </tspan>
            <tspan dy="1.2em" x="382">
                or
            </tspan>
            <tspan class="strong" dy="1.2em" x="382">
                Shock
            </tspan>
            <tspan dy="1.2em" x="382">
                (dizziness, pale, clammy)
            </tspan>
        </text>
        <line x1="382" y1="276" x2="382" y2="296" marker-end="url(#arrow)"/>
        <rect x="202" height="74" width="360" class="blue" rx="10" ry="10" y="300"/>
        <text x="382" y="320">
            <tspan class="strong">
                Call for help
            </tspan>
            <tspan dy="1.2em" x="382">
                Remove trigger / causitive agent
            </tspan>
            <tspan dy="1.2em" x="382">
                Position flat or sitting, not walking or standing
            </tspan>
        </text>
        <line x1="382" x2="382" marker-end="url(#arrow)" y1="374" y2="394"/>

        <rect x="276" height="66" width="212" class="pink" rx="10" ry="10" y="398"/>
        <text class="decision" x="382" y="439">
            Cardiac arrest?
        </text>
        
        <line y1="431" x1="489" y2="431" x2="587"/>
        <text class="decision" y="439" x="616">
            YES
        </text>
        <line marker-end="url(#arrow)" x1="616" x2="616" y1="444" y2="466"/>
        
        <rect height="84" class="pink" rx="10" ry="10" width="264" x="482" y="470"/>
            <a href="https://www.nzrc.org.nz/assets/Guidelines/Algorithms/Advanced-Life-Support-for-Infants-and-Children-Jan-2016.pdf">
                <text class="strong" x="616" y="504">
                    <tspan>
                        Refer Advanced Life
                    </tspan>
                    <tspan x="616" dy="1.4em">
                        Support algorithm
                    </tspan>
                </text>
            </a>

        <line y1="431" x1="276" y2="431" x2="200"/>
        <text class="decision" y="439" x="177">
            NO
        </text>
        <line marker-end="url(#arrow)" y1="444" y2="466" x1="177" x2="177"/>
        
        <rect class="pink" rx="10" ry="10" width="346" x="2" y="470" height="120"/>
        <text y="499" x="177">
            <tspan class="strong">
                Adrenaline IM:
            </tspan>
            <tspan class="em" dy="1.2em" x="177">
                (preferred injection site upper outer thigh)
            </tspan>
            <tspan class="strong" dy="1.2em" x="177" v-if="adrenalineIM">
                {{adrenalineIM.dose}}{{adrenalineIM.units}} ({{adrenalineIM.ml}}mL of 1:1,000)
            </tspan>
            <tspan class="small em" dy="1.2em" x="177">
                (this is the small 1ml vial)
            </tspan>
            <tspan class="strong" dy="1.2em" x="177">
                Repeat every 5 minutes as needed
            </tspan>
        </text>
        
        <line marker-end="url(#arrow)" x1="177" x2="177" y1="590" y2="610"/>
        <rect class="pink" rx="10" ry="10" x="22" y="614" width="310" height="120"/>
        <text x="177" y="636">
            <tspan>
                Attach cardiac monitoring:
            </tspan>
            <tspan dy="1.2em" x="177">
                High flow oxygen (8-12 L/min)
            </tspan>
            <tspan dy="1.2em" x="177">
                IV access
            </tspan>
            <tspan class="strong" dy="1.4em" x="177">
                For shock:
            </tspan>
            <tspan class="strong" dy="1.2em" x="177">
                0.9% Saline {{volume}}mL rapidly
            </tspan>
        </text>
        
        <line marker-end="url(#arrow)" y1="676" y2="676" x1="332" x2="352"/>
        <rect class="green" x="356" width="106" height="30" rx="10" ry="10" y="661"/>
        <text class="resolve" y="681" x="408">
            RESOLUTION
        </text>
        <line y1="676" y2="676" marker-end="url(#arrow)" x1="462" x2="478"/>
        <rect class="green" x="482" height="143" width="264" rx="10" ry="10" y="600"/> 
        <text x="616" y="626">
            <tspan class="strong">
                Observe (4 hours min)
            </tspan>
            <tspan x="616" dy="1.7em">
                Monitor vital signs, reassess ABC
            </tspan>
        </text>
        <circle r="2px" cx="502" cy="695"/>
        <circle r="2px" cx="502" cy="713"/>
        <text class="list" x="498" y="680">
            <tspan>
                Consider:
            </tspan>
            <tspan class="strong" dy="1.2em" x="510">
                hydrocortisone: {{hydrocortDose}}mg IV
            </tspan>
            <tspan class="strong" dy="1.2em" x="510">
                loratadine: {{loratadineDose}}mg PO
            </tspan>
            <tspan class="small" v-if="wtKg<=12">
                if 12month+
            </tspan>
        </text>
        
        <line marker-end="url(#arrow)" x1="177" y1="734" x2="177" y2="756"/>
        <rect class="pink" rx="10" ry="10" x="22" width="700" y="760" height="142"/>
        <g>
            <text class="strong" x="382" y="786">
                <tspan>
                    Call for specialist advice
                </tspan>
                <tspan x="382" dy="1.2em">
                    Consider:
                </tspan>
            </text>
            <g>
                <circle r="2px" cy="820" cx="42"/>
                <circle r="2px" cy="842" cx="42"/>
                <circle r="2px" cx="42" cy="865"/>
                <text class="list" y="826" x="50">
                    <tspan>
                        Transfer to advanced care setting
                    </tspan>
                    <tspan x="50" dy="1.4em">
                        Further 0.9% saline
                    </tspan>
                    <tspan dy="1.4em" x="50">
                        Nebulised 
                    </tspan>
                    <tspan class="strong">
                        adrenaline:
                    </tspan>
                    <tspan>
                        {{adrenalineNebDose}}mg
                    </tspan>
                    <tspan class="small" dy="1.1em" x="50">
                        {{adrenalineNebDose}} x 1:1,000 (1ml) vials
                    </tspan>
                    <tspan class="small" v-if="adrenalineNebSaline">
                        + {{adrenalineNebSaline}}mL 0.9% saline
                    </tspan>
                </text>
                <circle r="2px" cy="820" cx="330"/>
                <circle r="2px" cy="865" cx="330"/>
                <text class="list" y="826" x="337">
                    <tspan class="strong">
                        Adrenaline
                    </tspan>
                    <tspan>
                        infusion:
                    </tspan>
                    <tspan dy="1.1em" class="small" x="337">
                        mix 1mg (1 vial) of adrenaline in 1,000ml 0.9% saline @ {{dirtyAdrenalineRate}}ml/h
                    </tspan>
                    <tspan class="small" dy="1.1em" x="337">
                        If no infusion pump avalable, ≈{{dirtyAdrenalineDrops}}drops/min
                    </tspan>
                    <tspan dy="1.2em" x="337">
                        Metaraminol infusion
                    </tspan>
                </text>
            </g> 
        </g>
    </svg>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { roundToFixed, roundToNearest } from '@/services/infusion-calculations/Utilities/rounding';

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
        return this.wtKg >= 40
            ? 200
            : Math.round(this.wtKg * 5);
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