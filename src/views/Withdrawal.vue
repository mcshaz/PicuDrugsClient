<template>
  <div class="withdrawal">
    <h2>Withdrawal Charting</h2>
    <form>
      <b-form-group label-for="weight" label-cols-lg="2" label-cols-xl="2" label="Weight:" 
          :state="!errMsg" :invalid-feedback="errMsg"
          class="was-validated" >
        <b-input-group append="kg">
          <input class="form-control" name="weight" v-model.number="wtKg" placeholder="Weight" 
              type="number" required
              :min="minWt" :max="maxWt" autocomplete="off" step="0.1" />
        </b-input-group>
      </b-form-group>
      <b-form-group label-cols-lg="2" label-cols-xl="2" label="Morphine">
        <b-form-group label-cols-lg="5" label="1ml = " label-for="mophine-conc">
          <b-input-group append="microg/kg/hr">
            <input type="number" v-model.number="morphineConc" id="morphine-conc" :min="10"
                :max="80" step="10">
          </b-input-group>
        </b-form-group>
        <b-form-group label-cols-lg="5" label="last 24hrs:" label-for="morphine-ml">
          <b-input-group append="ml">
            <input type="number" v-model.number="morphineMl" id="morphine-ml">
          </b-input-group>
        </b-form-group>
      </b-form-group>
      <b-form-group label-cols-lg="2" label-cols-xl="2" label="Midazolam">
        <b-form-group label-cols-lg="5" label="1ml = " label-for="midazolam-conc">
          <b-input-group append="microg/kg/min">
            <input type="number" v-model.number="midazConc" id="midazolam-conc">
          </b-input-group>
        </b-form-group>
        <b-form-group label-cols-lg="5" label="last 24hrs:" label-for="midazolam-ml">
          <b-input-group append="ml">
            <input type="number" v-model.number="midazMl" id="midazolam-ml">
          </b-input-group>
        </b-form-group>
      </b-form-group>
      <b-form-group label-cols-lg="2" label-cols-xl="2" label="Clonidine">
        <b-form-group label-cols-lg="5" label="1ml = " label-for="clonidine-conc">
          <b-input-group append="microg/kg/hr">
            <input type="number" v-model.number="clonidineConc" id="clonidine-conc" readonly>
          </b-input-group>
        </b-form-group>
        <b-form-group label-cols-lg="5" label="last 24hrs:" label-for="clonidine-ml">
          <b-input-group append="ml">
            <input type="number" v-model.number="clonidineMl" id="clonidine-ml">
          </b-input-group>
        </b-form-group>
      </b-form-group>
      <b-form-group label-cols-lg="2" label-cols-xl="2" label="Wean Over:" label-for="wean-duration">
        <b-select required id="wean-duration" v-model="selectDuration" >
          <option :value="null" disabled>Please select a duration</option>
          <option :value="5">5 days <small class="text-muted">on infusions 5-10 days</small></option>
          <option :value="10">10 days <small class="text-muted">on infusions >10 days</small></option>
          <option :value="20">20 days <small class="text-muted">prolonged/difficult wean</small></option>
        </b-select>
      </b-form-group>
    </form>
    <withdrawal-table drug="morphine" original24-hr-dose="morphine24Hr" bioavailability="0.3333333333333333"
      :weanOverDays="selectDuration" />
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop } from 'vue-property-decorator';
// import PatientAgeWeightData from '@/components/PatientAgeWeightData.vue';
import WithdrawalTable from '@/components/WithdrawalTable.vue';

type vueNumber = number | '';

@Component({
  components: {
//    PatientAgeWeightData,
      WithdrawalTable,
  },
})
export default class Withdrawal extends Vue {
  public morphinMl: vueNumber = '';
  public morphineConc: vueNumber = 20;
  public midazMl: vueNumber = '';
  public midazConc: vueNumber = 1;
  public clonidineMl: vueNumber = '';
  public clonidineConc: vueNumber = 1;

  public wtKg: vueNumber = '';
  public minWt = 1;
  public maxWt = 600;

  public get morhine24Hr() {
    return (this.wtKg || 0) * (this.morphineConc || 0) * (this.morphinMl || 0) / 1000;
  }

  public get errMsg() {
    if (this.wtKg === '') {
      return 'Weight is required';
    }
    if (this.wtKg < this.minWt || this.wtKg > this.maxWt) {
      return `weight must be between ${this.minWt} and ${this.maxWt} kg`;
    }
    return '';
  }
}
</script>
