<template>
    <div>
        <date-input-pollyfill :min="min" :max="max" @input="date=$event" :value="value"
                v-if="isDateSupported===dateElSupport.noSupport" @blur="$emit('blur', $event)"/>
        <b-input-group v-else>
            <input class="form-control" type="date" :min="minStr" :max="maxStr" :value-as-date.prop="value" @blur="$emit('blur', $event)"
                @input.passive="date=$event.target.valueAsDate" v-if="isDateSupported===dateElSupport.valueAsDateSupport" />
            <input class="form-control" type="date" :min="minStr" :max="maxStr" v-model="dateStr" @blur="$emit('blur', $event)" v-else />
            <b-input-group-append :is-text="true">
                <font-awesome-icon icon="calendar-alt" />
            </b-input-group-append>
        </b-input-group>
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
    private pDate: Date | null = null;

    @Prop({default: null})
    private value!: Date | null;
    @Prop({default: null})
    private min!: Date | null;
    @Prop({default: null})
    private max!: Date | null;

    constructor() {
        super();
        this.isDateSupported = isDateSupported();
        this.dateElSupport = dateElSupport;
        this.pDate = this.value;
        if (this.isDateSupported === dateElSupport.elSupport) {
            this.pDateStr = '';
        }
    }

    public get minStr() {
        return this.min
            ? ymdFormat(this.min)
            : '';
    }

    public get maxStr() {
        return this.max
            ? ymdFormat(this.max)
            : '';
    }

    public created() {
        if (this.isDateSupported === dateElSupport.elSupport && this.value) {
            this.pDateStr = ymdFormat(this.value);
        }
    }

    public get dateStr() {
        return this.pDateStr;
    }
    public set dateStr(value: string) {
        this.pDateStr = value;
        let dt!: Date;
        if (value === '' || isNaN((dt = new Date(value)).valueOf())) {
            this.date = null;
            return;
        }
        if (dt.getHours() !== 0 || dt.getMinutes() !== 0) { // because it is interpreted as utc midnight
            dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
        }
        this.date = dt;
    }

    public get date() {
        return this.pDate;
    }
    public set date(value: Date | null) {
        this.pDate = value;
        // tslint:disable-next-line:triple-equals
        if (value != this.value) {
            this.$emit('input', value);
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