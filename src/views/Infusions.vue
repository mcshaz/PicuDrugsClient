<template>
  <div class="home">
    <b-jumbotron header="Drug Calculator" 
        lead="Individual drug infusions" />
    <PatientAgeWeightData>
      <b-form-group label-for="drug" label-cols-md="2" label="Drug:" 
          invalid-feedback="Please select a drug" :state="!!selectedDrugVM">
        <vue-single-select placeholder="please select a drug" 
            label="fullname" v-model="selectedDrugVM" textField="label" keyField="id"
            :filterBy="filterSearch" :options="searchableDrugs" :required="true" />
      </b-form-group>
    </PatientAgeWeightData>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject } from 'vue-property-decorator';
import PatientAgeWeightData from '@/components/PatientAgeWeightData.vue';
import { IEntityInfusion, IDrugDB, appDataType, IWardDefaults } from '@/services/db';
import VueSingleSelect from '@/components/vendor/VueSingleSelect.vue';

interface ISearchableDrug { label: string; id: number; searchable: string; }

@Component({
  components: {
    PatientAgeWeightData,
    VueSingleSelect,
  },
})
export default class Infusions extends Vue {
  public searchableDrugs: ISearchableDrug[] = [];
  public pSelectedDrugVM: ISearchableDrug | null = null;

  private drugs!: IEntityInfusion[];
  private selectedDrug?: IEntityInfusion;
  @Inject('db')
  private db!: IDrugDB;

  public created() {
    const drugsReady = this.db.infusionDrugs.toArray().then((data) => {
      this.drugs = data; // data.filter((i) => !(i as any).isTitratable) as IEntityFixedInfusionDrug[];
      this.searchableDrugs = data.map((d) => ({
        label: d.fullname,
        id: d.infusionDrugId,
        searchable: (d.fullname + '|' + (d.abbrev || '')).toLowerCase() } as ISearchableDrug));
    });
    if (this.$route.query.drug) {
      drugsReady.then(() => {
        this.selectedDrug = this.drugs.find((d) => d.fullname === this.$route.query.drug);
      });
    }
  }

  public get selectedDrugVM() { return this.pSelectedDrugVM; }
  public set selectedDrugVM(value: ISearchableDrug | null) {
    this.pSelectedDrugVM = value;
    this.selectedDrug = value ? this.drugs.find((d) => d.infusionDrugId === value.id) : void 0;
  }

  public filterSearch(option: ISearchableDrug, searchText: string) {
    return option.searchable
      .includes(searchText.toString().toLowerCase());
  }
}
</script>
