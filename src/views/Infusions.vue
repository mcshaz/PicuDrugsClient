<template>
  <div class="home">
    <h2>Drug Calculator - Individual drug infusions </h2>
    <patient-age-weight-data :exactAge="selectedDrug&&!selectedDrug.isTitratable">
      <b-form-group label-cols-lg="2" label-cols-xl="2" label="Drug:"
          invalid-feedback="Please select a drug" :state="!!selectedDrugVM">
        <vue-single-select placeholder="please select a drug"
            label="fullname" v-model="selectedDrugVM" textField="label" keyField="id"
            :filterBy="filterSearch" :options="searchableDrugs" :required="true" />
      </b-form-group>
      <b-form-group label-for="ampule" label-cols-lg="2" label-cols-xl="2" label="Ampule:"
            invalid-feedback="Please select an ampule">
        <b-form-select v-model="selectedAmpuleIndx" :options="ampules" required
            :disabled="!ampules.length">
          <template slot="first">
            <option :value="null" disabled>ampule concentration...</option>
          </template>
        </b-form-select>
      </b-form-group>
    </patient-age-weight-data>
    <p v-if="link">
      to link to this drug in documentation etc., use the link <a href="#">{{link}}</a>
    </p>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator'
import { SiUnitMeasure } from '@/services/infusion-calculations'
import PatientAgeWeightData from '@/components/PatientAgeWeightData.vue'
import { IEntityInfusion, IDrugDB, appDataType } from '@/services/drugDb'
import VueSingleSelect from '@/components/vendor/VueSingleSelect.vue'
import { sortByStringProp } from '@/services/utilities/sortByProp'

interface ISearchableDrug { label: string; id: number; searchable: string; }
interface ISelectOption { value: number; text: string; disabled?: boolean; }

const sepChar = '|'

@Component({
  components: {
    PatientAgeWeightData,
    VueSingleSelect
  }
})
export default class Infusions extends Vue {
  public searchableDrugs: ISearchableDrug[] = [];
  public selectedDrugVM: ISearchableDrug | null = null;
  public ampules: ISelectOption[] = [];
  public selectedAmpuleIndx: number | null = null;
  private selectedDrug: IEntityInfusion| null = null;

  private baseRef!: string;
  private drugs!: IEntityInfusion[];
  @Inject('db')
  private db!: IDrugDB;
  @Prop({ default: '' })
  private abbrev!: string;

  public created () {
    const drugsReady = this.db.infusionDrugs.toArray().then((data) => {
      sortByStringProp(data, 'fullname')
      this.drugs = data // data.filter((i) => !(i as any).isTitratable) as IEntityFixedInfusionDrug[];
      this.searchableDrugs = data.map((d) => ({
        label: d.fullname,
        id: d.infusionDrugId,
        searchable: (d.fullname + sepChar + (d.abbrev || '')).toLowerCase() } as ISearchableDrug))
    })
    this.baseRef = window.location.origin + this.$route.path
    if (!this.baseRef.endsWith('/')) {
      this.baseRef += '/'
    }
    if (this.abbrev) {
      this.baseRef = this.baseRef.slice(0, -1 - this.abbrev.length)
      drugsReady.then(() => {
        const searchFor = sepChar + this.abbrev.toLowerCase()
        this.selectedDrugVM = this.searchableDrugs.find((d) => d.searchable.endsWith(searchFor)) || null
      })
    }
  }

  @Watch('selectedDrugVM')
  public selectionChange (newVal: ISearchableDrug | null, oldVal: ISearchableDrug | null) {
    if (newVal !== oldVal) {
      this.selectedDrug = newVal
        ? (this.drugs.find((d) => d.infusionDrugId === newVal.id) || null)
        : null
      if (this.selectedDrug) {
        this.ampules = this.selectedDrug.drugAmpuleConcentrations.map((c, indx) => ({
          value: indx,
          text: `${c.concentration * c.volume} ${(new SiUnitMeasure(this.selectedDrug!.siPrefix, this.selectedDrug!.siUnitId)).toString()} in ${c.volume} ml`
        } as ISelectOption))
        if (this.ampules.length === 1) {
          this.selectedAmpuleIndx = 0
        }
      } else {
        this.ampules = []
        this.selectedAmpuleIndx = null
      }
    }
  }

  public get link () {
    return this.selectedDrug
      ? this.baseRef + encodeURIComponent(this.selectedDrug.abbrev)
      : ''
  }

  public filterSearch (option: ISearchableDrug, searchText: string) {
    return option.searchable
      .includes(searchText.toString().toLowerCase())
  }
}
</script>
