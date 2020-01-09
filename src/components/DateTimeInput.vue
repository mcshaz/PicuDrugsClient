<template>
    <div class="datetime form-inline">
        <b-form-select v-model="date" :options="dates">
            <template #first>
                <option :value="null" disabled>Please select a date</option>
            </template>
        </b-form-select>
        <b-input-group>
            <input type="time" v-model="time" class="form-control">
            <b-input-group-append :is-text="true">
                <font-awesome-icon icon="clock" />
            </b-input-group-append>
        </b-input-group>
        <input class="form-control ml-2" type="button" value="Now" @click="setNow">
    </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import DateInput from '@/components/DateInput.vue';
import { ymdFormat, dateInRange } from '@/services/utilities/dateHelpers';

interface IDates { value: number; text: string; /* disabled: boolean; */ }

@Component({
  components: {
    DateInput,
  },
})
export default class DateTimeInput extends Vue {
    @Prop({ default: null })
    public value!: Date | null;
    // @Prop({default: () => today})
    // public min!: Date;
    public date: number | null = null;
    public time = '';
    private wasEmpty = true;
    private dates: IDates[] = getDateOptions();
    public created() {
      this.valueChange();
    }
    public setNow() {
      const d = new Date();
      this.$emit('input', d);
    }
    @Watch('value')
    public valueChange() {
      if (this.value !== null) {
        const d = new Date(this.value);
        d.setHours(0, 0, 0, 0);
        this.date = d.getTime();
        this.time = `${this.value.getHours().toString().padStart(2, '0')}:${this.value.getMinutes().toString().padStart(2, '0')}`;
        this.wasEmpty = false;
      } else {
        this.date = null;
        this.time = '';
        this.wasEmpty = true;
      }
    }
    @Watch('date')
    @Watch('time')
    public dateTimeChange() {
      if (this.time === '' || this.date === null) {
        if (!this.wasEmpty) {
          this.$emit('input', null);
          this.wasEmpty = true;
        }
      } else {
        this.wasEmpty = false;
        const returnVar = new Date(this.date);
        returnVar.setHours(parseInt(this.time.substr(0, 2), 10), parseInt(this.time.substr(3, 2), 10));
        this.$emit('input', returnVar);
      }
    }
}
const formatter = new Intl.DateTimeFormat(navigator.languages as string[],
  { weekday: 'short',
    month: 'numeric',
    day: 'numeric' });
let pDtOptions: IDates[];
function getDateOptions() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!pDtOptions || pDtOptions[0].value !== today.getTime()) {
    pDtOptions = new Array(7).fill(today).map((t, indx) => {
      const dt = new Date(t);
      dt.setDate(dt.getDate() + indx);
      let rel: string;
      switch (indx) {
        case 0:
          rel = ' (today)';
          break;
        case 1:
          rel = ' (tomorrow)';
          break;
        default:
          rel = '';
      }
      return {
        value: dt.getTime(),
        text: formatter.format(dt) + rel,
      };
    });
  }
  return pDtOptions;
}
</script>
