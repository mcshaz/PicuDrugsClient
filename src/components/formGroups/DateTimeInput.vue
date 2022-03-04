<template>
    <div class="datetime form-inline">
        <date-input v-model="date" :min="dateMin" :max="dateMax" :required="required" :cssClass="cssClass"/>
        <b-input-group>
            <input type="time" v-model="time" class="form-control" :min="timeMin" :max="timeMax" :step="timeStep" :required="required"
                :class="cssClass">
            <b-input-group-append is-text>
                <font-awesome-icon icon="clock" />
            </b-input-group-append>
        </b-input-group>
        <input class="form-control ml-2 btn-secondary" type="button" value="Now" @click="setNow">
    </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import DateInput from '@/components/formGroups/DateInput.vue';
// import { ymdFormat } from '@/services/utilities/dateHelpers';

// interface IDates { value: number; text: string /* disabled: boolean; */ }

@Component({
  components: { DateInput },
})
export default class DateTimeInput extends Vue {
    @Prop({ default: null })
    public value!: Date | null;

    @Prop({ default: void 0 })
    public min?: Date;

    @Prop({ default: void 0 })
    public max?: Date;

    @Prop({ default: 60 })
    public timeStep!: number;

    @Prop({ default: void 0 })
    public required?: boolean;

    @Prop({ default: void 0 })
    public cssClass?: string;

    // @Prop({default: () => today})
    // public min!: Date;
    public date: Date | null = null;
    public time = '';

    public get dateMin() {
      if (!this.min) { return void 0; }
      const returnVar = new Date(this.min);
      returnVar.setHours(0, 0, 0, 0);
      return returnVar;
    }

    public get dateMax() {
      if (!this.max) { return void 0; }
      const returnVar = new Date(this.max);
      returnVar.setHours(0, 0, 0, 0);
      return returnVar;
    }

    public get timeMin() {
      if (!this.min || !this.date || this.date.valueOf() > this.dateMin!.valueOf()) { return void 0; }
      return getLocalTimeString(this.min);
    }

    public get timeMax() {
      if (!this.max || !this.date || this.date.valueOf() < this.dateMax!.valueOf()) { return void 0; }
      return getLocalTimeString(this.max);
    }

    public setNow() {
      const d = new Date();
      d.setSeconds(0, 0);
      this.$emit('input', d);
    }

    @Watch('value', { immediate: true })
    public valueChange(newVal: Date | null) {
      if (newVal !== null) {
        const d = new Date(newVal);
        d.setHours(0, 0, 0, 0);
        this.date = d;
        this.time = getLocalTimeString(newVal);
      } else {
        this.date = null;
        this.time = '';
      }
    }

    @Watch('date')
    @Watch('time')
    public dateTimeChange() {
      if (this.time === '' || this.date === null) {
        if (this.value) {
          this.$emit('input', null);
        }
      } else {
        const returnVar = new Date(this.date);
        returnVar.setHours(parseInt(this.time.substring(0, 2), 10), parseInt(this.time.substring(3), 10));
        if (!this.value || this.value.valueOf() !== returnVar.valueOf()) {
          this.$emit('input', returnVar);
        }
      }
    }
}
function getLocalTimeString(dt: Date | number) {
  if (!(dt instanceof Date)) { dt = new Date(dt); }
  return `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}`;
}
</script>
<!--
<style>
input[type="date"] {
  min-width: 10.2em;
}
input[type="time"] {
  min-width: 9.4em;
}
</style>
-->
