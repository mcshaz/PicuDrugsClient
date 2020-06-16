<template>
  <tr>
      <td v-html="wtKg"></td>
      <td>
        <output>
            <span v-html="maleMedianAgeForWeight"></span>
            <span v-if="maleMedianAgeForWeight!==maleIQRAgeForWeight">
                &nbsp;(<small v-html="maleIQRAgeForWeight"></small>)
            </span>
        </output>
      </td>
      <td>
        <output>
          <span v-html="femaleMedianAgeForWeight"></span>
          <span v-if="femaleMedianAgeForWeight!==femaleIQRAgeForWeight">
              &nbsp;(<small v-html="femaleIQRAgeForWeight"></small>)
          </span>
        </output>
      </td>
      <td>
          <b-button @click="$emit('delete-row')" variant="danger">
              <font-awesome-icon icon="trash-alt" />
          </b-button>
      </td>
  </tr>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Inject } from 'vue-property-decorator';
import { UKWeightData } from '@/services/anthropometry/';
import { CentileRange, IMedianMatchResult } from '@/services/anthropometry/CentileRange';
import { vueNumber } from './PatientAgeData.vue';
import { inverseCumSNorm } from '@/services/anthropometry/graphing/inverseCumSNorm';
import { ageString } from '@/services/utilities/ageString';

const lqZ = inverseCumSNorm(0.25);
let ageForWeightStr!: (ageDays: IMedianMatchResult, abbrev?: boolean) => string;

@Component
export default class MultiWeightRow extends Vue {
    @Prop({ required: true })
    public wtKg!: vueNumber;

    @Inject('wtCentiles')
    private wtCentiles!: UKWeightData;

    private created() {
      if (!ageForWeightStr) {
        // using male range because for the data we have for the weight metric, these are both the same.
        ageForWeightStr = ageString.bind(null, this.wtCentiles.maleRange.gestAgeData.minAge);
      }
    }

    public get maleMedianAgeForWeight() {
      if (this.wtKg === '') { return ''; }
      const ageDays = this.wtCentiles.maleRange.ageDaysForMedian(this.wtKg);
      this.$emit('male-median-age', ageDays);
      return ageForWeightStr(ageDays);
    }

    public get maleIQRAgeForWeight() {
      return this.iqrString(this.wtCentiles.maleRange);
    }

    public get femaleMedianAgeForWeight() {
      if (this.wtKg === '') { return ''; }
      const ageDays = this.wtCentiles.femaleRange.ageDaysForMedian(this.wtKg);
      this.$emit('female-median-age', ageDays);
      return ageForWeightStr(ageDays);
    }

    public get femaleIQRAgeForWeight() {
      return this.iqrString(this.wtCentiles.femaleRange);
    }

    private iqrString(centiles: CentileRange) {
      if (this.wtKg === '') { return ''; }
      const lb = ageForWeightStr(centiles.ageDaysForZ(-lqZ, this.wtKg));
      const ub = ageForWeightStr(centiles.ageDaysForZ(lqZ, this.wtKg));
      if (lb === ub) { return lb; }
      return `${lb} – ${ub}`;
    }
}
</script>
