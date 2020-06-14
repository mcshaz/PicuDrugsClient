<template>
  <validation-observer v-slot="observerCtxt" slim>
    <b-form-group label-for="weight" label-cols-lg="2" label-cols-xl="2" label="Weight:"
        label-align-lg="right" :state="getAndStoreState(observerCtxt)">
      <template #description v-if="lbWtCentile!==null">
        <output name="centile" id="centile" ref="centile" :class="centileClass">
          <span class="prefix">{{lbWtCentile.prefix}}&nbsp;</span>
          <span class="val">{{lbWtCentile.val}}</span>
          <sup class="suffix">{{lbWtCentile.suffix}}</sup>
          <span class="note">{{lbWtCentile.note}}</span>
          <span v-if="ubWtCentile">
          –
          <span class="prefix">{{ubWtCentile.prefix}}
          &nbsp;
          </span><span class="val">{{ubWtCentile.val}}</span>
          <sup class="suffix">{{ubWtCentile.suffix}}</sup>
          <span class="note">{{ubWtCentile.note}}</span>
          </span>
          centile
        </output>
      </template>
      <template #[feedbackName]>
        <validation-provider name="confirm weight checkbox" immediate
            :rules="{required: {allowFalse: false}}" v-if="requireAccept">
          <b-form-checkbox v-model="acceptWtWarn" name="acceptWtWarn">
            <em class="confirm">I confirm this is the correct weight!</em>
          </b-form-checkbox>
        </validation-provider>
        {{ combineErrors(observerCtxt) }}
      </template>
      <validation-provider name="Weight" vid="weight" :immediate="immediate" class="form-inline" tag="div">
        <b-input-group append="kg">
          <input class="form-control" name="weight" v-model.number="weightKg" placeholder="Weight"
              type="number" :required="required" @blur="debounceCentiles.flush()"
              :min="minWeight" :max="maxWeight" step="any" :class="wtClass"/>
        </b-input-group>
        <b-button v-if="allowMedianWeight" variant="outline-primary" :disabled="disableMedianWt" @click="medianWt4age" class="ml-3">
          Median Weight For Age
        </b-button>
      </validation-provider> <!-- end form-inline -->
    </b-form-group>
  </validation-observer>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import PatientAgeData from '@/components/PatientAgeData.vue';
import NhiInput from '@/components/NhiInput.vue';
import ValidatedBoolRadioGroup from '@/components/formGroups/ValidatedBoolRadioGroup.vue';
import { ChildAge, daysPerMonth, GenericRange } from '@/services/infusion-calculations';
import { UKWeightData, Lms } from '@/services/anthropometry/';
import { centileString, alarmLevel, ICentileVal } from '@/services/utilities/centileString';
import { minWeightRecord, maxWeightRecord } from '@/services/utilities/weightHelpers';
import { BFormCheckbox } from 'bootstrap-vue';
import StateWatcher, { IValCtxt } from '@/mixins/StateWatcher';
import _ from 'lodash';
import CombineErrors from '../mixins/CombineErrors';

type vueNumber = number | '';

@Component({
  components: { PatientAgeData, NhiInput, ValidatedBoolRadioGroup, BFormCheckbox },
})
export default class AgeValidatedWeight extends Mixins(StateWatcher, CombineErrors) {
  public lbWtCentile: ICentileVal | null = null;
  public ubWtCentile: ICentileVal | null = null;

  @Prop({ required: true })
  private value!: vueNumber;
  @Prop({ default: 40 })
  private weeksGestation!: vueNumber;
  @Prop({ default: null })
  private age!: ChildAge;
  @Prop({ default: null })
  private isMale!: boolean | null;
  @Prop({ default: true })
  private required!: boolean;
  @Prop({ default: false })
  private immediate!: boolean;
  @Prop({ default: true })
  private allowMedianWeight!: boolean;

  private acceptWtWarn = false;
  private weightKg: vueNumber = '';
  private lastState: boolean | null = null;
  // private lastValState: boolean | null = null;
  private debounceCentiles = _.debounce(this.updateCentiles.bind(this), 450);

  // not to be watched
  private wtData!: UKWeightData;
  private centileString?: string;

  public beforeCreate() {
    this.wtData = new UKWeightData();
  }

  public get alertLevel() {
    let returnVar: 'danger' | 'success';
    if (this.ubWtCentile) {
      returnVar = alertLevel(Math.round((this.lbWtCentile!.alarm + this.ubWtCentile.alarm) / 2));
    } else if (this.lbWtCentile) {
      returnVar = alertLevel(this.lbWtCentile.alarm);
    } else {
      return '';
    }
    if (this.acceptWtWarn && returnVar === 'danger') {
      return 'warning';
    }
    return returnVar;
  }

  public get disableMedianWt() {
    return !!this.weightKg || !this.age;
  }

  public get requireAccept() {
    return (this.alertLevel === 'warning' || this.alertLevel === 'danger') &&
      (this.minWeight <= this.weightKg && this.weightKg <= this.maxWeight);
  }

  public get centileClass() {
    return (this.alertLevel === 'warning' || this.alertLevel === 'danger')
      ? 'text-warning'
      : 'text-info';
  }

  public get feedbackName() {
    return this.lastState === true
      ? 'valid-feedback'
      : 'invalid-feedback';
  }

  public get wtClass() {
    return [this.alertLevel, this.getClassForState(this.lastState)];
  }

  public getAndStoreState(valCtxt: IValCtxt) {
    return (this.lastState = this.getState(valCtxt));
  }

  public get minWeight() {
    return minWeightRecord(this.age ? ChildAge.getMinTotalDays(this.age!) / daysPerMonth : void 0);
  }
  public get maxWeight() {
    return maxWeightRecord(this.age ? ChildAge.getMaxTotalDays(this.age!) / daysPerMonth : void 0);
  }

  @Watch('isWeightEstimate')
  public watchWeightEstimate(newVal: boolean) {
    this.$emit('update:weight-is-estimate', newVal);
  }

  @Watch('isMale')
  @Watch('weeksGestation')
  @Watch('age', { deep: true })
  public flush() {
    this.debounceCentiles();
    this.debounceCentiles.flush();
  }

  @Watch('weightKg')
  public watchWeightKg(weight: vueNumber) {
    if (weight === '') {
      this.flush();
    } else {
      this.debounceCentiles();
    }
  }

  @Watch('value', { immediate: true })
  public watchValue(newVal: vueNumber) {
    this.weightKg = newVal;
    this.flush();
  }

  @Watch('ubWtCentile', { deep: true })
  @Watch('ubWtCentile', { deep: true })
  public watchCentilStr() {
    const innerText = (this.$refs.centile as HTMLOutputElement).innerText;
    if (this.centileString !== innerText) {
      this.$emit('update:centile-string', (this.centileString = innerText));
    }
  }

  public medianWt4age() {
    const rng = this.lmsRange();
    if (!rng.lowerBound) {
      throw new Error('cannot get lms for age - no data');
    }
    if (!rng.upperBound) {
      this.weightKg = Math.round(rng.lowerBound.m);
    } else {
      this.weightKg = Math.round((rng.lowerBound.m + rng.upperBound.m) / 2);
    }
    this.$emit('median-weight', true);
  }

  private updateCentiles() {
    const rng = this.lmsRange();
    if (this.weightKg === '' || rng.lowerBound === void 0) {
      this.ubWtCentile = this.lbWtCentile = null;
    } else {
      const lbWtCentile = rng.lowerBound.cumSnormfromParam(this.weightKg) * 100;
      this.lbWtCentile = centileString(lbWtCentile);
      if (rng.upperBound === void 0) {
        this.ubWtCentile = null;
      } else {
        const ubWtCentile = rng.upperBound.cumSnormfromParam(this.weightKg) * 100;
        const ucs = centileString(ubWtCentile);
        if (ucs.val === this.lbWtCentile.val) {
          this.ubWtCentile = null;
        } else {
          this.ubWtCentile = ucs;
          if (ucs.prefix === this.lbWtCentile.prefix) {
            ucs.prefix = this.lbWtCentile.prefix = '';
          }
          if (this.isMale === null) {
            this.lbWtCentile.note = '♂';
            ucs.note = '♀';
          }
        }
      }
    }
    if (this.value !== this.weightKg) {
      this.$emit('input', this.weightKg);
    }
  }

  private lmsRange() {
    const returnVar = new GenericRange<Lms>();
    if (!this.age) {
      return returnVar;
    }
    const ageDays = this.age.getAgeRangeInDays();
    returnVar.lowerBound = this.wtData.lmsForAge(ageDays.upperBound, this.isMale === null ? true : this.isMale, this.weeksGestation || 40);
    if (this.isMale !== null && ageDays.lowerBound === ageDays.upperBound) {
      return returnVar;
    }
    returnVar.upperBound = this.wtData.lmsForAge(ageDays.lowerBound, this.isMale === null ? false : this.isMale, this.weeksGestation || 40);
    return returnVar;
  }
}

function alertLevel(level: alarmLevel) {
  switch (level) {
    case alarmLevel.none:
    case alarmLevel.minorWarning:
      return 'success';
    case alarmLevel.warning:
    case alarmLevel.danger:
      return 'danger';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
input.form-control.warning:valid {
  border-color: #fd7e14;
}
.confirm {
  font-size: 106%;
}
</style>
