<template>
  <div class="alti-calcs">
    <h2>Altitude Calculations</h2>
    <b-row align-h="end">
      <b-col lg="7">
        <validation-observer>
          <form @submit.prevent class="card p-2">
            <validated-input-group
              label="fio2"
              type="range"
              prepend="0.21"
              :append="fio2Max"
              min="0.21"
              :max="fio2Max"
              step="0.01"
              v-model="fio2"
              >
                <template #label>
                  FiO
                  <sub>2</sub>
            </validated-input-group>
            <validated-select-group label="Cabin Altitude"
                append="feet"
                v-model="altitude">
                    <option v-for="n in 7" :key="n" :value="n * 1000">{{n * 1000}}</option>
            </validated-select-group>
          </form>
        </validation-observer>
      </b-col>
      <b-col xl="5" lg="5">
        <b-card header="Results:">
          <ul>
            <li>Pressure will be {{percentSea}}% of sea level.</li>
            <li>Trapped gas will increase by {{percentVolIncr}}% of original volume.</li>
            <li>
              To achieve equivalent alveolar partial pressure of O
              <sub>2</sub>
              <small class="text-muted">(assuming a constant minute volume &amp; metabolic rate)</small>, FiO
              <sub>2</sub>
              will have to increase to {{equivalentFiO2}}.
            </li>
          </ul>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';
import {
  pressureInAtm,
  equivalentFiO2,
  lengthMeasures
} from '@/services/transports/pressureCalcs';

@Component({})
export default class AltitudeCalcs extends Vue {
  public fio2: number = 0.21;
  public altitude: number = 6000;

  public get fractionSea() {
    return pressureInAtm(this.altitude, lengthMeasures.feet);
  }
  public get percentSea() {
    return (this.fractionSea * 100).toFixed();
  }

  public get percentVolIncr() {
    return (100 / this.fractionSea - 100).toFixed();
  }

  public get equivalentFiO2Fract() {
    return equivalentFiO2(this.fractionSea);
  }

  public get equivalentFiO2() {
    return (this.equivalentFiO2Fract * this.fio2).toFixed(2);
  }

  public get fio2Max() {
    return (1 / this.equivalentFiO2Fract).toFixed(2);
  }
}
</script>
