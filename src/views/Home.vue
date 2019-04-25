<template>
  <div class="home">
    <b-jumbotron header="Drug Calculator" 
        lead="Rescitation ± ICU infusion charts" />
    <PatientAgeWeightData @valid-submit="submit" >
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
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject } from 'vue-property-decorator';
import PatientAgeWeightData from '@/components/PatientAgeWeightData.vue';
import { IPatientData } from '@/components/ComponentCommunication';
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
      : null;
  }
  public set selectedWardId(value: number | null) {
    this.pSelectedWard = value === null
      ? void 0
      : this.wards.find((w) => w.wardId === value);
    if (this.pSelectedWard) {
      this.infusions = !this.pSelectedWard.defaultBolusOnly;
      this.infusionsAvailable = this.pSelectedWard.infusionDrugIds.length > 0;
    }
  }

  public submit(data: IPatientData) {
    if (this.infusions) {
      this.$router.push('');
    }
  }
}
</script>
