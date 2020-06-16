<template>
  <div>
    <h2>Testing</h2>
    <validation-observer ref="mainObserver">
        <form @submit.prevent="submitForPDF">
            <button type="submit" class="btn btn-success mb-4"><font-awesome-icon icon="print"/> Create <font-awesome-icon icon="file-pdf"/></button>
        </form>
    </validation-observer>
  </div>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Mixins } from 'vue-property-decorator';
import Withdrawal from './Withdrawal.vue';
import { createAndDownloadPDF } from '@/services/pdf-generation/create-filled-data-pdf-lib';

@Component
export default class Tests extends Mixins(Withdrawal) {
  public async submitForPDF() {
    this.wtKg = 5.3;
    this.dob = new Date(2020, 4, 20);
    this.originalDrugName = 'IV morphine';
    this.setDefaultUnits();
    this.weanDuration = 10;
    this.original24HrVol = 63;
    this.originalConcVal = 20;
    this.rapidClonidineWean = false;
    this.weanDaily = true;
    this.weaningDrug = 'morphine';
    console.log({ originalDrug: this.originalDrug, weaningDrug: this.weaningDrug, age: this.age });
    createAndDownloadPDF({
      firstN: 'Little',
      lastN: 'Johnny',
      isMale: false,
      nhi: 'SIM0008',
      weight: this.wtKg,
      medicine: this.weaningDrug,
      dob: this.dob,
      prescriber: 'Brent McSharry',
      doseUnits: 'mg',
      route: 'oral/NG',
      regime: this.createWeanInfo(),
    });
  }
}
</script>
