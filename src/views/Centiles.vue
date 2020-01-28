<template>
  <div class="centiles">
    <h2>Drug Calculator - Centile Data</h2>
    <validation-observer>
      <form @submit.prevent ref="base-data" class="card p-2" id="patientData-data">
        <nhi-input v-model="nhi" @invalid-state-change="lookupNhi(!$event.$invalid)" />
        <validated-bool-radio-group label="Gender" true-label="Male" false-label="Female" v-model="isMale" />
        <validated-input-group label="Weeks Gestation" description="@ birth" v-model="weeksGestation"
            min="22" max="43"/>
        <dob-input v-model="dob" />
        <b-container fluid>
          <b-row class="justify-content-md-left">
            <b-col cols="1"></b-col>
            <b-col cols="3">
              Date
              <small class="small">+ age</small>
            </b-col>
            <b-col cols="2">
              Weight
              <b-button
                variant="outline-primary"
                @click="chart('weight')"
                :disabled="isMale===null"
              >
                <font-awesome-icon icon="chart-line" />
              </b-button>
            </b-col>
            <b-col cols="2">
              length
              <b-button variant="outline-primary" @click="chart('length')">
                <font-awesome-icon icon="chart-line" />
              </b-button>
            </b-col>
            <b-col cols="2">
              head-circ
              <b-button variant="outline-primary" @click="chart('head-circumference')">
                <font-awesome-icon icon="chart-line" />
              </b-button>
            </b-col>
            <b-col cols="2">
              bmi
              <b-button variant="outline-primary" @click="chart('BMI')">
                <font-awesome-icon icon="chart-line" />
              </b-button>
            </b-col>
          </b-row>
          <centile-row
            v-for="m in measurements"
            :key="m.rowId"
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
            @delete-row="deleteRow(m.rowId)"
          />
        </b-container>
        <b-button-group>
          <b-button :disabled="!canAdd" :variant="canAdd?'success':'warning'" @click="addRow">
            <font-awesome-icon icon="calendar-plus" />Add data
            <font-awesome-icon icon="ruler" />
          </b-button>
          <b-button @click="sort">
            <font-awesome-icon icon="sort-amount-down" />Sort
          </b-button>
          <b-button
            :disabled="disableSave"
            :variant="disableSave?'warning':'success'"
            @click="save"
          >
            <font-awesome-icon icon="save" />Save
            <transition name="fade">
              <font-awesome-icon v-if="saved" icon="check" />
            </transition>
          </b-button>
          <b-button variant="danger" @click="clear">
            <font-awesome-icon icon="eraser" />Clear All
          </b-button>
        </b-button-group>
      </form>
    </validation-observer>
    <b-modal
      id="centile-modal"
      ref="centile-modal"
      hide-footer
      ok-only
      :title="chartType+' centiles'"
      :lazy="true"
    >
      <svg-centiles
        :measurements="plotPoints"
        :is-male="isMale"
        :chartType="chartType"
        :gestAgeWeeks="weeksGestation"
      />
    </b-modal>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  UKWeightData,
  UKBMIData,
  UKLengthData,
  UKHeadCircumferenceData,
  IAnthropometry
} from '@/services/anthropometry/';
import {
  centileString,
  alarmLevel,
  ICentileVal
} from '@/services/utilities/centileString';
import DobInput from '@/components/DobInput.vue';
import ValidatedBoolRadioGroup from '@/components/formGroups/ValidatedBoolRadioGroup.vue';
import CentileRow, { ICentileVals } from '@/components/CentileRow.vue';

import { sortByDateProp } from '@/services/utilities/sortByProp';
import SvgCentiles, { chartType } from '@/components/SvgCentiles.vue';
import NhiInput from '@/components/NhiInput.vue';
import { BButtonGroup } from 'bootstrap-vue';

import { msPerDay } from '@/services/infusion-calculations/PresentationClasses/Dosing/PatientDetails/ChildAge';
import {
  PatientDBLocal,
  IGrowthMeasures,
  IPatient
} from '@/services/patientDb';

type vueNumber = number | '';
interface IIdCentileVals extends ICentileVals {
  rowId: symbol;
}

@Component({
  provide: {
    wtCentiles: new UKWeightData(),
    lengthCentiles: new UKLengthData(),
    hcCentiles: new UKHeadCircumferenceData(),
    bmiCentiles: new UKBMIData(),
  },
  components: {
    DobInput,
    ValidatedBoolRadioGroup,
    CentileRow,
    SvgCentiles,
    NhiInput,
    BButtonGroup,
  },
})
export default class Centiles extends Vue {
  public nhi = '';
  public isNhiValid = false;
  public isMale: null | boolean = null;
  public weeksGestation: vueNumber = 40;
  public dob: Date | null = null;
  public saved = false;
  public today = new Date();
  public measurements: IIdCentileVals[] = [];
  // graph properties
  public chartType: chartType | '' = '';
  public plotPoints: IAnthropometry[] = [];

  private patientDb!: PatientDBLocal;

  public created() {
    this.patientDb = new PatientDBLocal();
    this.today.setHours(0, 0, 0, 0);
  }

  public get canAdd() {
    return !!(this.dob && this.isMale !== null && this.weeksGestation);
  }

  public addRow() {
    this.measurements.push({
      rowId: Symbol('rowId'),
      measureDate: this.measurements.some(
        m => (m.measureDate && m.measureDate.getTime()) === this.today.getTime()
      )
        ? null
        : this.today,
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

  public clear() {
    this.nhi = '';
    this.isMale = null;
    this.weeksGestation = 40;
    this.dob = null;
    this.measurements = [];
  }

  public get disableSave() {
    return !this.isNhiValid || this.dob === null || this.isMale === null;
  }

  public async save() {
    this.sort();
    const saveData = {
      weeksGestation: this.weeksGestation || 40,
      dob: this.dob!,
      isMale: this.isMale!,
      measurements: this.measurements.reduce(
        (prev, m) => {
          if (m.measureDate && (m.wtKg || m.hcCm || m.lengthCm)) {
            prev.push({
              date: m.measureDate,
              weightKg: m.wtKg || void 0,
              hcCm: m.hcCm || void 0,
              lengthCm: m.lengthCm || void 0,
            });
          }
          return prev;
        },
        [] as IGrowthMeasures[]
      ),
    } as IPatient;
    // not doing a put here in case in the future we have saved other details such as name we did not wish to overwrite

    if (!(await this.patientDb.patients.update(this.nhi, saveData))) {
      saveData.nhi = this.nhi;
      await this.patientDb.patients.add(saveData);
    }

    this.saved = true;
    const self = this;
    setTimeout(() => (self.saved = false), 2000);
  }

  public deleteRow(rowId: symbol) {
    const indx = this.measurements.findIndex(m => m.rowId === rowId);
    if (indx !== -1) {
      this.measurements.splice(indx, 1);
    }
  }

  public async lookupNhi(isNhiValid: boolean) {
    this.isNhiValid = isNhiValid;
    if (isNhiValid) {
      const data = await this.patientDb.patients.get(this.nhi);
      if (data) {
        this.weeksGestation = data.weeksGestation;
        this.dob = data.dob;
        this.isMale = data.isMale;
        this.measurements = data.measurements.map(m => ({
          rowId: Symbol(m.date.toString()),
          measureDate: m.date,
          today: this.today,
          wtKg: m.weightKg || ('' as vueNumber),
          hcCm: m.hcCm || ('' as vueNumber),
          lengthCm: m.lengthCm || ('' as vueNumber),
          bmi: '' as vueNumber,
        }));
        this.addRow();
      }
    }
  }

  public chart(chartName: chartType) {
    if (!this.dob || this.isMale === null) {
      return;
    }
    this.sort();
    this.chartType = chartName;
    const dobTime = this.dob.getTime();
    const prop = chartTypeToMeasurement(chartName);
    this.plotPoints = this.measurements.reduce(
      (arr, m) => {
        const v = m[prop] as vueNumber;
        if (m.measureDate !== null && v !== '') {
          arr.push({
            ageDays: Math.floor((m.measureDate.getTime() - dobTime) / msPerDay),
            measure: v,
          });
        }
        return arr;
      },
      [] as IAnthropometry[]
    );
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
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
