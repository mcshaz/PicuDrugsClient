<template>
  <div class="gas-calcs">
    <h2>Gas usage calculations</h2>
    <b-row align-h="end">
      <b-col lg="7">
        <ValidationObserver v-slot="{ passes }">
<form @submit.prevent class="card p-2">
          <ValidationProvider v-slot="errors" name="Minute Volume">
<b-form-group label-for="min-vol" label-cols-lg="3" label-cols-xl="2"
                invalid-feedback="please enter minute volume" label="Minute Volume">
            <b-input-group append="L/min">
              <input class="form-control" type="number" min="0.5" max="10" step="0.1"
                  v-model.number="minVol" id="min-vol" name="min-vol" />
            </b-input-group>
          </b-form-group>
</ValidationProvider>
          <ValidationProvider v-slot="errors" name="fio2">
<b-form-group label-for="fio2" label-cols-lg="3" label-cols-xl="2"
                invalid-feedback="please enter fraction of inspired oxygen">
            <template slot="label">
              FiO<sub>2</sub>
            </template>
            <input class="form-control" type="number" min="0.21" max="1" step="0.01"
                  v-model.number="fio2" id="fio2" name="fio2" />
          </b-form-group>
</ValidationProvider>
          <ValidationProvider v-slot="errors" name="o2Rate">
<b-form-group label-for="o2Rate" label-cols-lg="3" label-cols-xl="2"
                invalid-feedback="please enter consumption" :description="o2Rate.toFixed(1) + ' L/min'">
            <template slot="label">
              O<sub>2</sub> Consumption
            </template>
            <b-input-group prepend="1 L/min" append="40 L/min">
              <input class="custom-range" type="range" min="1" max="40" step="0.5"
                  :value="o2Rate" @input="o2Changed($event.target.value)" id="o2Rate" name="o2Rate" />
            </b-input-group>
          </b-form-group>
</ValidationProvider>
          <ValidationProvider v-slot="errors" name="Time using cylinder:">
<b-form-group label-for="duration-mins" label-cols-lg="3" label-cols-xl="2" label="Time using cylinder:"
                invalid-feedback="Please select a duration">
            <template slot="description">
              <span class="time-estimate">{{ durationMins | timeFilter }}</span>
            </template>
            <b-input-group prepend="5 min" append="12 hr">
              <input class="custom-range" type="range" min="5" max="720"
                  v-model.number="durationMins" id="duration-mins" name="durationMins" />
            </b-input-group>
          </b-form-group>
</ValidationProvider>
          <ValidationProvider v-slot="errors" name="Cylinder Size:">
<b-form-group label-for="cylinder-size" label-cols-lg="3" label-cols-xl="2"
              label="Cylinder Size:" invalid-feedback="Please select a size">
            <select v-model="selectedSize" class="custom-select" required id="cylinder-size">
              <option v-for="(s, k) of cylinderSizes" :key="k" :value="k">
                {{k + (s.use ? ` (${s.use})` : '') }}
              </option>
            </select>
          </b-form-group>
</ValidationProvider>
            <ValidationProvider v-slot="errors" name="Starting pressure:">
<b-form-group label-for="start-pressure" label-cols-lg="3" label-cols-xl="2" label="Starting pressure:"
                invalid-feedback="Please select a pressure" :description="startPressure + ' bar'">
            <b-input-group prepend="0" :append="selectedCylinder.barFull + ' bar'">
              <input class="custom-range" type="range" min="0" :max="selectedCylinder.barFull"
                  v-model.number="startPressure" id="start-pressure" name="start-pressure" />
            </b-input-group>
          </b-form-group>
</ValidationProvider>
        </form>
</ValidationObserver>
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
import { timeFilter } from '@/services/transports/timeFilter';
import SvgGasGuage from '@/components/SvgGasGuage.vue';
type vueNumber = number | '';
const units = [ 'Bar/kPa', 'PSI', 'Proportion' ] as const;

@Component({
  components: {
    SvgGasGuage,
  },
  filters: {
    timeFilter,
  },
})
export default class GasCalcs extends Vue {
  public minVol: vueNumber = '';
  public fio2: vueNumber = 0.5;
  public o2Rate: number = 0;
  public durationMins: number = 60;
  public cylinderSizes = cylinderSizes;
  public selectedSize: keyof typeof cylinderSizes = 'M122';
  public startPressure: number = 0;

  public units = units;
  public selectedUnit = 'KPa';

  public get totalGasUsed() {
    return this.o2Rate * this.durationMins;
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
    this.o2Rate = Number(newVal);
    if (isNaN(this.o2Rate)) { this.o2Rate = 0; }
  }
}
function theoreticalO2Flow(fio2: number, mv: number) {
  return mv * (fio2 - 0.21) / 0.79;
}
</script>
<style>
  #tanks-used {
    font-size: 48pt;
  }
</style>
