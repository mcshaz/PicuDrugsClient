<template>
  <div class="home">
    <h2>Drug Calculator - Defaults for this browser</h2>
    <validation-observer v-slot="{ passes, invalid }">
      <form @submit.prevent="passes(submit)" ref="form" class="card p-2">
        <chart-type
          v-model="ward"
          :boluses.sync="boluses"
          :infusions.sync="infusions"
        />
        <b-button type="submit" :disabled="invalid" >Set Defaults</b-button>
      </form>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject } from 'vue-property-decorator';
import ChartType from '@/components/ChartType.vue';
// import { IPatientData } from '@/components/ComponentCommunication';
import { IAppData, definedCharts } from '@/services/drugDb';
// import { sortByStringProp } from '@/services/utilities/sortByProp';

interface ISelectOption {
  value: number;
  text: string;
  disabled?: boolean;
}

@Component({
  components: {
    ChartType,
  },
})
export default class SetDefaults extends Vue {
  public wardAbbrev = '';
  public charts: definedCharts[] = [];
  @Inject('appData')
  private appData!: IAppData;

  public created() {
    this.appData.getWardDefaults().then(wd => {
      if (wd) {
        this.charts = wd.chartTypes;
        this.wardAbbrev = wd.wardAbbrev;
      }
    });
  }

  public submit() {
    this.appData
      .setWardDefaults({
        chartTypes: this.charts,
        wardAbbrev: this.wardAbbrev,
        formalSet: true,
      })
      .then(() => this.$router.push({ name: 'home' }));
  }
}
</script>
