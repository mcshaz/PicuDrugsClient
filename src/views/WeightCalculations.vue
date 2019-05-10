<template>
    <div class="weight-calculations">
        <section>
            <h1>Obesity and eating disorder calculations</h1>
            <p>
                Drug dosing in obesity is a complex and controversial topic. There is <em>clearly</em> no one size fits all model<sup>1,2</sup>.
            </p>
            <p>
                For busulfan, methotrexate, tacrolimus, warfarin, linezolid, voriconazole, gentamicin, amikacin, vancomycin, caffeine, and mycophenolate
                please consider using <a href="https://www.nextdose.org/">nextdose</a>, which accounts for fat mass, creatinine clearance and the patient's previous
                response to medications in a bayesian analysis.
            </p>
            <form @submit.prevent :class="formula?'was-validated':''">
                <b-form-group label-for="formula" label-cols-lg="2" label-cols-xl="2" label="Formula:" invalid-feedback="Please select a formula" >
                    <template slot="description">
                        <span v-html="description"> </span>
                    </template>
                    <b-form-select v-model="formula" :options="formulaOptions" :required="true" name="formula" >
                        <template slot="first">
                            <option :value="''" disabled>Select a formula to see details</option>
                        </template>
                    </b-form-select>
                </b-form-group>
                <true-false-radio label="Gender:" true-label="Male" false-label="Female" v-model="isMale" :required="requireGender" />
                <patient-age-data v-model="age" :exact="true" :required="requireAge" />
                <b-form-group label-for="weight" label-cols-lg="2" label-cols-xl="2" label="Weight:" >
                    <b-input-group append="kg">
                    <input class="form-control" name="weight" v-model.number="weightKg" placeholder="Weight" :required="requireWeight"
                            type="number" autocomplete="off" step="any" />
                    </b-input-group>
                </b-form-group>
                <b-form-group label-for="height" label-cols-lg="2" label-cols-xl="2" label="Height:" >
                    <b-input-group append="cm">
                    <input class="form-control" name="height" v-model.number="heightCm" placeholder="Height" required
                            type="number" autocomplete="off" step="any" />
                    </b-input-group>
                </b-form-group>
            </form>
            <b-alert variant="info" show v-if="!!value">
                <output>
                    {{value.toFixed(isBsa ? 2 : (value < 10) ? 1 : 0)}}
                    <span v-if="isBsa">m<sup>2</sup></span><span v-else>kg</span>
                </output>
            </b-alert>
        </section>
        <footer>
            <hr />
            <ol class="citations">
                <li>
                    Anderson BJ, Holford NHG. Getting the dose right for obese children.
                    <cite>Arch Dis Child.</cite>
                    2017; <span class="volume-no">102</span>(1):54-55
                    <a href="http://dx.doi.org/10.1136/archdischild-2016-311696">http://dx.doi.org/10.1136/archdischild-2016-311696</a>
                </li>
                <li>
                    Holford NHG, Anderson BJ. Allometric size: The scientific theory and extension to normal fat mass.
                    <cite>Eur J Pharm Sci J</cite>
                    2017; <span class="volume-no">109</span>:59–64
                    <a href="https://doi.org/10.1016/j.ejps.2017.05.056">https://doi.org/10.1016/j.ejps.2017.05.056</a>
                </li>
            </ol>
        </footer>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import PatientWeightData from '@/components/PatientWeightData.vue'; // @ is an alias to /src
import TrueFalseRadio from '@/components/TrueFalseRadio.vue';
import PatientAgeData from '@/components/PatientAgeData.vue';
import { anthroCalculations, applyAnthropometry } from '@/services/pharmacokinetics/anthroCalculations';
import { mcLarenObesityCorrection, mooreObesityCorrection, bmiObesityCorrection } from '@/services/anthropometry/helpers/obesityCorrections';
import { UKWeightData, UKBMIData, UKLengthData } from '@/services/anthropometry/';
import { ChildAge } from '@/services/infusion-calculations';
type vueNumber = number | '';
enum centileCorrections { BMI = 'Body Mass Index Method', Moore = 'Moore Method', McLaren = 'McLaren Method' }

@Component({
  components: {
    TrueFalseRadio, PatientAgeData,
  },
})
export default class Obesity extends Vue {
    public isMale: boolean | null = null;
    public heightCm: vueNumber = '';
    public weightKg: vueNumber = '';
    public age: ChildAge | null = null;
    public formulaOptions: string[] = [];
    public formula = '';

    // non-reactive
    private pWeightCentiles?: UKWeightData;
    private pLengthCentiles?: UKLengthData;
    private pBmiCentiles?: UKBMIData;

    public created() {
        this.formulaOptions = Object.values(centileCorrections).concat(Array.from(anthroCalculations.keys()));
    }
    // computed
    public get description() {
        if (this.formula === '') { return ''; }
        if (this.formula === centileCorrections.Moore) {
            return 'Find height for age centile, and then calculate the weight for age which would be on the equivalent centile';
        }
        if (this.formula === centileCorrections.McLaren) {
            return 'Find the age which equates to the 50<sup>th</sup> centile for the height of the child, and lookup the 50<sup>th</sup> weight centile for that age';
        }
        if (this.formula === centileCorrections.BMI) {
            return 'Use the 50<sup>th</sup> centile BMI for age, and multiply by the height<sup>2</sup>';
        }
        return anthroCalculations.get(this.formula)!.description;
    }
    public get value() {
        if (this.formula === '') { return ''; }
        if (this.isCentileCalc) {
            if (this.heightCm === '' || this.isMale === null) {
                return '';
            }
            if (this.formula === centileCorrections.McLaren) {
                return mcLarenObesityCorrection(this.heightCm, this.isMale, this.lengthCentiles(), this.weightCentiles());
            }
            if (this.age === null) { return ''; }
            const ageDays = this.age.getAgeRangeInDays().avg();
            if (this.formula === centileCorrections.Moore) {
                return mooreObesityCorrection(this.heightCm, ageDays, this.isMale, this.lengthCentiles(), this.weightCentiles());
            }
            // else this.formula === centileCorrections.BMI
            return bmiObesityCorrection(this.heightCm, ageDays, this.isMale, this.bmiCentiles());
        }
        return applyAnthropometry(anthroCalculations.get(this.formula)!, this.weightKg, this.heightCm, this.isMale) || '';
    }
    public get requireAge() {
        return this.formula === centileCorrections.Moore || this.formula === centileCorrections.McLaren;
    }
    public get requireWeight() {
        const calc = anthroCalculations.get(this.formula);
        return calc === void 0 ? false : !!calc.requiresMassKg;
    }
    public get requireHeight() {
        if (this.isCentileCalc) { return true; }
        const calc = anthroCalculations.get(this.formula);
        return calc === void 0 ? false : !!calc.requiresHeightCm;
    }
    public get requireGender() {
        if (this.isCentileCalc) { return true; }
        const calc = anthroCalculations.get(this.formula);
        return calc === void 0 ? false : !!calc.requiresGender;
    }
    public get isBsa() {
        return this.formula.startsWith('body surface area');
    }
    public get isCentileCalc() {
        return this.formula === centileCorrections.Moore || this.formula === centileCorrections.McLaren || this.formula === centileCorrections.BMI;
    }
    // methods - more lik properties, but vue will make them observable if written as such
    private weightCentiles() {
        return this.pWeightCentiles || (this.pWeightCentiles = new UKWeightData());
    }
    private lengthCentiles() {
        return this.pLengthCentiles || (this.pLengthCentiles = new UKLengthData());
    }
    private bmiCentiles() {
        return this.pBmiCentiles || (this.pBmiCentiles = new UKBMIData());
    }
}
</script>

<style scoped>
    .volume-no {
        font-weight: bold;
    }
</style>