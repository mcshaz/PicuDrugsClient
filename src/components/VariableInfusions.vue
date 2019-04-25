<template>
</template>
<script lang="ts">
import 'reflect metadata';
import { Component, Vue, Inject, Prop } from 'vue-property-decorator';
import { WardLists, IDrugDB } from '@/services/db';
import { getVariableInfusionsForPt } from '@/services/infusion-calculations';
import { IChartData } from '@/components/ComponentCommunication';


@Component
export default class VariableInfusions extends Vue {
    @Prop({required: true})
    private chartData!: IChartData;
    @Inject('db')
    private db!: IDrugDB;
    public created() {

    }
}
</script>