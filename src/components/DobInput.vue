<template>
    <div :class="pState===null?'':'was-validated'" >
        <b-form-group label="DOB:" for="dob" label-cols-md="2" :state="pState" >
            <template slot="invalid-feedback">
                must be between {{min.toLocaleDateString()}} and {{max.toLocaleDateString()}}
            </template>
            <date-input-pollyfill :min="min" :max="max" @input="dob=$event" :value="value" 
                    v-if="isDateSupported===dateElSupport.noSupport" @blur="onBlur()" id="dob"/>
            <b-input-group v-else>
                <input class="form-control" type="date" :min="minStr" :max="maxStr" :value-as-date.prop="value" 
                    @blur="onBlur()" @input.passive="dob=$event.target.valueAsDate" 
                    v-if="isDateSupported===dateElSupport.valueAsDateSupport" id="dob" />
                <input class="form-control" type="date" :min="minStr" :max="maxStr" v-model="dobStr" 
                    @blur="onBlur()" v-else id="dob" />
                <b-input-group-append :is-text="true">
                    <font-awesome-icon icon="calendar-alt" />
                </b-input-group-append>
            </b-input-group>
        </b-form-group>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import DateInputPollyfill from '@/components/DateInputPollyfill.vue';
import { ymdFormat, dateInRange } from '@/services/utilities/dateHelpers';

enum dateElSupport { noSupport, elSupport, valueAsDateSupport }

@Component({
    components: {
        DateInputPollyfill,
    },
})
export default class DobInput extends Vue {
    public readonly isDateSupported: dateElSupport;
    public readonly dateElSupport: object;
    private pDateStr!: string;
    private pDob: Date | null = null;
    private pState: boolean | null = null;
    private pMin!: Date;
    private max!: Date;

    // non vue properties = start with undefined
    private timeout?: number | NodeJS.Timer;

    @Prop({default: null})
    private value!: Date | null;
    @Prop({default: 122}) // current longest lifespan in modern history
    private maxYears!: number;

    constructor() {
        super();
        this.isDateSupported = isDateSupported();
        this.dateElSupport = dateElSupport;
        this.pDob = this.value;
        if (this.isDateSupported === dateElSupport.elSupport) {
            this.pDateStr = '';
        }
    }

    public created() {
        this.setDates();
        if (this.isDateSupported === dateElSupport.elSupport && this.value) {
            this.pDateStr = ymdFormat(this.value);
        }
    }

    public get dobStr() {
        return this.pDateStr;
    }
    public set dobStr(value: string) {
        this.pDateStr = value;
        let dt!: Date;
        if (value === '' || isNaN((dt = new Date(value)).valueOf())) {
            this.dob = null;
            return;
        }
        if (dt.getHours() !== 0 || dt.getMinutes() !== 0) { // because it is interpreted as utc midnight
            dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
        }
        this.dob = dt;
    }

    public get dob() {
        return this.pDob;
    }
    public set dob(value: Date | null) {
        if (this.pDob !== value) { // necesary as null emitted on each keystroke in date input until a valid year
            this.pDob = value;
            this.setState(true);
            this.$emit('input', value);
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

    public onBlur() {
        this.setState();
        this.$emit('blur');
    }

    public setState(dateBeingEntered = false) {
        this.pState = this.pDob === null || (dateBeingEntered && this.pDob.getFullYear() < 1000)
            ? null
            : this.min <= this.pDob && this.pDob <= this.max;
    }

    private get min() { return this.pMin; }
    private set min(value: Date) {
        this.pMin = value;
        this.$emit('min-change', value);
    }

    @Watch('value')
    private valuePropChanged(newVal: Date | null) {
        if (this.pDob !== newVal) {
            this.pDob = newVal;
            this.setState();
        }
    }

    private setDates() {
        const now = new Date();
        this.max = new Date(now);
        const minDate = new Date(now);
        minDate.setFullYear(minDate.getFullYear() - this.maxYears);
        minDate.setDate(minDate.getDate() + 1);
        this.min = minDate;
        const nextMidnight = new Date(now);
        nextMidnight.setHours(0, 0, 0, 0);
        nextMidnight.setDate(nextMidnight.getDate() + 1);
        const msToMidnight = nextMidnight.getTime() - now.getTime();
        this.timeout = setTimeout(() => {
            this.setDates();
        }, msToMidnight);
    }

    private destroyed() {
        switch (typeof this.timeout) {
        case 'number':
            clearTimeout(this.timeout);
            break;
        case 'object':
            this.timeout.unref();
            if ((this.timeout as any).id && clearTimeout) {
                clearTimeout((this.timeout as any).id);
            }
            break;
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

<style>
</style>