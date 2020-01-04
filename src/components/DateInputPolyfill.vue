<template>
    <div>
        <div
            :class="['FormDate',isValid===true?'valid':'',isValid===false?'invalid':'']"
            @keydown.capture.passive="keydown"
            @blur.capture.passive="emitBlur">
            <input :required="required"
                ref="first"
                class="FormDate__input"
                type="number"
                autocomplete="off"
                min="1"
                step="1"
                :max="first.max"
                :placeholder="first.placeholder"
                :class="first.class"
                :value="first.value"
                @input="setValue($event.target.value,'first')">
            <span class="FormDate__divider">{{sep1}}</span>
            <input :required="required"
                ref="second"
                class="FormDate__input"
                type="number"
                autocomplete="off"
                min="1"
                step="1"
                :max="second.max"
                :placeholder="second.placeholder"
                :class="second.class"
                :value="second.value"
                @input="setValue($event.target.value,'second')">
            <span
                class="FormDate__divider"
            >{{sep2}}</span>
            <input :required="required"
                ref="third"
                class="FormDate__input"
                type="number"
                step="1"
                autocomplete="off"
                :max="third.max"
                :placeholder="third.placeholder"
                :class="third.class"
                :value="third.value"
                @input="setValue($event.target.value,'third')">
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { parseDate, dateInRange, dateOrder, shortFormatter } from '@/services/utilities/dateHelpers';
import { vueNumber } from './PatientAgeData.vue';
import { DatePart, datePartType } from '@/services/utilities/DatePart';

@Component({})
export default class DateInputPolyfill extends Vue {
    public isValid: null | boolean = null;

    public first = new DatePart(dateOrder[0] as datePartType);
    public sep1 = dateOrder[1];
    public second = new DatePart(dateOrder[2] as datePartType);
    public sep2 = dateOrder[3];
    public third = new DatePart(dateOrder[4] as datePartType);

    private dateArgs!: [DatePart, DatePart, DatePart];
    private pDate: Date | null = null;

    @Prop({ default: null })
    private value!: Date | null;
    @Prop({ default: null })
    private min!: Date | null;
    @Prop({ default: null })
    private max!: Date | null;
    @Prop({ default: false })
    private required!: boolean;

    public created() {
      if (this.min && this.max && this.min > this.max) {
        throw new RangeError('min must be <= max');
      }
      this.dateArgs = [this.first, this.second, this.third];
      this.dateArgs.sort((a, b) => {
        if (a.part === 'year') {
          return -1;
        }
        if (b.part === 'year') {
          return 1;
        }
        if (a.part === 'month') {
          return -1;
        }
        return 1;
      });
      if (this.value) {
        this.dateArgs[0].setValue(this.value.getFullYear().toString(), false);
        this.dateArgs[1].setValue((this.value.getMonth() + 1).toString(), false);
        this.dateArgs[2].setValue(this.value.getDate().toString(), false);
      }
      this.pDate = this.value;
    }

    public setValue(val: string, pos: 'first' | 'second' | 'third' = 'third') {
      const nextVal = this[pos].setValue(val, pos !== 'third');
      if (typeof nextVal === 'string') {
        if (pos === 'first') {
          const nextVal2 = this.second.setValue(nextVal);
          if (nextVal2) {
            pos = 'second';
            if (typeof nextVal2 === 'string') {
              this.third.setValue(nextVal, false);
            }
          }
        } else { // if (pos === 'second')
          this.third.setValue(nextVal, false);
        }
      }
      if (nextVal) {
        if (pos === 'first') {
          (this.$refs.second as HTMLInputElement).select();
        } else { // if (pos === 'second')
          (this.$refs.third as HTMLInputElement).select();
        }
      }
      this.emitDate();
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

    private emitDate() {
      const timestamp = parseDate(this.dateArgs[0].value, this.dateArgs[1].value, this.dateArgs[2].value);
      if (!timestamp) {
        if (this.pDate) {
          this.$emit('input', this.pDate = null);
          this.isValid = null;
        }
      } else if (!this.pDate || this.pDate.getTime() !== timestamp.getTime()) {
        this.$emit('input', this.pDate = timestamp);
        const thirdEl = this.$refs.third as HTMLInputElement;
        if (this.min && timestamp < this.min) {
          if (this.max && timestamp > this.max) {
            thirdEl.setCustomValidity(`date must be between ${shortFormatter.format(this.min)} and ${shortFormatter.format(this.max)}`);
          } else {
            thirdEl.setCustomValidity(`date must be >= ${shortFormatter.format(this.min)}`);
          }
          this.isValid = false;
        } else if (this.max && timestamp > this.max) {
          thirdEl.setCustomValidity(`date must be <= ${shortFormatter.format(this.max)}`);
          this.isValid = false;
        } else {
          thirdEl.setCustomValidity('');
          this.isValid = true;
        }
      }
    }
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
