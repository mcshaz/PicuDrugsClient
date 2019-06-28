<template>
    <svg xmlns:osb="http://www.openswatchbook.org/uri/2009/osb" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" 
            viewBox="0 0 197 251">
  <defs>
    <marker style="overflow:visible;" id="arrow" refX="0.0" refY="0.0" orient="auto">
      <path transform="rotate(180)" d="M 8.7185878,4.0337352 L -2.2072895,0.016013256 L 8.7185884,-4.0017078 C 6.9730900,-1.6296469 6.9831476,1.6157441 8.7185878,4.0337352 z " style="fill-rule:evenodd;stroke-width:0.625;stroke-linejoin:round;stroke:#000000;stroke-opacity:1;fill:#000000;fill-opacity:1" id="path881"></path>
    </marker>
  </defs>
  <metadata id="metadata5">
    <rdf:rdf>
      <cc:work rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"></dc:type>
        <dc:title>SVT</dc:title>
      </cc:work>
    </rdf:rdf>
  </metadata>
<g>
    <path id="shock-choice" d="M 68,22 90,43 113,22 90,1 Z"></path>
    <text height="22" width="40" x="90" y="20">
        <tspan>Shock</tspan>
        <tspan dy="1.2em" x="90">present?</tspan>
    </text>

    <path marker-end="url(#arrow)" d="M 113,22 h 31 v 6"></path>
    <rect y="29" x="127" height="22" width="34"></rect>
    <text height="22" width="40" x="144" y="38">
        <tspan>Vagal</tspan>
        <tspan dy="1.2em" x="144">manoeuvre</tspan>
    </text>
    
    <g v-for="(d, indx) in initialAdenosines" :key="d.dosePerKg">
        <rect :y="indx*28+71" x="125" height="13" width="38"></rect>
        <text height="13" width="38" x="144" :y="indx*28+77">
            <tspan class="drug">Adenosine</tspan><tspan class="ref" dy="-1em">†</tspan>
            <tspan class="ampule" x="144" dy="1.5em">
                {{d.ampuleMl}}
            </tspan>
            <tspan class="ml">
                mL
            </tspan>
            <tspan class="small">
                ({{d.dose}} mg)
            </tspan>
        </text>
    </g>
    
    <rect y="154" x="90" height="27" width="106"></rect>
    <text height="22" width="40" x="144" y="159">
        Consider:
    </text>

    <circle r="1px" cx="96" cy="165"></circle>
    <circle r="1px" cx="96" cy="171"></circle>
    <circle r="1px" cx="96" cy="177"></circle>
    
    <text class="list" height="22" width="40" y="166" x="99">
        <tspan class="drug">
            Adenosine</tspan><tspan class="ref" dy="-1em">†</tspan>
        <tspan class="dose" dy="0.4em">
            {{finalAdenosine.ampuleMl}}
        </tspan>
        <tspan class="units">
            mL
        </tspan>
        <tspan class="small">({{finalAdenosine.dose}} mg)</tspan>
        <tspan dy="1.2em" x="99">Synchronous DC shock</tspan>
        <tspan class="small">
            + hypnosedative
        </tspan>
        <tspan dy="1.2em" x="99">
            Amiodarone</tspan><tspan>*</tspan>
        <tspan>
            or Procainamide
        </tspan>
        <tspan class="small">
            (seek advice)
        </tspan>
    </text>    
        
    <path marker-end="url(#arrow)" d="m 68,22 -34,0 v 6"></path>
    <rect y="29" x="13" height="22" width="40"></rect>
    <text height="22" width="40" x="33" y="36">
        <tspan>Vagal</tspan>
        <tspan dy="1em" x="33">manoeuvre</tspan>
        <tspan dy="1em" x="33">(if no delays)</tspan>
    </text>

    <path id="iv-choice" d="M 1,82 33,58 65,82 33,106 Z"></path>
    <text height="22" width="40" x="33" y="78">
        <tspan>IV access + draw</tspan>
        <tspan dy="1em" x="33">up adenosine quicker than</tspan>
        <tspan dy="1em" x="33">obtaining defibrillator?</tspan>
    </text>    
    
    <rect y="123" x="13" height="20" width="40"></rect>
    <text height="22" width="40" x="33" y="132">
        <tspan>Synchronous</tspan>
        <tspan dy="1em" x="33">DC shock {{shock1}}J</tspan>
    </text>    
    
    <rect y="154" x="13" height="20" width="40"></rect>
    <text height="22" width="40" x="33" y="163">
        <tspan>Synchronous</tspan>
        <tspan dy="1em" x="33">DC shock {{shock2}}J</tspan>
    </text>    

    <path marker-end="url(#arrow)" d="M 33,51 v 7"></path>
    <path marker-end="url(#arrow)" d="m 65,82 h 59.5"></path>
    <path marker-end="url(#arrow)" d="M 33,106 33,123"></path>
    <path marker-end="url(#arrow)" d="m 33,143 v 10.5"></path>
    <path marker-end="url(#arrow)" d="m 144,51 v 19.5"></path>
    <path marker-end="url(#arrow)" d="M 144,84 v 14.5"></path>
    <path marker-end="url(#arrow)" d="m 144,112 v 14.5"></path>
    <path marker-end="url(#arrow)" d="m 144,140 v 13.5"></path>
    <path id="shock-revert" marker-end="url(#arrow)" d="M 33,174 v 6 h -26 v -31 h 22"></path>
    
    <rect class="flow-text" y="19" x="45" width="10" height="6"></rect>
    <text class="flow-text" width="20" height="12" x="50" y="23.5">
        Yes
    </text>
    <rect class="flow-text" y="19" x="125" width="10" height="6"></rect>
    <text class="flow-text" height="12" width="20" y="23.5" x="130">
        No
    </text>
    <rect class="flow-text" y="79" x="89" width="10" height="6"></rect>
    <text class="flow-text" height="12" width="20" x="94" y="83.5">
        Yes
    </text>
    <rect class="flow-text" width="10" height="6" x="28" y="111.5"></rect>
    <text class="flow-text" height="12" width="20" y="116" x="33">
        No
    </text>
    
    <rect class="flow-text" x="134" y="89" height="5.5" width="20"></rect>
    <text class="wait" height="12" width="20" y="93" x="144">
        2 minutes
    </text>
    <rect class="flow-text" x="134" width="20" height="5.5" y="117"></rect>
    <text class="wait" height="12" width="20" y="121" x="144">
        2 minutes
    </text>
    
    <rect height="4.5" width="40.5" class="flow-text" y="177.5" x="12.5"></rect>
    <text class="wait" x="32.5" y="181.4">
        <tspan>Consider amiodarone</tspan><tspan>*</tspan>
    </text>
</g>
<g id="legend">
    <rect  x="13" height="63" y="187" width="183"></rect>
    <circle cx="21" cy="197" r="1px"></circle>
    <circle cx="21" cy="202.5" r="1px"></circle>
    <text  x="16" class="list" y="193"><tspan >†</tspan>
        <tspan  class="drug" >Adenosine</tspan>
        <tspan  class="push" x="24" dy="1.1em">rapid flush with {{flushVol}} ml 0.9% saline</tspan>
        <tspan class="amp-describe"  x="24" dy="1.1em">Ampule is {{ampDescription}}</tspan>
    </text>
    <text class="list small" x="124" y="192">Dose is calculated as:</text>
    <text class="list small" v-for="(d, indx) in initialAdenosines" :key="d.dosePerKg" x="124" :y="196+indx*5" >
        <tspan>{{indx + 1}})</tspan>
        <tspan dx="0.4em" class="dosing-calc" >{{d.dosePerKg}} mg/kg (max {{d.doseMax}} mg)</tspan>
    </text>
    <line x1="13" x2="196" y1="208.5" y2="208.5" class="legend-divide"></line>
    <text x="16" y="214" class="list">
        <tspan >*</tspan><tspan class="drug">Amiodarone</tspan>
    </text>
    <circle cx="21" cy="218" r="0.75px"></circle>
    <circle cx="21" cy="222.7" r="0.75px"></circle>
    <text x="23" y="219" class="list amio">
        For central line dosing (preferable if available) please see:
    </text>
    <a href="/Cardiology">
        <text x="127" y="219" class="list amio">
            https://paediatricdrugs.net/Cardiology
        </text>
    </a>
	<circle class="make" cx="24" cy="227.5" r="0.5px"></circle>
    <circle class="make" cx="24" cy="232.2" r="0.5px"></circle>
	<circle class="make" cx="24" cy="237" r="0.5px"></circle>
    <circle class="make" cx="24" cy="242" r="0.5px"></circle>
    <text x="23" y="224" class="list amio" v-if="pivAmio">
        <tspan>Peripheral IV line concentration </tspan>
        <tspan class="em">(caution to avoid extravasation/tissuing)</tspan>
        <tspan>:</tspan>
        <tspan x="27" dy="1.2em">Ampule is {{amioConc.concentration * amioConc.volume}} mg/{{amioConc.volume}} mL</tspan>
        <tspan x="27" dy="1.2em">dilute </tspan>
        <tspan>
            {{pivAmio.concentrations[0].drawingUpDose / amioConc.concentration}} mL
        </tspan>
        <tspan class="small">
            ({{ pivAmio.concentrations[0].drawingUpDose }} mg)
        </tspan>
        <tspan>
            of amiodarone to a total volume of {{ pivAmio.concentrations[0].finalVolume }} mL
        </tspan>
        <tspan>
            with {{ pivAmio.diluent }}
        </tspan>
        <tspan x="27" dy="1.2em">1 mL/hour = </tspan>
        <tspan>
            {{pivAmio.concentrations[0].oneMlHrDose | roundToFixed}} {{pivAmio.rateUnit.toShortUserSafeString()}}
        </tspan>
        <tspan x="27" dy="1.2em">infuse at {{ (25 / pivAmio.concentrations[0].oneMlHrDose) | roundToFixed }} mL/hour for 4 hours (25 {{ pivAmio.rateUnit.toShortUserSafeString() }})</tspan>
        <tspan x="27" dy="1.2em">- then decrease rate to {{pivAmio.concentrations[0].flowRange.toString()}} mL/hour ({{ pivAmio.doseRange.toString() }} {{ pivAmio.rateUnit.toShortUserSafeString() }})</tspan>
    </text>
</g>
</svg>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Watch, Inject } from 'vue-property-decorator';
import { getAdenosineDoses, IDoseInfo, ampuleDescription } from '@/services/infusion-calculations/Transformations/Calculations/adenosine';
// import { NumericRange } from '@/services/infusion-calculations/Utilities/NumericRange';
import { IDrugDB, IEntityInfusion, IEntityVariableInfusionDrug, IEntityDrugAmpuleConcentration } from '@/services/drugDb';
import { getVariableInfusionsForPt, transformVariableInfusions, IVariableInfusionDrugVM } from '@/services/infusion-calculations';
import { roundToFixed } from '@/services/infusion-calculations/Utilities/rounding';

type vueNumber = number | '';

@Component({ filters: { roundToFixed } })
export default class SvtSvg extends Vue {
    @Prop({default: ''})
    public wtKg!: vueNumber;

    public adenosineDoses: IDoseInfo[] = [];
    public ampDescription = ampuleDescription;
    // public cvlAmio: IVariableInfusionDrugVM | null = null;
    public pivAmio: IVariableInfusionDrugVM | null = null;
    public amioConc: IEntityDrugAmpuleConcentration | null = null;

    @Inject('db')
    private db!: IDrugDB;
    // private cvlAmioDbData!: PromiseLike<IEntityInfusion | undefined>;
    private pivAmioDbData!: PromiseLike<IEntityInfusion | undefined>;

    public created() {
        this.updateAdenosine();
        // this.cvlAmioDbData = this.db.infusionDrugs.get(44);
        this.pivAmioDbData = this.db.infusionDrugs.get(45);
    }

    public get initialAdenosines() {
        return this.adenosineDoses.slice(0, 3);
    }
    public get finalAdenosine() {
        return {
            dose: this.adenosineDoses[3].dose + '–' + this.adenosineDoses[4].dose,
            ampuleMl: this.adenosineDoses[3].ampuleMl + '–' + this.adenosineDoses[4].ampuleMl,
        };
    }

    public get shock1() {
        if (!this.wtKg) {
            return 0;
        }
        return this.wtKg >= 50
            ? 50
            : Math.round(this.wtKg);
    }

    public get shock2() {
        if (!this.wtKg) {
            return 0;
        }
        return this.wtKg >= 50
            ? 100
            : Math.round(this.wtKg * 2);
    }

    public get flushVol() {
        if (!this.wtKg) {
            return '';
        }
        if (this.wtKg < 3) {
            return 5;
        }
        if (this.wtKg < 20) {
            return 10;
        }
        return 20;
    }

    @Watch('wtKg')
    public updateAdenosine() {
        this.adenosineDoses = getAdenosineDoses(this.wtKg || 0);
        this.getAmio();
    }

    private async getAmio() {
        if (this.wtKg) {
            const infusions = await Promise.all([/* this.cvlAmioDbData,*/ this.pivAmioDbData ]) as any as IEntityVariableInfusionDrug[];
            // note 600 = age months - this is not actually relevant for our current amiodarone protocols
            const wtSelectedInfusions = getVariableInfusionsForPt(infusions, 600, this.wtKg);
            const transformed = transformVariableInfusions(this.wtKg, wtSelectedInfusions, false);
            // this.cvlAmio = transformed[0];
            this.pivAmio = transformed[0];
            if (!this.amioConc) {
                this.amioConc = infusions[0].drugAmpuleConcentrations[0];
            }
        }
    }
}
</script>
<style scoped>
    /* <![CDATA[ */
    @namespace svg url(http://www.w3.org/2000/svg);
    rect {
        fill-opacity: 1;
        fill: #fff;
        stroke-width: 0.1;
        stroke-opacity: 1;
        stroke: #000;
    }
    text {
        font-size: 5px;
        font-style: normal;
        font-weight: normal;
        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
        letter-spacing: 0;
        word-spacing: 0;
        writing-mode: lr-tb;
        text-anchor: middle;
    }
    text.list {
        text-anchor: start;
        text-align: left;
    }
    line, path {
        stroke-width: 0.2;
        stroke: #fb3199;
    }
    path {
        fill: none;
    }
    .amio {
        font-size: 4px;
    }
    .small {
        font-size: 4px;
        fill: #444;
    }
    .amio .small {
        font-size: 3px;
    }
    .ref {
        font-size: 2px;
    }
    .wait {
        font-size: 4px;
        fill: indigo;
        font-style: italic;
    }
    .flow-text {
        fill: #fff;
        stroke: DarkRed;
        stroke-width: 0.2;
    }

    .legend-divide {
        stroke: #777;
        stroke-dasharray: 0.5 1;
    }
    .em {
        font-style: italic;
    }
	.make  {
		stroke-width: 0.2;
		fill: none;
		stroke: #000;
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

