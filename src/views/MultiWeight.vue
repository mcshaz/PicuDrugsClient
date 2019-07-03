<template>
  <div class="prinatableCharts">
    <h2>Drug Calculator - Create printable charts
    </h2>
    <form class="was-validated" @submit.prevent="submit" >
      <ward-select @ward="ward=$event" :ward-abbrev="wardName"
          @boluses="boluses=$event" :boluses="boluses"
          @infusions="infusions=$event" :infusions="infusions" 
          @infusions-available="infusionsAvailable=$event" />
      <b-form-group label="Email:" label-cols-lg="2" label-cols-xl="2" :state="emailValidity"
          invalid-feedback="Please enter a valid email address" label-for="email" v-model="email"
          description="To be notified if the charts for this department are altered/updated">
        <b-input-group >
          <b-input type="email" name="email" ref="email" id="email" v-model="email"/>
          <b-input-group-text slot="append">
            <font-awesome-icon icon="envelope" />
          </b-input-group-text>
        </b-input-group>
      </b-form-group>
      <b-button type="submit" :disabled="!ward" >submit</b-button>
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
            :key="w.wtKg"
            :wtKg="w.wtKg"
            @female-median-age="w.femaleM=$event"
            @male-median-age="w.maleM=$event"
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
import { IMultiWardChartData } from '@/components/ComponentCommunication';
import { IEntityWard, IAppData } from '@/services/drugDb';
import MultiWeightRow from '@/components/MultiWeightRow.vue';
import { UKWeightData, medianMatchAvg } from '@/services/anthropometry';
import { IMedianMatchResult } from '@/services/anthropometry/CentileRange';
import { exampleWeights } from '@/services/utilities/weightHelpers';

type vueNumber = number | '';
interface ISelectOption { value: number; text: string; disabled?: boolean; }
interface IWtAge { wtKg: number; maleM: IMedianMatchResult; femaleM: IMedianMatchResult; }
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
  public email = '';
  public weights: IWtAge[] = exampleWeights
      .map((wtKg) => ({ wtKg } as IWtAge));
  public weightInEditor: vueNumber = '';
  public min = 0.1;
  public max = 100;
  private ward: IEntityWard | null = null;
  private defaultWardAbbrev = '';

  @Prop({default: ''})
  private wardName!: string;

  public get emailValidity() {
    if (this.email.length) {
      return (this.$refs.email as HTMLInputElement).validity.valid;
    }
    return null;
  }

  public addRow() {
    if (this.weightInEditor === '' || this.weightInEditor <= 0) {
      return;
    }
    if (!this.weights.some((w) => w.wtKg === this.weightInEditor)) {
      this.weights.push({ wtKg: this.weightInEditor } as IWtAge);
      this.weights.sort((a, b) => {
        if (a.wtKg === b.wtKg) { return 0; }
        return a.wtKg > b.wtKg ? 1 : -1;
      });
    }
    this.weightInEditor = '';
  }

  public del(indx: number) {
    this.weights.splice(indx, 1);
  }

  public submit() {
    if (!this.ward) {
      throw new Error('validation failing - selectedWard was null but valid submit reached');
    }
    const chartData: IMultiWardChartData = {
      boluses: this.boluses,
      infusions: this.infusions,
      ward: this.ward,
      weights: this.weights.map((w) => ({ wtKg: w.wtKg, estAge: medianMatchAvg(w.femaleM, w.maleM)})),
      updateEmail: this.email,
    };
    this.$router.push({ name: 'multi-chart', params: { chartData }} as any);
  }
}
</script>
