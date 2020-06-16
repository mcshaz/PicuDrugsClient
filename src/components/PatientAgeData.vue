<template>
    <validation-observer v-slot="allErrors" tag="div">
      <dob-input v-model="dob" @min-change="minChange($event)" :immediate="immediate" :disabled="disabled"
          :rules="{ requiredIfEmpty: required!==false ? { target: 'years' } : false }" :label-cols-lg="labelColsLg" :label-cols-xl="labelColsXl"/>
      <b-form-group id="ageymd" label="Age:" :label-cols-lg="labelColsLg" :label-cols-xl="labelColsXl" label-align-lg="right"
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
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { maxYears } from '@/services/validation/validators';
import DobInput from '@/components/DobInput.vue';
import StateWatcher from '@/mixins/StateWatcher';
import { isEquivalent } from '@/mixins/VModelReflector';
import LabelColWidth from '../mixins/LabelColWidth';

export type vueNumber = number | ''; // todo https://stackoverflow.com/questions/55682288/export-and-import-a-typescript-type-alias-from-d-ts-file

@Component({
  components: {
    DobInput,
  },
})
export default class PatientAgeData extends Mixins(StateWatcher, LabelColWidth) {
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
  private childAge: ChildAge | null = null;
  private pAgeCalcDate?: Date;

  public get years() { return this.childAge ? this.childAge.years : ''; }
  public set years(years: vueNumber) {
    if (years === this.years) {
      return;
    }
    if (typeof years === 'number') {
      if (this.childAge) {
        this.childAge.years = years;
      } else {
        this.childAge = new ChildAge({ years });
      }
    } else if (this.childAge!.months === null && this.childAge!.days === null) {
      this.childAge = null;
    }
  }

  public get months() {
    if (this.childAge === null) {
      return '';
    }
    return this.childAge.months === null ? '' : this.childAge.months;
  }

  public set months(months: vueNumber) {
    if (months === this.months) {
      return;
    }
    if (this.childAge) {
      this.childAge!.months = months === '' ? null : months;
    } else {
      months = months as number;
      this.childAge = new ChildAge({ months });
    }
  }

  public get days() {
    if (this.childAge === null) {
      return '';
    }
    return this.childAge.days === null ? '' : this.childAge.days;
  }

  public set days(days: vueNumber) {
    if (days === this.days) {
      return;
    }
    if (this.childAge) {
      this.childAge.days = days === '' ? null : days;
    } else {
      days = days as number;
      this.childAge = new ChildAge({ days });
    }
  }

  public get dob() {
    return this.childAge === null ? null : this.childAge.dob;
  }

  public set dob(dob: Date | null) {
    if (dob === this.dob) {
      return;
    }
    if (this.childAge) {
      this.childAge.dob = dob;
    } else {
      dob = dob as Date;
      this.childAge = new ChildAge({ dob });
    }
    (this.$refs.years as HTMLInputElement).tabIndex = (this.$refs.months as HTMLInputElement).tabIndex =
      (this.$refs.days as HTMLInputElement).tabIndex = dob !== null ? -1 : 0;
  }

  private combineErrors(observerContext: any) {
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
  @Watch('value', { immediate: true, deep: true })
  private valueChanged(newVal: ChildAge | null) {
    if (newVal === null) {
      this.childAge = null;
    } else if (!isEquivalent(this.childAge, newVal)) {
      this.childAge = new ChildAge(newVal);
    }
  }

  @Watch('childAge', { deep: true })
  private ageDataChange() {
    if (!isEquivalent(this.childAge, this.value)) {
      this.pAgeCalcDate = new Date();
      this.pAgeCalcDate.setHours(0, 0, 0, 0);
      this.$emit('input', this.childAge);
    }
  }

  private minChange() {
    if (this.pAgeCalcDate) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (now > this.pAgeCalcDate) {
        if (this.dob) {
          this.childAge!.dob = this.childAge!.dob; // force reevaluation
        } else if (this.days) {
          this.days++;
        }
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

input.small-int {
  max-width: 6.3em;
}
</style>
