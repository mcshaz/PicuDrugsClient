<template>
  <div class="home">
    <h2>Gas usage calculations</h2>
    <form @submit.prevent class="card p-2">
      <b-form-group label-for="min-vol" label-cols-lg="3" label-cols-xl="2"
            invalid-feedback="please enter minute volume" label="Minute Volume">
        <b-input-group append="L/min" >
          <input class="form-control" type="number" min="0.5" max="10" step="0.1"
              v-model.number="minVol" id="min-vol" name="min-vol" />
        </b-input-group>
      </b-form-group>
      <b-form-group label-for="fio2" label-cols-lg="3" label-cols-xl="2"
            invalid-feedback="please enter fraction of inspired oxygen">
        <template slot="label">
          FiO<sub>2</sub>
        </template>
        <input class="form-control" type="number" min="0.21" max="1" step="0.01"
              v-model.number="fio2" id="fio2" name="fio2" />
      </b-form-group>
      <b-form-group label-for="o2consumption" label-cols-lg="3" label-cols-xl="2"
            invalid-feedback="please enter consumption">
        <template slot="label">
          O<sub>2</sub> Consumption
        </template>
        <b-input-group append="L/min" >
          <input class="custom-range" type="range" min="1" max="40"
              v-model.number="o2Consumption" id="o2consumption" name="o2consumption" />
        </b-input-group>
      </b-form-group>
      <b-form-group label-for="durationMins" label-cols-lg="3" label-cols-xl="2" label="Time using cylinder:"
            invalid-feedback="Please select a duration">
        <template slot="description">
          <span class="time-estimate">estimate {{ durationMins | timeFilter }}</span>
        </template>
        <b-input-group prepend="5 min" append="12 hr" >
          <input class="custom-range" type="range" min="5" max="720"
              v-model.number="durationMins" id="durationMins" name="durationMins" />
        </b-input-group>
      </b-form-group>
      <b-form-group label-for="cylinderSize" label-cols-lg="3" label-cols-xl="2"
          label="Cylinder Size:" invalid-feedback="Please select a size" >
        <select v-model="selectedCylinder" class="custom-select" required >
          <option value="" disabled>cylinder...</option>
          <option v-for="{s, c} of cylinderSizes" :key="s" :value="s">
            {{s + (c.use ? `(${c.use})` : '') }}
          </option>
        </select>
      </b-form-group>
    </form>
    <svg-gas-guage  />
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator'
import { cylinderSizes, pressureToKpa, GasCylinder } from '@/services/transports/GasCylinder'
import SvgGasGuage from '@/components/SvgGasGuage.vue'
type vueNumber = number | '';
const units = [ 'KPa', 'Bar', 'PSI', 'Proportion' ] as const

interface ISelectOption { value: number; text: string; disabled?: boolean; }

@Component({
  components: {
  }
})
export default class GasCalcs extends Vue {
  public minVol: vueNumber = '';
  public fio2: vueNumber = '';
  public o2Consumption: number = 0;
  public durationMins: number = 60;
  public cylinderSizes = cylinderSizes;
  public selectedSize: keyof typeof cylinderSizes = 'M122';

  public units = units;
  public selectedUnit = 'KPa';

  public get proportionUsed () {
    return this.o2Consumption * this.durationMins / this.selectedCylinder.litres
  }

  public get selectedCylinder () {
    return cylinderSizes[this.selectedSize]
  }

  @Watch('minVol')
  @Watch('fio2')
  public calco2 () {
    this.o2Consumption = (this.fio2 !== '' && this.minVol !== '')
      ? theoreticalO2Flow(this.fio2, this.minVol)
      : 0
  }

  @Watch('o2consumption')
  public o2Changed (newVal: vueNumber, oldVal: vueNumber) {
    this.fio2 = ''
    this.minVol = ''
  }
}
function theoreticalO2Flow (fio2: number, mv: number) {
  return mv * (fio2 - 0.21) / 0.79
}
</script>
