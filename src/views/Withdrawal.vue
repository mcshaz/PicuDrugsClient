<template>
  <div class="withdrawal">
    <h2>Withdrawal Charting</h2>
    <PatientAgeWeightData @valid-submit="submit" :requireAge="false">
      <template v-slot:after>
        <b-form-group label-cols-lg="2" label-cols-xl="2" label="Morphine">
          <b-form-group label-cols-lg="5" label="1ml = " label-for="mophine-conc">
            <b-input-group append="microg/kg/hr">
              <input type="number" v-model.number="morphineConc" id="morphine-conc">
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
      </template>
    </PatientAgeWeightData>
    <div class="withdrawal-drug-row">
    </div>

  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop } from 'vue-property-decorator';
import PatientAgeWeightData from '@/components/PatientAgeWeightData.vue';
import { IPatientData, IWardChartData } from '@/components/ComponentCommunication';

interface ISelectOption { value: number; text: string; disabled?: boolean; }
type vueNumber = number | '';

@Component({
  components: {
    PatientAgeWeightData,
  },
})
export default class Withdrawal extends Vue {
  public morphinMl: vueNumber = '';
  public morphineConc: vueNumber = 20;
  public midazMl: vueNumber = '';
  public midazConc: vueNumber = 1;
  public clonidineMl: vueNumber = '';
  public clonidineConc: vueNumber = 1;

  public submit(data: IPatientData) {
    const chartData = data as IWardChartData;
    this.$router.push({ name: 'ward-chart', params: { chartData }} as any);
  }

  
}
</script>
