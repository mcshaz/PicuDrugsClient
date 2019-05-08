<template>
  <b-row class="justify-content-md-left">
      <b-col>
          <date-input 
            :value="measureDate" 
            :min="dob" 
            :max="today"
            @input="$emit('date-change', $event)" />
      </b-col>
      <b-col>
            <input class="form-control" type="text" :value="ageString" readonly="readonly" />
      </b-col>
      <CentileCell 
            measure="wt"
            :value="wtKg"
            @debounced-input="$emit('wt-change', $event)"
            units="kg"
            :centile="wtCentile" />
      <CentileCell 
            measure="length"
            :value="lengthCm"
            @debounced-input="$emit('length-change', $event)" 
            units="cm"
            :centile="lengthCentile" />
      <CentileCell
            measure="head-circ"
            :value="hcCm"
            @debounced-input="$emit('hc-change', $event)" 
            units="cm"
            :centile="hcCentile" />
      <CentileCell
            measure="bmi"
            :value="bmi"
            :centile="bmiCentile" 
            :read-only="true" >
          <span>
              kg/m<sup>2</sup>
          </span>
      </CentileCell>
  </b-row>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Watch, Inject } from 'vue-property-decorator';
import { UKWeightData, UKBMIData, UKLengthData, UKHeadCircumferenceData, CentileCollection } from '@/services/anthropometry/';
import { centileString } from '@/services/utilities/centileString';
import { ChildAge, msPerDay } from '@/services/infusion-calculations/PresentationClasses/Dosing/PatientDetails/ChildAge';
import CentileCell from './CentileCell.vue';
import DateInput from './DateInput.vue' ;

type vueNumber = number | '';

export interface ICentileVals {
    // setter only
    today: Date;
    // rest
    measureDate: Date | null;
    wtKg: vueNumber;
    hcCm: vueNumber;
    lengthCm: vueNumber;
    bmi: vueNumber;
}

@Component({
    components: {
        CentileCell,
        DateInput,
    },
})
export default class CentileRow extends Vue implements ICentileVals {
    @Prop({required: true})
    public dob!: Date | null;
    @Prop({required: true})
    public isMale!: boolean;
    @Prop({required: true})
    public weeksGestation!: vueNumber;
    @Prop({required: true})
    public today!: Date;
    @Prop({required: true})
    public wtKg!: vueNumber;
    @Prop({required: true})
    public hcCm!: vueNumber;
    @Prop({required: true})
    public lengthCm!: vueNumber;
    @Prop({required: true})
    public measureDate!: Date | null;
    private pAgeDays: number | null = null;
    @Inject('wtCentiles')
    private wtCentiles!: UKWeightData;
    @Inject('bmiCentiles')
    private bmiCentiles!: UKBMIData;
    @Inject('lengthCentiles')
    private lengthCentiles!: UKLengthData;
    @Inject('hcCentiles')
    private hcCentiles!: UKHeadCircumferenceData;

    public created() {
        this.setAgeDays();
    }

    public get ageString() {
        if (!this.dob || !this.measureDate) {
            return '';
        }
        const age = ChildAge.ageOnDate(this.dob, this.measureDate);
        return age.years + 'y' + age.months + 'm' + (age.years < 2 ? (age.days + 'd') : '');
    }

    @Watch('measureDate')
    @Watch('isMale')
    @Watch('weeksGestation')
    @Watch('dob')
    public setAgeDays() {
        this.pAgeDays = (!this.dob || !this.measureDate || this.dob > this.measureDate)
            ? null
            : Math.floor((this.measureDate.getTime() - this.dob.getTime()) / msPerDay);
    }

    public get bmi() {
        let returnVar: vueNumber;
        if (!this.wtKg || !this.lengthCm) {
            returnVar = '';
        } else {
            returnVar = UKBMIData.calculateBMI(this.wtKg, this.lengthCm);
            returnVar = Number(returnVar.toFixed(1));
        }
        this.$emit('bmi-change', returnVar);
        return returnVar;
    }
    public get wtCentile() {
        return this.getCentile(this.wtKg, this.wtCentiles);
    }
    public get lengthCentile() {
        return this.getCentile(this.lengthCm, this.lengthCentiles);
    }
    public get hcCentile() {
        return this.getCentile(this.hcCm, this.hcCentiles);
    }
    public get bmiCentile() {
        return this.getCentile(this.bmi, this.bmiCentiles);
    }

    private getCentile(value: vueNumber, cc: CentileCollection) {
        return value && this.pAgeDays && this.weeksGestation && this.weeksGestation > 23 && this.weeksGestation <= 43
            ? centileString(cc.cumSnormForAge(value, this.pAgeDays, this.isMale, this.weeksGestation) * 100)
            : null;
    }
}
</script>

<style>
  
</style>