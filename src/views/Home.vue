<template>
  <div class="home">
    <h2>Drug Calculator - Rescitation ± ICU infusion charts </h2>
    <b-row align-h="end">
      <b-col lg="7">
        <validation-observer v-slot="{passes, invalid}" slim>
          <form novalidate @submit.prevent="passes(submit)" class="card p-2" autocomplete="off">
            <validated-input-group label="Patient Name" label-cols-lg="2" label-align-lg="right" type="text" v-model="name"
                    placeholder="Patient Name" pattern="^[a-zA-Z]" trim/>
            <nhi-input v-model="nhi" label-cols-lg="2"/>
            <patient-age-data v-model="age" label-cols-lg="2"/>
            <validated-bool-radio-group label="Gender" true-label="Male" false-label="Female" v-model="isMale" :stacked="false" label-cols-lg="2"/>
            <validated-input-group label="Weeks Gestation" :disabled="gestationDisabled" v-model="weeksGestation"
              min="22" max="43" :description="gestationDescription" label-cols-lg="2"/>
            <age-validated-weight :require-age="infusions" v-model="weightKg" :age="age" :weeks-gestation="weeksGestation" :is-male="isMale"/>
            <validated-bool-radio-group label="Weight is" v-model="isWtMeasured" false-label="estimate on age or appearance" true-label="recent measure" label-cols-lg="2"/>
            <chart-type :wardAbbrev="wardName"
                @change:ward="ward=$event"
                :boluses.sync="boluses"
                :infusions.sync="infusions" label-cols-lg="2"/>
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
              Do you write the date as {{dateEg}}? If not, your browser culture settings are incorrect <span class="text-muted">(e.g. US English rather than NZ English)</span>
              <a href="https://www.w3.org/International/questions/qa-lang-priorities#changing"> see these directions to set your browser language/culture</a>
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
import PatientAgeData from '@/components/PatientAgeData.vue';
import ValidatedBoolRadioGroup from '@/components/formGroups/ValidatedBoolRadioGroup.vue';
import { IWardChartData } from '@/components/ComponentCommunication';
import { IEntityWard, IAppData } from '@/services/drugDb';
import { dateOrder } from '@/services/utilities/dateHelpers';
import { vueNumber } from '../components/PatientAgeData.vue';
import { ChildAge } from '../services/infusion-calculations';

interface ISelectOption { value: number; text: string; disabled?: boolean; }

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
  public boluses = true;
  public infusions = true;
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

  // unwatched
  private baseRef!: string;

  public created() {
    // route might be user typed & is valid with or without trailing '/'
    this.baseRef = process.env.VUE_APP_BASE_URL! + setSlash(this.$route.path);
    // logic should be - if wardName prop defined or if no appData use ward.isBolusOnly
    // else use appData
    // nb 2 promises - do not set up race condition - should be ok as in created hook
    if (this.wardName) {
      this.baseRef = this.baseRef.slice(0, -1 - this.wardName.length);
    }
  }

  public submit() {
    this.appData.setWardDefaults({
      boluses: this.boluses,
      infusions: this.infusions,
      wardAbbrev: this.ward!.abbrev,
      formalSet: false,
    });
    const chartData: IWardChartData = {
      boluses: this.boluses,
      infusions: this.infusions,
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
      ? this.baseRef + encodeURIComponent(this.ward.abbrev)
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
}

function setSlash(path: string) {
  if (/^\/*$/.test(path)) {
    return '';
  }
  if (!path.endsWith('/')) { // route might be user typed & is valid with or without trailing '/'
    path += '/';
  }
  if (path[0] === '/') {
    path = path.substr(1);
  }
  return path;
}
</script>
