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
    <validation-provider v-slot="valState" name="Chart type" rules="required">
      <b-form-group
        :label-cols-lg="labelColsLg"
        :label-cols-xl="labelColsXl"
        label-align-lg="right"
        label="Chart type:"
        :invalid-feedback="valState.errors[0]"
        :state="getState(valState)"
      >
        <b-form-checkbox-group stacked v-model="chartSelection" name="chart-type" :state="getState(valState)">
          <b-form-checkbox
            value="boluses"
            id="boluses"
          >
            Bolus Drugs
          </b-form-checkbox>
          <b-form-checkbox
            value="infusions"
            id="infusions"
            :disabled="infusionsDisabled"
          >
            Infusions
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
import { Component, Vue, Inject, Prop, Watch, Mixins } from 'vue-property-decorator';
import { IEntityWard, IDrugDB, IAppData } from '@/services/drugDb';
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
export default class chartSelection extends Mixins(StateWatcher, LabelColWidth) {
  private selectedWard: IEntityWard | null = null;
  public wardOptions: { value: string; text: string; disabled?: boolean; }[] = [];

  @Inject('db')
  private db!: IDrugDB;
  @Prop({ default: '' })
  private wardAbbrev!: string;
  @Prop({ default: true })
  private boluses!: boolean;
  @Prop({ default: true })
  private infusions!: boolean;
  @Inject('appData')
  private appData!: IAppData;
  // unwatched
  private wards!: PromiseLike<IEntityWard[]>;
  private chartSelectionTouched?: boolean;

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
          this.boluses = wd.boluses;
          this.infusions = wd.infusions;
          // the chart selection touched is a hack to not change the ward selection to the default
          // for a particular ward if the user has set different defaults
          this.chartSelectionTouched = true;
          this.abbrev = wd.wardAbbrev;
        }
      });
      this.chartSelectionTouched = false;
    }
  }

  private get chartSelection() {
    const returnVar = [];
    if (this.boluses) { returnVar.push('boluses'); }
    if (this.infusions && !this.infusionsDisabled) { returnVar.push('infusions'); }
    return returnVar;
  }
  private set chartSelection(value: string[]) {
    let val = value.includes('boluses');
    if (this.boluses !== val) {
      this.$emit('update:boluses', val);
    }
    val = value.includes('infusions') && !this.infusionsDisabled;
    if (this.infusions !== val) {
      this.$emit('update:infusions', val);
    }
    this.chartSelectionTouched = true;
  }

  public get infusionsDisabled() {
    return this.selectedWard === null || this.selectedWard.infusionSortOrderings.length === 0;
  }

  public get abbrev() {
    return this.selectedWard ? this.selectedWard.abbrev : '';
  }
  public set abbrev(value: string) {
    if (value !== this.abbrev) {
      if (value === '') {
        this.$emit('update:ward', this.selectedWard = null);
      } else {
        this.wards.then(wards => {
          const searchFor = value.toLowerCase();
          this.selectedWard = wards.find(w => w.abbrev.toLowerCase() === searchFor) || null;
          this.$emit('update:ward', this.selectedWard);
          if (this.selectedWard && !this.chartSelectionTouched && this.infusions === this.selectedWard.defaultBolusOnly) {
            this.$emit('update:infusions', !this.selectedWard.defaultBolusOnly);
          }
        });
      }
    }
  }
}
</script>
