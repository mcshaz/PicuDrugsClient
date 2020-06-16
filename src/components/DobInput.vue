<template>
  <validated-date-group :min="min" :max="max" v-model="dob" :rules="rules" :label-cols-lg="labelColsLg" :label-cols-xl="labelColsXl"
      @blur="onBlur($event)" :name="dob" :required="required" :immediate="immediate"
      label="DOB" description="date of birth"/>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator';
import ValidatedDateGroup from '@/components/formGroups/ValidatedDateGroup.vue';
import { shortFormatter } from '@/services/utilities/dateHelpers';
import LabelColWidth from '../mixins/LabelColWidth';

// enum dateElSupport { noSupport, elSupport, valueAsDateSupport }

@Component({
  components: {
    ValidatedDateGroup,
  },
})
export default class DobInput extends Mixins(LabelColWidth) {
    public max!: Date;
    public state: boolean | null = null;
    private pDob: Date | null = null;
    private pMin!: Date;

    // non vue properties = start with undefined
    private timeout?: number | NodeJS.Timer;

    @Prop({ default: void 0 })
    private required?: boolean;

    @Prop({ default: void 0 })
    private immediate?: boolean;

    @Prop({ default: null })
    private value!: Date | null;

    @Prop({ default: 122 }) // current longest lifespan in modern history
    private maxYears!: number;

    @Prop({ default: void 0 })
    rules: any;

    public created() {
      this.setDates();
    }

    public get dob() {
      return this.pDob;
    }

    public set dob(value: Date | null) {
      if (this.pDob !== value) {
        // user is still typing or changing the date
        this.pDob = value;
        if (value == null || value.getFullYear() > 999) {
          this.$emit('input', value);
        }
      }
    }

    public onBlur(evt: any) {
      this.$emit('blur', evt);
    }

    private get min() { return this.pMin; }
    private set min(value: Date) {
      this.pMin = value;
      this.$emit('min-change', value);
    }

    public get minString() {
      return shortFormatter.format(this.min);
    }

    public get maxString() {
      return shortFormatter.format(this.max);
    }

    // watching the property - the property and pDOB are different as DOB < 1000 AD (i.e. date is being entered) will differ
    @Watch('value')
    private valuePropChanged(newVal: Date | null) {
      if (this.pDob !== newVal) {
        this.pDob = newVal;
      }
    }

    private setDates() {
      const now = new Date();
      this.max = new Date(now);
      const minDate = new Date(now);
      minDate.setFullYear(minDate.getFullYear() - this.maxYears);
      minDate.setDate(minDate.getDate() + 1);
      this.min = minDate;
      const nextMidnight = new Date(now);
      nextMidnight.setHours(0, 0, 0, 0);
      nextMidnight.setDate(nextMidnight.getDate() + 1);
      const msToMidnight = nextMidnight.getTime() - now.getTime();
      this.timeout = setTimeout(() => {
        this.setDates();
      }, msToMidnight);
    }

    private destroyed() {
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
}

</script>
