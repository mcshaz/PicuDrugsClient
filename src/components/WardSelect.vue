<template>
  <div>
    <b-form-group label-for="ward" label-cols-lg="2" label-cols-xl="2" label="Ward:" invalid-feedback="Please select a ward">
      <b-form-select v-model="abbrev" :options="wardOptions" :required="true" name="ward" >
        <template slot="first">
          <option :value="''" disabled>Please select a ward</option>
        </template>
      </b-form-select>
    </b-form-group>
    <b-form-group label-cols-lg="2" label-cols-xl="2" label="Chart type:" invalid-feedback="Please select at least 1 chart"
        :state="boluses||infusions">
      <div role="group" tabindex="-1">
        <b-form-checkbox class="custom-control-inline" @change="$emit('boluses', $event)" 
            :checked="boluses" name="boluses" :required="!infusions" :state="boluses||infusions" >
          Bolus Drugs
        </b-form-checkbox>
        <b-form-checkbox class="custom-control-inline" @input="$emit('infusions', $event && infusionsAvailable)" 
            :checked="infusions&&infusionsAvailable" :disabled="!infusionsAvailable" name="infusions" 
            :required="!boluses" :state="boluses||infusions">
          Infusions
        </b-form-checkbox>
      </div>
    </b-form-group>
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
import { IEntityWard, IDrugDB } from '@/services/drugDb';
import { sortByStringProp } from '@/services/utilities/sortByProp';

interface ISelectOption { value: string; text: string; disabled?: boolean; }

@Component
export default class WardSelect extends Vue {
  public wardOptions: ISelectOption[] = [];
  private selectedWard: IEntityWard | null = null;
  private wards!: PromiseLike<IEntityWard[]>;
  @Inject('db')
  private db!: IDrugDB;
  @Prop({default: ''})
  private wardAbbrev!: string;
  @Prop({default: true})
  private boluses!: boolean;
  @Prop({default: true})
  private infusions!: boolean;

  public created() {
    this.wards = this.db.wards.toArray().then((wards) => {
      wards = wards.filter((w) => w.isLive);
      sortByStringProp(wards, 'fullname');
      this.wardOptions = wards.map((w) => ({ value: w.abbrev, text: w.fullname } as ISelectOption));
      this.abbrev = this.wardAbbrev;
      return wards;
    });
  }

  public get infusionsAvailable() {
    return this.selectedWard && this.selectedWard.infusionSortOrderings.length > 0;
  }

  public get abbrev() {
    return this.selectedWard
      ? this.selectedWard.abbrev
      : '';
  }
  public set abbrev(value: string) {
    if (value !== this.abbrev) {
      if (value === '') {
        this.selectedWard = null;
      } else {
        this.wards.then((wards) => {
          const searchFor = value.toLowerCase();
          this.selectedWard = wards.find((w) => w.abbrev.toLowerCase() === searchFor) || null;
          this.$emit('ward', this.selectedWard);
        });
      }
    }
  }
}
</script>
