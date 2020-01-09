<template>
    <div>
        <validation-provider v-slot="{errors, failedRules}" name="NHI" rules="exactLength:7|nhiRegex|nhiChecksum">
            <b-form-group label-for="nhi" label-cols-lg="2" label-cols-xl="2" label="NHI:" :state="validator.$error">
                <input class="form-control" type="text" id="nhi" name="nhi" v-model.trim="nhi" placeholder="NHI"/>
                <template #invalid-feedback v-if="validator.$invalid">
                    <template v-if="failedRules">
                        A letter or number is mistyped
                        <b-button variant="link" v-b-modal.nhi-explain>(more info <font-awesome-icon icon="question" />)</b-button>
                    </template>
                </template>
            </b-form-group>
        </validation-provider>
        <!-- Modal Component -->
        <b-modal id="nhi-explain" title="Info on NZ NHI" :ok-only="true">
            <p class="my-4">
                The NHI contains information within the 7 characters which
                allow computers to check if it is a valid value. This validation check is <em>failing</em>.
            </p>
            <p>
                If you are creating a ficticious patient for simulation activities, either leave the NHI
                blank, or use the NHI <strong>'{{simNHI}}'</strong>.
                This is the <em>only</em> invalid NHI which will pass validation.
            </p>
            <p>
                If you work in a country other than NZ, please <a href="mailto:brentm@adhb.govt.nz">email
                the program author (Brent)</a> with details and he will set up validation for your particular
                institution.
            </p>
        </b-modal>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { defaultSim, nhiChecksum } from '@/services/validation/validators';

type vueNumber = number | '';

@Component({})
export default class NhiInput extends Vue {
  public readonly simNHI = defaultSim;
  @Prop({ required: true })
  private value!: string;

  public get nhi() {
    return this.value;
  }
  public set nhi(value: string) {
    this.$emit('input', value.toUpperCase());
  }
}
/*
function validateNhi(nhi: string, pattern: string = createNHIRx()) {
    if (!nhi || nhi.length === 0) { return nhiValidationResult.na; }
    if (nhi.length !== nhiLength) { return nhiValidationResult.length; }
    if (!new RegExp(pattern).test(nhi)) {
        return nhiValidationResult.regExp;
    }
    if (nhi === simNHI) { return nhiValidationResult.simPass; }
    if (!mod11check(nhi)) {
        return nhiValidationResult.checkSum;
    }
    return nhiValidationResult.pass;
}
*/
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#nhi {
  text-transform: uppercase;
  max-width: 12em;
}
</style>
