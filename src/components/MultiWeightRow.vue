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
import { ChildAge, daysPerYear, daysPerMonth } from '@/services/infusion-calculations/PresentationClasses/Dosing/PatientDetails/ChildAge';
import { CentileRange, IMedianMatchResult } from '@/services/anthropometry/CentileRange';
import { searchComparison } from '@/services/anthropometry';
import { vueNumber } from './PatientAgeData.vue';
import { inverseCumSNorm } from '@/services/anthropometry/graphing/inverseCumSNorm';

const monthCut = daysPerYear * 2;
const halfCut = daysPerYear * 12;

const lqZ = inverseCumSNorm(0.25);

@Component
export default class MultiWeightRow extends Vue {
    @Prop({required: true})
    public wtKg!: vueNumber;
    @Inject('wtCentiles')
    private wtCentiles!: UKWeightData;

    public get maleMedianAgeForWeight() {
        if (this.wtKg === '') { return ''; }
        const ageDays = this.wtCentiles.maleRange.ageDaysForMedian(this.wtKg);
        this.$emit('male-median-age', ageDays);
        return this.ageString(ageDays);
    }

    public get maleIQRAgeForWeight() {
        return this.iqrString(this.wtCentiles.maleRange);
    }

    public get femaleMedianAgeForWeight() {
        if (this.wtKg === '') { return ''; }
        const ageDays = this.wtCentiles.femaleRange.ageDaysForMedian(this.wtKg);
        this.$emit('female-median-age', ageDays);
        return this.ageString(ageDays);
    }

    public get femaleIQRAgeForWeight() {
        return this.iqrString(this.wtCentiles.femaleRange);
    }

    private iqrString(centiles: CentileRange) {
        if (this.wtKg === '') { return ''; }
        const lb = this.ageString(centiles.ageDaysForZ(-lqZ, this.wtKg));
        const ub = this.ageString(centiles.ageDaysForZ(lqZ, this.wtKg));
        if (lb === ub) { return lb; }
        return `${lb} – ${ub}`;
    }

    private ageString(match: IMedianMatchResult) {
        switch (match.matchType) {
            case searchComparison.greaterThanMax:
                return '> max';
            case searchComparison.lessThanMin:
                return `< ${this.wtCentiles.maleRange.gestAgeData.minAge}/40`;
            case searchComparison.inRange:
                const roundDays = Math.round(match.ageDays);
                if (match.gestation < 40) {
                    if (roundDays >= 7) {
                        return `${match.gestation + 1}/40`;
                    }
                    if (roundDays === 0) {
                        return `${match.gestation}/40`;
                    }
                    return`${match.gestation}<sup>+${roundDays}</sup>/40`;
                }
                if (roundDays <= 30) {
                    return `${roundDays} day${roundDays === 1 ? '' : 's'}`;
                }
                if (roundDays < monthCut) {
                    const mth = Math.round(roundDays * 2 / daysPerMonth) / 2;
                    return mth % 1 === 0
                        ? `${mth} month${mth === 1 ? '' : 's'}`
                        : (mth - 0.5) + '½ months';
                }
                if (roundDays < halfCut) {
                    const yrs =  Math.round(roundDays * 2 / daysPerYear) / 2;
                    return yrs % 1 === 0
                        ? yrs + ' years'
                        : (yrs - 0.5) + '½ years';
                }
                return (roundDays / daysPerYear).toFixed() + ' years';
            default:
                throw new Error('unrecognised result');
        }
    }
}
</script>
