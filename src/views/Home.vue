<template>
  <div class="home">
    <h2>Drug Calculator - Rescitation ± ICU infusion charts </h2>
    <b-row align-h="end">
      <b-col lg="7">
        <validation-observer v-slot="{passes, invalid}" slim>
          <form novalidate @submit.prevent="passes(submit)" class="card p-2" autocomplete="off">
            <validated-input-group label="Patient Name" label-cols-lg="2" label-align-lg="right" type="text" v-model="name"
              placeholder="Patient Name" trim/>
            <nhi-input v-model="nhi" label-cols-lg="2"/>
            <patient-age-data v-model="age" label-cols-lg="2"/>
            <validated-bool-radio-group label="Gender" true-label="Male" false-label="Female" v-model="isMale" :stacked="false" label-cols-lg="2"/>
            <validated-input-group label="Gestation" :disabled="gestationDisabled" v-model="weeksGestation" append="weeks" name="gestation"
              min="22" max="43" :description="gestationDescription" label-cols-lg="2" placeholder="Completed Weeks"/>
            <age-validated-weight label-cols-lg="2" :require-age="isAgeRequired" v-model="weightKg" :age="age" :weeks-gestation="weeksGestation" :is-male="isMale"/>
            <validated-bool-radio-group label="Weight is" v-model="isWtMeasured" false-label="estimate on age or appearance" true-label="recent measure" label-cols-lg="2"/>
            <chart-type :wardAbbrev="wardName"
                @update:ward="ward=$event"
                :chart-types.sync="charts"
                @not-found:ward-abbrev="notFound"
                label-cols-lg="2"/>
            <b-row align-h="end">
              <b-col lg="10">
                <b-button type="submit" :variant="invalid ? '' : 'success'" :disabled="invalid">Create Chart</b-button>
              </b-col>
            </b-row>
          </form>
        </validation-observer>
      </b-col>
      <b-col xl="5" lg="5">
        <b-card header="Did you know:">
          <b-card-body>
            <p>
              You can permanently set the <router-link to="/browser-defaults">default selections for this page</router-link>.
            </p>
            <p>
              Do you write the date as {{dateEg}}? If not, your browser culture settings are incorrect <span class="text-muted">(e.g. US English rather than NZ English)</span>.
              See <a href="https://www.w3.org/International/questions/qa-lang-priorities" target="_blank">these directions</a> to set the appropriate language/culture for your browser.
            </p>
            <p v-if="link">
              To provide a hyperlink to this ward in protocols etc., copy the link <a href="#" target="_self">{{link}}</a>
            </p>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop } from 'vue-property-decorator';
import AgeValidatedWeight from '@/components/AgeValidatedWeight.vue';
import ChartType from '@/components/ChartType.vue';
import NhiInput from '@/components/NhiInput.vue';
import PatientAgeData, { vueNumber } from '@/components/PatientAgeData.vue';
import ValidatedBoolRadioGroup from '@/components/formGroups/ValidatedBoolRadioGroup.vue';
import { IWardChartData } from '@/components/ComponentCommunication';
import { IEntityWard, IAppData, definedCharts } from '@/services/drugDb';
import { dateOrder } from '@/services/utilities/dateHelpers';

import { ChildAge } from '../services/infusion-calculations';

interface ISelectOption { value: number; text: string; disabled?: boolean }

@Component({
  components: {
    AgeValidatedWeight,
    ChartType,
    NhiInput,
    PatientAgeData,
    ValidatedBoolRadioGroup,
  },
})
export default class Home extends Vue {
  private charts: definedCharts[] = [];
  private ward: IEntityWard | null = null;
  public name = '';
  public nhi = '';
  public weeksGestation: vueNumber = 40;
  public weightKg: vueNumber = '';
  public isMale: boolean | null = null;
  public isWtMeasured = true;
  public centileString = '';
  public age: ChildAge | null = null;
  public dateEg = dateOrder.join('');
  @Inject('appData')
  private appData!: IAppData;

  @Prop({ default: '' })
  private wardName!: string;

  public submit() {
    this.appData.setWardDefaults({
      chartTypes: this.charts,
      wardAbbrev: this.ward!.abbrev,
      formalSet: false,
    });
    const chartData: IWardChartData = {
      charts: this.charts,
      ward: this.ward!,
      name: this.name,
      nhi: this.nhi,
      age: this.age,
      isMale: this.isMale,
      weeksGestation: this.weeksGestation,
      weightKg: this.weightKg as number,
      isWtEstimate: !this.isWtMeasured,
      centileString: this.centileString,
    };
    this.$router.push({ name: 'ward-chart', params: { chartData } } as any);
  }

  public get link() {
    return this.ward
      ? window.location.origin + this.$router.currentRoute.fullPath + encodeURIComponent(this.ward.abbrev)
      : '';
  }

  public get gestationDisabled() {
    return this.age && this.age.years >= 2;
  }

  public get gestationDescription() {
    if (!this.age) {
      return 'only used if an age or DOB is provided';
    }
    if (this.age.years >= 2) {
      return 'not relevant if age ≥ 2 years';
    }
    return 'weeks gestation @ delivery';
  }

  public get isAgeRequired() {
    return this.charts.includes('infusion');
  }

  public notFound() {
    this.$router.push({ name: 'not-found', query: { path: window.location.href }, params: { pathMatch: 'foo' } }); // pathMatch provided as per https://github.com/vuejs/vue-router/issues/3062
  }
}

</script>
<style>
#gestation {
  max-width: 12em;
}
</style>
