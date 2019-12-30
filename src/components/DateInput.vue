<template>
    <div class="date-input">
        <date-input-polyfill :min="min" :max="max" @input="$emit('input',$event)" :value="value"
                v-if="isDateSupported===dateElSupportValues.noSupport" @blur="$emit('blur', $event)" :id="id" :required="required"/>
        <b-input-group v-else>
            <input class="form-control" type="date" :min="minStr" :max="maxStr"
                :value-as-date.prop="value?new Date(value.getTime()-offset):null" :required="required"
                @blur="$emit('blur', $event)" @input.passive="$emit('input', $event.target.valueAsDate?new Date($event.target.valueAsDate.getTime()+offset):null)"
                v-if="isDateSupported===dateElSupportValues.valueAsDateSupport" :name="name" :id="id" />
            <input class="form-control" type="date" :min="minStr" :max="maxStr" v-model="dateStr"
                @blur="$emit('blur', $event)" v-else :name="name" :id="id" :required="required" />
            <b-input-group-append :is-text="true">
                <font-awesome-icon icon="calendar-alt" />
            </b-input-group-append>
        </b-input-group>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import DateInputPolyfill from '@/components/DateInputPolyfill.vue'
import { ymdFormat, dateInRange } from '@/services/utilities/dateHelpers'
import { dateElSupportValues, dateElSupport } from '@/services/utilities/html5ElementSupport'

@Component({
  components: {
    DateInputPolyfill
  }
})
export default class DateInput extends Vue {
    public readonly isDateSupported: dateElSupportValues;
    public readonly dateElSupportValues: typeof dateElSupportValues;
    public offset = 0;
    private pDateStr!: string;
    private wasDate?: boolean;

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

    constructor () {
      super()
      this.isDateSupported = dateElSupport
      this.dateElSupportValues = dateElSupportValues
      if (this.isDateSupported === dateElSupportValues.elSupport) {
        this.pDateStr = ''
      }
    }

    public created () {
      if (this.isDateSupported === dateElSupportValues.elSupport && this.value) {
        this.pDateStr = ymdFormat(this.value)
      } else if (this.isDateSupported === dateElSupportValues.valueAsDateSupport) {
        this.offset = (this.value || new Date()).getTimezoneOffset() * 60000
      }
    }

    public get dateStr () {
      return this.pDateStr
    }
    public set dateStr (value: string) {
      this.pDateStr = value
      let dt!: Date
      if (value === '' || isNaN((dt = new Date(value)).valueOf())) {
        if (this.wasDate) {
          this.$emit('value', null)
          this.wasDate = false
        }
        return
      }
      if (dt.getHours() !== 0 || dt.getMinutes() !== 0) { // because it is interpreted as utc midnight
        dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset())
      }
      this.$emit('value', dt)
      this.wasDate = true
    }

    public get minStr () {
      return this.min
        ? ymdFormat(this.min)
        : void 0
    }
    public get maxStr () {
      return this.max
        ? ymdFormat(this.max)
        : void 0
    }
}

</script>

<style>
.date-input {
    max-width: 14.4em;
}
</style>
