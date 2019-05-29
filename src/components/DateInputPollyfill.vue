<template>
    <div>
        <div
            :class="['FormDate',isValid===true?'valid':'',isValid===false?'invalid':'']"
            @keydown.capture.passive="keydown"
            @blur.capture.passive="emitBlur" >
            <input :required="required"
                ref="first"
                class="FormDate__input FormDate__input--day"
                type="number"
                autocomplete="off"
                min="1"
                step="1"
                :max="firstMax"
                :placeholder="isMonthFirst?'mm':'dd'"
                v-model="first">
            <span class="FormDate__divider">/</span>
            <input :required="required"
                ref="second"
                class="FormDate__input FormDate__input--month"
                type="number"
                autocomplete="off"
                min="1"
                step="1"
                :max="secondMax"
                :placeholder="isMonthFirst?'dd':'mm'"
                v-model="second">
            <span
                class="FormDate__divider"
            >/</span>
            <input :required="required"
                ref="year"
                v-model="year"
                class="FormDate__input FormDate__input--year"
                type="number"
                step="1"
                autocomplete="off"
                placeholder="yyyy">
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { parseDate, dateInRange, isMonthFirst } from '@/services/utilities/dateHelpers';

@Component
export default class DateInputPollyfill extends Vue {
    public isValid: null | boolean = null;
    private readonly isMonthFirst: boolean;
    private readonly firstMax: number;
    private readonly secondMax: number;

    private pFirst: string = '';
    private pSecond: string = '';
    private pYear: string = '';
    private pDate!: Date | null;

    @Prop({default: null})
    private value!: Date | null;
    @Prop({default: null})
    private min!: Date | null;
    @Prop({default: null})
    private max!: Date | null;
    @Prop({default: false})
    private required!: boolean;

    constructor() {
        super();
        this.isMonthFirst = isMonthFirst;
        if (this.isMonthFirst) {
            this.firstMax = 12;
            this.secondMax = 31;
        } else {
            this.firstMax = 31;
            this.secondMax = 12;
        }
    }

    public created() {
        if (this.min && this.max && this.min > this.max) {
            throw new RangeError('min must be <= max');
        }
        if (this.value) {
            const mm = this.value.getMonth().toString().padStart(2, '0');
            const dd = this.value.getDay().toString().padStart(2, '0');
            if (this.isMonthFirst) {
                this.pFirst = mm;
                this.pSecond = dd;
            } else {
                this.pFirst = dd;
                this.pSecond = mm;
            }
            this.pYear = this.value.getFullYear().toString().padStart(4, '0');
        }
        this.pDate = this.value;
    }

    public get first() { return this.pFirst; }
    public set first(value: string) {
        const move = this.isMonthFirst
            ? this.moveMonth(value)
            : this.moveDay(value);
        if (typeof move === 'boolean') {
            this.pFirst = formatNo(value);
            if (move) {
                (this.$refs.second as HTMLInputElement).select();
            }
        } else {
            this.pFirst = formatNo(move[0]);
            this.second = formatNo(move[1]);
            // ?has had activeElement moved by call to second onto year
            // if so, leave it there
            if (this.$refs.first === document.activeElement) {
                (this.$refs.second as HTMLInputElement).focus();
            }
        }
        this.setValue();
    }

    public get second() { return this.pSecond; }
    public set second(value: string) {
        const move = this.isMonthFirst
            ? this.moveDay(value)
            : this.moveMonth(value);
        if (typeof move === 'boolean') {
            this.pSecond = formatNo(value);
            if (move) {
                (this.$refs.year as HTMLInputElement).select();
            }
        } else {
            this.pSecond = formatNo(move[0]);
            this.pYear = formatNo(move[1], 4);
            (this.$refs.year as HTMLInputElement).focus();
        }
        this.setValue();
    }

    public get year() { return this.pYear; }
    public set year(value: string) {
        this.pYear = formatNo(value, 4);
        this.setValue();
    }

    private moveDay(day: string) {
        if (!day.length) {
            return false;
        }
        if (day.length === 2 && day[0] === '0' && day[1] !== '0') {
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

    private moveMonth(month: string) {
        if (!month.length) {
            return false;
        }
        if (month.length === 2 && month[0] === '0' && month[1] !== '0') {
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

    private keydown(evt: KeyboardEvent) {
        if (evt.key === '/' || evt.key === '-') {
            // evt.preventDefault(); // we will hope number input does this - if changing, remove .passive from binding
            if ((evt.target as HTMLInputElement).value.length) {
                if (evt.target === this.$refs.first) {
                    (this.$refs.second as HTMLInputElement).select();
                } else if (evt.target === this.$refs.second) {
                    (this.$refs.year as HTMLInputElement).select();
                }
            }
        }
    }

    private emitBlur(evt: FocusEvent) {
        const relatedTarget = evt.relatedTarget;
        if (relatedTarget !== this.$refs.year && relatedTarget !== this.$refs.month && relatedTarget !== this.$refs.year) {
            if ((this.pDate && this.pDate.getTime()) !== (this.value && this.value.getTime())) {
                this.$emit('change', this.pDate);
            }
            this.$emit('blur', evt);
        }
    }

    private setValue() {
        const timestamp = this.isMonthFirst
            ? parseDate(this.pYear, this.pFirst, this.pSecond)
            : parseDate(this.pYear, this.pSecond, this.pFirst);
        if (!timestamp) {
            if (this.pDate) {
                this.$emit('input', this.pDate = null);
                this.isValid = null;
            }
        } else if (!this.pDate || this.pDate.getTime() !== timestamp.getTime()) {
            this.$emit('input', this.pDate = timestamp);
            const yearEl = this.$refs.year as HTMLInputElement;
            if (this.min && timestamp < this.min) {
                if (this.max && timestamp > this.max) {
                    yearEl.setCustomValidity(`date must be between ${this.min.toLocaleDateString()} and ${this.max.toLocaleDateString()}`);
                } else {
                     yearEl.setCustomValidity(`date must be >= ${this.min.toLocaleDateString()}`);
                }
                this.isValid = false;
            } else if (this.max && timestamp > this.max) {
                yearEl.setCustomValidity(`date must be <= ${this.max.toLocaleDateString()}`);
                this.isValid = false;
            } else {
                yearEl.setCustomValidity('');
                this.isValid = true;
            }
        }
    }
}

function formatNo(no: string, len: number = 2) {
    if (no === '' || no === '0' ) { return no; }
    return no.slice(-len).padStart(len, '0');
}
</script>

<style lang="scss">
// formatting https://github.com/maoberlehner/building-a-date-input-component-with-vue
.FormDate.invalid {
    border-color: #dc3545;
    -webkit-box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    box-shadow: 0px 0px 0px 0.2rem rgba(220,53,69,0.25);
}
.FormDate.valid {
    border-color: #28a745;
}

.FormDate {
  $spacing: 0.75em;
  $vert-pad:0.375rem;
  display: inline-flex;
  position: relative;
  overflow: hidden;
  border: 1px solid #ced4da;
  line-height: 1.5;
  border-radius: 0.25rem;
  height: calc(1.5em + 0.75rem + 2px);
  font-size: 1rem;
  // 1. Hide the spinner button in Chrome, Safari and Firefox.
  &__input {
    padding: $vert-pad;
    padding-right: $spacing / 2;
    padding-left: $spacing / 2;
    border: none;
    color: #495057;
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
    padding-top: $vert-pad * 0.67;
    pointer-events: none;
    font-size:1.2rem;
    color: #6c757d;
  }
}
</style>