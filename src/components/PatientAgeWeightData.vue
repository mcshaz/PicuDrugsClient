<template>
  <b-form  class="needs-validation" novalidate>
    <b-form-group for="name" label-cols-md="2" label="Name:">
      <input class="form-control" type="text" id="name" v-model.trim="name" placeholder="Patient Name" autocomplete="off" />
    </b-form-group>
    <nhi-input v-model="nhi" @valid-state-change="nhiValidState=$event" />
    {{nhiValidState}}
    <patient-age-data v-model="age" />
    <b-form-group for="weight" label-cols-md="2" label="Weight:">
      <b-input-group append="kg">
        <input class="form-control" id="weight" v-model.number="weightKg" placeholder="Weight" type="number" required 
            :min="minWeight()" :max="maxWeight()" autocomplete="off" />
      </b-input-group>
    </b-form-group>
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
    <b-form-group for="weeksGestation" label-cols-md="2" label="Gestation:">
      <b-input-group append="weeks">
        <input class="form-control" id="weeksGestation" v-model.number="weeksGestation" placeholder="Weeks Gestation" type="number" min="22" max="43" />
      </b-input-group>
    </b-form-group>
    <p>{{lbWtCentile!==null}}</p>
    <!--<transition name="bounce">-->
      <b-alert fade show="lbWtCentile!==null" :variant="alertLevel" >
        <output v-if="lbWtCentile!==null" name="centile">
          <span class="prefix">{{lbWtCentile.prefix}}&nbsp;</span><span class="val">{{lbWtCentile.val}}</span><sup class="suffix">{{lbWtCentile.suffix}}</sup>
          <span v-if="ubWtCentile">
            –
            <span class="prefix">{{ubWtCentile.prefix}}&nbsp;</span><span class="val">{{ubWtCentile.val}}</span><sup class="suffix">{{ubWtCentile.suffix}}</sup>
          </span>
          centile
        </output>
          <div v-if="alertLevel==='warning'||alertLevel==='danger'">
            <hr>
            <b-form-checkbox v-model="acceptWtWarn" id="acceptWtWarn" :value="true" required>
                  I confirm this is the correct weight
            </b-form-checkbox>
          </div>
      </b-alert>
    <!--</transition>-->
    <b-button class="ml-md-5" type="submit" :variant="alertLevel">Submit</b-button>
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

type vueNumber = number | '';
type nullBool = null | boolean;

@Component({
  components: { PatientAgeData, NhiInput },
})
export default class PatientAgeWeightData extends Vue {
  public name: string = '';
  public nhi: string = '';
  public age: ChildAge | null = null;
  public isMale: nullBool = null;
  public weeksGestation: vueNumber = 40;
  public alertLevel: string = '';
  public lbWtCentile: ICentileVal | null = null;
  public ubWtCentile: ICentileVal | null = null;
  public isErrorWt: boolean = false;
  public acceptWtWarn: boolean = false;

  private wtData!: UKWeightData;
  private pWeightKg: vueNumber = '';
  private nhiValidState: nullBool = null;

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
    return maxWeightRecord(this.age ? ChildAge.getMaxTotalDays(this.age) / daysPerMonth : void 0);
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
        if (ucs.prefix === this.lbWtCentile.prefix) {
          ucs.prefix = this.lbWtCentile.prefix = '';
        }
        this.alertLevel = alertLevel(Math.round((this.lbWtCentile.alarm + this.ubWtCentile.alarm) / 2));
      }
    }
  }
}

function alertLevel(level: alarmLevel) {
  switch (level) {
    case alarmLevel.none:
      return 'success';
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
#nhi {
  text-transform: uppercase;
}
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
