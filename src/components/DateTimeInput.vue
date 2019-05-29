<template>
    <div class="datetime form-inline">
        <b-form-select v-model="date" :options="dates" >
            <template slot="first">
                <option :value="null" disabled>Please select a date</option>
            </template>
        </b-form-select>
        <b-input-group>
            <input type="time" v-model="time">
            <b-input-group-append :is-text="true">
                <font-awesome-icon icon="clock" />
            </b-input-group-append>
        </b-input-group>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import DateInput from '@/components/DateInput.vue';
import { ymdFormat, dateInRange, isMonthFirst } from '@/services/utilities/dateHelpers';

interface IDates { value: number; text: string; disabled: boolean; }
const today = new Date();
today.setHours(0, 0, 0, 0);

@Component({
    components: {
        DateInput,
    },
})
export default class DateTimeInput extends Vue {
    @Prop({default: null})
    public value!: Date | null;
    @Prop({default: () => today})
    public min!: Date;
    public date: number | null = null;
    public time = '';
    private wasEmpty = true;
    private dates: IDates[] = new Array(7).fill(today).map((t, indx) => {
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
            text: dateStr(dt) + rel,
            disabled: dt.getTime() < this.min.getTime(),
        };
    });
    public created() {
        this.valueChange();
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

function dateStr(date: Date) {
    let day: string;
    switch (date.getDay()) {
        case 0:
            day = 'Sun';
            break;
        case 1:
            day = 'Mon';
            break;
        case 2:
            day = 'Tue';
            break;
        case 3:
            day = 'Wed';
            break;
        case 4:
            day = 'Thu';
            break;
        case 5:
            day = 'Fri';
            break;
        case 6:
            day = 'Sat';
            break;
        default:
            throw new Error();
    }
    const d = date.getDate(); // could padLeft
    const m = date.getMonth();
    return isMonthFirst
        ? `${day} ${m}/${d}`
        : `${day} ${d}/${m}`;
}
</script>
