<template>
    <div class="date-input">
        <date-input-pollyfill :min="min" :max="max" @input="$emit('input',$event)" :value="value" 
                v-if="isDateSupported===dateElSupport.noSupport" @blur="$emit('blur', $event)" :id="id" :required="required"/>
        <b-input-group v-else>
            <input class="form-control" type="date" :min="minStr" :max="maxStr" 
                :value-as-date.prop="value?new Date(value.getTime()-offset):null" :required="required"
                @blur="$emit('blur', $event)" @input.passive="$emit('input', $event.target.valueAsDate?new Date($event.target.valueAsDate.getTime()+offset):null)"
                v-if="isDateSupported===dateElSupport.valueAsDateSupport" :name="name" :id="id" />
            <input class="form-control" type="date" :min="minStr" :max="maxStr" v-model="dateStr" 
                @blur="$emit('blur', $event)" v-else :name="name" :id="id" :required="required" />
            <b-input-group-append :is-text="true">
                <font-awesome-icon icon="calendar-alt" />
            </b-input-group-append>
        </b-input-group>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import DateInputPollyfill from '@/components/DateInputPollyfill.vue';
import { ymdFormat, dateInRange } from '@/services/utilities/dateHelpers';

enum dateElSupport { noSupport, elSupport, valueAsDateSupport }

@Component({
    components: {
        DateInputPollyfill,
    },
})
export default class DateInput extends Vue {
    public readonly isDateSupported: dateElSupport;
    public readonly dateElSupport: typeof dateElSupport;
    public offset = 0;
    private pDateStr!: string;
    private wasDate?: boolean;

    @Prop({default: void 0})
    private min?: Date | null;
    @Prop({default: void 0})
    private max?: Date | null;
    @Prop({default: null})
    private value!: Date | null;
    @Prop({default: void 0})
    private name?: string;
    @Prop({default: void 0})
    private id?: string;
    @Prop({default: false})
    private required!: boolean;

    constructor() {
        super();
        this.isDateSupported = isDateSupported();
        this.dateElSupport = dateElSupport;
        if (this.isDateSupported === dateElSupport.elSupport) {
            this.pDateStr = '';
        }
    }

    public created() {
        if (this.isDateSupported === dateElSupport.elSupport && this.value) {
            this.pDateStr = ymdFormat(this.value);
        } else if (this.isDateSupported === dateElSupport.valueAsDateSupport) {
            this.offset = (this.value || new Date()).getTimezoneOffset() * 60000;
        }
    }

    public get dateStr() {
        return this.pDateStr;
    }
    public set dateStr(value: string) {
        this.pDateStr = value;
        let dt!: Date;
        if (value === '' || isNaN((dt = new Date(value)).valueOf())) {
            if (this.wasDate) {
                this.$emit('value', null);
                this.wasDate = false;
            }
            return;
        }
        if (dt.getHours() !== 0 || dt.getMinutes() !== 0) { // because it is interpreted as utc midnight
            dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
        }
        this.$emit('value', dt);
        this.wasDate = true;
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
.date-input {
    max-width: 14.2em;
}
</style>