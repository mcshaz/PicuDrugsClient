<template>
<tr>
    drug.calculatedDoseUnit
    drug.rateUnit

    in concentrations
    conc.calculatedDose
    conc.infusionRate

    conc.drawingUpDose
    amp.drawingUpVolume
    conc.oneMlHrDose
    conc.finalVolume
    in ampuleDetails
  </tr>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Inject, Watch } from 'vue-property-decorator';
import { UKWeightData, medianMatchAvg } from '@/services/anthropometry/';
import { IMedianMatchResult } from '@/services/anthropometry/CentileRange';

import { ageString } from '@/services/utilities/ageString';
// import { IEntityFixedInfusionDrug } from '@/services/drugDb';
import { transformFixedInfusions, IPatientFixedInfusionDrug, FixedInfusionDrugVM } from '@/services/infusion-calculations';

type vueNumber = number | '';

@Component
export default class InfusionSandboxTable extends Vue {
    @Prop({ required: true })
    public wtKg!: number;

    @Prop({ required: true })
    public drugData!: IPatientFixedInfusionDrug;

    @Inject('wtCentiles')
    private wtCentiles!: UKWeightData;

    private ageForWeight = '';
    private patientInfusion: FixedInfusionDrugVM | null = null;
    private noData = true;
    private ageDays!: IMedianMatchResult;

    private created() {
      this.ageDays = medianMatchAvg(this.wtCentiles.maleRange.ageDaysForMedian(this.wtKg),
        this.wtCentiles.femaleRange.ageDaysForMedian(this.wtKg));
      // using male range because for the data we have for the weight metric, these are both the same.
      this.ageForWeight = ageString(this.wtCentiles.maleRange.gestAgeData.minAge, this.ageDays);
    }

    @Watch('drugData', { deep: true })
    private drugDataChange() {
      if (this.drugData) {
        this.patientInfusion = transformFixedInfusions(this.wtKg, this.drugData);
      } else {
        this.patientInfusion = null;
      }
    }
}
</script>
