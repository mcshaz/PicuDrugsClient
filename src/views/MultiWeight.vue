<template>
  <div class="prinatableCharts">
    <h2>Drug Calculator - Create printable charts
    </h2>
    <form class="was-validated" @submit.prevent>
      <ward-select @ward="ward=$event" :ward-abbrev="wardName"
          @boluses="boluses=$event" :boluses="boluses"
          @infusions="infusions=$event" :infusions="infusions" 
          @infusions-available="infusionsAvailable=$event" />
    </form>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Weight(kg)</th>
          <th scope="col">Male Median <small>(IQR)</small></th>
          <th scope="col">Female Median <small>(IQR)</small></th>
          <th scope="col" class="small">remove</th>
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
            <form class="form-inline" @submit.prevent="addRow">
              <input type="number" class="form-control" v-model.number="weightInEditor" :min="min" :max="max" step="0.1">
              <b-button type="submit" :disabled="weightInEditor===''||weightInEditor<min||weightInEditor>max">
                <font-awesome-icon icon="plus" />
              </b-button>
            </form>
          </td>
          <td colspan="3">
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop } from 'vue-property-decorator';
import WardSelect from '@/components/WardSelect.vue';
import { IPatientData, IWardChartData } from '@/components/ComponentCommunication';
import { IEntityWard } from '@/services/drugDb';
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

  @Prop({default: ''})
  private wardName!: string;

  public addRow() {
    if (this.weightInEditor === '' || this.weightInEditor <= 0) {
      return;
    }
    if (!this.weights.includes(this.weightInEditor)) {
      this.weights.push(this.weightInEditor);
      this.weights.sort((a, b) => {
        if (a === b) { return 0; }
        return a > b ? 1 : -1;
      });
    }
    this.weightInEditor = '';
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
    this.$router.push({ name: 'ward-chart', params: { chartData }} as any);
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
