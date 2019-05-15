<template>
  <form :class="isFormSubmitted?'was-validated':''" novalidate 
      @submit.prevent="submit" ref="form" class="card p-2">
    <slot>
    </slot>
    <b-form-group label-for="name" label-cols-lg="2" label-cols-xl="2" label="Name:">
      <input class="form-control" type="text" name="name" id="name" v-model.trim="name" 
          placeholder="Patient Name" autocomplete="off" />
    </b-form-group>
    <nhi-input v-model="nhi" @valid-state-change="nhiValidState=$event" />
    <patient-age-data v-model="age" :exact="exactAge" :required="requireAge" />
    <true-false-radio label="Gender:" true-label="Male" false-label="Female" v-model="isMale" />
    <weeks-gestation :disabled="!age||age.years>=2" v-model="weeksGestation" />
    <b-form-group  label-for="weight" label-cols-lg="2" label-cols-xl="2" label="Weight:" 
          :state="errMsg===null?null:(errMsg==='')" 
          class="was-validated" @blur="debounceCentiles.flush()" >
        <template slot="invalid-feedback" v-if="!acceptWtWarn&&errMsg.startsWith('Weight')">
          {{errMsg}}
        </template>
        <template :slot="acceptWtWarn?'valid-feedback':'invalid-feedback'" v-else >
          <output v-if="lbWtCentile!==null" name="centile" id="centile" ref="centile">
            <span class="prefix">{{lbWtCentile.prefix}}&nbsp;</span>
            <span class="val">{{lbWtCentile.val}}</span>
            <sup class="suffix">{{lbWtCentile.suffix}}</sup>
            <span class="note">{{lbWtCentile.note}}</span>
            <span v-if="ubWtCentile">
            –
            <span class="prefix">{{ubWtCentile.prefix}}
            &nbsp;
            </span><span class="val">{{ubWtCentile.val}}</span>
            <sup class="suffix">{{ubWtCentile.suffix}}</sup>
            <span class="note">{{ubWtCentile.note}}</span>
            </span>
            centile
          </output>
          <div>
            <b-form-checkbox v-model="acceptWtWarn" name="acceptWtWarn" :value="true" required
                v-if="alertLevel==='warning'||alertLevel==='danger'">
              I confirm this is the correct weight
            </b-form-checkbox>
            {{errMsg}}
          </div>
        </template>
        <div class="form-inline" >
          <b-input-group append="kg">
            <input class="form-control" name="weight" v-model.number="weightKg" placeholder="Weight" 
                type="number" required ref="weight"
                :min="minWeight" :max="maxWeight" autocomplete="off" step="any" :class="alertLevel" />
          </b-input-group>
          <b-button variant="outline-primary" :disabled="(!isWeightEstimate&&!!weightKg)||!age" @click="wt4age" class="ml-3" >
            Median Weight For Age
          </b-button>
        </div> <!-- end form-inline -->
      </b-form-group>
      <b-form-group label-cols-lg="2" label-cols-xl="2" label="Estimate:">
        <b-form-radio-group name="weight-estimate" v-model="isWeightEstimate" >
          <b-form-radio id="estimate" :value="true">
            estimated weight
          </b-form-radio>
          <b-form-radio id="exact" :value="false">
            exact weight
          </b-form-radio>
        </b-form-radio-group>
    </b-form-group>
    <b-button type="submit" :variant="alertLevel" >Create Chart</b-button>
  </form>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue } from 'vue-property-decorator';
import PatientAgeData from '@/components/PatientAgeData.vue';
import NhiInput from '@/components/NhiInput.vue';
import TrueFalseRadio from '@/components/TrueFalseRadio.vue';
import WeeksGestation from '@/components/WeeksGestation.vue';
import { ChildAge, daysPerMonth, GenericRange } from '@/services/infusion-calculations';
import { UKWeightData, Lms } from '@/services/anthropometry/';
import { centileString, alarmLevel, ICentileVal } from '@/services/utilities/centileString';
import { minWeightRecord, maxWeightRecord } from '@/services/utilities/weightHelpers';
import _ from 'lodash';

type vueNumber = number | '';
type nullBool = null | boolean;

@Component({
  components: { PatientAgeData, NhiInput, TrueFalseRadio, WeeksGestation },
})
export default class PatientAgeWeightData extends Vue {
  public name = '';
  public nhi = '';
  public weeksGestation: vueNumber = 40;
  public alertLevel = '';
  public lbWtCentile: ICentileVal | null = null;
  public ubWtCentile: ICentileVal | null = null;
  public isFormSubmitted = false;
  public minWeight = minWeightRecord();
  public maxWeight = maxWeightRecord();
  public isWeightEstimate = false;

  @Prop({default: true})
  private requireWeight!: boolean;
  @Prop({default: false})
  private exactAge!: boolean;
  @Prop({default: false})
  private requireAge!: boolean;
  private pAcceptWtWarn = false;
  private pAge: ChildAge | null = null;
  private pIsMale: nullBool = null;
  private pWeightKg: vueNumber = '';
  private nhiValidState: nullBool = null;
  private debounceCentiles = _.debounce(this.updateCentiles.bind(this), 450);

// not to be watched
  private wtData!: UKWeightData;

  public created() {
    this.wtData = new UKWeightData();
  }

  public get weightKg() { return this.pWeightKg; }
  public set weightKg(value: vueNumber) {
    this.pWeightKg = value;
    if (value === '') {
      this.debounceCentiles.cancel();
      this.updateCentiles();
    } else {
      this.debounceCentiles();
    }
  }

  public get isMale() { return this.pIsMale; }
  public set isMale(value: nullBool) {
    if (value !== this.pIsMale) {
      this.pIsMale = value;
      this.updateCentiles();
    }
  }

  public get age() { return this.pAge; }
  public set age(value: ChildAge | null) {
    this.pAge = value;
    this.updateCentiles();
  }

  public get acceptWtWarn() { return this.pAcceptWtWarn; }
  public set acceptWtWarn(value: boolean) {
    this.pAcceptWtWarn = value;
    (this.$refs.weight as HTMLInputElement).setCustomValidity(value ? '' : 'centiles');
    if (value && this.alertLevel === 'danger') {
      this.alertLevel = 'warning';
    }
  }

  public get errMsg() {
    if (this.weightKg === '') {
      return this.requireWeight
        ? 'Weight is required'
        : null;
    }
    if (this.weightKg < this.minWeight || this.weightKg > this.maxWeight) {
      return `Weight must be ${this.minWeight} – ${this.maxWeight} kg`;
    }
    if (this.alertLevel === 'success') {
      return '';
    }
    return this.acceptWtWarn
      ? ''
      : 'Please confirm the weight has been double checked';
  }

  public wt4age() {
    const rng = this.lmsRange();
    if (!rng.lowerBound) {
      throw new Error('cannot get lms for age - no data');
    }
    this.isWeightEstimate = true;
    if (!rng.upperBound) {
      this.weightKg = Math.round(rng.lowerBound.m);
    } else {
      this.weightKg = Math.round((rng.lowerBound.m + rng.upperBound.m) / 2);
    }
  }

  public submit(evt: Event) {
    this.isFormSubmitted = true;
    if ((this.$refs.form as HTMLFormElement).checkValidity()) {
      this.$emit('valid-submit', {
        name: this.name,
        nhi: this.nhi,
        weeksGestation: this.weeksGestation,
        age: this.pAge,
        isMale: this.pIsMale,
        weightKg: this.pWeightKg,
        centileHTML: this.$refs.centile ? (this.$refs.centile as HTMLOutputElement).innerHTML : '',
        isWeightEstimate: this.isWeightEstimate,
      });
    }
  }

  private updateCentiles() {
    const rng = this.lmsRange();
    if (this.pWeightKg === '' || rng.lowerBound === void 0) {
      this.ubWtCentile = this.lbWtCentile = null;
      this.minWeight = minWeightRecord();
      this.maxWeight = maxWeightRecord();
      return;
    }
    const lbWtCentile = rng.lowerBound.cumSnormfromParam(this.pWeightKg) * 100;
    this.lbWtCentile = centileString(lbWtCentile);
    if (rng.upperBound === void 0) {
      this.ubWtCentile = null;
      this.alertLevel = alertLevel(this.lbWtCentile.alarm);
    } else {
      const ubWtCentile = rng.upperBound.cumSnormfromParam(this.pWeightKg) * 100;
      const ucs = centileString(ubWtCentile);
      if (ucs.val === this.lbWtCentile.val) {
        this.ubWtCentile = null;
        this.alertLevel = alertLevel(this.lbWtCentile.alarm);
      } else {
        this.ubWtCentile = ucs;
        if (ucs.prefix === this.lbWtCentile.prefix) {
          ucs.prefix = this.lbWtCentile.prefix = '';
        }
        if (this.pIsMale === null) {
          this.lbWtCentile.note = '♂';
          ucs.note = '♀';
        }
        this.alertLevel = alertLevel(Math.round((this.lbWtCentile.alarm + this.ubWtCentile.alarm) / 2));
      }
    }
    this.acceptWtWarn = this.alertLevel === 'success';
    this.minWeight = minWeightRecord(ChildAge.getMinTotalDays(this.pAge!) / daysPerMonth);
    this.maxWeight = maxWeightRecord(ChildAge.getMaxTotalDays(this.pAge!) / daysPerMonth);
  }

  private lmsRange() {
    const returnVar = new GenericRange<Lms>();
    if (!this.pAge) {
      return returnVar;
    }
    const ageDays = this.pAge.getAgeRangeInDays();
    returnVar.lowerBound = this.wtData.lmsForAge(ageDays.upperBound, this.pIsMale === null ? true : this.pIsMale, this.weeksGestation || 40);
    if (this.isMale !== null && ageDays.lowerBound === ageDays.upperBound) {
      return returnVar;
    }
    returnVar.upperBound = this.wtData.lmsForAge(ageDays.lowerBound, this.pIsMale === null ? false : this.pIsMale, this.weeksGestation || 40);
    return returnVar;
  }
}

function alertLevel(level: alarmLevel) {
  switch (level) {
    case alarmLevel.none:
    case alarmLevel.minorWarning:
      return 'success';
    case alarmLevel.warning:
    case alarmLevel.danger:
      return 'danger';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
input.form-control.warning:valid {
  border-color: #fd7e14;
}
input[type='number'] {
  max-width: 7.5em;
}
</style>
