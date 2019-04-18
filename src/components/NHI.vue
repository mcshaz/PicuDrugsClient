<template>
    <div>
        <b-form-group for="nhi" label-cols-md="2" label="NHI:" :state="nhiState"
            valid-feedback="conforms to NZ NHI" >
            <input class="form-control" type="text" id="nhi" v-model.trim="nhi" placeholder="NHI" 
                   autocomplete="off" :pattern="nhiPattern" :minlength="nhiLength" :maxlength="nhiLength" 
                   ref="nhi"/>
            <template slot="invalid-feedback" v-if="!explainChecksum">
                Must be 3 letters (NOT 'I' or 'O') followed by 4 numbers
            </template>
            <template slot="invalid-feedback" v-else>
                A letter or number is mistyped <b-button v-b-modal.nhi-explain>(more info <font-awesome-icon icon="question" />)</b-button>
            </template>
        </b-form-group>
        <!-- Modal Component -->
        <b-modal id="nhi-explain" title="Info on NZ NHI">
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
const simNHI = 'SIM1111'
enum nhiValidationResult { pass=0, length, regExp, checkSum }

@Component
export default class PatientAgeWeightData extends Vue {
    public nhiState: null | boolean = null;
    public explainChecksum = false;
    private pNhi: string = '';
    public nhiPattern!:string;
    public readonly simNHI = simNHI;
    public readonly nhiLength = nhiLength;

    public created(){
        this.nhiPattern = createNHIRx(true);
    }

    public get nhi() { return this.pNhi; }
    public set nhi(value: string) {
        this.pNhi = value;
        if (value.length < nhiLength) {
            this.nhiState = null;
        } else {
            this.validate();
        }
        this.$emit('input', value);
    }

    public validate() {
        const valResult = validateNhi(this.nhi, this.nhiPattern);
        this.explainChecksum = valResult === nhiValidationResult.checkSum;
        const newState = valResult === nhiValidationResult.pass;
        if (this.nhiState !== newState) {
            this.nhiState = newState;
            this.$emit('validationStateChange', newState);
        }
    }

    private setCustomValidity(valResult: nhiValidationResult) {
        (this.$refs.nhi as HTMLInputElement).setCustomValidity(valResult === nhiValidationResult.checkSum
            ? 'Checksum Error'
            : '');
    }
}
function validateNhi(nhi: string, pattern: string = createNHIRx()) {
    if (!nhi) { return nhiValidationResult.pass; }
    if (nhi.length !== nhiLength) { return nhiValidationResult.length; }
    if (nhi === simNHI) { return nhiValidationResult.pass; }
    if (!new RegExp(pattern).test(nhi)) {
        return nhiValidationResult.regExp;
    }
    if (!mod11check(nhi)) {
        return nhiValidationResult.checkSum;
    }
    return nhiValidationResult.pass;
}

function createNHIRx(ignoreCase: boolean = false) {
  let allowedChars = 'A-HJ-NP-Z';
  if (ignoreCase) {
    allowedChars = allowedChars + allowedChars.toLowerCase();
  }
  allowedChars = '[' + allowedChars + ']';
  return '^AAANNNC$'
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
  return checkSum === 11 - cum % 11;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#nhi {
  text-transform: uppercase;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
