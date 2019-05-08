<template>
  <div class="chart">
    <variable-infusions :chart-promise="infusions" />
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Prop, Inject } from 'vue-property-decorator';
// import PatientWeightData from '@/components/PatientWeightData.vue'; // @ is an alias to /src
import VariableInfusions from '@/components/VariableInfusions.vue';
import { IWardChartData } from '@/components/ComponentCommunication';
import { WardLists, IDrugDB, IEntityBolusDrug, IEntityFixedDrug } from '@/services/drugDb';
import { getVariableInfusionsForPt, transformVariableInfusions, IVariableInfusionDrugVM } from '@/services/infusion-calculations';

@Component({
  components: {
    VariableInfusions,
  },
})
export default class WardChart extends Vue {
  public infusions: Promise<IVariableInfusionDrugVM[]> | null = null;
  public boluses: Array<IEntityBolusDrug | IEntityFixedDrug | string> = [];
  @Prop({required: true})
  private chartData!: IWardChartData;
  @Inject('db')
  private db!: IDrugDB;
  public created() {
    if (!this.chartData) {
      this.$router.replace({name: 'home'});
      return;
    }
    const wardList = new WardLists(this.db);
    if (this.chartData!.infusions) {
      this.infusions = wardList.getVariableInfusions(this.chartData.ward).then((data) => {
        const selected = getVariableInfusionsForPt(data, this.chartData.age.totalMonthsEstimate(this.chartData.weeksGestation), this.chartData.weightKg);
        return transformVariableInfusions(this.chartData.weightKg, selected);
      });
    }
    if (this.chartData.boluses) {
      wardList.getBolusDrugs(this.chartData.ward).then((data) => {
        this.boluses = data;
      });
    }
  }
}
</script>