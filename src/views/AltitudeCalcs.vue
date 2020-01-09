<template>
  <div class="alti-calcs">
    <h2>Altitude Calculations</h2>
    <b-row align-h="end">
      <b-col lg="7">
        <validation-observer v-slot="{ passes }">
<form @submit.prevent class="card p-2">
          <validation-provider v-slot="errors" name="fio2">
<b-form-group label-for="fio2" label-cols-lg="3" label-cols-xl="2"
                invalid-feedback="please enter fraction of inspired oxygen" :description="fio2.toString()">
            <template #label>
              FiO<sub>2</sub>
            </template>
            <b-input-group prepend="0.21" :append="fio2Max">
                <input class="custom-range" type="range" min="0.21" :max="fio2Max" step="0.01"
                    v-model.number="fio2" id="fio2" name="fio2" />
            </b-input-group>
          </b-form-group>
</validation-provider>
          <validation-provider v-slot="errors" name="Cabin Altitude">
<b-form-group label-for="altitude" label-cols-lg="3" label-cols-xl="2"
                invalid-feedback="please enter the altitude" label="Cabin Altitude">
            <b-input-group append="feet">
              <select class="custom-select" v-model="altitude" id="altitude" name="altitude">
                  <option v-for="n in 7" :key="n" :value="n * 1000">
                      {{n * 1000}}
                  </option>
              </select>
            </b-input-group>
          </b-form-group>
</validation-provider>
        </form>
</validation-observer>
      </b-col>
      <b-col xl="5" lg="5">
        <b-card header="Results:">
            <ul>
                <li>Pressure will be {{percentSea}}% of sea level.</li>
                <li>Trapped gas will increase by {{percentVolIncr}}% of original volume.
                </li>
                <li>To achieve equivalent alveolar partial pressure of O<sub>2</sub>
                    <small class="text-muted">
                        (assuming a constant minute volume &amp; metabolic rate)
                    </small>, FiO<sub>2</sub> will have to increase to {{equivalentFiO2}}.
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
import { pressureInAtm, equivalentFiO2, lengthMeasures } from '@/services/transports/pressureCalcs';

@Component({
})
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
