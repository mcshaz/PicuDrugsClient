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
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';
import ChartType from '@/components/ChartType.vue';
import { IPatientData } from '@/components/ComponentCommunication';
import { IAppData } from '@/services/drugDb';
import { sortByStringProp } from '@/services/utilities/sortByProp';

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
  public infusions = true;
  public boluses = true;
  @Inject('appData')
  private appData!: IAppData;

  public created() {
    this.appData.getWardDefaults().then(wd => {
      if (wd) {
        this.boluses = wd.boluses;
        this.infusions = wd.infusions;
        this.wardAbbrev = wd.wardAbbrev;
      }
    });
  }

  public submit(data: IPatientData) {
    if ((this.$refs.form as HTMLFormElement).checkValidity()) {
      this.appData
        .setWardDefaults({
          boluses: this.boluses,
          infusions: this.infusions,
          wardAbbrev: this.wardAbbrev,
          formalSet: true,
        })
        .then(() => this.$router.push({ name: 'home' }));
    }
  }
}
</script>
