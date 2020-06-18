<template>
    <div>
        <validated-input-group label="NHI" rules="exactLength:7|nhiRegex|nhiChecksum" :label-cols-lg="labelColsLg" :label-cols-xl="labelColsXl"
                type="text" v-model="nhi" placeholder="NHI" :immediate="immediate" :required="required">
            <template #invalid-feedback="{ valContext }">
                <span v-if="valContext.failedRules.nhiChecksum">
                    A letter or number is mistyped
                    <b-button variant="link" v-b-modal.nhi-explain>(more info <font-awesome-icon icon="question" />)</b-button>
                </span>
                <span v-else-if="valContext && valContext.errors">
                    {{ valContext.errors[0] }}
                </span>
            </template>
        </validated-input-group>
        <!-- Modal Component -->
        <b-modal id="nhi-explain" title="Info on NZ NHI" :ok-only="true"
                header-bg-variant="dark"
                header-text-variant="light">
            <p class="my-4">
                The NHI contains information within the 7 characters which
                allow computers to check if it is a valid value <span class="text-muted">(a 'checksum')</span>. This validation check is currently <em>failing</em>.
            </p>
            <p>
                If you are creating a ficticious patient for simulation activities, either leave the NHI
                blank, or use the NHI <strong>SIM0000</strong> through to <strong>SIM0099</strong>.
                These are the <em>only</em> invalid NHIs which will pass validation.
            </p>
            <p>
                If you work in a country other than NZ, please <a href="mailto:brentm@adhb.govt.nz">email
                the program author (Brent)</a> with details and he can set up validation for your particular
                institution.
            </p>
        </b-modal>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Mixins } from 'vue-property-decorator';
import ValidatedInputGroup from '@/components/formGroups/ValidatedInputGroup.vue';
import LabelColWidth from '@/mixins/LabelColWidth';

type vueNumber = number | '';

@Component({
  components: {
    ValidatedInputGroup,
  },
})
export default class NhiInput extends Mixins(LabelColWidth) {
  @Prop({ required: true })
  private value!: string;

  @Prop({ default: void 0 })
  private required?: boolean;

  @Prop({ default: void 0 })
  private immediate?: boolean;

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
