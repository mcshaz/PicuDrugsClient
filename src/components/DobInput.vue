<template>
    <div :class="pState===null?'':'was-validated'">
        <validation-provider v-slot="errors" name="DOB" mode="lazy">
          <b-form-group label="DOB:" label-for="dob" label-cols-lg="2" label-cols-xl="2"
                :state="state" description="date of birth" :invalid-feedback="errors[0]">
              <date-input :min="min" :max="max" v-model="dob"
                      @blur="onBlur($event)" :id="dob" :required="required" />
          </b-form-group>
        </validation-provider>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import DateInput from '@/components/formGroups/DateInputPolyfill.vue';
import { ymdFormat, dateInRange, shortFormatter } from '@/services/utilities/dateHelpers';

enum dateElSupport { noSupport, elSupport, valueAsDateSupport }

@Component({
  components: {
    DateInput,
  },
})
export default class DobInput extends Vue {
    public max!: Date;
    public state: boolean | null = null;
    private pDob: Date | null = null;
    private pMin!: Date;

    // non vue properties = start with undefined
    private timeout?: number | NodeJS.Timer;

    @Prop({ default: false })
    private required!: boolean;
    @Prop({ default: null })
    private value!: Date | null;
    @Prop({ default: 122 }) // current longest lifespan in modern history
    private maxYears!: number;

    public created() {
      this.setDates();
    }

    public get dob() {
      return this.pDob;
    }
    public set dob(value: Date | null) {
      if (this.pDob !== value) {
        this.pDob = value;
        this.$emit('input', value);
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
