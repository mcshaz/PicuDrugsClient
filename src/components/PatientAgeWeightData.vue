<template>
  <b-form :class="isFormSubmitted?'was-validated':''" novalidate 
      @submit="submit" ref="form" class="card p-2">
    <slot>
    </slot>
    <b-form-group label-for="name" label-cols-md="2" label="Name:">
      <input class="form-control" type="text" name="name" id="name" v-model.trim="name" placeholder="Patient Name" autocomplete="off" />
    </b-form-group>
    <nhi-input v-model="nhi" @valid-state-change="nhiValidState=$event" />
    <patient-age-data v-model="age" />
    <b-form-group label-cols-md="2" label="Gender:">
        <b-form-radio-group>
          <b-form-radio id="maleRadio" v-model="isMale" :value="true">
            Male
          </b-form-radio>
          <b-form-radio id="femaleRadio" v-model="isMale" :value="false">
            Female
          </b-form-radio>
        </b-form-radio-group>
    </b-form-group>
    <b-form-group label-for="weeksGestation" label-cols-md="2" label="Gestation:">
      <b-input-group append="weeks" invalid-feedback="a number between 22 &amp; 43 weeks is required" >
        <input class="form-control" name="weeksGestation" id="weeksGestation" v-model.number="weeksGestation" 
            placeholder="Weeks Gestation" type="number" min="22" max="43" required
            :disabled="!age||age.years>=2"
        />
      </b-input-group>
    </b-form-group>
    <b-form-group label-for="weight" label-cols-md="2" label="Weight:" :state="wtState()"
          :class="alertLevel===''?'':'was-validated'" @blur="debounceCentiles.flush()" >
        <template slot="invalid-feedback" v-if="pWeightKg===''&&wtTouched">
          Weight is required
        </template>
        <template slot="invalid-feedback" v-else-if="pWeightKg<minWeight||pWeightKg>maxWeight">
          Weight must be {{minWeight}} – {{maxWeight}} kg
        </template>
        <template :slot="alertLevel==='success'?'valid-feedback':'invalid-feedback'" v-else>
          <output v-if="lbWtCentile!==null" name="centile" id="centile" ref="centile">
            <span class="prefix">{{lbWtCentile.prefix}}&nbsp;</span><span class="val">{{lbWtCentile.val}}</span><sup class="suffix">{{lbWtCentile.suffix}}</sup>
            <span v-if="ubWtCentile">
              –
              <span class="prefix">{{ubWtCentile.prefix}}&nbsp;</span><span class="val">{{ubWtCentile.val}}</span><sup class="suffix">{{ubWtCentile.suffix}}</sup>
            </span>
            centile
          </output>
          <div>
            <b-form-checkbox v-model="acceptWtWarn" name="acceptWtWarn" :value="true" required
                 v-if="alertLevel==='warning'||alertLevel==='danger'">
              I confirm this is the correct weight
            </b-form-checkbox>
          </div>
        </template>
      <b-input-group append="kg">
        <input class="form-control" name="weight" v-model.number="weightKg" placeholder="Weight" type="number" required ref="weight"
            :min="minWeight" :max="maxWeight" autocomplete="off" step="any" :class="alertLevel" />
      </b-input-group>
    </b-form-group>
    <hr />
    <b-button type="submit" :variant="alertLevel" >Submit</b-button>
  </b-form>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue } from 'vue-property-decorator';
import PatientAgeData from '@/components/PatientAgeData.vue';
import NhiInput from '@/components/NhiInput.vue';
import { ChildAge, daysPerMonth } from '@/services/infusion-calculations/PresentationClasses/Dosing/PatientDetails/ChildAge';
import { UKWeightData } from '@/services/anthropometry/';
import { centileString, alarmLevel, ICentileVal } from '@/services/utilities/centileString';
import { minWeightRecord, maxWeightRecord } from '@/services/utilities/weightHelpers';
import _ from 'lodash';

type vueNumber = number | '';
type nullBool = null | boolean;

@Component({
  components: { PatientAgeData, NhiInput },
})
export default class PatientAgeWeightData extends Vue {
  public name = '';
  public nhi = '';
  public weeksGestation: vueNumber = 40;
  public alertLevel = '';
  public lbWtCentile: ICentileVal | null = null;
  public ubWtCentile: ICentileVal | null = null;
  public wtTouched = false;
  public isFormSubmitted = false;
  public minWeight = minWeightRecord();
  public maxWeight = maxWeightRecord();

  private pAcceptWtWarn = false;
  private pAge: ChildAge | null = null;
  private pIsMale: nullBool = null;
  private pWeightKg: vueNumber = '';
  private nhiValidState: nullBool = null;
  private debounceCentiles = _.debounce(this.updateCentiles.bind(this), 400);

// not to be watched
  private wtData!: UKWeightData;

  public created() {
    this.wtData = new UKWeightData();
  }

  public get weightKg() { return this.pWeightKg; }
  public set weightKg(value: vueNumber) {
    this.pWeightKg = value;
    this.wtTouched = true;
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

  public wtState() {
    if (!this.wtTouched) {
      return null;
    }
    return (this.$refs.weight as HTMLInputElement).checkValidity();
  }

  public submit(evt: Event) {
    this.isFormSubmitted = this.wtTouched = true;
    evt.preventDefault();
    evt.stopPropagation();
    if ((this.$refs.form as HTMLFormElement).checkValidity()) {
      this.$emit('valid-submit', {
        name: this.name,
        nhi: this.nhi,
        weeksGestation: this.weeksGestation,
        age: this.pAge,
        isMale: this.pIsMale,
        weightKg: this.pWeightKg,
        centileHTML: this.$refs.centile ? (this.$refs.centile as HTMLOutputElement).innerHTML : '',
      });
    }
  }

  private updateCentiles() {
    if (!this.pWeightKg || !this.pAge) {
      this.ubWtCentile = this.lbWtCentile = null;
      this.minWeight = minWeightRecord();
      this.maxWeight = maxWeightRecord();
      return;
    }
    const ageDays = this.pAge.getAgeRangeInDays();
    const lbWtCentile = this.wtData.cumSnormForAge(this.pWeightKg, ageDays.upperBound, this.pIsMale === null ? true : this.pIsMale, this.weeksGestation || 40) * 100;
    this.lbWtCentile = centileString(lbWtCentile);
    if (this.isMale !== null && ageDays.lowerBound === ageDays.upperBound) {
      this.ubWtCentile = null;
      this.alertLevel = alertLevel(this.lbWtCentile.alarm);
    } else {
      const ubWtCentile = this.wtData.cumSnormForAge(this.pWeightKg, ageDays.lowerBound, this.pIsMale === null ? false : this.pIsMale, this.weeksGestation || 40) * 100;
      const ucs = centileString(ubWtCentile);
      if (ucs.val === this.lbWtCentile.val) {
        this.ubWtCentile = null;
        this.alertLevel = alertLevel(this.lbWtCentile.alarm);
      } else {
        this.ubWtCentile = ucs;
        if (ucs.prefix === this.lbWtCentile.prefix) {
          ucs.prefix = this.lbWtCentile.prefix = '';
        }
        this.alertLevel = alertLevel(Math.round((this.lbWtCentile.alarm + this.ubWtCentile.alarm) / 2));
      }
    }
    this.acceptWtWarn = this.alertLevel === 'success';
    this.minWeight = minWeightRecord(ChildAge.getMinTotalDays(this.pAge) / daysPerMonth);
    this.maxWeight = maxWeightRecord(ChildAge.getMaxTotalDays(this.pAge) / daysPerMonth);
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
