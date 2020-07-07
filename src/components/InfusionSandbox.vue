<template>
  <div class="prinatableCharts">
    <h2>Drug Calculator - Create printable charts</h2>
    <validation-observer v-slot="{ passes }">
      <form class="was-validated" @submit.prevent="passes(submit)">
        <validated-input-group label="drug name" type="text" v-model="name"/><!--label-cols-lg="2" label-cols-xl="2"-->

        <validation-provider v-slot="errors" name="ampule">
          <b-form-group label="ampule" label-cols-lg="2" label-cols-xl="2" class="form-inline" :invalid-feedback="errors[0]">
            <div class="input-group">
              <input id="ampAmount" type="number" v-model="ampAmount" class="form-control" />
              <div class="input-group-append select-input">
                <select class="custom-select" v-model="ampPrefix" id="ampPrefix">
                  <option
                    v-for="p in siPrefixes"
                    :key="p.logValue"
                    :value="p.logValue"
                  >{{p.fullName}}</option>
                </select>
                <select class="custom-select" v-model="siUnitId" id="siUnitId">
                  <option v-for="u in siUnits" :key="u.value" :value="u.value">{{u.text}}</option>
                </select>
              </div><!--input-group-append-->
            </div><!--input-group-->
            <label for="ampVol">in</label>
            <b-input-group append="mL">
              <input id="ampVol" type="number" v-model="ampVol" class="form-control" />
            </b-input-group>
          </b-form-group>
        </validation-provider>

        <validated-select-group label="Dilution Method" v-model="dilutionMethodId" id="dilutionMethod">
          <option v-for="m in dilutionMethods" :key="m.value" :value="m.value">{{m.text}}</option>
        </validated-select-group>

        <validation-provider v-slot="errors" name="run infusion @:">
          <b-form-group
            label="run infusion @:"
            label-cols-lg="2"
            label-cols-xl="2"
            :invalid-feedback="errors[0]"
            class="form-inline">
            <div class="input-group-addon">
              <select class="custom-select" v-model="infusionPrefix" id="infusionPrefix">
                <option v-for="p in siPrefixes" :key="p.logValue" :value="p.logValue">{{p.fullName}}</option>
              </select>
              <div class="input-group-append">{{siUnits.find(siUnitId).fullName}}</div><!--input-group-append-->
            </div><!--input-group-addon-->
            <label for="isPerMinute">per</label>
            <select class="custom-select" v-model="isPerMinute" id="isPerMinute">
              <option :value="true">minute</option>
              <option :value="false">hour</option>
            </select>
          </b-form-group>
        </validation-provider>

        <validated-input-group label="Dilution Volume" append="mL" type="number" v-model="dilutionVol"/>

        <validated-input-group label="Duration" append="mins" type="number" v-model="duration"/>

        <validated-input-group label="rate" append="mL" type="number" v-model="rate"/>

        <validated-input-group label="concentration" append="mL" type="number" v-model="concentration"/>
      </form>
    </validation-observer>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">kg</th>
          <th scope="col"></th>
          <th scope="col">
            Female Median
            <small>(IQR)</small>
          </th>
          <th scope="col" class="small">remove</th>
        </tr>
      </thead>
      <tbody>
        <infusion-sandbox-row v-for="w in weights" :key="w" :wtKg="w" />
      </tbody>
      <tfoot>
        <tr>
          <td></td>
          <td colspan="3"></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue } from 'vue-property-decorator';
import { exampleWeights } from '@/services/utilities/weightHelpers';
import {
  siUnit,
  //  IEntityFixedDilution,
  //  IEntityFixedConcentration,
  dilutionMethod
} from '@/services/drugDb';
import {
  IPatientFixedInfusionDrug,
  IPatientFixedConcentration,
  IPatientFixedDilution,
  prefixes
} from '@/services/infusion-calculations';
import { UKWeightData } from '@/services/anthropometry/';
import {
  enumToValues,
  enumValueOptions
} from '@/services/utilities/enumToValues';

type vueNumber = number | '';
interface ISelectOption {
  value: number;
  text: string;
  disabled?: boolean;
}

@Component({
  provide: {
    wtCentiles: new UKWeightData(),
  },
})
export default class InfusionSandbox extends Vue {
  public dilutionMethods = enumToValues(dilutionMethod);
  public siUnits = enumToValues(siUnit, enumValueOptions.sortOnText);
  public siPrefixes = prefixes;

  public weights = exampleWeights;
  public name = '';
  public ampPrefix = -3;
  public ampAmount: vueNumber = '';
  public ampVol: vueNumber = 1;
  public siUnitId = siUnit.gram;
  public dilutionMethodId = dilutionMethod.NeatFixedFlow;
  public infusionPrefix = -3;
  public isPerMinute = true;

  public dilutionVol = 50;
  public duration = 20;
  public rate = 10;
  public concentration = 0.2;

  public get infusionEntity(): IPatientFixedInfusionDrug {
    const returnVar = {
      fullname: this.name,
      siPrefix: this.ampPrefix,
      siUnitId: this.siUnitId,
      drugAmpuleConcentrations: [
        {
          concentration: (this.ampAmount || 0) / (this.ampVol || 1),
          volume: this.ampVol,
        },
      ],
      dilution: {
        dilutionMethodId: this.dilutionMethodId,
        siPrefix: this.infusionPrefix,
        isPerMin: this.isPerMinute,
        concentrations: [
          {
            volume: this.dilutionVol || null,
            stopMinutes: this.duration,
            rate: this.rate,
            concentration: this.concentration,
          } as IPatientFixedConcentration,
        ],
      } as IPatientFixedDilution,
    } as IPatientFixedInfusionDrug;
    return returnVar;
  }
}
</script>
<style scoped>
.input-group-append.select-input {
  width: 20%;
  padding: 0;
}

.input-group-append.select-input select {
  border: none;
  height: 32px;
}
</style>
