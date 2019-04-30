<template>
  <div role="tablist">
    <b-card no-body class="mb-1">
      <div v-for="(drug, indx) in chart" :key="drug.drugName" >
        <b-card-header header-tag="header" class="p-1" role="tab" >
            <b-button block href="#" v-b-toggle="'accordion'+indx" variant="info">
                <a :href="drug.link" class="text-white">{{drug.drugName}}</a>
                <span>{{drug.note}}</span>
                <span>@</span>
                <span>{{drug.doseRange}}</span>
                <span>{{drug.rateUnit}}</span>
            </b-button>
        </b-card-header>
        <b-collapse :id="'accordion'+indx" visible accordion="my-accordion" role="tabpanel">
            <b-card-body>
                
                <b-card-text v-for="(conc, cIndx) in drug.concentrations" :key="conc.oneMlHrDose" :class="cIndx%2===0?'even':'odd'" >
                    <span>{{conc.detailName}}</span>
                    <span>{{round(conc.drawingUpDose)}}</span>
                    <span>{{drug.drawingUpUnits}}</span>
                    <span>{{conc.isNeat?'neat, total':'diluted to'}}</span>
                    <span>{{conc.finalVolume}}</span>
                    <span>ml</span>
                    <span>
                        (<span>1ml/h = </span>
                        <span>{{round(conc.oneMlHrDose)}}</span>
                        <span>{{drug.rateUnit}}</span>)
                    </span>
                    <span>@</span>
                    <span>{{conc.flowRange}}</span>
                    <span>ml/h</span>
                </b-card-text>
            </b-card-body>
        </b-collapse>
      </div>
    </b-card>
  </div>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop } from 'vue-property-decorator';
import { WardLists, IDrugDB } from '@/services/db';
import { IVariableInfusionDrugVM, NumericRange } from '@/services/infusion-calculations';

@Component
export default class VariableInfusions extends Vue {
    public chart: IVariableInfusionDrugVM[] = [];
    @Prop({required: true})
    private chartPromise!: Promise<IVariableInfusionDrugVM[]>;

    public created() {
        if (this.chartPromise!) {
            this.chartPromise.then((data) => {
                this.chart = data;
            });
        }
    }

    public round(val: number) {
        return NumericRange.sigFigures(val, 2);
    }
}
</script>
<style>
a[aria-expanded="true"] {
    background-color: green;
}
.even {
    background-color: lightgray;
}
</style>