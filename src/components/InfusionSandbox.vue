<template>
  <div class="prinatableCharts">
    <h2>Drug Calculator - Create printable charts
    </h2>
    <form class="was-validated" @submit.prevent="submit" >
        <b-form-group label="drug name:" label-for="name" label-cols-lg="2" label-cols-xl="2" >
                <input name="name" type="text" v-model="name" class="form-control">
        </b-form-group>
        <b-form-group label="ampule:" label-cols-lg="2" label-cols-xl="2" class="form-inline">
            <b-form-group label="ampConc:" label-for="ampConc" label-cols-lg="2" label-cols-xl="2" >
                <div class="input-group">
                    <input name="ampConc" type="number" v-model="ampConc" class="form-control">
                    <select class="form-control" v-model="ampPrefix">
                        <option v-for="" >
                        </option>>
                    </select>
                </div>
            </b-form-group>
            in
            <b-form-group label="ampPrefix:" label-for="ampPrefix" label-cols-lg="2" label-cols-xl="2" >
                <b-input-group append="ml">
                    <input name="ampPrefix" type="number" v-model="ampPrefix" class="form-control">
                </b-input-group>
            </b-form-group>

            <b-form-group label="siUnitId:" label-for="siUnitId" label-cols-lg="2" label-cols-xl="2" >
                <b-input-group append="ml">
                    <input name="siUnitId" type="number" v-model="siUnitId" class="form-control">
                </b-input-group>
            </b-form-group>

            <b-form-group label="ampVol:" label-for="ampVol" label-cols-lg="2" label-cols-xl="2" >
                <b-input-group append="ml">
                    <input name="ampVol" type="number" v-model="ampVol" class="form-control">
                </b-input-group>
            </b-form-group>
        </b-form-group>

        <b-form-group label="Dilution Method:" label-for="dilutionMethodId" label-cols-lg="2" label-cols-xl="2" >
            <b-input-group append="ml">
                <input name="dilutionMethodId" type="number" v-model="dilutionMethodId" class="form-control">
            </b-input-group>
        </b-form-group>

        <b-form-group label="infusionPrefix:" label-for="infusionPrefix" label-cols-lg="2" label-cols-xl="2" >
            <b-input-group append="ml">
                <input name="infusionPrefix" type="number" v-model="infusionPrefix" class="form-control">
            </b-input-group>
        </b-form-group>

        <b-form-group label="isPerMinute:" label-for="isPerMinute" label-cols-lg="2" label-cols-xl="2" >
            <b-input-group append="ml">
                <input name="isPerMinute" type="number" v-model="isPerMinute" class="form-control">
            </b-input-group>
        </b-form-group>


        <b-form-group label="dilutionVol:" label-for="dilutionVol" label-cols-lg="2" label-cols-xl="2" >
            <b-input-group append="ml">
                <input name="dilutionVol" type="number" v-model="dilutionVol" class="form-control">
            </b-input-group>
        </b-form-group>

        <b-form-group label="duration:" label-for="duration" label-cols-lg="2" label-cols-xl="2" >
            <b-input-group append="ml">
                <input name="duration" type="number" v-model="duration" class="form-control">
            </b-input-group>
        </b-form-group>

        <b-form-group label="rate:" label-for="rate" label-cols-lg="2" label-cols-xl="2" >
            <b-input-group append="ml">
                <input name="rate" type="number" v-model="rate" class="form-control">
            </b-input-group>
        </b-form-group>

        <b-form-group label="concentration:" label-for="concentration" label-cols-lg="2" label-cols-xl="2" >
            <b-input-group append="ml">
                <input name="concentration" type="number" v-model="concentration" class="form-control">
            </b-input-group>
        </b-form-group>
      <b-button type="submit" :disabled="!ward" >submit</b-button>
    </form>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">kg</th>
          <th scope="col"></th>
          <th scope="col">Female Median <small>(IQR)</small></th>
          <th scope="col" class="small">remove</th>
        </tr>
      </thead>
      <tbody>
        <infusion-sandbox-row v-for="(w, indx) in weights" 
            :key="w.wtKg"
            :wtKg="w.wtKg"
            @female-median-age="w.femaleM=$event"
            @male-median-age="w.maleM=$event"
            @edit-row="edit(indx)"
            @delete-row="del(indx)"
        />
      </tbody>
      <tfoot>
        <tr>
          <td>
          </td>
          <td colspan="3">
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop } from 'vue-property-decorator';
import { exampleWeights } from '@/services/utilities/weightHelpers';
import { siUnit, IEntityFixedDilution, IEntityFixedConcentration, dilutionMethod } from '@/services/drugDb';
import { IPatientFixedInfusionDrug, IPatientFixedConcentration, IPatientFixedDilution, prefixes } from '@/services/infusion-calculations';
import { UKWeightData } from '@/services/anthropometry/';
import { enumToValues } from '@/services/utilities/enumToValues';

type vueNumber = number | '';
interface ISelectOption { value: number; text: string; disabled?: boolean; }

@Component({
  provide: {
    wtCentiles: new UKWeightData(),
  },
})
export default class InfusionSandbox extends Vue {
  public dilutionMethods = enumToValues(dilutionMethod);
  public siUnits = enumToValues(siUnit, );
  public infusionPrefixes = prefixes;

  public weights = exampleWeights;
  public name = '';
  public ampPrefix = -3;
  public ampConc: vueNumber = '';
  public ampVol: vueNumber = '';
  public siUnitId = siUnit.gram;
  public dilutionMethodId = dilutionMethod.NeatFixedFlow;
  public infusionPrefix = -3;
  public isPerMinute = true;

  public dilutionVol = 50;
  public duration = 20;
  public rate = 10;
  public concentration = 0.2;

  public get infusionEntity(): IPatientFixedInfusionDrug {
    var returnVar = {
          fullname: this.name,
          siPrefix: this.ampPrefix,
          siUnitId: this.siUnitId,
          drugAmpuleConcentrations: [{
              concentration: this.ampConc,
              volume: this.ampVol,
          }],
          dilution: {
                dilutionMethodId: this.dilutionMethodId,
                siPrefix: this.infusionPrefix,
                isPerMin: this.isPerMinute,
                concentrations: [{
                    volume: this.dilutionVol || null,
                    stopMinutes: this.duration,
                    rate: this.rate,
                    concentration: this.concentration,
              } as IPatientFixedConcentration]
          } as IPatientFixedDilution,
    } as IPatientFixedInfusionDrug
    return returnVar;
  }
}

</script>
<style scoped>
.input-group-addon.select-input {
  width: 20%;
  padding: 0;
}

.input-group-addon.select-input select {
  border: none;
  height: 32px;
}
</style>
