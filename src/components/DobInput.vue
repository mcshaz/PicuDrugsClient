<template>
    <div :class="pState===null?'':'was-validated'" >
        <b-form-group label="DOB:" label-for="dob" label-cols-lg="2" label-cols-xl="2" :state="pState" >
            <template slot="invalid-feedback">
                must be between {{min.toLocaleDateString()}} and {{max.toLocaleDateString()}}
            </template>
            <date-input :min="min" :max="max" v-model="dob"
                    @blur="onBlur()" :id="dob"/>
        </b-form-group>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import DateInput from '@/components/DateInput.vue';
import { ymdFormat, dateInRange } from '@/services/utilities/dateHelpers';

enum dateElSupport { noSupport, elSupport, valueAsDateSupport }

@Component({
    components: {
        DateInput,
    },
})
export default class DobInput extends Vue {
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

    public created() {
        this.setDates();
    }

    public get dob() {
        return this.pDob;
    }
    public set dob(value: Date | null) {
        if (this.pDob !== value) {
            this.pDob = value;
            this.setState(true);
            this.$emit('input', value);
        }
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

</script>
