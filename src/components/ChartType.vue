<template>
  <div>
    <validated-select-group
      label="Ward"
      v-model="abbrev"
      required
      :label-cols-lg="labelColsLg" :label-cols-xl="labelColsXl">
        <option value="" disabled>Please select a ward</option>
        <option v-for="w in wardOptions" :key="w.value" :value="w.value">
          {{ w.text }}
        </option>
    </validated-select-group>
    <validation-provider v-slot="valState" name="Chart type(s)" rules="required">
      <b-form-group
        :label-cols-lg="labelColsLg"
        :label-cols-xl="labelColsXl"
        label-align-lg="right"
        label="Chart type:"
        :invalid-feedback="valState.errors[0]"
        :state="getState(valState)"
      >
        <b-form-checkbox-group stacked v-model="charts" rules="required" name="chart-type" :state="getState(valState)">
          <b-form-checkbox
            value="boluses"
            id="boluses">
            Bolus Drugs
          </b-form-checkbox>
          <b-form-checkbox
            value="infusions"
            id="infusions"
            :disabled="infusionsDisabled">
            Infusions
          </b-form-checkbox>
          <b-form-checkbox
            value="anaphylaxis"
            id="anaphylaxis">
            Anaphylaxis Flowchart
          </b-form-checkbox>
          <b-form-checkbox
            value="seizures"
            id="seizures">
            Status Epilepsy Flowchart
          </b-form-checkbox>
          <b-form-checkbox
            value="svt"
            id="svt">
            SVT Flowchart
          </b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>
    </validation-provider>
  </div>
  <!--
  <div class="form-check form-check-inline">
      <input type="checkbox" class="form-check-input" @change="$emit('boluses', $event.target.checked)"
          :checked="boluses" name="boluses" :required="!infusions"  />
      <label class="form-check-label" for="boluses">
        Bolus Drugs
      </label>
  </div>
  <div class="form-check form-check-inline">
    <input type="checkbox" class="form-check-input" @change="$emit('infusions', $event.target.checked)"
        :checked="infusions&&infusionsAvailable" :disabled="!infusionsAvailable" name="infusions"
        :required="!boluses" :state="boluses||infusions" />
    <label class="form-check-label" for="infusions">
      Infusions
    </label>
  </div>
  -->
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Inject, Prop, Mixins } from 'vue-property-decorator';
import { IEntityWard, IDrugDB, IAppData, definedCharts } from '@/services/drugDb';
import { sortByStringProp } from '@/services/utilities/sortByProp';
import StateWatcher from '@/mixins/StateWatcher';
import ValidatedSelectGroup from '@/components/formGroups/ValidatedSelectGroup.vue';
import { BFormCheckbox, BFormCheckboxGroup } from 'bootstrap-vue';
import LabelColWidth from '@/mixins/LabelColWidth';

@Component({
  components: {
    ValidatedSelectGroup,
    BFormCheckbox,
    BFormCheckboxGroup,
  },
})
export default class ChartSelection extends Mixins(StateWatcher, LabelColWidth) {
  private selectedWard: IEntityWard | null = null;
  public wardOptions: { value: string; text: string; disabled?: boolean }[] = [];

  @Inject('db')
  private db!: IDrugDB;

  @Prop({ default: '' })
  private wardAbbrev!: string;

  @Prop({ default: () => ['boluses', 'anaphylaxis'] as definedCharts[] })
  private chartTypes!: definedCharts[];

  @Inject('appData')
  private appData!: IAppData;

  // unwatched
  private wards!: PromiseLike<IEntityWard[]>;
  private chartsTouched!: boolean;

  public created() {
    this.wards = this.db.wards.toArray().then(wards => {
      wards = wards.filter(w => w.isLive);
      sortByStringProp(wards, 'fullname');
      this.wardOptions = wards.map((w) => ({ value: w.abbrev, text: w.fullname }));
      return wards;
    });
    if (this.wardAbbrev) {
      this.abbrev = this.wardAbbrev;
    } else {
      this.appData.getWardDefaults().then(wd => {
        if (wd) {
          this.chartTypes = wd.chartTypes;
          // the chart selection touched is a hack to not change the ward selection to the default
          // for a particular ward if the user has set different defaults
          this.abbrev = wd.wardAbbrev;
        }
      });
    }
  }

  public get infusionsDisabled() {
    return this.selectedWard === null || this.selectedWard.infusionSortOrderings.length === 0;
  }

  public get abbrev() {
    return this.selectedWard?.abbrev || '';
  }

  public set abbrev(value: string) {
    if (value !== this.abbrev) {
      if (value === '') {
        if (this.selectedWard !== null) {
          this.$emit('update:ward', this.selectedWard = null);
        }
      } else {
        this.wards.then(wards => {
          const searchFor = value.toLowerCase();
          const foundWard = wards.find(w => w.abbrev.toLowerCase() === searchFor) || null;
          if (this.selectedWard !== foundWard) {
            this.$emit('update:ward', foundWard);
            this.selectedWard = foundWard;
          }
          if (foundWard && !this.chartsTouched) {
            this.charts = foundWard.defaultCharts;
          }
        });
      }
    }
  }

  public get charts() {
    return this.chartTypes;
  }

  public set charts(value: definedCharts[]) {
    if (!setsEquivalent(value, this.chartTypes)) {
      this.$emit('update:chart-types', value);
      this.chartsTouched = true;
    }
  }
}
function setsEquivalent<T>(ar1: T[], ar2: T[]) {
  return ar1.length === ar2.length && ar1.every((a) => ar2.includes(a));
}
</script>
