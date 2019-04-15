<template>
    <div>
        <DateInputPollyfill :min="min" :max="max" @input="internalValue=$event" :value="value" v-if="isDateSupported===dateElSupport.noSupport"/>
        <div class="input-group" v-else>
            <input class="form-control col" type="date" :min="min" :max="max" :value-as-date="value"
                @input="internalValue=$event.target.valueAsDate" v-if="isDateSupported===dateElSupport.valueAsDateSupport">
            <input class="form-control col" type="date" :min="min" :max="max" v-model="dateStr" v-else>
            <div class="input-group-append">
                <div class="input-group-text">
                <font-awesome-icon icon="calendar" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import DateInputPollyfill from '@/components/DateInputPollyfill.vue';
import { ymdFormat, dateInRange } from '@/services/utilities/dateHelpers';

enum dateElSupport { noSupport, elSupport, valueAsDateSupport }

@Component({
    components: {
        DateInputPollyfill,
    },
})
export default class DateInput extends Vue {
// formatting https://github.com/maoberlehner/building-a-date-input-component-with-vue
    public readonly isDateSupported: dateElSupport;
    public readonly dateElSupport: object;
    private pDateStr!: string;

    private pInternalValue: Date | null = null;

    @Prop({default: null})
    private readonly value!: Date | null;
    @Prop({default: null})
    private readonly min!: Date | null;
    @Prop({default: null})
    private readonly max!: Date | null;

    constructor() {
        super();
        this.isDateSupported = isDateSupported();
        this.dateElSupport = dateElSupport;
        if (this.isDateSupported === dateElSupport.elSupport) {
            this.pDateStr = '';
        }
    }

    public created() {
        if (this.isDateSupported === dateElSupport.elSupport && this.value) {
            this.pDateStr = ymdFormat(this.value);
        }
        this.pInternalValue = this.value;
    }

    public get dateStr() {
        return this.value
            ? ymdFormat(this.value)
            : '';
    }
    public set dateStr(value: string) {
        let dt!: Date;
        if (value === '' || isNaN((dt = new Date(value)).valueOf())) {
            this.internalValue = null;
            return;
        }
        if (dt.getHours() !== 0 || dt.getMinutes() !== 0) { // because it is interpreted as utc midnight
            dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
        }
        this.internalValue = dt;
    }

    public get internalValue() { return this.pInternalValue; }
    public set internalValue(value: Date | null) {
        if (!value || !dateInRange(value, this.min, this.max)) {
            if (this.pInternalValue) {
                this.$emit('input', this.pInternalValue = null);
            }
        } else if (!this.pInternalValue || this.pInternalValue.getTime() !== value.getTime()) {
            this.$emit('input', this.pInternalValue = value);
        }
    }
}

function isDateSupported() {
    const input = document.createElement('input');
    const v = 'a';
    input.setAttribute('type', 'date');
    input.setAttribute('value', v);
    if (input.value === v) {
        return dateElSupport.noSupport;
    }
    return input.valueAsDate === null
        ? dateElSupport.valueAsDateSupport
        : dateElSupport.elSupport;
}

</script>

<style lang="scss">
.FormDate {
  $spacing: 0.75em;
  display: inline-flex;
  position: relative;
  overflow: hidden;
  border: 1px solid #888;
  border-radius: 0.25em;
  // 1. Hide the spinner button in Chrome, Safari and Firefox.
  &__input {
    padding: $spacing;
    padding-right: $spacing / 2;
    padding-left: $spacing / 2;
    border: none;
    text-align: center;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -moz-appearance: textfield; // 1
    &::-webkit-inner-spin-button {
      display: none; // 1
    }
    &:first-child {
      padding-left: $spacing;
    }
    &:last-child {
      padding-right: $spacing;
    }
    &:focus {
      outline: none;
    }
    &--day,
    &--month {
      width: 3em;
    }
    &--year {
      width: 4em;
    }
  }
  &__divider {
    padding-top: $spacing;
    padding-bottom: $spacing;
    pointer-events: none;
  }
}
</style>