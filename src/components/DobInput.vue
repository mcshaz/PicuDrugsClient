<template>
    <div :class="pState===null?'':'was-validated'">
        <b-form-group label="DOB:" label-for="dob" label-cols-lg="2" label-cols-xl="2" :state="pState">
            <template slot="invalid-feedback">
                must be between {{minString}} and {{maxString}}
            </template>
            <date-input :min="min" :max="max" v-model="dob"
                    @blur="onBlur($event)" :id="dob" :required="required" />
        </b-form-group>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import DateInput from '@/components/DateInput.vue';
import { ymdFormat, dateInRange, shortFormatter } from '@/services/utilities/dateHelpers';
import { between } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
import { Validations } from 'vuelidate-property-decorators';

enum dateElSupport { noSupport, elSupport, valueAsDateSupport }

@Component({
  components: {
    DateInput,
  },
  mixins: [ validationMixin ],
})
export default class DobInput extends Vue {
    private pDob: Date | null = null;
    private pState: boolean | null = null;
    private pMin!: Date;
    private max!: Date;

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

    @Validations()
    public getValidations() {
      return { dob: { between: between(this.min, this.max) } };
    }

    public get dob() {
      return this.pDob;
    }
    public set dob(value: Date | null) {
      if (this.pDob !== value) {
        this.pDob = value;
        this.setState(true);
        this.$emit('input', value, this.$v);
      }
    }

    public onBlur(evt: any) {
      this.setState();
      this.$emit('blur', evt);
    }

    public setState(dateBeingEntered = false) {
      this.pState = this.$v.dob!.$error && (dateBeingEntered && this.pDob!.getFullYear() < 1000)
        ? null
        : this.$v.dob!.$error;
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

    @Watch('value')
    private valuePropChanged(newVal: Date | null) {
      if (this.pDob !== newVal) {
        this.pDob = newVal;
        this.setState();
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
