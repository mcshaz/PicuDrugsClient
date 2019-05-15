<template>
  <div class="prinatableCharts">
    <h2>Drug Calculator - Create printable charts
    </h2>
    <form class="was-validated" @submit.prevent>
      <ward-select @ward="ward=$event" :ward-abbrev="wardName||defaultWardAbbrev"
          @boluses="boluses=$event" :boluses="boluses"
          @infusions="infusions=$event" :infusions="infusions" 
          @infusions-available="infusionsAvailable=$event" />

      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col" rowspan="2">Weight(kg)</th>
            <th scope="col">Male</th>
            <th scope="col">Female</th>
            <th></th>
          </tr>
          <tr>
            <th scope="col" >Median<small>(IQR)</small></th>
            <th scope="col" >Median<small>(IQR)</small></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <multi-weight-row v-for="(w, indx) in weights" 
              :key="w"
              :wtKg="w"
              @edit-row="edit(indx)"
              @delete-row="del(indx)"
          />
        </tbody>
        <tfoot>
          <tr>
            <td>
              <input type="number" class="form-control" v-model.number="weightInEditor" :min="min" :max="max">
            </td>
            <td colspan="3">
              <b-button :disabled="weightInEditor===''||weightInEditor<min||weightInEditor>max">
                Add
              </b-button>
            </td>
          </tr>
        </tfoot>
      </table>
    </form>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';
import PatientAgeWeightData from '@/components/PatientAgeWeightData.vue';
import WardSelect from '@/components/WardSelect.vue';
import { IPatientData, IWardChartData } from '@/components/ComponentCommunication';
import { IEntityWard, IDrugDB, IAppData } from '@/services/drugDb';
import { sortByStringProp } from '@/services/utilities/sortByProp';
import MultiWeightRow from '@/components/MultiWeightRow.vue';
import { UKWeightData } from '@/services/anthropometry';

type vueNumber = number | '';
interface ISelectOption { value: number; text: string; disabled?: boolean; }

@Component({
  components: {
    WardSelect,
    MultiWeightRow,
  },
  provide: {
    wtCentiles: new UKWeightData(),
  },
})
export default class MultiWeight extends Vue {
  public boluses = true;
  public infusions = true;
  public infusionsAvailable = false;
  public weights: number[] = [2.5, 3, 3.5, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80];
  public weightInEditor: vueNumber = '';
  public min = 0.1;
  public max = 100;
  private ward: IEntityWard | null = null;
  private defaultWardAbbrev = '';
  @Inject('db')
  private db!: IDrugDB;
  @Inject('appData')
  private appData!: IAppData;
  @Prop({default: ''})
  private wardName!: string;
  private baseRef!: string;
  private setOnWardReady!: boolean;

  public created() {
    // route might be user typed & is valid with or without trailing '/'
    this.baseRef = process.env.VUE_APP_BASE_URL! + setSlash(this.$route.path);
    // logic should be - if wardName prop defined or if no appData use ward.isBolusOnly
    // else use appData
    // nb 2 promises - do not set up race condition - should be ok as in created hook
    if (this.wardName) {
      this.baseRef = this.baseRef.slice(0, -1 - this.wardName.length);
      this.setOnWardReady = true;
    } else {
      this.appData.getWardDefaults().then((wd) => {
        this.setOnWardReady = !wd;
        if (wd) {
          this.boluses = wd.boluses;
          this.infusions = wd.infusions;
          this.defaultWardAbbrev = wd.wardAbbrev;
        }
      });
    }
  }

  public addRow() {
    if (this.weightInEditor === '' || this.weightInEditor <= 0) {
      throw new Error('cannot add empty or <= 0 weight');
    }
    if (!this.weights.includes(this.weightInEditor)) {
      this.weights.push(this.weightInEditor);
      this.weights.sort();
    }
  }

  public del(indx: number) {
    this.weights.splice(indx, 1);
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

  @Watch('ward')
  public watchWard(newVal: IEntityWard, oldVal: IEntityWard) {
    if (this.setOnWardReady && newVal && !oldVal) {
      this.infusions = !newVal.defaultBolusOnly;
      this.boluses = true;
      this.setOnWardReady = false;
    }
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
