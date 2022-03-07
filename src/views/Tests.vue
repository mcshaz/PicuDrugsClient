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
import WithdrawalDrug from '../components/WithdrawalDrug.vue';

@Component
export default class Tests extends Mixins(Withdrawal, WithdrawalDrug) {
  public async submitForPDF() {
    this.wtKg = 5.3;
    this.dob = new Date(2020, 4, 20);
    this.originalDrugName = 'IV morphine';
    this.setDefaultUnits();
    this.weanDuration = 10; // also try 28
    this.original24HrVol = 63;
    this.originalConcVal = 20;
    this.rapidClonidineWean = false;
    this.weanDaily = true;
    this.weaningDrug = 'morphine';
    createAndDownloadPDF({
      firstN: 'Little',
      lastN: 'Johnny',
      isMale: false,
      nhi: 'SIM0008',
      weight: this.wtKg,
      dob: this.dob,
      prescriber: 'Brent McSharry',
      drugs: [{
        weaningDrug: this.weaningDrug,
        weaningDoseUnits: this.weaningDoseUnits,
        route: 'oral/NG',
        originalDrug: this.originalDrug!.name,
        originalConc: this.concLabel.label + ' ' + this.originalConcVal + this.originalConcUnits!.units,
        originalVol: this.original24HrVol + this.original24HrUnits,
        weaningRegime: this.weaningRegime,
      }],
    });
  }
}
</script>
