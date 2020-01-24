<template>
  <div>
    <validated-select-input
          label="Ward"
          v-model="abbrev"
          :options="wardOptions"
          required
        >
            <option :value="''" disabled>Please select a ward</option>
            <option v-for="w in wards" :key="w.wardId" :value="w.abbrev">
              {{ w.fullname }}
            </option>
    </validated-select-input>
    <validation-provider v-slot="{ errors, changed }" name="Chart type" rules="required">
      <b-form-group
        label-cols-lg="2"
        label-cols-xl="2"
        label="Chart type"
        :invalid-feedback="errors[0]"
        :state="errors[0] ? false : (changed ? true : null)"
      >
        <b-form-checkbox-group stacked v-model="chartType" name="chart-type" :state="errors[0] ? false : (changed ? true : null)">
          <b-form-checkbox
            value="boluses"
            id="boluses"
          >
            Bolus Drugs
          </b-form-checkbox>
          <b-form-checkbox
            value="infusions"
            id="infusions"
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
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';
import { IEntityWard, IDrugDB, IAppData } from '@/services/drugDb';
import { sortByStringProp } from '@/services/utilities/sortByProp';

@Component
export default class WardSelect extends Vue {
  private selectedWard: IEntityWard | null = null;
  private wards!: PromiseLike<IEntityWard[]>;
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

  public created() {
    this.wards = this.db.wards.toArray().then(wards => {
      wards = wards.filter(w => w.isLive);
      sortByStringProp(wards, 'fullname');
      return wards;
    });
    if (this.wardAbbrev) {
      this.abbrev = this.wardAbbrev;
    } else {
      this.appData.getWardDefaults().then(wd => {
        if (wd) {
          this.boluses = wd.boluses;
          this.infusions = wd.infusions;
          this.abbrev = wd.wardAbbrev;
        }
      });
    }
  }

  private get chartType() {
    return [ this.boluses ? 'boluses' : void 0, this.infusions ? 'infusions' : void 0 ].filter((e) => e !== void 0) as string[];
  }
  private set chartType(bolusTypes: string[]) {
    let val = bolusTypes.includes('boluses');
    if (this.boluses !== val) {
      this.$emit('change:boluses', val);
    }
    val = bolusTypes.includes('infusions');
    if (this.infusions !== val) {
      this.$emit('change:infusions', val);
    }
  }

  public get infusionsAvailable() {
    return (
      this.selectedWard && this.selectedWard.infusionSortOrderings.length > 0
    );
  }

  public get abbrev() {
    return this.selectedWard ? this.selectedWard.abbrev : '';
  }
  public set abbrev(value: string) {
    if (value !== this.abbrev) {
      if (value === '') {
        this.selectedWard = null;
      } else {
        this.wards.then(wards => {
          const searchFor = value.toLowerCase();
          this.selectedWard = wards.find(w => w.abbrev.toLowerCase() === searchFor) || null;
        });
      }
      this.$emit('ward', this.selectedWard);
    }
  }

  @Watch('infusionsAvailable')
  private availableChange(newVal: boolean) {
    this.$emit('infusions-available', newVal);
  }
}
</script>
