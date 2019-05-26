<template>
    <div :class="nhiState===null?'':'was-validated'" >
        <b-form-group label-for="nhi" label-cols-lg="2" label-cols-xl="2" label="NHI:" :state="nhiState" >
            <input class="form-control" type="text" id="nhi" name="nhi" v-model.trim="nhi" placeholder="NHI" 
                   autocomplete="off" :pattern="nhiPattern" :minlength="nhiLength" :maxlength="nhiLength" 
                   ref="nhi" @blur="validate()" />
            <template slot="invalid-feedback" v-if="validationResult===validationResults.regExp||validationResult===validationResults.length">
                Must be 3 letters (NO 'I's or 'O's) followed by 4 numbers
            </template>
            <template slot="invalid-feedback" v-else-if="validationResult===validationResults.checkSum">
                A letter or number is mistyped 
                <b-button variant="link" v-b-modal.nhi-explain>(more info <font-awesome-icon icon="question" />)</b-button>
            </template>
        </b-form-group>
        <!-- Modal Component -->
        <b-modal id="nhi-explain" title="Info on NZ NHI" :ok-only="true" >
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
import { Component, Prop, Vue } from 'vue-property-decorator';

type vueNumber = number | '';
const nhiLength = 7;
const simNHI = 'SIM0000';
enum nhiValidationResult { na, pass, simPass, length, regExp, checkSum }

@Component
export default class NhiInput extends Vue {
  public nhiState: null | boolean = null;
  public nhiPattern!: string;
  public readonly simNHI = simNHI;
  public readonly nhiLength = nhiLength;
  public validationResult = nhiValidationResult.na;
  public validationResults = nhiValidationResult;

  @Prop() private readonly value!: string;
  private pNhi: string = '';

  public created() {
      this.nhiPattern = createNHIRx();
      this.pNhi = this.value;
  }

  public get nhi() { return this.pNhi; }
  public set nhi(value: string) {
      this.pNhi = value.toUpperCase();
      this.$emit('input', value);
      this.validate(value.length < nhiLength);
  }

  public validate(isBeingEntered = false) {
    const validity = (this.$refs.nhi as HTMLInputElement).validity;
    if (this.nhi.length === 0) {
      this.validationResult = nhiValidationResult.na;
    } else if (validity.tooShort || validity.tooLong) {
      this.validationResult = nhiValidationResult.length;
    } else if (validity.patternMismatch) {
      this.validationResult = nhiValidationResult.regExp;
    } else if (this.nhi !== simNHI && !mod11check(this.nhi)) {
      this.validationResult = nhiValidationResult.checkSum;
      (this.$refs.nhi as HTMLInputElement).setCustomValidity('checksum fails');
    } else {
      this.validationResult = nhiValidationResult.pass;
      (this.$refs.nhi as HTMLInputElement).setCustomValidity('');
    }
    let newState: boolean | null;
    switch (this.validationResult) {
      case nhiValidationResult.pass:
        newState = true;
        break;
      case nhiValidationResult.na:
        newState = null;
        break;
      case nhiValidationResult.length:
        newState = isBeingEntered ? null : false;
        break;
      default:
        newState = false;
        break;
    }
    if (this.nhiState !== newState) {
        this.nhiState = newState;
        this.$emit('valid-state-change', newState);
    }
  }
}

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

function createNHIRx(ignoreCase: boolean = false) {
  let allowedChars = 'A-HJ-NP-Z';
  let sim = simNHI;
  if (ignoreCase) {
    allowedChars += allowedChars.toLowerCase();
    sim = sim.split('')
      .map((c) => isNaN(Number(c))
        ? `[${c}${c.toLowerCase()}]`
        : c)
      .join('');
  }
  allowedChars = '[' + allowedChars + ']';
  const returnVar = 'AAANNNC'
    .split('')
    .map((c) => {
      switch (c) {
        case 'A':
          return allowedChars;
        case 'N':
        case 'C':
          return '\\d';
        default:
          return c;
      }
    })
    .join('');
  return `^(${returnVar}|${sim})$`;
}

function mod11check(str: string) {
  const alphaLookup = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const checkSum = parseInt(str.slice(-1), 10);
  str = str.slice(0, -1).toUpperCase();
  let cum = 0;
  let multiplier = str.length + 1;
  for (const c of str) {
    let val = parseInt(c, 10);
    if (isNaN(val)) {
      val = alphaLookup.indexOf(c) + 1;
    }
    cum += val * multiplier--;
  }
  const modulus = cum % 11;
  return modulus > 1
    ? (checkSum === 11 - modulus)
    : (modulus + checkSum === 11);
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#nhi {
  text-transform: uppercase;
  max-width: 12em;
}
</style>
