<template>
  <div class="chart">
    <variable-infusions :chart-promise="inf" v-for="(inf, indx) in infusions" :key="`inf-${indx}`" />
    <b-toast id="email-registered-toast" variant="success" title="Email registered" :no-close-button="true">
      You will be emailed if the charts for {{chartData.ward.abbrev}} change
    </b-toast>
    <b-toast id="email-failed-toast" variant="danger" title="Error registering email" :no-close-button="true">
      There has been a problem and your email is not registered. Please try again.
    </b-toast>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Prop, Inject } from 'vue-property-decorator';
// import PatientWeightData from '@/components/PatientWeightData.vue'; // @ is an alias to /src
import VariableInfusions from '@/components/VariableInfusions.vue';
import { IMultiWardChartData } from '@/components/ComponentCommunication';
import { WardLists, IDrugDB, IEntityBolusDrug, IEntityFixedDrug } from '@/services/drugDb';
import { getVariableInfusionsForPt, transformVariableInfusions, IVariableInfusionDrugVM, daysPerMonth } from '@/services/infusion-calculations';
import { IRegisterEmail } from '@/services/drugDb';
import { weeksPerMonth } from '../services/anthropometry';

@Component({
  components: {
    VariableInfusions,
  },
})
export default class WardMultiChart extends Vue {
  public infusions: Array<Promise<IVariableInfusionDrugVM[]>> = [];
  public boluses: Array<IEntityBolusDrug | IEntityFixedDrug | string> = [];
  @Prop({required: true})
  private chartData!: IMultiWardChartData;
  @Inject('db')
  private db!: IDrugDB;
  @Inject('serverCom')
  private serverCom!: IRegisterEmail;
  public created() {
    if (!this.chartData) {
      this.$router.replace({name: 'booklet'});
      return;
    }
    if (this.chartData.updateEmail) {
      this.serverCom.notifyOfDbChanges(this.chartData.updateEmail, this.chartData.ward.wardId)
        .then(() => (this as any).$bvToast.show('email-registered-toast'),
              () => (this as any).$bvToast.show('email-failed-toast'));
    }
    const wardList = new WardLists(this.db);
    if (this.chartData!.infusions) {
      const allInfusions = wardList.getVariableInfusions(this.chartData.ward);
      for (const w of this.chartData.weights) {
          const ageMonths = w.estAge.gestation < 40
            ? 0
            : w.estAge.ageDays / daysPerMonth;
          this.infusions.push(allInfusions.then((data) => {
            const selected = getVariableInfusionsForPt(data, ageMonths, w.wtKg);
            return transformVariableInfusions(w.wtKg, selected);
          }));
      }
    }
    if (this.chartData.boluses) {
      wardList.getBolusDrugs(this.chartData.ward).then((data) => {
        this.boluses = data;
      });
    }
  }
}
</script>