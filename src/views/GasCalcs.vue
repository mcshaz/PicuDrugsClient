<template>
  <div class="gas-calcs">
    <h2>Gas usage calculations</h2>
    <b-row align-h="end">
      <b-col lg="7">
        <form @submit.prevent class="card p-2" novalidate>
          <validated-input-group label="Minute Volume" append="L/min" type="number" min="0.1" max="10" step="0.1" v-model="minVol"/>
          <validated-input-group type="number" min="0.21" max="1" step="0.01" v-model="fio2">
            <template #label>
              FiO<sub>2</sub>
            </template>
          </validated-input-group>
          <validated-input-group label="O2 Consumption" type="number" min="0" max="40" required append="L/min">
            <template #label>
              O<sub>2</sub> Consumption
            </template>
          </validated-input-group >
          <validated-input-group label="Time using cylinder" type="range" v-model="durationMins" prepend="5 min" append="12 hr" min="5" max="720">
            <template #range-value>
              <duration-display :value="durationMins"/>
            </template>
          </validated-input-group>
          <validated-select-group label="Cylinder Size" required >
            <template>
              <option v-for="(s, k) of cylinderSizes" :key="k" :value="k">
                {{k + (s.use ? ` (${s.use})` : '') }}
              </option>
            </template>
          </validated-select-group>
          <validated-input-group label="Starting pressure" type="range" :range-value="startPressure + ' bar'" prepend="0" :append="selectedCylinder.barFull + ' bar'"
              min="0" :max="selectedCylinder.barFull"/>
        </form>
      </b-col>
      <b-col xl="5" lg="5">
        <b-card header="Results:">
          Using a total of {{totalGasUsed.toFixed()}} litres of gas
          <br>
          <span class="text-muted">
            (commencing with {{(fractionStart * 100).toFixed()}}% of a size
            {{selectedSize}} tank =
            {{(selectedCylinder.litres * fractionStart).toFixed()}} litres)
          </span>
          <svg-gas-guage v-if="proportionRemain > 0" :fraction-begin="fractionStart"
              :fraction-remain="proportionRemain" :full-value="selectedCylinder.barFull" />
          <div id="tanks-used" v-else>
            {{roundedTanksUsed}} x
            <img src="/img/gas-cylinder.svg" height="100">
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';
import { cylinderSizes, pressureToKpa, GasCylinder } from '@/services/transports/GasCylinder';
import { roundToFixed } from '@/services/infusion-calculations/Utilities/rounding';

import SvgGasGuage from '@/components/SvgGasGuage.vue';
import DurationDisplay from '@/components/DurationDisplay.vue';
type vueNumber = number | '';
const units = [ 'Bar/kPa', 'PSI', 'Proportion' ] as const;

@Component({
  components: {
    SvgGasGuage,
    DurationDisplay,
  },
})
export default class GasCalcs extends Vue {
  public minVol: vueNumber = '';
  public fio2: vueNumber = 0.5;
  public o2Rate: vueNumber = 0;
  public durationMins: number = 60;
  public cylinderSizes = cylinderSizes;
  public selectedSize: keyof typeof cylinderSizes = 'M122';
  public startPressure: number = 0;

  public units = units;
  public selectedUnit = 'KPa';

  public get totalGasUsed() {
    return (this.o2Rate || 0) * this.durationMins;
  }

  public get proportionRemain() {
    return this.fractionStart - this.totalGasUsed / this.selectedCylinder.litres;
  }

  public get roundedTanksUsed() {
    const used = this.totalGasUsed / this.selectedCylinder.litres;
    return (Math.ceil(used * 10) / 10).toFixed(1);
  }

  public get selectedCylinder() {
    return cylinderSizes[this.selectedSize];
  }

  public get fractionStart() {
    return this.startPressure / this.selectedCylinder.barFull;
  }

  public created() {
    this.startPressure = this.selectedCylinder.barFull;
  }

  @Watch('minVol')
  @Watch('fio2')
  public calco2() {
    this.o2Rate = (this.fio2 !== '' && this.minVol !== '')
      ? theoreticalO2Flow(this.fio2, this.minVol)
      : 0;
  }

  public o2Changed(newVal: string) {
    if (newVal !== '') {
      this.fio2 = '';
      this.minVol = '';
    }
  }
}
function theoreticalO2Flow(fio2: number, mv: number) {
  return roundToFixed(mv * (fio2 - 0.21) / 0.79);
}
</script>
<style>
  #tanks-used {
    font-size: 48pt;
  }
</style>
