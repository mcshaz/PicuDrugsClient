<template>
  <div class="home">
    <h2>Drug Calculator - Rescitation ± ICU infusion charts </h2>
    <b-row align-h="end">
      <b-col lg="7" >
        <patient-age-weight-data @valid-submit="submit" :requireAge="infusions&&infusionsAvailable">
          <ward-select @ward="ward=$event" :ward-abbrev="wardName"
              @boluses="boluses=$event" :boluses="boluses"
              @infusions="infusions=$event" :infusions="infusions" 
              @infusions-available="infusionsAvailable=$event" />
        </patient-age-weight-data>
      </b-col>
      <b-col xl="5" lg="5" >
        <b-card header="Did you know:">
          <b-card-body>
            <ul>
              <li>
                you can permanently set the <router-link to="/browser-defaults">default selections for this page</router-link>.
              </li>
              <li v-if="link">
                to provide a hyperlink to this ward in protocols etc., copy the link <a href="#" target="_self" >{{link}}</a>
              </li>
            </ul>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop } from 'vue-property-decorator';
import PatientAgeWeightData from '@/components/PatientAgeWeightData.vue';
import WardSelect from '@/components/WardSelect.vue';
import { IPatientData, IWardChartData } from '@/components/ComponentCommunication';
import { IEntityWard, IAppData } from '@/services/drugDb';

interface ISelectOption { value: number; text: string; disabled?: boolean; }

@Component({
  components: {
    PatientAgeWeightData,
    WardSelect,
  },
})
export default class Home extends Vue {
  public boluses = true;
  public infusions = true;
  public infusionsAvailable = false;
  private ward: IEntityWard | null = null;
  @Inject('appData')
  private appData!: IAppData;
  @Prop({default: ''})
  private wardName!: string;
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

  public submit(data: IPatientData) {
    if (!this.ward) {
      throw new Error('validation failing - selectedWard was null but valid submit reached');
    }
    const chartData = data as IWardChartData;
    chartData.boluses = this.boluses;
    chartData.infusions = this.infusions;
    chartData.ward = this.ward;
    this.appData.setWardDefaults(
        { boluses: this.boluses, infusions: this.infusions, wardAbbrev: this.ward.abbrev, formalSet: false});
    this.$router.push({ name: 'ward-chart', params: { chartData }} as any);
  }

  public get link() {
    return this.ward
      ? this.baseRef + encodeURIComponent(this.ward.abbrev)
      : '';
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
