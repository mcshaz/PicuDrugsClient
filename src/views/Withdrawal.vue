<template>
  <div id="withdrawal">
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
          <b-card-header header-tag="header" class="p-1" role="tab" >
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
          <b-card-header header-tag="header" class="p-1" role="tab" >
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
                It is important to use the <strong>total volume infused</strong>, as this includes any boluses the patient has received, plus accounts for any change in infusion rate during the 24 hours.
              </p>
            </b-card-body>
            <img src="/img/example-vol-PICU.jpg" img-alt="Example PICU observation chart" class="card-img-bottom">
          </b-collapse>
        </b-card>
      </b-col>
      <form class="col-lg-5 order-lg-1" novalidate autocomplete="off">
        <b-form-group label="Patient details" label-cols-xl="3" id="patient-details" label-size="lg">
          <b-form-group label-for="weight" label="Weight:" label-cols-sm="4" label-cols-md="3" label-align-sm="right" >
            <b-input-group append="kg">
              <input class="form-control" id="weight" v-model.number="$v.wtKg.$model" placeholder="Weight"
                  type="number" step="0.1" :class="getValidationClass($v.wtKg)"/>
            </b-input-group>
            <vuelidate-message :validator="$v.wtKg" label="weight" units="kg" />
          </b-form-group>
          <b-form-group label-for="age" label-cols-sm="4" label-cols-md="3" label="Age:" label-align-sm="right" >
            <true-false-radio label="Age:" true-label="< 12 months old" false-label="≥ 1 year old" :state="!$v.lt1Year.$invalid"
                v-model="$v.lt1Year.$model" name="age" >
            </true-false-radio>
            <vuelidate-message :validator="$v.lt1Year" label="age" isSelect/>
          </b-form-group>
        </b-form-group><!--/patient-details-->
        <hr>
        <b-form-group  label-cols-xl="3" id="original-Rx" label-size="lg" >
          <template slot="label">
            Original pain/sedative <font-awesome-icon icon="prescription"/>
          </template>
          <b-form-group label="Medication:" label-for="original-drug" label-cols-sm="4" label-cols-md="3" label-align-sm="right">
            <select  id="original-drug" v-model="$v.originalDrugName.$model" class="custom-select"
                :class="getValidationClass($v.originalDrugName)">
              <option value="" disabled>Please select …</option>
              <optgroup v-for="gp in ddOpts" :key="gp[0]" :label="gp[0]" >
                <option v-for="wd in gp[1]" :key="wd.name" :value="wd.name">{{wd.name}}</option>
              </optgroup>
            </select>
            <vuelidate-message isSelect :validator="$v.originalDrugName" label="the original medication"/>
          </b-form-group>
          <b-form-group label-for="conc" label-cols-sm="4" label-cols-md="3" label-align-sm="right" v-if="isDailyDrugRequired">
            <template slot="label">
              {{concLabel.label}} <strong class="text-warning" v-if="hasDifferentDefaults">*</strong>
            </template>
            <b-input-group :prepend="isPatch?originalConcUnits.units:void 0">
              <input type="number" v-model.number="$v.originalConc.$model" id="conc" :step="originalConcUnits?originalConcUnits.min:1"
                  class="form-control" :class="getValidationClass($v.originalConc)" :disabled="originalConcUnits&&originalConcUnits.min===originalConcUnits.max">
              <div class="input-group-append">
                <select v-model="$v.originalConcUnits.$model" id="unit-select" :class="getValidationClass($v.originalConcUnits)"
                    class="custom-select input-group-addon" v-if="!isPatch" :disabled="concentrations.length===1">
                  <option value="" disabled>…</option>
                  <option v-for="conc in concentrations" :key="conc.units" :value="conc" >{{conc.units}}</option>
                </select>
              </div><!--/input-group-append-->
            </b-input-group>
            <vuelidate-message :isSelect="!$v.originalConc.$invalid" :validator="$v.originalConc.$invalid?$v.originalConc:$v.originalConcUnits"
                :label="`the ${concLabel.description}${$v.originalConc.$invalid?'':' units'}`" :units="originalConcUnits?originalConcUnits.units:''"/>
            <template slot="description"  v-if="hasDifferentDefaults">
              <strong class="text-warning">*</strong> Please note different PICU vs. PCA/NCA concentrations.
            </template>
          </b-form-group>
          <b-form-group label="last 24hrs:" label-for="vol" label-cols-sm="4" label-cols-md="3" label-align-sm="right" v-if="isDailyDrugRequired && !isPatch">
            <b-input-group :append="original24HrUnits">
              <input type="number" v-model.number="$v.original24HrVol.$model" id="vol"
                  class="form-control" :class="getValidationClass($v.original24HrVol)">
            </b-input-group>
            <vuelidate-message :validator="$v.original24HrVol"
                :label="`the ${original24HrUnits==='ml'?'volume':original24HrUnits} of ${originalDrugName} given in the last 24 hours`"/>
            <template slot="description" v-if="original24HrUnits==='ml'">
              where do I <a href="#PICU-total-vol" @click.prevent="openThenNav($event.target, picuVolVis=true)">find the volume given…</a>?
            </template>
          </b-form-group>
        </b-form-group><!--/original prescription-->
        <hr>
        <div class="alert alert-primary" role="alert" v-if="original24HrCalc.dose && !this.isChloral">
          This equates to a total {{originalDrug.name}} dose of <output>{{original24HrCalc.dose}} {{original24HrCalc.units}}</output>/<strong>day</strong>
        </div>
        <b-form-group label="Weaning medication" label-cols-xl="3" id="weaning-med" label-size="lg">
          <b-form-group label="Oral:" label-for="weaning-drug" label-cols-sm="4" label-cols-md="3" label-align-sm="right">
            <select required id="weaning-drug" v-model="$v.weaningDrug.$model" class="custom-select"
                :class="getValidationClass($v.weaningDrug)">
              <option value="" disabled>Please select …</option>
              <option v-for="(fn, key) in conversionDrugs" :key="key" :value="key" >{{key}}</option>
            </select>
            <vuelidate-message isSelect :validator="$v.weaningDrug" label="the weaning medication"/>
          </b-form-group>
          <b-form-group label-cols-sm="4" label-cols-md="3" label="Wean over:" label-for="wean-duration" label-align-sm="right" v-show="!isClonidine">
            <b-input-group append="days">
              <input type="number" step="1" v-model.number="$v.weanDuration.$model"
                  id="weanDuration" class="form-control" :class="getValidationClass($v.weanDuration)">
            </b-input-group>
            <vuelidate-message :validator="$v.weanDuration" label="weaning duration" units="days"/>
            <template #description>
              how do I <a href="#opiod-benzo-wean" @click.prevent="openThenNav($event.target, opiodBenzoVis=true)">determine the wean duration…</a>?
            </template>
          </b-form-group>
          <b-form-group label-cols-sm="4" label-cols-md="3" label="Wean over:" label-for="wean-duration" label-align-sm="right" >
            <true-false-radio label="Wean duration:" true-label="rapid" false-label="slower" v-model="rapidClonidineWean"
                v-if="isClonidine">
            </true-false-radio>
            <true-false-radio label="Wean:" true-label="daily" false-label="alternate days" v-model="weanDaily"
                v-else />
            <template #description v-if="isClonidine">
              how do I <a href="#clonidine-wean" @click.prevent="openThenNav($event.target, clonidineVis=true)">determine the clonidine wean duration…</a>?
            </template>
          </b-form-group>
        </b-form-group><!--/weaning medication-->
        <div class="alert alert-success" role="alert" v-if="totalWeaning24Hrs">
          This equates to a total <strong>daily</strong> <em> starting</em> enteral {{weaningDrug}} dose of
          <span class="nobr"><output>{{totalWeaning24Hrs.dailyCommence}} {{weaningDoseUnits}}</output>/<strong>day</strong></span>
          <small v-if="isWeaningDoseMax"> (this is the maximum dose)</small>
        </div>
        <hr>
        <b-form-group label="Prescriber name" label-cols-xl="3" label-for="prescriber-name">
          <input class="form-control" id="prescriber-name" v-model="$v.prescriber.$model" placeholder="your name"
                  type="text" :class="getValidationClass($v.prescriber)" autocomplete="name"/>
          <vuelidate-message :validator="$v.prescriber" label="your name" />
        </b-form-group>
        <hr>
        <button type="reset" class="btn btn-warning mb-4" @click.prevent="clearAll()">Clear All <font-awesome-icon icon="eraser"/></button>
        <button type="button" class="btn btn-success mb-4 ml-2" :disabled="$v.invalid" @click.passive="$refs.plan.createPDF()"><font-awesome-icon icon="print"/> Print <font-awesome-icon icon="file-pdf"/></button>
      </form>
    </b-row>
    <b-row>
      <b-col>
        <b-alert v-model="$v.$invalid" variant="dark">
          The withdrawal plan will appear here after all the information in the form above is filled in and valid.
        </b-alert>
        <withdrawal-table v-if="!$v.$invalid" ref="plan"
            :drug="weaningDrug" :start24-hr-dose="totalWeaning24Hrs.dailyCommence" :q-hourly="totalWeaning24Hrs.qH"
            :linear-wean="linearWeanInfo" :clonidine-wean="clonidineWeanInfo" :doseUnit="weaningDoseUnits" >
          <ul class="row" id="entered-details">
            <li class="col-md-4">
              <h5>Details:</h5>
              <dl>
                <dt>weight</dt>
                  <dd>{{wtKg}} kg</dd>
                <dt>age group</dt>
                  <dd v-if='lt1Year'>
                    &lt; 12 months
                  <dd v-else>
                    ≥ 1 year old
                  </dd>
                  <dt>data entered by</dt>
                    <dd>{{prescriber}}</dd>
              </dl>
            </li>
            <li class="col-md-4"><h5>Original medication:</h5>
              <dl>
                <dt>drug</dt>
                  <dd>{{originalDrugName}}</dd>
                <dt>{{concLabel.label}}</dt>
                  <dd class="units" v-if="isPatch">
                    {{originalConcUnits.units}} {{originalConc}}
                  </dd>
                  <dd class="units" v-else>
                    {{originalConc}} {{originalConcUnits.units}}
                  </dd>
                  <template v-if="isDailyDrugRequired">
                    <dt>per 24 hours</dt>
                    <dd>{{original24HrVol}} {{original24HrUnits}}</dd>
                  </template>
              </dl>
            </li>
            <li class="col-md-4"><h5>Weaning medication:</h5>
              <dl>
                <dt>drug</dt>
                  <dd>{{weaningDrug}}</dd>
                <dt>weaning duration</dt>
                  <dd v-if="isClonidine">
                    <span v-if="rapidClonidineWean">rapid</span>
                    <span v-else>slow</span>
                  </dd>
                  <dd v-else>{{weanDuration}} days
                    <span class="text-muted" v-if="!weanDaily">(alternate day)</span>
                  </dd>
              </dl>
            </li>
          </ul>
        </withdrawal-table >
      </b-col>
    </b-row>
  </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator'
// import PatientAgeWeightData from '@/components/PatientAgeWeightData.vue';
import WithdrawalTable from '@/components/WithdrawalTable.vue'
import TrueFalseRadio from '@/components/TrueFalseRadio.vue'
import VuelidateMessage from '@/components/VuelidateMessage.vue'
import { toGrouping } from '@/services/drugDb'
import { withdrawalDrugs, IDrug, IConcInfo, adminRoute, numberOrFunc, IWeaningMed, extractUnits } from '@/services/pharmacokinetics/withdrawalInfo'
import { roundToFixed, roundToPrecision } from '@/services/infusion-calculations/'
import { minWeightRecord, maxWeightRecord } from '@/services/utilities/weightHelpers'
import { getViewportSize, bootstrapSizes } from '@/services/utilities/viewportSize'
import { Validations } from 'vuelidate-property-decorators'
import vue from 'vuelidate/vue'
import { required, between, requiredIf, integer, minLength, ValidationRule } from 'vuelidate/lib/validators'
import { Validation, validationMixin } from 'vuelidate'
import { LeaveDirtyState } from '@/services/validation/LeaveDirtyState'
// import { regexDescribe } from '@/services/validation/regexDescribe';
// import jsPDF from 'jspdf';
// import { pdfTemplate } from '@/services/utilities/pdfTemplate';
// import 'jspdf-autotable';
// import { BaseConfig, HTMLConfig } from 'jspdf-autotable';

type vueNumber = number | '';
const emptyObj = Object.freeze({})
const emptyArray = Object.freeze([]) as []
const ddOpts = Object.freeze(Array.from(toGrouping(withdrawalDrugs, (d) => d.drugClass)))
interface IDoseUnits { dose?: number; units?: string; }
const defaultConcLimits = [1, 1000]

@Component({
  components: {
    //    PatientAgeWeightData,
    WithdrawalTable,
    TrueFalseRadio,
    VuelidateMessage
  },
  mixins: [ validationMixin ]
})
export default class Withdrawal extends Vue {
  public prescriber = '';
  public wtKg: vueNumber = '';
  public ddOpts = ddOpts;
  public originalDrugName = '';
  public weanDuration: vueNumber = '';
  public original24HrVol: vueNumber = '';
  public originalConc: vueNumber = '';
  public originalConcUnits: IConcInfo | null = null;
  public weanDaily = true;
  public lt1Year: null | boolean = null;
  public weaningDrug: (keyof IWeaningMed & string) | '' = '';
  public opiodBenzoVis = getViewportSize() >= bootstrapSizes.lg ;
  public clonidineVis = false;
  public picuVolVis = false;
  public rapidClonidineWean = false;
  private navTarget!: HTMLElement | null;

  private validations!: any;
  public created () {
    const requiredIfDaily = { required: requiredIf('isDailyDrugRequired') }
    const simpleRequired = { required }
    this.validations = {
      prescriber: Object.assign({ minLength: minLength(2) }, simpleRequired as any),
      wtKg: Object.assign({ between: between(1, 200) }, simpleRequired as any), // between
      lt1Year: simpleRequired,
      originalDrugName: simpleRequired,
      // originalConc between
      originalConc: Object.assign({}, requiredIfDaily as any),
      originalConcUnits: requiredIfDaily,
      original24HrVol: { required: requiredIf((vm: Withdrawal) => vm.isDailyDrugRequired && !vm.isPatch) },
      weaningDrug: simpleRequired,
      weanDuration: { required, between: between(2, 41), integer }
    }
  }
  @Validations()
  public getValidations () {
    let min: number | undefined
    let max: number | undefined
    if (this.originalConcUnits) {
      min = this.getVal(this.originalConcUnits.min)
      max = this.getVal(this.originalConcUnits.max)
    }
    this.validations.originalConc.between = between(min || defaultConcLimits[0], max || defaultConcLimits[1])
    return this.validations
  }

  public get originalDrug () {
    if (!this.originalDrugName) { return }
    return withdrawalDrugs.find((wd) => wd.name === this.originalDrugName)
  }
  public get concentrations () {
    return this.originalDrug ? this.originalDrug.concentrations : emptyArray
  }
  public get conversionDrugs () {
    return this.originalDrug ? this.originalDrug.conversion : emptyObj
  }
  public get concLabel () {
    if (this.isPatch) {
      return { label: 'Patch strength:', description: 'strength' }
    }
    if (this.originalDrug && this.originalDrug.adminRoute === adminRoute.boluses) {
      return { label: 'Single dose:', description: 'dose' }
    }
    return { label: '1 ml/hr =', description: 'concentration' }
  }
  public get hasDifferentDefaults () {
    return !!(this.originalConcUnits && this.originalConcUnits.default)
  }
  public get isPatch () {
    return this.originalDrug && this.originalDrug.adminRoute === adminRoute.patch
  }
  public get isDailyDrugRequired () {
    return !!(this.originalDrug && this.originalDrug.concentrations.length)
  }
  public get isClonidine () {
    return this.weaningDrug === 'clonidine'
  }
  public get isChloral () {
    return this.originalDrug && this.originalDrug.name === 'chloral hydrate'
  }

  public get original24HrUnits () {
    if (this.originalDrug && this.originalDrug.adminRoute === adminRoute.boluses) {
      return 'doses'
    }
    return 'ml'
  }
  public get original24HrCalc (): IDoseUnits {
    if (this.originalConcUnits && this.originalConc && this.originalConc > 0) {
      if (this.originalConcUnits.units === 'TTS') {
        const dose = this.originalConc * 100
        return {
          dose,
          units: extractUnits(this.originalConcUnits.units)
        }
      } else if (this.original24HrVol) {
        let multiplier = this.originalConcUnits.units.endsWith('/min') ? 60 : 1 // 1 assigned per hour & per dose
        if (this.originalConcUnits.units.includes('/kg')) {
          if (!this.wtKg || this.wtKg <= 0) {
            return emptyObj
          }
          multiplier *= this.wtKg
        }
        const returnVar = {
          dose: multiplier * this.originalConc * this.original24HrVol,
          units: extractUnits(this.originalConcUnits.units)
        } as IDoseUnits
        if (returnVar.dose! > 3000 && returnVar.units === 'microg') {
          returnVar.dose = returnVar.dose! / 1000
          returnVar.units = 'mg'
        }
        returnVar.dose = roundToPrecision(returnVar.dose!, 3)

        return returnVar
      }
    }
    return emptyObj
  }

  public get totalWeaning24Hrs () {
    if (this.originalDrug && this.weaningDrug && this.lt1Year !== null) {
      if (this.original24HrCalc.dose) {
        let dose = this.original24HrCalc.dose
        if (this.weaningDrug === 'clonidine') {
          if (this.original24HrCalc.units === 'mg') {
            dose *= 1000
          }
        } else if (this.original24HrCalc.units === 'microg') {
          dose /= 1000
        }
        return this.originalDrug.conversion[this.weaningDrug]!(dose, this.lt1Year)
      } else if (this.wtKg && this.wtKg > 0 && !this.isDailyDrugRequired) {
        return this.originalDrug.conversion[this.weaningDrug]!(this.wtKg, this.lt1Year)
      }
    }
  }
  public get weaningDoseUnits () {
    if (!this.weaningDrug) { return '' }
    return this.weaningDrug === 'clonidine' ? 'microg' : 'mg'
  }
  public get isWeaningDoseMax () {
    return this.totalWeaning24Hrs && this.totalWeaning24Hrs.dailyCommence === this.totalWeaning24Hrs.maxPerDay
  }
  public get clonidineWeanInfo () {
    return this.isClonidine && this.wtKg
      ? { weightKg: this.wtKg, rapidWean: this.rapidClonidineWean }
      : null
  }
  public get linearWeanInfo () {
    return !this.isClonidine && this.weaningDrug && this.weanDuration
      ? { weanOverDays: this.weanDuration,
        weanAlternateDays: !this.weanDaily }
      : null
  }
  @Watch('originalDrug')
  @Watch('wtKg')
  public setDefaultUnits () {
    if (this.originalDrug) {
      const leaveDirty = new LeaveDirtyState(this.$v.originalConc!, this.$v.originalConcUnits!, this.$v.weaningDrug!)
      switch (this.originalDrug.concentrations.length) {
        case 1:
          this.originalConcUnits = this.originalDrug.concentrations[0]
          break
        case 2:
          // change conc units to default if - a)have an invalid value b) are not dirty
          if (this.originalConcUnits && !this.originalDrug.concentrations.some((c) => c.units === this.originalConcUnits!.units)) {
            this.originalConcUnits = null
          }
          if ((!this.originalConcUnits || !this.$v.originalConcUnits!.$dirty) && this.wtKg) {
            this.originalConcUnits = this.originalDrug.concentrations[this.wtKg < 30 ? 0 : 1]!
          }
      }
      if (this.originalConcUnits && (this.originalConcUnits.min === this.originalConcUnits.max || !this.$v.originalConc!.$dirty)) {
        this.originalConc = this.getVal(this.originalConcUnits.default, this.originalConcUnits.min) || ''
      }
      const convKeys = Object.keys(this.originalDrug.conversion)
      if (convKeys.length === 1) {
        this.weaningDrug = (convKeys[0] as (keyof IWeaningMed & string))
      } else if (this.weaningDrug && !this.originalDrug.conversion[this.weaningDrug]) {
        this.weaningDrug = ''
      }
      leaveDirty.setValues()
    }
  }
  public clearAll () {
    this.wtKg = ''
    this.ddOpts = ddOpts
    this.originalDrugName = ''
    this.weanDuration = ''
    this.original24HrVol = ''
    this.originalConc = ''
    this.originalConcUnits = null
    this.weanDaily = true
    this.lt1Year = null
    this.weaningDrug = ''
    this.opiodBenzoVis = false
    this.clonidineVis = false
    this.picuVolVis = false
  }

  public openThenNav (target: HTMLAnchorElement) {
    let href = target.href
    href = href.substring(href.indexOf('#') + 1)
    this.navTarget = document.getElementById(href)
    if (this.navTarget!.classList.contains('show')) {
      this.notifyShown()
    }
  }
  public notifyShown () {
    if (this.navTarget) {
      this.navTarget.parentElement!.scrollIntoView({ behavior: 'smooth' })
      this.navTarget = null
    }
  }
  public getValidationClass (v: Validation) {
    return v.$invalid ? 'is-invalid' : 'is-valid'
  }
  private getVal (val?: numberOrFunc, val2?: numberOrFunc) {
    for (const v of arguments) {
      switch (typeof v) {
        case 'function':
          if (this.wtKg) {
            return v(this.wtKg)
          }
          break
        case 'number':
          return v
      }
    }
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
.custom-select.input-group-addon {
	display: -ms-flexbox;
	display: -webkit-box;
	display: flex;
	-ms-flex-align: center;
	-webkit-box-align: center;
	align-items: center;
	margin-bottom: 0;
	color: #495057;
	text-align: left;
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
