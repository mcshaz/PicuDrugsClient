<template>
<tr>
            drug.ampuleUnits
            drug.calculatedDoseUnit
            drug.rateUnit

            in concentrations
            conc.calculatedDose
            conc.infusionRate

            conc.isNeat;

            conc.drawingUpDose
            conc.oneMlHrDose
            conc.finalVolume
            in ampuleDetails

            amp.drawingUpVolume
  </tr>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Inject, Watch } from 'vue-property-decorator';
import { UKWeightData } from '@/services/anthropometry/';
import { IMedianMatchResult } from '@/services/anthropometry/CentileRange';
import { medianMatchAvg } from '@/services/anthropometry';
import { ageString } from '@/services/utilities/ageString';
import { IEntityFixedInfusionDrug } from '@/services/drugDb';
import { getFixedDilutionsForPt, transformFixedInfusions, FixedInfusionDrugVM } from '@/services/infusion-calculations';

type vueNumber = number | '';

@Component
export default class MultiWeightRow extends Vue {
    @Prop({required: true})
    public wtKg!: number;
    @Prop({required: true})
    public drugData!: IEntityFixedInfusionDrug;
    @Inject('wtCentiles')
    private wtCentiles!: UKWeightData;

    public ageForWeight = '';
    private patientInfusion: FixedInfusionDrugVM | null = null;
    private noData = true;
    private ageDays!: IMedianMatchResult;

    private created() {
        this.ageDays = medianMatchAvg(this.wtCentiles.maleRange.ageDaysForMedian(this.wtKg),
                                       this.wtCentiles.femaleRange.ageDaysForMedian(this.wtKg));
        // using male range because for the data we have for the weight metric, these are both the same.
        this.ageForWeight = ageString(this.wtCentiles.maleRange.gestAgeData.minAge, this.ageDays);
    }

    @Watch('drugData', {deep: true})
    private drugDataChange() {
        const wtSelectedInfusion = getFixedDilutionsForPt(this.drugData, 600, this.wtKg)!;
        if (!wtSelectedInfusion) {
            this.$emit('has-data', false);
        }
        else {
            this.patientInfusion = transformFixedInfusions(this.wtKg, wtSelectedInfusion);
            this.$emit('has-data', true);
        }
    }
}
</script>

