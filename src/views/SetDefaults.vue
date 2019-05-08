<template>
  <div class="home">
    <b-jumbotron header="Drug Calculator" 
            lead="Defaults for this browser" />
    <form @submit.prevent="submit" ref="form" class="card p-2">
        <ward-select @ward="wardAbbrev=$event.abbrev" :ward-abbrev="wardAbbrev"
                @boluses="boluses=$event" :boluses="boluses"
                @infusions="infusions=$event" :infusions="infusions" />
        <b-button type="submit">Set Defaults</b-button>
    </form>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';
import WardSelect from '@/components/WardSelect.vue';
import { IPatientData } from '@/components/ComponentCommunication';
import { IAppData } from '@/services/drugDb';
import { sortByStringProp } from '@/services/utilities/sortByProp';

interface ISelectOption { value: number; text: string; disabled?: boolean; }

@Component({
  components: {
    WardSelect,
  },
})
export default class SetDefaults extends Vue {
  public wardAbbrev = '';
  public infusions = true;
  public boluses = true;
  @Inject('appData')
  private appData!: IAppData;

  public created() {
    this.appData.getWardDefaults().then((wd) => {
        if (wd) {
            this.boluses = wd.boluses;
            this.infusions = wd.infusions;
            this.wardAbbrev = wd.wardAbbrev;
        }
    });
  }

  public submit(data: IPatientData) {
    if ((this.$refs.form as HTMLFormElement).checkValidity()) {
        this.appData.setWardDefaults({
            boluses: this.boluses,
            infusions: this.infusions,
            wardAbbrev: this.wardAbbrev,
            formalSet: true,
        }).then(() => this.$router.push({ name: 'home'}));
    }
  }
}
</script>
