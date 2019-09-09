<template>
  <div class="was-validated">
    <dob-input v-model="dob" @min-change="minDate=$event" :required="!!errMsg&&errMsg.endsWith('required')" />
    <b-form-group id="ageymd" label="Age:" label-cols-lg="2" label-cols-xl="2" 
      :state="errMsg===null?null:(errMsg==='')"
      :invalid-feedback="errMsg" >
      <div class="form-inline">
        <b-input-group append="years" class="mr-1">
          <input class="form-control small-int" name="years" id="years" v-model.number="years" placeholder="yrs" type="number"
            min="0" :max="maxYears" ref="years" :required="exact||required||months!==''" step="1" />
        </b-input-group>
        <b-input-group append="months" class="mr-1">
          <input class="form-control small-int" name="months" id="months" v-model.number="months" placeholder="mths" type="number" 
            min="0" max="160" ref="months" :required="exact||years===0" step="1" />
        </b-input-group>
        <b-input-group append="days">
          <input class="form-control small-int" name="days" id="days" v-model.number="days" placeholder="days" type="number" 
            min="0" max="1200" ref="days" :required="exact" step="1" />
        </b-input-group>
      </div>
    </b-form-group>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { ChildAge } from '@/services/infusion-calculations/';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import DobInput from '@/components/DobInput.vue';
import { maxYears } from '@/services/validation/getAgeOrDOBVals';
export type vueNumber = number | ''; // todo https://stackoverflow.com/questions/55682288/export-and-import-a-typescript-type-alias-from-d-ts-file

@Component({
    components: {
        DobInput,
    },
})
export default class PatientAgeData extends Vue {
  @Prop({default: false})
  private exact!: boolean;
  @Prop({default: false})
  private required!: boolean;
  private pYears: vueNumber = '';
  private pMonths: vueNumber = '';
  private pDays: vueNumber = '';
  private pDob: Date | null = null;
  private pMinDate: Date | null = null;

  private childAge?: ChildAge | null;
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

  private ageDataChange() {
    if (this.errMsg === null || this.errMsg !== '' || this.pYears === '') {
      if (this.childAge) {
        this.$emit('input', this.childAge = null);
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
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
