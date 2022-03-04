<template>
  <validation-observer ref="mainObserver" tag="div">
    <b-form-group  id="original-Rx" label-size="lg">
      <template #label>
        Original pain/sedative <font-awesome-icon icon="prescription"/>
        <button type="button" class="btn btn-warning float-right" @click="$emit('delete', id)"><font-awesome-icon icon="trash-alt"/> Remove</button>
      </template>
      <validated-select-group label="Medication" :name="'medication'+id" v-model="originalDrugName" required>
        <option value="" disabled>Please select …</option>
        <optgroup v-for="o in ddOpts" :key="o.drugClass" :label="o.drugClass" :disabled="o.disabled">
          <option v-for="wd in o.drugs" :key="wd.name" :value="wd.name">{{wd.name}}</option>
        </optgroup>
      </validated-select-group>
      <template v-if="isDailyDrugRequired">
        <validated-input-group v-if="isPatch" :name="'original-conc-details'+id" error-label="Original Concentration"
            :append="originalConcUnits.units" type="number" v-model="originalConcVal" ref="originalConcVal" :label="concLabel.label"
            :step="originalConcUnits?(originalConcUnits.step || originalConcUnits.min):1" required :min="originalConcLimits[0]" :max="originalConcLimits[1]">
        </validated-input-group>
        <validated-input-select-group v-else :name="'original-conc-details'+id" error-label="Original Concentration" select-error-label="[concentration] UNITS"
            type="number" v-model="originalConcVal" ref="originalConcVal"
            :step="originalConcUnits?originalConcUnits.min:1" required :min="originalConcLimits[0]" :max="originalConcLimits[1]"
            :select-disabled="concentrations.length===1" :select-value.sync="originalConcUnits" :select-name="'unit-select'+id">
          <template #label>
            {{concLabel.label}} <strong class="text-warning" v-if="hasDifferentDefaults">*</strong>
          </template>
          <template>
            <option value="" disabled>…</option>
            <option v-for="conc in concentrations" :key="conc.units" :value="conc">{{conc.units}}</option>
          </template>
          <template #description v-if="hasDifferentDefaults">
            <strong class="text-warning">*</strong> Please note different PICU vs PCA/NCA protocols
          </template>
        </validated-input-select-group>
      </template>
      <validated-input-group label="last 24hrs" :name="'last24hr'+id" required
          :description="`the ${original24HrUnits==='mL'?'volume':original24HrUnits} of ${originalDrugName} given in the last 24 hours`"
          label-for="vol" label-cols-sm="4" label-cols-md="3" label-align-sm="right" v-if="isDailyDrugRequired && !isPatch"
          :append="original24HrUnits" type="number" v-model="original24HrVol" min="0" max="500">
        <template #description v-if="original24HrUnits==='mL'">
          <slot name="volume-details">
          </slot>
        </template>
      </validated-input-group>
    </b-form-group><!--/original prescription-->
    <div class="alert alert-primary" role="alert" v-if="original24HrCalc.dose && !isChloral">
      This equates to a total {{originalDrugName}} dose of <output>{{original24HrCalc.dose}} {{original24HrCalc.units}}</output>/<strong>day</strong>
    </div>
    <b-form-group label="Weaning plan" id="weaning-med" label-size="lg">
      <validated-select-group :name="'weaning-med'+id" label="Oral" v-model="weaningDrug" required>
        <template>
          <option value="" disabled>Please select …</option>
          <option v-for="(fn, key) in conversionDrugs" :key="key" :value="key">{{key}}</option>
        </template>
      </validated-select-group>
      <validated-bool-radio-group label="Wean Duration" v-model="rapidClonidineWean" v-if="isClonidine"
          true-label="rapid" false-label="slower" :name="'wean-duration'+id" required>
        <template #description>
          <slot name="clonidine-duration">
          </slot>
        </template>
      </validated-bool-radio-group>
      <template v-else>
        <validated-input-group label="Wean over" :rules="{ required: true, step: { multiple: weanDaily ? 1 : 2}  }" append="days" type="number" step="1" v-model="weanDuration"
            required min="2" max="42" :name="'wean-over'+id">
          <template #description>
            <slot name="opiod-benzo-duration">
            </slot>
          </template>
        </validated-input-group>
        <validated-bool-radio-group label="Wean each" true-label="day" false-label="alternate day" v-model="weanDaily" required/>
      </template>
      <validated-date-group v-model="startOral" :min="startOralMin" :max="startOralMax" label="Convert On" :name="'start-oral'+id"
          description="When to commence the first oral dose" required/>
      <validated-date-group v-model="startWean" :min="startWeanMin" :max="startWeanMax" label="Start Wean" :name="'start-wean'+id"
          description="When to begin reducing the dose" required/>
    </b-form-group><!--Weaning plan-->
    <div class="alert alert-success" role="alert" v-if="totalWeaning24Hrs">
      This equates to a total <strong>daily</strong> <em> starting</em> enteral {{ weaningDrug }} dose of
      <span class="nobr"><output>{{ totalWeaning24Hrs.dailyCommence }} {{ weaningDoseUnits }}</output>/<strong>day</strong></span>
      <small v-if="isWeaningDoseMax"> (this is the maximum dose)</small>.
      <span class="finishing">The last dose is due {{ lastDose }}</span>
    </div>
  </validation-observer>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import ValidatedInputGroup from '@/components/formGroups/ValidatedInputGroup.vue';
import ValidatedInputSelectGroup from '@/components/formGroups/ValidatedInputSelectGroup.vue';
import ValidatedDateGroup from '@/components/formGroups/ValidatedDateGroup.vue';
import ValidatedBoolRadioGroup from '@/components/formGroups/ValidatedBoolRadioGroup.vue';
import { toGrouping } from '@/services/drugDb';
import { withdrawalDrugs, IConcInfo, adminRoute, numberOrFunc, IWeaningMed, extractUnits, drugClass } from '@/services/pharmacokinetics/withdrawalInfo';
import { roundToPrecision } from '@/services/infusion-calculations/';
import { linearWean, alternateWean, exponentialWean, nonWean } from '@/services/pharmacokinetics/weaningRegimes';
import { WeanDay } from '@/services/pharmacokinetics/WeanDay';
import { shortFormatter, daysDif } from '@/services/utilities/dateHelpers';

type vueNumber = number | '';
const emptyObj = Object.freeze({});
const emptyArray = Object.freeze([]) as [];
const ddOpts = Object.freeze([...toGrouping(withdrawalDrugs, (d) => d.drugClass)]);
interface IDoseUnits { dose?: number; units?: string }
const defaultConcLimits = Object.freeze({ min: 1, max: 1000 });
const maxDaysToStart = 21;

@Component({
  components: {
    ValidatedInputSelectGroup,
    ValidatedBoolRadioGroup,
    ValidatedInputGroup,
    ValidatedDateGroup,
  },
})
export default class WithdrawalDrug extends Vue {
  @Prop({ required: true })
  public wtKg!: vueNumber;

  @Prop({ required: true })
  public ageLt1Yr!: boolean | null;

  @Prop({ default: () => [] })
  public selectedDdOpts!: string[];

  @Prop({ default: -1 })
  public id!: number;

  public ddOpts = ddOpts.map((e) => ({
    drugClass: e[0],
    disabled: false,
    drugs: e[1],
  }));

  public startOral: Date | null = null;
  public startOralMin: Date = null as any as Date;
  public startOralMax: Date = null as any as Date;
  public startWean: Date | null = null;
  public originalDrugName = '';
  public weanDuration: vueNumber = '';
  public original24HrVol: vueNumber = '';
  public weanDaily = true;
  public originalConcVal: vueNumber = '';
  public originalConcUnits: IConcInfo | null = null;
  public weaningDrug: (keyof IWeaningMed & string) | '' = '';
  public rapidClonidineWean = true;

  public created() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    this.startOral = now;
    this.startOralMin = new Date(this.startOral);
    this.startOralMax = new Date(this.startOralMin);
    this.startOralMax.setDate(this.startOralMax.getDate() + maxDaysToStart);
  }

  public get startWeanMin() {
    const returnVar = new Date(this.startOral || this.startOralMin);
    returnVar.setDate(returnVar.getDate() + 1);
    return returnVar;
  }

  public get startWeanMax() {
    const returnVar = new Date(this.startOralMax);
    returnVar.setDate(returnVar.getDate() + maxDaysToStart);
    return returnVar;
  }

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
      return { label: 'Patch strength', description: 'strength' };
    }
    if (this.originalDrug && this.originalDrug.adminRoute === adminRoute.boluses) {
      return { label: 'Single dose:', description: 'dose' };
    }
    return { label: '1 mL/hr =', description: 'concentration' };
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
    return this.originalDrugName === 'chloral hydrate';
  }

  public get original24HrUnits() {
    if (this.originalDrug && this.originalDrug.adminRoute === adminRoute.boluses) {
      return 'doses';
    }
    return 'mL';
  }

  public get original24HrCalc(): IDoseUnits {
    if (this.originalConcUnits && this.originalConcVal && this.originalConcVal > 0) {
      let multiplier = this.originalConcUnits.units.endsWith('/min') ? 60 : 1; // 1 assigned per hour & per dose
      if (this.originalConcUnits.units.includes('/kg')) {
        if (!this.wtKg || this.wtKg <= 0) {
          return emptyObj;
        }
        multiplier *= this.wtKg;
      }
      const returnVar = {
        dose: multiplier * this.originalConcVal,
        units: extractUnits(this.originalConcUnits.units),
      } as IDoseUnits;
      if (this.original24HrVol) {
        returnVar.dose! *= this.original24HrVol;
      }
      if (returnVar.dose! > 3000 && returnVar.units === 'microg') {
        returnVar.dose = returnVar.dose! / 1000;
        returnVar.units = 'mg';
      }
      returnVar.dose = roundToPrecision(returnVar.dose!, 3);
      return returnVar;
    }
    return emptyObj;
  }

  public get totalWeaning24Hrs() {
    if (this.originalDrug && this.weaningDrug && this.ageLt1Yr !== null) {
      if (this.original24HrCalc.dose) {
        let dose = this.original24HrCalc.dose;
        if (this.weaningDrug === 'clonidine') {
          if (this.original24HrCalc.units?.startsWith('mg')) {
            dose *= 1000;
          }
        } else if (this.original24HrCalc.units?.startsWith('microg')) {
          dose /= 1000;
        }
        return this.originalDrug.conversion[this.weaningDrug]!(dose, this.ageLt1Yr);
      } else if (this.wtKg && this.wtKg > 0 && !this.isDailyDrugRequired) {
        return this.originalDrug.conversion[this.weaningDrug]!(this.wtKg, this.ageLt1Yr);
      }
    }
  }

  public get isWeaningDoseMax() {
    return this.totalWeaning24Hrs && this.totalWeaning24Hrs.dailyCommence === this.totalWeaning24Hrs.maxPerDay;
  }

  public get originalConc() {
    if (!this.originalConcUnits) {
      return '';
    }
    return `${this.concLabel.label} ${this.originalConcVal} ${this.originalConcUnits.units}`;
  }

  public get originalVol() {
    return this.isPatch
      ? ''
      : this.original24HrVol + this.original24HrUnits;
  }

  public get weaningDoseUnits() {
    if (!this.weaningDrug) { return ''; }
    return this.weaningDrug === 'clonidine' ? 'microg' : 'mg';
  }

  public get lastDose() {
    return this.weaningRegime.length
      ? shortFormatter.format(this.weaningRegime[this.weaningRegime.length - 1].weanDate)
      : '';
  }

  public get weaningRegime() {
    // :drug="weaningDrug" :start24-hr-dose="totalWeaning24Hrs.dailyCommence" :q-hourly="totalWeaning24Hrs.qH"
    // :linear-wean="linearWeanInfo" :clonidine-wean="clonidineWeanInfo" :doseUnit="weaningDoseUnits">
    if (!(this.totalWeaning24Hrs && this.weaningDrug && this.startWean && this.startOral && this.startWean.getTime() > this.startOral.getTime())) {
      return [];
    }
    let individualDose = this.totalWeaning24Hrs.dailyCommence * this.totalWeaning24Hrs.qH / 24;
    const startWeanDate = new Date(this.startWean);
    startWeanDate.setDate(startWeanDate.getDate() - 1);
    let returnVar = nonWean(individualDose, daysDif(this.startOral, this.startWean) - 1, this.totalWeaning24Hrs.qH, this.startOral);
    if (this.isClonidine) {
      if (!this.wtKg) {
        return [];
      }
      if (!this.rapidClonidineWean && individualDose > this.wtKg) {
        returnVar = returnVar.concat(linearWean(individualDose, this.wtKg / individualDose, this.totalWeaning24Hrs.qH, startWeanDate, this.wtKg));
        startWeanDate.setDate(startWeanDate.getDate() + 1);
        individualDose = this.wtKg;
      }
      return returnVar.concat(exponentialWean(individualDose, 0.5, 4, this.totalWeaning24Hrs.qH, startWeanDate));
    }
    if (!this.weanDuration) {
      return [];
    }
    if (this.weanDaily) {
      return returnVar.concat(linearWean(individualDose, 1 / this.weanDuration, this.totalWeaning24Hrs.qH, startWeanDate));
    }
    const altRegime = alternateWean(individualDose, this.weanDuration, this.totalWeaning24Hrs.qH, startWeanDate);
    // if even, 1st 2 days will be at starting dose
    // if odd, 1 day at starting dose
    // we want drop to be on startWean Date
    if (this.weanDuration % 2 === 0) {
      // however this now leaves our wean over 1 day less than the specified weanDuration
      altRegime.shift();
    }
    return returnVar.concat(altRegime);
  }

  @Watch('startOral', { immediate: true })
  public setStartWean() {
    if (this.startOral !== null && (this.startWean === null || this.startWeanMin > this.startWean || this.startWean > this.startWeanMax || !this.fieldTouched('Start Wean'))) {
      this.startWean = new Date(this.startOral);
      const addDays = (new Date()).getHours() >= 12 ? 2 : 1;
      this.startWean.setDate(this.startWean.getDate() + addDays);
    }
  }

  @Watch('selectedDdOpts', { immediate: true })
  public setDisabledGroup() {
    if (this.selectedDdOpts.length !== 0) {
      for (const o of this.ddOpts) {
        o.disabled = !o.drugs.some(d => d.name === this.originalDrugName) && this.selectedDdOpts.some(sdd => o.drugs.some(d => d.name === sdd));
      }
      // both benzo and other (=chloral) use diazepam withdrawal. Too risky to allow both together
      const benzo = this.ddOpts.find(d => d.drugClass === drugClass.benzo)!;
      const other = this.ddOpts.find(d => d.drugClass === drugClass.others)!;
      benzo.disabled = other.disabled = benzo.disabled || other.disabled;
    }
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

  @Watch('originalDrugName')
  public originalDrugNameChange() {
    this.$emit('update:original-drug-name', this.originalDrugName);
  }

  @Watch('originalConc')
  public originalConcChange() {
    this.$emit('update:original-conc', this.originalConc);
  }

  @Watch('originalVol')
  public originalVolChange() {
    this.$emit('update:original-vol', this.originalVol);
  }

  @Watch('weaningDrug')
  public weaningDrugChange() {
    this.$emit('update:weaning-drug', this.weaningDrug);
  }

  @Watch('weaningDoseUnits')
  public weaningDoseUnitsChange() {
    this.$emit('update:weaning-dose-units', this.weaningDoseUnits);
  }

  @Watch('weaningRegime')
  public weanRegimeChange(newVal: WeanDay[]) {
    this.$emit('update:weaning-regime', newVal);
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
.nobr { white-space: nowrap; }
</style>
