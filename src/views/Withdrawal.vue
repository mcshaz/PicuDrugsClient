<template>
  <div>
    <h2>Withdrawal Charting</h2>
    <b-row align-h="end" class="d-print-none">
      <b-col lg="7" order-lg="12" role="tablist">
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block href="#" v-b-toggle.opiod-benzo-wean variant="info">Opiods &amp; benzodiazepine weaning protocol
              <small class="when-closed">(click to open)</small>
            </b-button>
          </b-card-header>
          <b-collapse id="opiod-benzo-wean" v-model="opiodBenzoVis" accordion="weaning-info" role="tabpanel" @shown="notifyShown">
            <b-card-body>
              <h5>The <a href="https://www.starship.org.nz/guidelines/weaning-of-opioids-and-benzodiazepines/">full weaning protocol</a> is available on the Starship website</h5>
              <p class="card-text">Generally, weaning from opiods &amp; benzodiazepines is done over:</p>
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
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block href="#" v-b-toggle.clonidine-wean variant="info">Clonidine weaning protocol
              <small class="when-closed">(click to open)</small>
            </b-button>
          </b-card-header>
          <b-collapse id="clonidine-wean" v-model="clonidineVis" accordion="weaning-info" role="tabpanel" @shown="notifyShown">
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
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.PICU-total-vol variant="info">Finding the 24 hours infusion volume on a PICU chart
              <small class="when-closed">(click to open)</small>
            </b-button>
          </b-card-header>
          <b-collapse id="PICU-total-vol" accordion="weaning-info" role="tabpanel" v-model="picuVolVis" @shown="notifyShown">
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
                It is important to use the <strong>total volume infused</strong>,
                as this includes any boluses the patient has received, plus accounts for any change in infusion rate during the 24 hours.
              </p>
            </b-card-body>
            <img src="/img/example-vol-PICU.jpg" img-alt="Example PICU observation chart" class="card-img-bottom">
          </b-collapse>
        </b-card>
      </b-col>
      <validation-observer v-slot="{ invalid, handleSubmit }" slim>
        <form class="col-lg-5 order-lg-1" novalidate autocomplete="off" @submit.prevent="handleSubmit(createPDF)" @reset.prevent="clearAll">
          <b-form-group label="Patient details" label-cols-xl="3" id="patient-details" label-size="lg">
            <validated-input-group label="Name" label-cols-lg="2" label-align-lg="right" type="text" v-model="ptName"
              placeholder="Patient Name" trim/>
            <nhi-input v-model="nhi" label-cols-lg="2"/>
            <patient-age-data v-model="age" label-cols-lg="2"/>
            <age-validated-weight :require-age="true" v-model="wtKg" :age="age"/>
          </b-form-group><!--/patient-details-->
          <hr>
          <b-form-group  label-cols-xl="3" id="original-Rx" label-size="lg">
            <template #label>
              Original pain/sedative <font-awesome-icon icon="prescription"/>
            </template>
            <validated-select-group label="Medication" v-model="originalDrugName" required>
              <option value="" disabled>Please select …</option>
              <optgroup v-for="gp in ddOpts" :key="gp[0]" :label="gp[0]">
                <option v-for="wd in gp[1]" :key="wd.name" :value="wd.name">{{wd.name}}</option>
              </optgroup>
            </validated-select-group>
            <validated-input-select-group name="original-conc-details" error-label="Original Concentration" select-error-label="[concentration] UNITS"
                :prepend="isPatch?originalConcUnits.units:void 0" type="number" v-model="originalConcVal" ref="originalConcVal"
                :step="originalConcUnits?originalConcUnits.min:1" required :min="originalConcLimits[0]" :max="originalConcLimits[1]"
                :select-disabled="concentrations.length===1" :select-value.sync="originalConcUnits" select-name="unit-select"
                v-if="isDailyDrugRequired">
              <template #label>
                {{concLabel.label}} <strong class="text-warning" v-if="hasDifferentDefaults">*</strong>
              </template>
              <template v-if="!isPatch">
                <option value="" disabled>…</option>
                <option v-for="conc in concentrations" :key="conc.units" :value="conc">{{conc.units}}</option>
              </template>
              <template #description v-if="hasDifferentDefaults">
                <strong class="text-warning">*</strong> Please note different PICU vs PCA/NCA protocols
              </template>
            </validated-input-select-group>
            <validated-input-group label="last 24hrs" :description="`the ${original24HrUnits==='ml'?'volume':original24HrUnits} of ${originalDrugName} given in the last 24 hours`"
                label-for="vol" label-cols-sm="4" label-cols-md="3" label-align-sm="right" v-if="isDailyDrugRequired && !isPatch"
                :append="original24HrUnits" type="number" v-model="original24HrVol">
              <template #description v-if="original24HrUnits==='ml'">
                where do I <a href="#PICU-total-vol" @click.prevent="openThenNav($event.target, picuVolVis=true)">find the volume given…</a>?
              </template>
            </validated-input-group>
          </b-form-group><!--/original prescription-->
          <hr>
          <div class="alert alert-primary" role="alert" v-if="original24HrCalc.dose && !isChloral">
            This equates to a total {{originalDrug.name}} dose of <output>{{original24HrCalc.dose}} {{original24HrCalc.units}}</output>/<strong>day</strong>
          </div>
          <b-form-group label="Weaning plan" label-cols-xl="3" id="weaning-med" label-size="lg">
            <validated-select-group name="weaning-med" label="Oral" v-model="weaningDrug">
              <template>
                <option value="" disabled>Please select …</option>
                <option v-for="(fn, key) in conversionDrugs" :key="key" :value="key">{{key}}</option>
              </template>
            </validated-select-group>
            <validated-bool-radio-group label="Wean Duration" v-model="rapidClonidineWean" v-if="isClonidine"
                true-label="rapid" false-label="slower">
              <template #description>
                how do I <a href="#clonidine-wean" @click.prevent="openThenNav($event.target, clonidineVis=true)">determine the clonidine wean duration…</a>?
              </template>
            </validated-bool-radio-group>
            <template v-else>
              <validated-input-group label="Wean over" rules="integer" append="days" type="number" step="1" v-model="weanDuration"
                  required min="2" max="41">
                <template #description>
                  how do I <a href="#opiod-benzo-wean" @click.prevent="openThenNav($event.target, opiodBenzoVis=true)">determine the wean duration…</a>?
                </template>
              </validated-input-group>
              <validated-bool-radio-group label="Wean each" true-label="day" false-label="alternate day" v-model="weanDaily"/>
            </template>
          </b-form-group><!--Weaning plan-->
          <div class="alert alert-success" role="alert" v-if="totalWeaning24Hrs">
            This equates to a total <strong>daily</strong> <em> starting</em> enteral {{ weaningDrug }} dose of
            <span class="nobr"><output>{{ totalWeaning24Hrs.dailyCommence }} {{ weaningDoseUnits }}</output>/<strong>day</strong></span>
            <small v-if="isWeaningDoseMax"> (this is the maximum dose)</small>
          </div>
          <hr>
          <validated-input-group label="Prescriber name" type="text" v-model="prescriber" placeholder="your name" autocomplete="name" required min="2"/>
          <hr>
          <button type="submit" class="btn btn-success mb-4 ml-2" :disabled="invalid"><font-awesome-icon icon="print"/> Create <font-awesome-icon icon="file-pdf"/></button>
          <button type="reset" class="btn btn-warning mb-4">Clear All <font-awesome-icon icon="eraser"/></button>
        </form>
      </validation-observer>
    </b-row>
  </div>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Watch } from 'vue-property-decorator';
import AgeValidatedWeight from '@/components/AgeValidatedWeight.vue';
import NHI from '@/components/NhiInput.vue';
import ValidatedInputSelectGroup from '@/components/formGroups/ValidatedInputSelectGroup.vue';
import { toGrouping } from '@/services/drugDb';
import { withdrawalDrugs, IConcInfo, adminRoute, numberOrFunc, IWeaningMed, extractUnits } from '@/services/pharmacokinetics/withdrawalInfo';
import { roundToPrecision, ChildAge } from '@/services/infusion-calculations/';
// import { minWeightRecord, maxWeightRecord } from '@/services/utilities/weightHelpers';
import { getViewportSize, bootstrapSizes } from '@/services/utilities/viewportSize';
import { BAlert } from 'bootstrap-vue';
import { linearWean, alternateWean, exponentialWean } from '@/services/pharmacokinetics/weaningRegimes';
import { WeanDay } from '@/services/pharmacokinetics/WeanDay';
import { createPDF } from '@/services/pdf-generation/create-filled-data-pdf-lib';

// import { regexDescribe } from '@/services/validation/regexDescribe';
// import jsPDF from 'jspdf';
// import { pdfTemplate } from '@/services/utilities/pdfTemplate';
// import 'jspdf-autotable';
// import { BaseConfig, HTMLConfig } from 'jspdf-autotable';

type vueNumber = number | '';
const emptyObj = Object.freeze({});
const emptyArray = Object.freeze([]) as [];
const ddOpts = Object.freeze(Array.from(toGrouping(withdrawalDrugs, (d) => d.drugClass)));
interface IDoseUnits { dose?: number; units?: string }
const defaultConcLimits = Object.freeze({ min: 1, max: 1000 });

@Component({
  components: {
    AgeValidatedWeight,
    NHI,
    ValidatedInputSelectGroup,
    BAlert,
  },
})
export default class Withdrawal extends Vue {
  public prescriber = '';
  public wtKg: vueNumber = '';
  public ddOpts = ddOpts;
  public originalDrugName = '';
  public weanDuration: vueNumber = '';
  public original24HrVol: vueNumber = '';
  public weanDaily = true;
  public age: ChildAge | null = null;
  public ptName = '';
  public nhi = '';
  public opiodBenzoVis = getViewportSize() >= bootstrapSizes.lg;
  public clonidineVis = false;
  public picuVolVis = false;
  public rapidClonidineWean = false;

  public originalConcVal: vueNumber = '';
  public originalConcUnits: IConcInfo | null = null;
  public weaningDrug: (keyof IWeaningMed & string) | '' = '';

  // unwatched
  private navTarget!: HTMLElement | null;

  public get originalConcLimits() {
    if (this.originalConcUnits) {
      return [
        this.getNumber(this.originalConcUnits.min) || defaultConcLimits.min,
        this.getNumber(this.originalConcUnits.max) || defaultConcLimits.max];
    }
    return defaultConcLimits;
  }

  public get originalDrug() {
    if (!this.originalDrugName) { return; }
    return withdrawalDrugs.find((wd) => wd.name === this.originalDrugName);
  }

  public get concentrations() {
    return this.originalDrug ? this.originalDrug.concentrations : emptyArray;
  }

  public get conversionDrugs() {
    return this.originalDrug ? this.originalDrug.conversion : emptyObj;
  }

  public get concLabel() {
    if (this.isPatch) {
      return { label: 'Patch strength:', description: 'strength' };
    }
    if (this.originalDrug && this.originalDrug.adminRoute === adminRoute.boluses) {
      return { label: 'Single dose:', description: 'dose' };
    }
    return { label: '1 ml/hr =', description: 'concentration' };
  }

  public get hasDifferentDefaults() {
    return !!(this.originalConcUnits && this.originalConcUnits.default);
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

  public get original24HrUnits() {
    if (this.originalDrug && this.originalDrug.adminRoute === adminRoute.boluses) {
      return 'doses';
    }
    return 'ml';
  }

  public get original24HrCalc(): IDoseUnits {
    if (this.originalConcUnits && this.originalConcVal && this.originalConcVal > 0) {
      if (this.originalConcUnits.units === 'TTS') {
        const dose = this.originalConcVal * 100;
        return {
          dose,
          units: extractUnits(this.originalConcUnits.units),
        };
      } else if (this.original24HrVol) {
        let multiplier = this.originalConcUnits.units.endsWith('/min') ? 60 : 1; // 1 assigned per hour & per dose
        if (this.originalConcUnits.units.includes('/kg')) {
          if (!this.wtKg || this.wtKg <= 0) {
            return emptyObj;
          }
          multiplier *= this.wtKg;
        }
        const returnVar = {
          dose: multiplier * this.originalConcVal * this.original24HrVol,
          units: extractUnits(this.originalConcUnits.units),
        } as IDoseUnits;
        if (returnVar.dose! > 3000 && returnVar.units === 'microg') {
          returnVar.dose = returnVar.dose! / 1000;
          returnVar.units = 'mg';
        }
        returnVar.dose = roundToPrecision(returnVar.dose!, 3);

        return returnVar;
      }
    }
    return emptyObj;
  }

  public get totalWeaning24Hrs() {
    if (this.originalDrug && this.weaningDrug && this.age !== null) {
      const lt1Year = this.age.years < 1;
      if (this.original24HrCalc.dose) {
        let dose = this.original24HrCalc.dose;
        if (this.weaningDrug === 'clonidine') {
          if (this.original24HrCalc.units === 'mg') {
            dose *= 1000;
          }
        } else if (this.original24HrCalc.units === 'microg') {
          dose /= 1000;
        }
        return this.originalDrug.conversion[this.weaningDrug]!(dose, lt1Year);
      } else if (this.wtKg && this.wtKg > 0 && !this.isDailyDrugRequired) {
        return this.originalDrug.conversion[this.weaningDrug]!(this.wtKg, lt1Year);
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
      ? { wtKg: this.wtKg, rapidWean: this.rapidClonidineWean }
      : null;
  }

  public get linearWeanInfo() {
    return !this.isClonidine && this.weaningDrug && this.weanDuration
      ? {
        weanOverDays: this.weanDuration,
        weanAlternateDays: !this.weanDaily,
      }
      : null;
  }

  @Watch('originalDrug')
  @Watch('wtKg')
  public setDefaultUnits() {
    if (this.originalDrug) {
      switch (this.originalDrug.concentrations.length) {
        case 1:
          this.originalConcUnits = this.originalDrug.concentrations[0];
          break;
        case 2:
          // change conc units to default if - a) have an invalid value b) are not dirty
          if (this.originalConcUnits && !this.originalDrug.concentrations.some((c) => c.units === this.originalConcUnits!.units)) {
            this.originalConcUnits = null;
          }
          if ((!this.originalConcUnits || !this.fieldTouched('[concentration] UNITS')) && this.wtKg) {
            this.originalConcUnits = this.originalDrug.concentrations[this.wtKg < 30 ? 0 : 1]!;
          }
      }
      if (this.originalConcUnits && (this.originalConcUnits.min === this.originalConcUnits.max || !this.fieldTouched('Original Concentration'))) {
        this.originalConcVal = this.getNumber(this.originalConcUnits.default, this.originalConcUnits.min) || '';
      }
      const convKeys = Object.keys(this.originalDrug.conversion);
      if (convKeys.length === 1) {
        this.weaningDrug = (convKeys[0] as (keyof IWeaningMed & string));
      } else if (this.weaningDrug && !this.originalDrug.conversion[this.weaningDrug]) {
        this.weaningDrug = '';
      }
    }
  }

  public clearAll() {
    this.wtKg = '';
    this.ddOpts = ddOpts;
    this.originalDrugName = '';
    this.weanDuration = '';
    this.original24HrVol = '';
    this.originalConcVal = '';
    this.originalConcUnits = null;
    this.weanDaily = true;
    this.nhi = '';
    this.age = null;
    this.ptName = '';
    this.weaningDrug = '';
    this.opiodBenzoVis = false;
    this.clonidineVis = false;
    this.picuVolVis = false;
    // Wait until the models are updated in the UI
    this.$nextTick((this.$refs.form as any).reset);
  }

  public async createPDF() {
    createPDF({
      name: this.ptName,
      nhi: this.nhi,
      weight: this.wtKg as number,
      medicine: this.weaningDrug,
      dob: this.age!.dob!,
      prescriber: this.prescriber,
      doseUnits: this.weaningDoseUnits,
      route: 'oral/NG',
      regime: this.createWeanInfo(),
    }, '/pdf/WeaningProtocol.pdf');
  }

  public createWeanInfo() {
    // :drug="weaningDrug" :start24-hr-dose="totalWeaning24Hrs.dailyCommence" :q-hourly="totalWeaning24Hrs.qH"
    // :linear-wean="linearWeanInfo" :clonidine-wean="clonidineWeanInfo" :doseUnit="weaningDoseUnits">
    if (!this.totalWeaning24Hrs) {
      throw new Error('validation problem - allowed to submit createPDF but not all data present');
    }
    let individualDose = this.totalWeaning24Hrs.dailyCommence * this.totalWeaning24Hrs.qH / 24;
    if (this.linearWeanInfo) {
      if (this.linearWeanInfo.weanAlternateDays) {
        return alternateWean(individualDose, this.linearWeanInfo.weanOverDays, this.totalWeaning24Hrs.qH);
      } else {
        return linearWean(individualDose, 1 / this.linearWeanInfo.weanOverDays, this.totalWeaning24Hrs.qH);
      }
    } else if (this.clonidineWeanInfo) {
      let returnVar: WeanDay[] = [];
      let startWeanDate: Date;
      if (!this.clonidineWeanInfo.rapidWean && individualDose > this.clonidineWeanInfo.wtKg) {
        returnVar = linearWean(individualDose, this.clonidineWeanInfo.wtKg / individualDose, this.totalWeaning24Hrs.qH, this.clonidineWeanInfo.wtKg);
        startWeanDate = new Date(returnVar[returnVar.length - 1].weanDate);
        startWeanDate.setDate(startWeanDate.getDate() + 1);
        individualDose = this.clonidineWeanInfo.wtKg;
      } else {
        startWeanDate = new Date();
      }
      return returnVar.concat(exponentialWean(individualDose, 0.5, 4, this.totalWeaning24Hrs.qH, startWeanDate));
    }
    throw new Error('linear and clonidine wean info both unavailable');
  }

  public openThenNav(target: HTMLAnchorElement) {
    let href = target.href;
    href = href.substring(href.indexOf('#') + 1);
    this.navTarget = document.getElementById(href);
    if (this.navTarget!.classList.contains('show')) {
      this.notifyShown();
    }
  }

  public notifyShown() {
    if (this.navTarget) {
      this.navTarget.parentElement!.scrollIntoView({ behavior: 'smooth' });
      this.navTarget = null;
    }
  }

  private getNumber(...vals: Array<numberOrFunc | undefined>) {
    for (const v of vals) {
      switch (typeof v) {
        case 'function':
          if (this.wtKg) {
            return v(this.wtKg);
          }
          break;
        case 'number':
          return v;
      }
    }
  }

  private fieldTouched(fieldName: string) {
    const field = (this.$refs.mainObserver as any).fields[fieldName];
    return field && field.touched;
  }
}

</script>
<style>
#entered-details {
  list-style: none;
  margin-bottom: 0;
}
#entered-details dl {
  padding-left: 1em;
}
#entered-details dd {
  padding-left: 1em;
}
.vol-eg {
  color: red;
}

:not(.collapsed) > .when-closed {
  display: none;
}
.nobr { white-space: nowrap; }
</style>
