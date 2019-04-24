<template>
  <div class="home">
    <b-jumbotron header="Drug Calculator" 
        lead="Individual drug infusions" />
    <PatientAgeWeightData>
      <b-form-group label-for="drug" label-cols-md="2" label="Drug:" invalid-feedback="Please select a drug">
          <vue-bootstrap-typeahead
            required
            v-model="drugName"
            :serializer="d=>d.fullname"
            :data="drugs"
            :minMatchingChars="1"
            @hit="setSelected($event)"
            placeholder="Search for infusion"
          />
      </b-form-group>
    </PatientAgeWeightData>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject } from 'vue-property-decorator';
import PatientAgeWeightData from '@/components/PatientAgeWeightData.vue';
import { IEntityFixedInfusionDrug, IDrugDB, appDataType, IWardDefaults } from '@/services/db';
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';

@Component({
  components: {
    PatientAgeWeightData,
    VueBootstrapTypeahead,
  },
})
export default class Home extends Vue {
  public drugs: IEntityFixedInfusionDrug[] = [];

  private selectedDrug?: IEntityFixedInfusionDrug;
  private pDrugName = '';

  @Inject('db')
  private db!: IDrugDB;

  public created() {
    const drugsReady = this.db.infusionDrugs.toArray().then((data) => {
      this.drugs = data.filter((i) => !(i as any).isTitratable) as IEntityFixedInfusionDrug[];
    });
    if (this.$route.query.drug) {
      drugsReady.then(() => { this.setSelected(this.drugs.find((d) => d.fullname === this.$route.query.drug)); });
    }
  }

  public get drugName() { return this.pDrugName; }
  public set drugName(value: string) {
    this.pDrugName = value;
    const matches = this.drugs.filter((d) => d.fullname === value);
    this.selectedDrug = (matches.length === 1)
      ? matches[0]
      : void 0;
  }

  public setSelected(selectedDrug?: IEntityFixedInfusionDrug) {
    this.selectedDrug = selectedDrug;
    this.pDrugName = selectedDrug
      ? selectedDrug.fullname
      : '';
  }

}
</script>
