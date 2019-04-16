<template>
  <div class="hello">
    <div class="form-group row">
      <label for="name" class="col-sm-2 col-form-label">Name</label>
      <div class="col-sm-10">
        <input class="form-control" type="text" id="name" v-model="name" placeholder="Patient Name" >
      </div>
    </div>
    <div class="form-group row">
      <label for="nhi" class="col-sm-2 col-form-label">NHI</label>
      <div class="col-sm-10">
        <input class="form-control" type="text" id="nhi" v-model="nhi" placeholder="NHI" >
      </div>
    </div>
    <patient-age-data v-model="age" />
    <div class="form-group row">
      <label for="weight" class="col-sm-2 col-form-label">Weight</label>
      <div class="col-sm-10">
        <div class="input-group">
          <input class="form-control" id="weight" v-model.number="weightKg" placeholder="Weight" type="number" :min="minWeight()" :max="maxWeight()" >
          <div class="input-group-append">
            <span class="input-group-text" >kg</span>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Gender</label>
      <fieldset class="col-sm-10">
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" id="maleRadio" v-model="isMale" :value="true">
          <label class="form-check-label" for="maleRadio">Male</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" id="femaleRadio" v-model="isMale" :value="false">
          <label class="form-check-label" for="femaleRadio">Female</label>
        </div>
      </fieldset>
    </div>
    <div class="form-group row">
      <div class="col-sm-2">
        <label for="weeksGestation" class="col-form-label">Gestation</label>
        <small class="form-text text-muted">weeks @ birth</small>
      </div>
      <div class="col-sm-10">
        <div class="input-group">
          <input class="form-control" id="weeksGestation" v-model.number="weeksGestation" placeholder="Weeks Gestation" type="number" min="22" max="23">
          <div class="input-group-append">
            <span class="input-group-text" >weeks</span>
          </div>
        </div>
      </div>
    </div>
    <transition name="bounce">
      <div class="alert" :class="alertLevel?'alert-'+alertLevel:''" v-if="lbWtCentile!==null" >
        <p>
          <span class="prefix">{{lbWtCentile.prefix}}</span>&nbsp;<span class="val">{{lbWtCentile.val}}</span><sup class="suffix">{{lbWtCentile.suffix}}</sup>
          <span v-if="ubWtCentile">
            –
            <span class="prefix">{{ubWtCentile.prefix}}</span>&nbsp;<span class="val">{{ubWtCentile.val}}</span><sup class="suffix">{{ubWtCentile.suffix}}</sup>
          </span>
          centile
        </p>
        <transition name="bounce">
          <div v-if="alertLevel==='warning'||alertLevel==='danger'">
            <hr>
            <div class="mb-0" >
              <div class="form-check">
                <input class="form-check-input" type="checkbox" v-model="acceptWtWarn" id="acceptWtWarn">
                <label class="form-check-label" for="acceptWtWarn">
                  I confirm this is the correct weight
                </label>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue } from 'vue-property-decorator';
import PatientAgeData from '@/components/PatientAgeData.vue';
import { ChildAge, daysPerMonth } from '@/services/infusion-calculations/PresentationClasses/Dosing/PatientDetails/ChildAge';
import { UKWeightData } from '@/services/anthropometry/';
import { centileString, alarmLevel, ICentileVal } from '@/services/utilities/centileString';
import { minWeightRecord, maxWeightRecord } from '@/services/utilities/weightHelpers';

type vueNumber = number | '';

@Component({
  components: { PatientAgeData },
})
export default class PatientAgeWeightData extends Vue {
  public name: string = '';
  public nhi: string = '';
  public age: ChildAge | null = null;
  public isMale: boolean | null = null;
  public weeksGestation: vueNumber = 40;
  public alertLevel: string = '';
  public lbWtCentile: ICentileVal | null = null;
  public ubWtCentile: ICentileVal | null = null;
  public isErrorWt: boolean = false;
  public acceptWtWarn: boolean = false;

  private pWeightKg: vueNumber = '';
  private wtData!: UKWeightData;

  public created() {
    this.wtData = new UKWeightData();
  }

  public get weightKg() { return this.pWeightKg; }
  public set weightKg(value: vueNumber) {
    this.pWeightKg = value;
    this.updateCentiles();
  }

  public minWeight() {
    return minWeightRecord(this.age ? ChildAge.getMinTotalDays(this.age) / daysPerMonth : void 0);
  }

  public maxWeight() {
    return minWeightRecord(this.age ? ChildAge.getMaxTotalDays(this.age) / daysPerMonth : void 0);
  }

  private updateCentiles() {
    if (!this.pWeightKg || !this.age) {
      this.ubWtCentile = this.lbWtCentile = null;
      return;
    }
    const ageDays = this.age.getAgeRangeInDays();
    const lbWtCentile = this.wtData.cumSnormForAge(this.pWeightKg, ageDays.upperBound, this.isMale === null ? true : this.isMale, this.weeksGestation || 40) * 100;
    this.lbWtCentile = centileString(lbWtCentile);
    if (this.isMale !== null && ageDays.lowerBound === ageDays.upperBound) {
      this.ubWtCentile = null;
      this.alertLevel = alertLevel(this.lbWtCentile.alarm);
    } else {
      const ubWtCentile = this.wtData.cumSnormForAge(this.pWeightKg, ageDays.lowerBound, this.isMale === null ? false : this.isMale, this.weeksGestation || 40) * 100;
      const ucs = centileString(ubWtCentile);
      if (ucs.val === this.lbWtCentile.val) {
        this.ubWtCentile = null;
        this.alertLevel = alertLevel(this.lbWtCentile.alarm);
      } else {
        this.ubWtCentile = ucs;
        this.alertLevel = alertLevel(Math.round((this.lbWtCentile.alarm + this.ubWtCentile.alarm) / 2));
      }
    }
  }
}

function alertLevel(level: alarmLevel) {
  switch (level) {
    case alarmLevel.none:
      return '';
    case alarmLevel.minorWarning:
      return 'dark';
    case alarmLevel.warning:
      return 'warning';
    case alarmLevel.danger:
      return 'danger';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
