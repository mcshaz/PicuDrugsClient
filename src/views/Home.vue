<template>
  <div class="home">
    <b-jumbotron header="Drug Calculator" 
        lead="Rescitation ± ICU infusion charts" />
    <PatientAgeWeightData>
      <b-form-group label-for="ward" label-cols-md="2" label="Ward:" invalid-feedback="Please select a ward">
        <b-form-select v-model="ward" :options="wards" required>
          <template slot="first">
            <option :value="-1" disabled>Please select a ward</option>
          </template>
        </b-form-select>
      </b-form-group>
      <b-form-group label-cols-md="2" label="chart type:" invalid-feedback="Please select at least 1 chart"
          :state="boluses||infusions">
        <b-form-checkbox-group id="chart-type-group" name="charts">
          <b-form-checkbox v-model="boluses">Bolus Drugs</b-form-checkbox>
          <b-form-checkbox v-model="infusions" :disabled="!infusionsAvailable">Infusions</b-form-checkbox>
        </b-form-checkbox-group>>
      </b-form-group>
    </PatientAgeWeightData>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject } from 'vue-property-decorator';
import PatientAgeWeightData from '@/components/PatientAgeWeightData.vue';
import { IEntityWard, IDrugDB, appDataType, IWardDefaults } from '@/services/db';

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

  private pSelectedWard?: IEntityWard;
  private wards!: IEntityWard[];
  @Inject('db')
  private db!: IDrugDB;

  public created() {
    const wardsReady = this.db.wards.toArray().then((data) => {
      this.wards = data.filter((w) => w.isLive);
      this.wardOptions = this.wards.map((w) => ({ value: w.wardId, text: w.fullname } as ISelectOption));
    });
    if (this.$route.query.ward) {
      wardsReady.then(() => { this.pSelectedWard = this.wards.find((w) => w.abbrev === this.$route.query.ward); });
    } else {
      this.db.appData.get(appDataType.wardDefaults).then((ad) => {
        if (ad) {
          const defaults = JSON.parse(ad.data) as IWardDefaults;
          this.boluses = defaults.boluses;
          this.infusions = defaults.infusions;
          wardsReady.then(() => { this.pSelectedWard = this.wards.find((w) => w.wardId === defaults.wardId); });
        }
      });
    }
  }

  public get selectedWardId() {
    return this.pSelectedWard
      ? this.pSelectedWard.wardId
      : -1;
  }
  public set selectedWardId(value: number) {
    this.pSelectedWard = value === -1
      ? void 0
      : this.wards.find((w) => w.wardId === value);
    if (this.pSelectedWard) {
      this.infusions = !this.pSelectedWard.defaultBolusOnly;
      this.infusionsAvailable = this.pSelectedWard.infusionDrugIds.length > 0;
    }
  }
}
</script>
