<template>
  <div class="home">
    <b-jumbotron header="Drug Calculator" 
        lead="Individual drug infusions" />
    <PatientAgeWeightData>
      <b-form-group label-cols-md="2" label="Drug:" 
          invalid-feedback="Please select a drug" :state="!!selectedDrugVM">
        <vue-single-select placeholder="please select a drug" 
            label="fullname" v-model="selectedDrugVM" textField="label" keyField="id"
            :filterBy="filterSearch" :options="searchableDrugs" :required="true" />
      </b-form-group>
      <b-form-group label-for="ampule" label-cols-md="2" label="Ampule:" 
            invalid-feedback="Please select an ampule">
        <b-form-select v-model="selectedAmpuleIndx" :options="ampules" required 
            :disabled="!ampules.length">
          <template slot="first">
            <option :value="null" disabled>ampule concentration...</option>
          </template>
        </b-form-select>
      </b-form-group>
    </PatientAgeWeightData>
    <p v-if="route">
      to link to this drug in documentation etc go to <a>{{route}}</a>
    </p>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop } from 'vue-property-decorator';
import { SiUnitMeasure } from '@/services/infusion-calculations';
import PatientAgeWeightData from '@/components/PatientAgeWeightData.vue';
import { IEntityInfusion, IDrugDB, appDataType, IWardDefaults } from '@/services/db';
import VueSingleSelect from '@/components/vendor/VueSingleSelect.vue';

interface ISearchableDrug { label: string; id: number; searchable: string; }
interface ISelectOption { value: number; text: string; disabled?: boolean; }

@Component({
  components: {
    PatientAgeWeightData,
    VueSingleSelect,
  },
})
export default class Infusions extends Vue {
  public searchableDrugs: ISearchableDrug[] = [];
  public pSelectedDrugVM: ISearchableDrug | null = null;
  public ampules: ISelectOption[] = [];
  public selectedAmpuleIndx: number | null = null;
  public route = '';

  private drugs!: IEntityInfusion[];
  private selectedDrug?: IEntityInfusion;
  @Inject('db')
  private db!: IDrugDB;
  @Prop({default:''})
  private abbrev!: string;

  public created() {
    const drugsReady = this.db.infusionDrugs.toArray().then((data) => {
      this.drugs = data; // data.filter((i) => !(i as any).isTitratable) as IEntityFixedInfusionDrug[];
      this.searchableDrugs = data.map((d) => ({
        label: d.fullname,
        id: d.infusionDrugId,
        searchable: (d.fullname + '|' + (d.abbrev || '')).toLowerCase() } as ISearchableDrug));
    });
    if (this.abbrev) {
      drugsReady.then(() => {
        this.selectedDrug = this.drugs.find((d) => d.abbrev === this.abbrev);
      });
    }
  }

  public get selectedDrugVM() { return this.pSelectedDrugVM; }
  public set selectedDrugVM(value: ISearchableDrug | null) {
    this.pSelectedDrugVM = value;
    this.selectedDrug = value ? this.drugs.find((d) => d.infusionDrugId === value.id) : void 0;
    if (this.selectedDrug) {
      this.ampules = this.selectedDrug.drugAmpuleConcentrations.map((c, indx) => ({
        value: indx,
        text: `${c.concentration * c.volume} ${(new SiUnitMeasure(this.selectedDrug!.siPrefix, this.selectedDrug!.siUnitId)).toString()} in ${c.volume} ml`,
      } as ISelectOption));
      if (this.ampules.length === 1) {
        this.selectedAmpuleIndx = this.ampules[0].value;
      }
    } else {
      this.ampules = [];
      this.selectedAmpuleIndx = null;
    }
  }

  public filterSearch(option: ISearchableDrug, searchText: string) {
    return option.searchable
      .includes(searchText.toString().toLowerCase());
  }
}
</script>
