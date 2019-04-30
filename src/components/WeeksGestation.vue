<template>
    <div class="weeks-gestation was-validated">
        <b-form-group label-for="weeksGestation" label-cols-lg="2" label-cols-xl="2" label="Gestation:"
                invalid-feedback="a number between 22 &amp; 43 weeks is required" :state="state">
        <b-input-group append="weeks" >
            <input class="form-control" name="weeksGestation" id="weeksGestation"
                placeholder="Weeks Gestation" type="number" :min="minGest" :max="maxGest" required
                :disabled="disabled" @input="convertAndEmit($event.target.value)" :value="value" />
        </b-input-group>
        </b-form-group>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

type vueNumber = number | '';
type nullBool = null | boolean;
const termGestation = 40;
@Component
export default class WeeksGestation extends Vue {
    @Prop({default: termGestation})
    private value!: number;
    @Prop({default: false})
    private disabled!: boolean;

    private minGest = 22;
    private maxGest = 43;
    private state = true;

    public convertAndEmit(val: string) {
        let numVal: '' | number;
        if (!val) {
            numVal = '';
        } else {
            const floatVal = parseFloat(val);
            numVal = isNaN(floatVal)
                ? ''
                : floatVal;
        }
        this.state = !!numVal && this.minGest <= numVal && numVal <= this.maxGest;
        this.$emit('input', numVal);
    }

    @Watch('disabled')
    private disableChange(newVal: boolean) {
        if (newVal) {
            this.convertAndEmit(termGestation.toString());
        }
    }
}
</script>