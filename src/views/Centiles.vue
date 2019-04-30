<template>
  <div class="centiles">
    <b-jumbotron header="Drug Calculator" 
            lead="Centile Data" />
    <form @submit.prevent ref="base-data" class="card p-2" id="patientData-data">
        <true-false-radio label="Gender:" true-label="Male" false-label="Female" v-model="isMale" />
        <weeks-gestation v-model="weeksGestation" />
        <dob-input v-model="dob" />
        <b-button :disabled="!canAdd" :variant="canAdd?'success':'warning'" @click="addRow" >Add measurements</b-button>
        <b-container fluid>
            <b-row class="justify-content-md-left">
              <b-col>
                  Date
              </b-col>
              <b-col>
                  Age
              </b-col>
              <b-col>
                  Weight
              </b-col>
              <b-col>
                  length
              </b-col>
              <b-col>
                  head-circ
              </b-col>
              <b-col>
                  bmi
              </b-col>
            </b-row>
          <centile-row v-for="m in measurements" :key="m.rowId"
              :today="today"
              :dob="dob"
              :is-male="isMale"
              :weeks-gestation="weeksGestation"
              :measure-date="m.measureDate"
              :wt-kg="m.wtKg"
              :length-cm="m.lengthCm"
              :hc-cm="m.hcCm"
              @wt-change="m.wtKg=$event"
              @hc-change="m.hcCm=$event"
              @length-change="m.lengthCm=$event"
              @bmi-change="m.bmi=$event"
              @date-change="m.measureDate=$event"
              class="was-validated"
          />
        </b-container>
        <b-button @click="sort" >Sort</b-button>
    </form>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { UKWeightData, UKBMIData, UKLengthData, UKHeadCircumferenceData } from '@/services/anthropometry/';
import { centileString, alarmLevel, ICentileVal } from '@/services/utilities/centileString';
import DobInput from '@/components/DobInput.vue';
import WeeksGestation from '@/components/WeeksGestation.vue';
import TrueFalseRadio from '@/components/TrueFalseRadio.vue';
import CentileRow from '@/components/CentileRow.vue';
import { ICentileVals } from '@/components/CentileRow.vue';
import { sortByDateProp } from '@/services/utilities/sortByProp';

type vueNumber = number | '';
interface IIdCentileVals extends ICentileVals { rowId: number; }

@Component({
  // Provides IoC container at the top level of VueComponent
  provide: {
    wtCentiles: new UKWeightData(),
    lengthCentiles: new UKLengthData(),
    hcCentiles: new UKHeadCircumferenceData(),
    bmiCentiles: new UKBMIData(),
  },
  components: {
    DobInput, WeeksGestation, TrueFalseRadio, CentileRow,
  },
})
export default class Centiles extends Vue {
  public isMale: null | boolean = null;
  public weeksGestation: vueNumber = 40;
  public dob: Date | null = null;
  public today = new Date();
  public measurements: IIdCentileVals[] = [];

  private rowId!: number;

  public created() {
    this.rowId = 0;
  }

  public get canAdd() {
    return !!(this.dob && this.isMale && this.weeksGestation);
  }

  public addRow() {
    this.measurements.push({
      rowId: this.rowId++,
      measureDate: this.measurements.length ? null : this.today,
      today: this.today,
      wtKg: '',
      hcCm: '',
      lengthCm: '',
      bmi: '',
    });
  }

  public sort() {
    sortByDateProp(this.measurements, 'measureDate');
  }
}
</script>