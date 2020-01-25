<template>
    <validation-observer v-slot="allErrors" tag="div">
      <dob-input v-model="dob" @min-change="minDate=$event" :immediate="immediate" :disabled="disabled"
          :rules="{ requiredIfEmpty: required!==false ? { target: 'years' } : false }"/>
      <b-form-group id="ageymd" label="Age:" label-cols-lg="3" label-cols-xl="3" label-align-lg="right"
            :state="immediate!==false ? !combineErrors(allErrors) : getState(allErrors)" :invalid-feedback="combineErrors(allErrors)">
        <div class="form-inline">
          <validation-provider vid="years" name="years" :rules="{ integer: true, requiredIfEmpty: required!==false ? { target: 'DOB' } : false  }"
              v-slot="valContext" :immediate="immediate" slim><!--todo exact-->
            <b-input-group append="years" class="mr-1">
              <input class="form-control small-int" name="years" id="years" v-model.number="years" placeholder="yrs" type="number"
                min="0" :max="maxYears" ref="years" step="1" :class="getValidClass(valContext)"
                :disabled="disabled"/>
            </b-input-group>
          </validation-provider>
          <validation-provider vid="months" name="months" v-slot="valContext"
              :rules="{required_if: ['years', 0], required: exact!==false}" :immediate="immediate" slim>
            <b-input-group append="months" class="mr-1" rules="integer">
              <input class="form-control small-int" name="months" id="months" v-model.number="months" placeholder="mths" type="number"
                min="0" max="24" ref="months" step="1" :class="getValidClass(valContext)"
                :disabled="disabled"/>
            </b-input-group>
          </validation-provider>
          <validation-provider vid="days" name="days" slim :immediate="immediate" v-slot="valContext">
            <b-input-group append="days" rules="integer">
              <input class="form-control small-int" name="days" id="days" v-model.number="days" placeholder="days" type="number"
                min="0" max="31" ref="days" step="1" :class="getValidClass(valContext, 'days')"
                :disabled="disabled" :required="exact"/>
            </b-input-group>
          </validation-provider>
        </div>
      </b-form-group>
  </validation-observer>
</template>

<script lang="ts">
import 'reflect-metadata';
import { ChildAge } from '@/services/infusion-calculations/';
import { Component, Prop, Vue, Mixins, Watch } from 'vue-property-decorator';
import { maxYears } from '@/services/validation/validators';
import DobInput from '@/components/DobInput.vue';
import StateWatcher from '@/mixins/StateWatcher';

export type vueNumber = number | ''; // todo https://stackoverflow.com/questions/55682288/export-and-import-a-typescript-type-alias-from-d-ts-file

@Component({
  components: {
    DobInput,
  },
})
export default class PatientAgeData extends Mixins(StateWatcher) {
  @Prop({ required: true })
  value!: ChildAge | null;
  @Prop({ default: false })
  required!: boolean;
  @Prop({ default: false })
  disabled!: boolean;
  @Prop({ default: false })
  exact!: boolean;
  @Prop({ default: false })
  immediate!: boolean;

  private readonly maxYears = maxYears;
  private pYears: vueNumber = '';
  private pMonths: vueNumber = '';
  private pDays: vueNumber = '';
  private pDob: Date | null = null;
  private pMinDate: Date | null = null;
  private childAge: ChildAge | null = null;

  public get years() { return this.pYears; }
  public set years(years: vueNumber) {
    if (years === this.pYears) {
      return;
    }
    if (typeof years === 'number') {
      this.pYears = Math.floor(years);
    } else {
      this.pYears = '';
    }
    this.pDob = null;
    this.ageDataChange();
  }

  public get months() { return this.pMonths; }
  public set months(months: vueNumber) {
    if (months === this.pMonths) {
      return;
    }
    if (typeof months === 'number') {
      if (this.pYears === '') {
        this.pYears = 0;
      }
      if (months > 12) {
        this.pYears = Math.floor(this.pYears + (months / 12));
        months = months % 12;
      }
      this.pMonths = Math.floor(months);
    } else {
      this.pMonths = '';
    }
    this.pDob = null;
    this.ageDataChange();
  }

  public get days() { return this.pDays; }
  public set days(days: vueNumber) {
    if (days === this.pDays) {
      return;
    }
    if (typeof days === 'number') {
      if (this.pMonths === '') {
        this.pMonths = 0;
      }
      if (this.pYears === '') {
        this.pYears = 0;
      }
      if (days > 28) {
        const workingDate = new Date();
        let dInPriorMonth = ChildAge.daysInPriorMonth(workingDate);
        while (days >= dInPriorMonth) {
          days = days - dInPriorMonth;
          this.pMonths = (this.pMonths || 0) + 1;
          workingDate.setMonth(workingDate.getMonth() - 1);
          dInPriorMonth = ChildAge.daysInPriorMonth(workingDate);
        }
      }
      this.pDays = days;
    } else {
      this.pDays = '';
    }
    this.pDob = null;
    this.ageDataChange();
  }

  public get dob() {
    return this.pDob;
  }

  public set dob(dob: Date | null) {
    this.pDob = dob;
    if (dob === null) {
      this.setAgeTabs(false);
      return;
    }
    const now = new Date();
    if (dob < this.minDate || dob > now) { // not handling 122yr 11mo 30d on tickover of night as edge case & irrelevant
      this.pDays = this.pMonths = this.pYears = '';
      this.setAgeTabs(false);
      return;
    }
    const age = ChildAge.ageOnDate(dob, now);
    this.pYears = age.years;
    this.pMonths = age.months;
    this.pDays = age.days;
    this.ageDataChange();
    this.setAgeTabs(true);
  }

  public setAgeTabs(isValidDOB: boolean) {
    (this.$refs.years as HTMLInputElement).tabIndex = (this.$refs.months as HTMLInputElement).tabIndex =
      (this.$refs.days as HTMLInputElement).tabIndex = isValidDOB ? -1 : 0;
  }
  combineErrors(observerContext: any) {
    return Object.entries(observerContext.errors).reduce((accum, e) => {
      if (e[0] !== 'DOB') {
        accum.push(...(e[1] as any[]));
      }
      return accum;
    }, [] as any[]).join(' AND ');
  }
  /*
  public get errMsg() {
    if (this.pYears === '' && this.pMonths === '' && this.pDays === '') {
      return this.required
        ? 'age or DOB is required'
        : null;
    } else if (this.exact && (this.pMonths === '' || this.pDays === '')) {
      return 'exact age or DOB is required';
    } else if (this.pYears === '') {
      return 'years required (enter 0 if < 1year)';
    } else if (this.pYears === 0 && this.pMonths === '') {
      return 'months are required if 0 years';
    } else if (this.pYears < 0 || this.pMonths! < 0 || this.pDays! < 0) {
      return 'negative values are not allowed';
    } else if (this.pYears > maxYears) {
      return `age must be <= ${maxYears} years old (oldest person to have lived)`;
    }
    return '';
  }
  */
  @Watch('value', { immediate: true })
  private valueChanged(newVal: ChildAge | null) {
    if (newVal !== this.childAge) {
      this.childAge = newVal;
    }
  }

  private ageDataChange() {
    if (this.pYears === '') {
      if (this.childAge) {
        this.$emit('input', (this.childAge = null));
      }
      return;
    }
    const mo = typeof this.pMonths === 'number'
      ? this.pMonths
      : null;
    const dyo = typeof this.pDays === 'number'
      ? this.pDays
      : null;
    if (this.childAge) {
      if (this.childAge.years === this.pYears && this.childAge.months === mo && this.childAge.days === dyo) {
        return;
      }
      this.childAge.years = this.pYears;
      this.childAge.months = mo;
      this.childAge.days = dyo;
    } else {
      this.childAge = new ChildAge(this.pYears, mo, dyo);
    }
    this.$emit('input', this.childAge);
  }

  private get minDate() { return this.pMinDate!; }
  private set minDate(value: Date) {
    if (this.pMinDate) { // must be a new day
      if (this.pDob !== null) {
        this.dob = this.pDob;
      } else if (this.days !== '') {
        this.days++;
      }
    }
    this.pMinDate = value;
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

input.small-int {
  max-width: 6.3em;
}
</style>
