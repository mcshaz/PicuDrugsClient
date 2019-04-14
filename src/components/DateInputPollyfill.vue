<template>
  <div
    class="FormDate"
    @keydown.capture.passive="keydown"
  ><!-- :value-as-date.prop -->
    <input
      ref="first"
      class="FormDate__input FormDate__input--day"
      type="number"
      :placeholder="pIsMonthFirst?'mm':'dd'"
      v-model="first"
      @blur="pFirst = pFirst.padStart(2, 0)">
    <span class="FormDate__divider">/</span>
    <input
      ref="second"
      class="FormDate__input FormDate__input--month"
      type="number"
      :placeholder="pIsMonthFirst?'dd':'mm'"
      v-model="second"
      @blur="pSecond = pSecond.padStart(2, 0)">
    <span
      class="FormDate__divider"
    >/</span>
    <input
      ref="year"
      v-model="year"
      class="FormDate__input FormDate__input--year"
      type="number"
      placeholder="yyyy"
      @blur="year = year.padStart(4, 0)">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component
export default class DateInputPollyfill extends Vue {
// formatting https://github.com/maoberlehner/building-a-date-input-component-with-vue
    private readonly pIsMonthFirst: boolean;
    private readonly pIsDateSupported: boolean;

    private pFirst: string = '';
    private pSecond: string = '';
    private pYear: string = '';
    
    @Prop()
    private value!: Date | null;

    constructor() {
        super();
        this.pIsMonthFirst = isNaN(Date.parse('23/05/2017'));
        this.pIsDateSupported = isDateSupported();
    }

    public get first() { return this.pFirst; }
    public set first(value: string) {
        let move = this.pIsMonthFirst
            ? this.moveMonth(value)
            : this.moveDay(value);
        if (typeof move === 'boolean') {
            this.pFirst = value;
        } else {
            this.pFirst = move[0];
            this.second = move[1];
            // ?has had activeElement moved by call to second onto year
            // if so, leave it there
            if (this.$refs.first !== document.activeElement) {
                move = false;
            }
        }
        if (move) {
            (this.$refs.second as HTMLInputElement).select();
        }
        this.emitValue();
    }

    public get second() { return this.pSecond; }
    public set second(value: string) {
        const move = this.pIsMonthFirst
            ? this.moveDay(value)
            : this.moveMonth(value);
        if (typeof move === 'boolean') {
            this.pSecond = value;
        } else {
            this.pSecond = move[0];
            this.pYear = move[1];
        }
        if (move) {
            (this.$refs.year as HTMLInputElement).select();
        }
        this.emitValue();
    }

    public get year() { return this.pYear; }
    public set year(value: string) {
        this.pYear = value.slice(-4);
        this.emitValue();
    }

    private moveDay(day: string) {
        if (!day.length) {
            return false;
        }
        if (day.length === 2 && day[0] === '0') {
            return true;
        }
        const dVal = parseInt(day, 10);
        if (isNaN(dVal)) {
            return false;
        }
        if (dVal > 31) {
            return [day.slice(0, -1), day.slice(-1)];
        }
        if (dVal > 3) {
            return true;
        }
        return false;
    }

    private keydown(evt: KeyboardEvent) {
        if (evt.key === '/' || evt.key === '-') {
            // evt.preventDefault(); // we woll hope number input does this
            if ((evt.target as HTMLInputElement).value.length) {
                if (evt.target === this.$refs.first) {
                    (this.$refs.second as HTMLInputElement).select();
                } else if (evt.target === this.$refs.second) {
                    (this.$refs.year as HTMLInputElement).select();
                }
            }
        }
    }

    private moveMonth(month: string) {
        if (!month.length) {
            return false;
        }
        if (month.length === 2 && month[0] === '0') {
            return true;
        }
        const mVal = parseInt(month, 10);
        if (isNaN(mVal)) {
            return false;
        }
        if (mVal > 12) {
            return [month.slice(0, -1), month.slice(-1)];
        }
        if (mVal > 1) {
            return true;
        }
        return false;
    }

    private emitValue() {
        const mm = parseFloat(this.pIsMonthFirst ? this.pFirst : this.pSecond) - 1;
        const dd = parseFloat(this.pIsMonthFirst ? this.pSecond : this.pFirst);
        const yyyy = parseFloat(this.pYear);
        const timestamp = new Date(yyyy, mm, dd);
        if (timestamp.getFullYear() !== yyyy || timestamp.getMonth() !== mm || timestamp.getDate() !== dd) {
            if (this.value) {
                this.$emit('input', this.value = null);
            }
        } else if (!this.value || this.value.getTime() !== timestamp.getTime()) {
            this.$emit('input', this.value = timestamp);
        }
    }
}

function isDateSupported() {
    const input = document.createElement('input');
    const value = 'a';
    input.setAttribute('type', 'date');
    input.setAttribute('value', value);
    return (input.value !== value);
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