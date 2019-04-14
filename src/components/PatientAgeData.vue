<template>
  <div>
    <div class="form-group form-row">
      <label for="dob" class="col-sm-2 col-form-label">DOB</label>
      <div class="col-sm-10">
        <div class="input-group">
          <input class="form-control col" type="date" id="dob" v-model="dob" :min="minDate" :max="maxDate">
          <div class="input-group-append">
            <div class="input-group-text">
              <font-awesome-icon icon="calendar" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <fieldset class="form-group">
      <div class="form-row">
        <legend class="col-form-label col-sm-2 col-form-label">Age</legend>
        <div class="col-sm-10">
          <div class="form-row">
            <div class="input-group col">
              <input class="form-control" id="years" v-model.number="years" placeholder="years" type="number"
                min="0" :max="maxYears" >
              <div class="input-group-append">
                <label class="input-group-text" for="years" >years</label>
              </div>
            </div>
            <div class="input-group col">
              <input class="form-control" id="months" v-model.number="months" placeholder="months" type="number" 
                min="0" max="72">
              <div class="input-group-append">
                <label class="input-group-text" for="months">months</label>
              </div>
            </div>
            <div class="input-group col">
              <input class="form-control" id="days" v-model.number="days" placeholder="days" type="number" 
                min="0" max="1200">
              <div class="input-group-append">
                <label class="input-group-text" for="days">days</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </fieldset>
  </div>
</template>

<script lang="ts">
import { ChildAge } from '@/services/infusion-calculations/';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

const ageDataChangeStr = 'age-data-change';
@Component
export default class PatientAgeData extends Vue {
  public readonly maxYears = 122;
  public minDate: string = '';
  public maxDate: string = '';

  @Prop({default: false})
  private exact!: boolean;
  private pYears: number | null = null;
  private pMonths: number | null = null;
  private pDays: number | null = null;
  private pDob: Date | null = null;
  // non vue properties = start with undefined
  private timeout?: number | NodeJS.Timer;
  private childAge?: ChildAge | null;

  public get years() { return this.pYears === null
    ? ''
    : this.pYears; }
  public set years(years: number | string) {
    if (years === this.years) {
      return;
    }
    if (typeof years === 'number') {
      this.pYears = Math.floor(years);
      this.pDob = null;
    } else {
      this.pYears = null;
    }
    this.ageDataChange();
  }

  public get months() { return this.pMonths === null
  ? ''
  : this.pMonths; }
  public set months(months: number | string) {
    if (months === this.months) {
      return;
    }
    if (typeof months === 'number') {
      if (this.pYears === null) {
        this.pYears = 0;
      }
      if (months > 12) {
        this.pYears = Math.floor(this.pYears + (months / 12));
        months = months % 12;
      }
      this.pMonths = Math.floor(months);
      this.pDob = null;
    } else {
      this.pMonths = null;
    }
    this.ageDataChange();
  }

  public get days() { return this.pDays === null
    ? ''
    : this.pDays; }
  public set days(days: number | string) {
    if (days === this.days) {
      return;
    }
    if (typeof days === 'number') {
      if (this.pMonths === null) {
        this.pMonths = 0;
      }
      if (this.pYears === null) {
        this.pYears = 0;
      }
      if (days > 28) {
        const workingDate = new Date();
        let dInPriorMonth = daysInPriorMonth(workingDate);
        while (days >= dInPriorMonth) {
          days = days - dInPriorMonth;
          this.pMonths = (this.pMonths || 0) + 1;
          workingDate.setMonth(workingDate.getMonth() - 1);
          dInPriorMonth = daysInPriorMonth(workingDate);
        }
      }
      this.pDays = days;
      this.pDob = null;
    } else {
        this.pDays = null;
    }
    this.ageDataChange();
  }

  public get dob() {
    return this.pDob === null
      ? ''
      : ymdFormat(this.pDob);
  }

  public set dob(dobStr: string) {
    let dob!: Date;
    if (dobStr === '' || isNaN((dob = new Date(dobStr)).valueOf())) {
        this.pDob = null;
        return;
    }
    if (dob.getHours() !== 0 || dob.getMinutes() !== 0) { // because it is interpreted as utc midnight
      dob.setMinutes(dob.getMinutes() + dob.getTimezoneOffset());
    }
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    if (years < 0 || years > this.maxYears) {
      this.pYears = this.pMonths = this.pDays = null;
    } else {
      let months = now.getMonth() - dob.getMonth();
      let days = now.getDate() - dob.getDate();
      if (months < 0) { months += 12; }
      if (days < 0) {
        days += daysInPriorMonth(now);
        if (months === 0) {
          months = 11;
          years--;
        } else {
          months--;
        }
      }
      const workingDate = new Date(now);
      workingDate.setFullYear(workingDate.getFullYear() - years);
      if (dob > workingDate) { years--; }
      this.pYears = years;
      this.pMonths = months;
      this.pDays = days;
    }
    this.pDob = dob;
    this.ageDataChange();
  }

  public created() {
    this.setDates();
  }

  public destroyed() {
    switch (typeof this.timeout) {
      case 'number':
        clearTimeout(this.timeout);
        break;
      case 'object':
        this.timeout.unref();
        if ((this.timeout as any).id && clearTimeout) {
          clearTimeout((this.timeout as any).id);
        }
        break;
    }
  }

  private setDates() {
    const now = new Date();
    this.maxDate = ymdFormat(now);
    const minDate = new Date(now);
    minDate.setFullYear(minDate.getFullYear() - this.maxYears);
    minDate.setDate(minDate.getDate() + 1);
    this.minDate = ymdFormat(minDate);
    const nextMidnight = new Date(now);
    nextMidnight.setHours(0, 0, 0, 0);
    nextMidnight.setDate(nextMidnight.getDate() + 1);
    const msToMidnight = nextMidnight.getTime() - now.getTime();
    this.timeout = setTimeout(() => {
      this.setDates();
      this.onNewDay();
    }, msToMidnight);
  }

  private onNewDay() {
    if (this.pDob !== null) {
      this.dob = this.dob;
    } else if (typeof this.days === 'number') {
      this.days++;
    }
  }

  private ageDataChange() {
    if (this.pYears === null || (this.pYears === 0 && this.pMonths === null)
        || this.pYears < 0 || this.pMonths! < 0 || this.pDays! < 0 || this.pYears > this.maxYears
        || (this.exact && (this.pMonths === null || this.pDays === null))) {
      if (this.childAge) {
        this.$emit(ageDataChangeStr, this.childAge = null);
      }
      return;
    }
    if (this.childAge) {
      if (this.childAge.years === this.pYears && this.childAge.months === this.pMonths && this.childAge.days === this.pDays) {
        return;
      }
      this.childAge.years = this.pYears;
      this.childAge.months = this.pMonths;
      this.childAge.days = this.pDays;
    } else {
      this.childAge = new ChildAge(this.pYears, this.pMonths, this.pDays);
    }
    this.$emit(ageDataChangeStr, this.childAge);
  }
}

function ymdFormat(d: Date) {
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear().toString().padStart(4, '0');
  return `${year}-${month}-${day}`;
}

function daysInPriorMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 0).getDate();
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
