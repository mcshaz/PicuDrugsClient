<template>
  <div class="centiles">
    <b-jumbotron header="Drug Calculator" 
            lead="Centile Data" />
    <form @submit.prevent ref="base-data" class="card p-2" id="patientData-data">
        <true-false-radio label="Gender:" true-label="Male" false-label="Female" v-model="isMale" />
        <weeks-gestation v-model="weeksGestation" />
        <dob-input v-model="dob" />
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
                  <b-button variant="outline-primary" @click="chart('weight')" :disabled="isMale===null">
                    <font-awesome-icon icon="chart-line" />
                  </b-button>
              </b-col>
              <b-col>
                  length
                  <b-button variant="outline-primary" @click="chart('length')">
                    <font-awesome-icon icon="chart-line" />
                  </b-button>
              </b-col>
              <b-col>
                  head-circ
                  <b-button variant="outline-primary" @click="chart('head-circumference')">
                    <font-awesome-icon icon="chart-line" />
                  </b-button>
              </b-col>
              <b-col>
                  bmi
                  <b-button variant="outline-primary" @click="chart('BMI')">
                    <font-awesome-icon icon="chart-line" />
                  </b-button>
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
        <b-button-group>
          <b-button :disabled="!canAdd" :variant="canAdd?'success':'warning'" @click="addRow" >Add measurements</b-button>
          <b-button @click="sort" >Sort</b-button>
        </b-button-group>
    </form>
    <b-modal id="centile-modal" ref="centile-modal" hide-footer ok-only :title="chartType+' centiles'" :lazy="true">
      <svg-centiles :measurements="plotPoints" :is-male="isMale" :chartType="chartType" :gestAgeWeeks="weeksGestation" />
    </b-modal>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { UKWeightData, UKBMIData, UKLengthData, UKHeadCircumferenceData, IAnthropometry } from '@/services/anthropometry/';
import { centileString, alarmLevel, ICentileVal } from '@/services/utilities/centileString';
import DobInput from '@/components/DobInput.vue';
import WeeksGestation from '@/components/WeeksGestation.vue';
import TrueFalseRadio from '@/components/TrueFalseRadio.vue';
import CentileRow from '@/components/CentileRow.vue';
import { ICentileVals } from '@/components/CentileRow.vue';
import { sortByDateProp } from '@/services/utilities/sortByProp';
import SvgCentiles from '@/components/SvgCentiles.vue';
import { chartType } from '@/components/SvgCentiles.vue';
import { msPerDay } from '@/services/infusion-calculations/PresentationClasses/Dosing/PatientDetails/ChildAge';

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
    DobInput, WeeksGestation, TrueFalseRadio, CentileRow, SvgCentiles,
  },
})
export default class Centiles extends Vue {
  public isMale: null | boolean = null;
  public weeksGestation: vueNumber = 40;
  public dob: Date | null = null;
  public today = new Date();
  public measurements: IIdCentileVals[] = [];
  // graph properties
  public chartType: chartType | '' = '';
  public plotPoints: IAnthropometry[] = [];

  private rowId!: number;

  public created() {
    this.rowId = 0;
  }

  public get canAdd() {
    return !!(this.dob && this.isMale !== null && this.weeksGestation);
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

  public chart(chartName: chartType) {
    if (!this.dob || this.isMale === null) {
      return;
    }
    this.sort();
    this.chartType = chartName;
    const dobTime = this.dob.getTime();
    const prop = chartTypeToMeasurement(chartName);
    this.plotPoints = this.measurements.reduce((arr, m) => {
      const v = m[prop] as vueNumber;
      if (m.measureDate !== null && v !== '') {
        arr.push({
          ageDays: Math.floor((m.measureDate.getTime() - dobTime) / msPerDay),
          measure: v,
        });
      }
      return arr;
    }, [] as IAnthropometry[]);
    if (this.plotPoints.length) {
      (this.$refs['centile-modal'] as any).show();
    }
  }
}

function chartTypeToMeasurement(chartName: chartType): keyof IIdCentileVals {
    switch (chartName) {
      case 'weight':
          return 'wtKg';
      case 'length':
          return 'lengthCm';
      case 'head-circumference':
          return 'hcCm';
      case 'BMI':
          return 'bmi';
      default:
          throw new Error(`unrecognised chart type:'${chartName}'`);
  }
}
</script>
<style >
#centile-modal .modal {
    padding: 0 !important;
}
#centile-modal .modal-dialog {
    max-width: 100%;
    height: 100%;
    margin: 0;
}
#centile-modal .modal-content {
    border: 0;
    min-height: 100%;
    height: auto;
}
</style>
