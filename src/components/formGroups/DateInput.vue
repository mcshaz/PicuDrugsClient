<template>
    <div class="date-input">
        <date-input-polyfill v-model="pDate" v-if="isDateSupported===dateElSupportValues.noSupport"
              @blur="$emit('blur', $event)" :id="id" :required="required" :class="cssClass"/>
        <b-input-group v-else>
            <input class="form-control" type="date" :min="minStr" :max="maxStr" v-model="dateStr"
                @blur="$emit('blur', $event)" :name="name" :id="id" :required="required" :class="cssClass"/>
            <b-input-group-append is-text>
                <font-awesome-icon icon="calendar-alt" />
            </b-input-group-append>
        </b-input-group>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import DateInputPolyfill from '@/components/formGroups/DateInputPolyfill.vue';
import { ymdFormat, dateInRange } from '@/services/utilities/dateHelpers';
import { dateElSupportValues, dateElSupport } from '@/services/utilities/html5ElementSupport';

@Component({
  components: {
    DateInputPolyfill,
  },
})
export default class DateInput extends Vue {
    public readonly isDateSupported: dateElSupportValues;
    public readonly dateElSupportValues: typeof dateElSupportValues;

    @Prop({ default: void 0 })
    private cssClass?: string;
    @Prop({ default: void 0 })
    private min?: Date | null;
    @Prop({ default: void 0 })
    private max?: Date | null;
    @Prop({ default: null })
    private value!: Date | null;
    @Prop({ default: void 0 })
    private name?: string;
    @Prop({ default: void 0 })
    private id?: string;
    @Prop({ default: false })
    private required!: boolean;

    constructor() {
      super();
      this.isDateSupported = dateElSupport;
      this.dateElSupportValues = dateElSupportValues;
    }

    public get dateStr() {
      if (!this.value || Number.isNaN(this.value.valueOf())) {
        return '';
      }
      const returnVar = new Date(this.value);
      returnVar.setMinutes(-returnVar.getTimezoneOffset());
      return ymdFormat(returnVar);
    }
    public set dateStr(newVal: string) {
      let dt!: Date;
      if (this.value && (newVal === '' || Number.isNaN((dt = new Date(newVal)).valueOf()))) {
        this.$emit('value', null);
        return;
      }
      dt.setMinutes(dt.getTimezoneOffset());
      if (dt.valueOf() !== (this.value ? this.value.valueOf() : null)) {
        this.$emit('value', dt);
      }
    }

    public get minStr() {
      return this.min
        ? ymdFormat(this.min)
        : void 0;
    }
    public get maxStr() {
      return this.max
        ? ymdFormat(this.max)
        : void 0;
    }
}

</script>

<style>
.date-input {
    max-width: 14.4em;
}
</style>
