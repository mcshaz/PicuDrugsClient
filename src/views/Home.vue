<template>
  <div class="home">
    <b-jumbotron header="Drug Calculator" 
        lead="Rescitation ± ICU infusion charts" />
    <PatientAgeWeightData @valid-submit="submit" :requireAnyAge="infusions">
      <b-form-group label-for="ward" label-cols-md="2" label="Ward:" invalid-feedback="Please select a ward">
        <b-form-select v-model="selectedWardId" :options="wardOptions" required name="ward" >
          <template slot="first">
            <option :value="null" disabled>Please select a ward</option>
          </template>
        </b-form-select>
      </b-form-group>
      <b-form-group label-cols-md="2" label="Chart type:" invalid-feedback="Please select at least 1 chart"
          :state="boluses||infusions">
        <div role="group" tabindex="-1">
          <b-form-checkbox class="custom-control-inline" v-model="boluses" name="boluses" :required="!infusions" :state="boluses||infusions">
            Bolus Drugs
          </b-form-checkbox>
          <b-form-checkbox class="custom-control-inline" v-model="infusions" :disabled="!infusionsAvailable" name="infusions" :required="!boluses" :state="boluses||infusions">
            Infusions
          </b-form-checkbox>
        </div>
      </b-form-group>
    </PatientAgeWeightData>
    <p v-if="link">
      to provide a hyperlink to this ward in protocols etc., copy the link <a href="#">{{link}}</a>
    </p>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop } from 'vue-property-decorator';
import PatientAgeWeightData from '@/components/PatientAgeWeightData.vue';
import { IPatientData, IWardChartData } from '@/components/ComponentCommunication';
import { IEntityWard, IDrugDB, appDataType, IWardDefaults } from '@/services/db';
import { sortByStringProp } from '@/services/utilities/sortByProp';

interface ISelectOption { value: number; text: string; disabled?: boolean; }

@Component({
  components: {
    PatientAgeWeightData,
  },
})
export default class Home extends Vue {
  public boluses = true;
  public infusions = true;
  public infusionsAvailable = true;
  public wardOptions: ISelectOption[] = [];

  private selectedWard: IEntityWard | null = null;
  private wards!: IEntityWard[];
  @Inject('db')
  private db!: IDrugDB;
  @Prop({default: ''})
  private wardName!: string;
  private baseRef!: string;
  private defaultInfusion!: boolean;

  public created() {
    const wardsReady = this.db.wards.toArray().then((data) => {
      this.wards = data.filter((w) => w.isLive);
      sortByStringProp(this.wards, 'fullname');
      this.wardOptions = this.wards.map((w) => ({ value: w.wardId, text: w.fullname } as ISelectOption));
    });
    this.baseRef = window.location.origin + this.$route.path;
    if (!this.baseRef.endsWith('/')) {
      this.baseRef += '/';
    }
    if (this.wardName) {
      this.baseRef = this.baseRef.slice(0, -1 - this.wardName.length);
      wardsReady.then(() => {
        const searchFor = this.wardName.toLowerCase();
        this.selectedWard = this.wards.find((w) => w.abbrev.toLowerCase() === searchFor) || null;
        });
    } else {
      this.db.appData.get(appDataType.wardDefaults).then((ad) => {
        if (ad) {
          const defaults = JSON.parse(ad.data) as IWardDefaults;
          this.boluses = defaults.boluses;
          this.defaultInfusion = this.infusions = defaults.infusions;
          wardsReady.then(() => { this.selectedWard = this.wards.find((w) => w.wardId === defaults.wardId) || null; });
        }
      });
    }
  }

  public get selectedWardId() {
    return this.selectedWard
      ? this.selectedWard.wardId
      : null;
  }
  public set selectedWardId(value: number | null) {
    this.selectedWard = value === null
      ? null
      : (this.wards.find((w) => w.wardId === value) || null);
    if (this.selectedWard) {
      this.infusionsAvailable = this.selectedWard.infusionSortOrderings.length > 0;
      this.infusions = this.infusionsAvailable && !this.selectedWard.defaultBolusOnly;
    }
  }

  public submit(data: IPatientData) {
    if (this.selectedWard === null) {
      throw new Error('validation failing - selectedWard was null but valid submit reached');
    }
    const chartData = data as IWardChartData;
    chartData.boluses = this.boluses;
    chartData.infusions = this.infusions;
    chartData.ward = this.selectedWard;
    this.$router.push({ name: 'ward-chart', params: { chartData }} as any);
  }

  public get link() {
    return this.selectedWard
      ? this.baseRef + encodeURIComponent(this.selectedWard.abbrev)
      : '';
  }
}
</script>
