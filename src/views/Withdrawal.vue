<template>
  <div class="withdrawal">
    <h2>Withdrawal Charting</h2>
    <b-row align-h="end">
      <b-col lg="7" order-lg="12" role="tablist">
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab" id="opiod-benzo-wean-header">
            <b-button block href="#" v-b-toggle.opiod-benzo-wean variant="info">Opiods &amp; benzodiazepine weaning protocol</b-button>
          </b-card-header>
          <b-collapse id="opiod-benzo-wean" v-model="opiodBenzoVis" accordion="weaning-info" role="tabpanel">
            <b-card-body>
              <h5>The <a href="https://www.starship.org.nz/guidelines/weaning-of-opioids-and-benzodiazepines/">full weaning protocol</a> is available on the Starship website</h5>
              <p class="card-text">Generally weaning from opiods &amp; benzodiazepines is done over:</p>
              <ul class="list-group">
                <li class="list-group-item list-group-item-success">10 days if on the original medication for > 10 days.</li>
                <li class="list-group-item list-group-item-dark">5 days if on original medication for 5–10 days <strong>and</strong> WAT-1 score ≥ 3 on 2 consecutive occasions.</li>
                <li class="list-group-item list-group-item-primary">No weaning or WAT-1 scoring if on the original medication for &lt; 5 days.</li>
                <li class="list-group-item list-group-item-warning">
                  Occasionally over 20–40 days, particularly if requiring > 2 rescue doses per day while following the 10 day withdrawal plan.
                  Seek the opinion of a clinician experienced in managing drug withdrawal.
                </li>
              </ul>
              <p class="card-text">
                Generally the dose reduction is daily. However in some withdrawal plans involving multiple medications, each medications is weaned on an alternate day.
                To achieve this, enter an even number for one medication and an odd number for the other
                <span class="text-muted">(for example wean oral morphine over 20 days and oral diazepam over 21 days).</span>
              </p>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab" id="clonidine-wean-header">
            <b-button block href="#" v-b-toggle.clonidine-wean variant="info">Clonidine weaning protocol</b-button>
          </b-card-header>
          <b-collapse id="clonidine-wean" v-model="clonidineVis" accordion="weaning-info" role="tabpanel">
            <b-card-body>
              <h5>The <a href="https://www.starship.org.nz/guidelines/weaning-of-opioids-and-benzodiazepines/">full weaning protocol</a> is available on the Starship website</h5>
              <p class="card-text">Generally weaning from clonidine follows the protocol:</p>
              <ul class="list-group">
                <li class="list-group-item list-group-item-success">
                  Less than 7 days and dose is ≤ 4 microgram/kg/day → Stop without weaning.
                </li>
                <li class="list-group-item list-group-item-dark">
                  Less than 7 days and dose is ≥ 4 microgram/kg/day → Reduce by 50% every 24 hrs for 3 days then cease.
                </li>
                <li class="list-group-item list-group-item-primary">
                  More than 7 days → Reduce by 1 microgram/kg/dose every 24 hrs until dose reaches 1 microgram/kg/dose.
                  Continue until other medicines being weaned are ceased, then reduce clonidine by 50% every 24hrs for 3 days, then cease.
                </li>
              </ul>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab" id="PICU-total-vol-header">
            <b-button block href="#" v-b-toggle.PICU-total-vol variant="info">Finding the 24 hours infusion volume on a PICU chart
              <small class="when-closed">(click to open)</small>
            </b-button>
          </b-card-header>
          <b-collapse id="PICU-total-vol" accordion="weaning-info" role="tabpanel" v-model="picuVolVis">
            <b-card-body>
              <p class="card-text>">
                The Starship PICU daily obs chart has a list of infusion dose rates (e.g. microg/kg/hr) and <em>below</em> this,
                a list containing the volume administered (in mL) of each infusion.
              </p>
              <p class="card-text">
                Each medication volume contains 2 rows – the final value recorded in the <em>bottom</em> of the 2 rows should be the number used
                <span class="text-muted">(<span class="vol-eg">52</span> in the chart below)</span>,
                as this value is independent of syringe changes.
              </p>
              <p class="card-text">
                It is important to use the <strong>total volume infused</strong>, as this includes any boluses the patient has received, plus accounts for any change in infusion rate during the 24 hours.
              </p>
            </b-card-body>
            <img src="/img/example-vol-PICU.jpg" img-alt="Example PICU observation chart" class="card-img-bottom">
          </b-collapse>
        </b-card>
      </b-col>
      <form class="col-lg-5 order-lg-1 was-validated" autocomplete="off">
        <b-form-group label="Patient details:" label-cols-xl="3" id="patient-details" label-size="lg">
          <b-form-group label-for="weight" label-cols-sm="4" label-cols-md="3" label="Weight:"
              :state="!wtErrMsg" :invalid-feedback="wtErrMsg" label-align-sm="right" >
            <b-input-group append="kg">
              <input class="form-control" name="weight:" v-model.number="wtKg" placeholder="Weight"
                  type="number" required
                  :min="minWt" :max="maxWt" step="0.1" />
            </b-input-group>
          </b-form-group>
          <true-false-radio required label="Age:" true-label="< 12 months old" false-label="≥ 1 year old" v-model="lt1Year" label-align-sm="right" label-cols-sm="4" label-cols-md="3"/>
        </b-form-group><!--/patient-details-->
        <hr>
        <b-form-group  label-cols-xl="3" id="original-Rx" label-size="lg">
          <template slot="label">
            Original pain/sedative <font-awesome-icon icon="prescription"/>:
          </template>
          <b-form-group label="Medication:" label-for="original-drug" label-cols-sm="4" label-cols-md="3" label-align-sm="right">
            <select required id="original-drug" v-model="originalDrug" class="custom-select">
              <option :value="defaultOriginalDrug" disabled>Please select …</option>
              <optgroup v-for="gp in ddOpts" :key="gp[0]" :label="gp[0]" >
                <option v-for="wd in gp[1]" :key="wd.name" :value="wd">{{wd.name}}</option>
              </optgroup>
            </select>
          </b-form-group>
          <b-form-group label-for="conc" label-cols-sm="4" label-cols-md="3" label-align-sm="right" v-if="isDailyDrugRequired">
            <template slot="label">
              {{concLabel}} <strong class="text-warning" v-if="hasDifferentDefaults">*</strong>
            </template>
            <b-input-group :prepend="isPatch?selectedConcUnits.units:void 0">
              <input type="number" v-model.number="originalConc" id="conc" :min="minConc"
                  :max="maxConc" :step="minConc" class="form-control" required>
              <div class="input-group-append">
                <select v-model="selectedConcUnits" id="unit-select" class="custom-select input-group-addon" v-if="!isPatch" required>
                  <option :value="defaultOriginalDrug" disabled>…</option>
                  <option v-for="conc in originalDrug.concentrations" :key="conc.units" :value="conc" >{{conc.units}}</option>
                </select>
              </div><!--/input-group-append-->
            </b-input-group>
            <template slot="description">
              <strong class="text-warning">*</strong> Please note different PICU vs. PCA/NCA concentrations.
            </template>
          </b-form-group>
          <b-form-group label="last 24hrs:" label-for="vol" label-cols-sm="4" label-cols-md="3" label-align-sm="right" v-if="isDailyDrugRequired && !isPatch">
            <b-input-group :append="original24HrUnits">
              <input type="number" required min="0" max="400" v-model.number="original24Hr" id="vol" class="form-control">
            </b-input-group>
            <template slot="description" v-if="original24HrUnits==='ml'">
              Total volume in last 24 hrs. <a href="#PICU-total-vol-header" @click="picuVolVis=true">Where do I find this?</a>
            </template>
          </b-form-group>
        </b-form-group><!--/original prescription-->
        <div class="alert alert-primary" role="alert" v-if="totalOriginal24Hr.dose && !this.isChloral">
          This equates to a total {{originalDrug.name}} dose of <output>{{totalOriginal24Hr.displayDose}} {{totalOriginal24Hr.units}}</output>/<strong>day</strong>
        </div>
        <hr>
        <b-form-group label="Weaning medication" label-cols-xl="3" id="weaning-med" label-size="lg">
          <b-form-group label="Oral:" label-for="weaning-drug" label-cols-sm="4" label-cols-md="3" label-align-sm="right">
            <select required id="weaning-drug" v-model="weaningDrug" class="custom-select">
              <option value="" disabled>Please select …</option>
              <option v-for="(fn, key) in originalDrug.conversion" :key="key" :value="key" >{{key}}</option>
            </select>
          </b-form-group>
          <b-form-group label-cols-sm="4" label-cols-md="3" label="Wean over:" label-for="wean-duration" label-align-sm="right" v-show="!isClonidine">
            <b-input-group append="days">
              <input type="number" required step="1" min="2" max="41" v-model.number="weanDuration" id="weanDuration" class="form-control">
            </b-input-group>
            <template slot="description">
              <a href="#opiod-benzo-wean-header" @click="protocolVis=true">How many days?</a>
            </template>
          </b-form-group>
          <true-false-radio label="Wean:" true-label="daily" false-label="alternate days" v-model="weanDaily" label-align-sm="right" label-cols-sm="4" label-cols-md="3"
              v-show="!isClonidine"/>
          <true-false-radio label="Wean duration:" true-label="rapid" false-label="slower" v-model="rapidClonidineWean" label-align-sm="right" label-cols-sm="4" label-cols-md="3"
              v-show="isClonidine">
              <template v-slot:description>
                <a href="#clonidine-wean-header" @click="clonidineVis=true">Where do I find this?</a>
              </template>
          </true-false-radio>
        </b-form-group><!--/weaning medication-->
        <div class="alert alert-success" role="alert" v-if="totalWeaning24Hrs">
          This equates to a total <strong>daily</strong> <em> starting</em> enteral {{weaningDrug}} dose of
          <span class="nobr"><output>{{totalWeaning24Hrs.dailyCommence}} {{weaningDoseUnits}}</output>/<strong>day</strong></span>
          <small v-if="isWeaningDoseMax"> (this is the maximum dose)</small>
        </div>
        <hr>
        <button type="reset" class="btn btn-warning" @click.prevent="clearAll()">Clear All <font-awesome-icon icon="eraser"/></button>
      </form>
    </b-row>
    <hr>
    <b-row>
      <b-col>
        <withdrawal-table :drug="weaningDrug" :start24-hr-dose="totalWeaning24Hrs.dailyCommence" :q-hourly="totalWeaning24Hrs.qH"
          :linear-wean="linearWeanInfo" :clonidine-wean="clonidineWeanInfo" v-if="totalWeaning24Hrs" :doseUnit="weaningDoseUnits" />
      </b-col>
    </b-row>
  </div>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';
// import PatientAgeWeightData from '@/components/PatientAgeWeightData.vue';
import WithdrawalTable from '@/components/WithdrawalTable.vue';
import TrueFalseRadio from '@/components/TrueFalseRadio.vue';
import { toGrouping } from '@/services/drugDb';
import { withdrawalDrugs, IDrug, IConcInfo, adminRoute, numberOrFunc, IWeaningMed, extractUnits } from '@/services/pharmacokinetics/withdrawalInfo';
import { roundToFixed, roundToPrecision } from '@/services/infusion-calculations/';
import { minWeightRecord, maxWeightRecord } from '@/services/utilities/weightHelpers';

type vueNumber = number | '';
const emptyObj = Object.freeze({});
const defaultOriginalDrug = { concentrations: Object.freeze([]), conversion: emptyObj } as IDrug;
const ddOpts = Object.freeze(Array.from(toGrouping(withdrawalDrugs, (d) => d.drugClass)));
interface IDoseUnits { dose?: number; units?: string; displayDose?: number; }

@Component({
  components: {
//    PatientAgeWeightData,
      WithdrawalTable,
      TrueFalseRadio,
  },
})
export default class Withdrawal extends Vue {
  public wtKg: vueNumber = '';
  public ddOpts = ddOpts;
  public defaultOriginalDrug = defaultOriginalDrug;
  public originalDrug = defaultOriginalDrug;
  public weanDuration: vueNumber = '';
  public original24Hr: vueNumber = '';
  public originalConc: vueNumber = '';
  public selectedConcUnits: IConcInfo | null = null;
  public weanDaily = true;
  public lt1Year: null | boolean = null;
  public weaningDrug: (keyof IWeaningMed & string) | '' = '';
  public opiodBenzoVis = true;
  public clonidineVis = false;
  public picuVolVis = false;
  public rapidClonidineWean = false;

  public get concLabel() {
    if (this.isPatch) {
      return 'Patch strength:';
    }
    if (this.originalDrug && this.originalDrug.adminRoute === adminRoute.boluses) {
      return 'Single dose:';
    }
    return '1 ml/hr =';
  }
  public get hasDifferentDefaults() {
    return !!(this.selectedConcUnits && this.selectedConcUnits.default);
  }
  public get isPatch() {
    return this.originalDrug && this.originalDrug.adminRoute === adminRoute.patch;
  }
  public get isDailyDrugRequired() {
    return !!(this.originalDrug && this.originalDrug.concentrations.length);
  }
  public get isClonidine() {
    return this.weaningDrug === 'clonidine';
  }
  public get isChloral() {
    return this.originalDrug && this.originalDrug.name === 'chloral hydrate';
  }
  public get minConc() {
    const def = 1;
    if (this.selectedConcUnits) {
      return this.getVal(this.selectedConcUnits.min) || def;
    }
    return def;
  }
  public get maxConc() {
    const def = 1000;
    if (this.selectedConcUnits) {
      return this.getVal(this.selectedConcUnits.max) || def;
    }
    return def;
  }
  public get original24HrUnits() {
    if (this.originalDrug && this.originalDrug.adminRoute === adminRoute.boluses) {
      return 'doses';
    }
    return 'ml';
  }
  public get totalOriginal24Hr(): IDoseUnits {
    if (this.selectedConcUnits && this.originalConc && this.originalConc > 0) {
      if (this.selectedConcUnits.units === 'TTS') {
        const dose = this.originalConc * 100;
        return {
          dose,
          displayDose: dose,
          units: extractUnits(this.selectedConcUnits.units),
        };
      } else if (this.original24Hr) {
        let multiplier = this.selectedConcUnits.units.endsWith('/min') ? 60 : 1; // 1 assigned per hour & per dose
        if (this.selectedConcUnits.units.includes('/kg')) {
          if (!this.wtKg || this.wtKg <= 0) {
            return emptyObj;
          }
          multiplier *= this.wtKg;
        }
        const returnVar = {
          dose: multiplier * this.originalConc * this.original24Hr,
          units: extractUnits(this.selectedConcUnits.units),
        } as IDoseUnits;
        if (returnVar.dose! > 3000 && returnVar.units === 'microg') {
          returnVar.displayDose = returnVar.dose! /= 1000;
          returnVar.units = 'mg';
        } else {
          returnVar.displayDose = returnVar.dose;
        }
        returnVar.displayDose = roundToPrecision(returnVar.displayDose!, 3);

        return returnVar;
      }
    }
    return emptyObj;
  }

  public get totalWeaning24Hrs() {
    if (this.originalDrug && this.weaningDrug && this.lt1Year !== null) {
      if (this.totalOriginal24Hr.dose) {
        return this.originalDrug.conversion[this.weaningDrug]!(this.totalOriginal24Hr.dose, this.lt1Year);
      } else if (this.wtKg && this.wtKg > 0 && !this.isDailyDrugRequired) {
        return this.originalDrug.conversion[this.weaningDrug]!(this.wtKg, this.lt1Year);
      }
    }
  }
  public get weaningDoseUnits() {
    if (!this.weaningDrug) { return ''; }
    return this.weaningDrug === 'clonidine' ? 'microg' : 'mg';
  }
  public get isWeaningDoseMax() {
    return this.totalWeaning24Hrs && this.totalWeaning24Hrs.dailyCommence === this.totalWeaning24Hrs.maxPerDay;
  }
  public get clonidineWeanInfo() {
    return this.isClonidine && this.wtKg
      ? { weightKg: this.wtKg, rapidWean: this.rapidClonidineWean }
      : null;
  }
  public get linearWeanInfo() {
    return !this.isClonidine && this.weaningDrug && this.weanDuration
      ? { weanOverDays: this.weanDuration,
          weanAlternateDays: !this.weanDaily }
      : null;
  }
  public get wtErrMsg() {
    if (this.wtKg === '') {
      return 'Weight is required';
    }
    if (this.wtKg < this.minWt || this.wtKg > this.maxWt) {
      return `weight must be between ${this.minWt} and ${this.maxWt} kg`;
    }
    return '';
  }
  public get minWt() {
    return roundToFixed(minWeightRecord(this.lt1Year === false ? 12 : 4), 1);
  }
  public get maxWt() {
    return Math.round(maxWeightRecord(this.lt1Year === true ? 12 : 216));
  }
  @Watch('originalDrug')
  @Watch('wtKg')
  public setDefaultUnits() {
    if (this.originalDrug) {
      switch (this.originalDrug.concentrations.length) {
        case 1:
          this.selectedConcUnits = this.originalDrug.concentrations[0];
          if (!this.originalConc) {
              this.originalConc = this.getVal(this.selectedConcUnits.default, this.selectedConcUnits.min) || '';
          }
          break;
        case 2:
          if (this.selectedConcUnits && !this.originalDrug.concentrations.some((c) => c.units === this.selectedConcUnits!.units)) {
            this.selectedConcUnits = null;
          }
          if (!this.originalConc && this.wtKg) {
            this.selectedConcUnits = this.originalDrug.concentrations[this.wtKg < 30 ? 0 : 1]!;
            if (!this.originalConc) {
              this.originalConc = this.getVal(this.selectedConcUnits.default, this.selectedConcUnits.min) || '';
            }
          }
      }
      const convKeys = Object.keys(this.originalDrug.conversion);
      if (convKeys.length === 1) {
        this.weaningDrug = (convKeys[0] as (keyof IWeaningMed & string));
      }
    } else {
      this.selectedConcUnits = null;
      this.weaningDrug = '';
    }
  }
  public clearAll() {
    this.wtKg = '';
    this.ddOpts = ddOpts;
    this.defaultOriginalDrug = defaultOriginalDrug;
    this.originalDrug = defaultOriginalDrug;
    this.weanDuration = '';
    this.original24Hr = '';
    this.originalConc = '';
    this.selectedConcUnits = null;
    this.weanDaily = true;
    this.lt1Year = null;
    this.weaningDrug = '';
    this.opiodBenzoVis = false;
    this.clonidineVis = false;
    this.picuVolVis = false;
  }
  private getVal(val?: numberOrFunc, val2?: numberOrFunc) {
    for (const v of arguments) {
      switch (typeof val) {
        case 'function':
          if (this.wtKg) {
            return val(this.wtKg);
          }
          break;
        case 'number':
          return val;
      }
    }
  }
}
</script>
<style>
.custom-select.input-group-addon {
	display: -ms-flexbox;
	display: -webkit-box;
	display: flex;
	-ms-flex-align: center;
	-webkit-box-align: center;
	align-items: center;
	margin-bottom: 0;
	color: #495057;
	text-align: center;
	white-space: nowrap;
	background-color: #e9ecef!important;
	border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.vol-eg {
  color: red;
}

:not(.collapsed) > .when-closed {
  display: none;
}
.nobr { white-space: nowrap; }
</style>
