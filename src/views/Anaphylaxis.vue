<template>
  <div class="anaphylaxis">
    <validation-observer>
      <form>
        <validation-input-group label="Weight" append="kg"
                v-model="wtKg"
                placeholder="Weight"
                type="number"
                required
                :min="minWt"
                :max="maxWt"
                autocomplete="off"
                step="0.1"
              />
      </form>
    </validation-observer>
    <status-epilepsy-svg :wtKg="wtKg" />
    <!--<anaphylaxis-svg :wtKg="wtKg"/>-->
    <!--<svt-svg :wtKg="wtKg"/>-->
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue } from 'vue-property-decorator';
import AnaphylaxisSvg from '@/components/AnaphylaxisSvg.vue';
import SvtSvg from '@/components/SvtSvg.vue';
import StatusEpilepsySvg from '@/components/StatusEpilepsySvg.vue';

type vueNumber = number | '';
@Component({
  components: {
    AnaphylaxisSvg,
    SvtSvg,
    StatusEpilepsySvg,
  },
})
export default class Anaphylaxis extends Vue {
  public wtKg: vueNumber = '';
  public minWt = 1;
  public maxWt = 600;
}
</script>

<style scoped>
@media print {
  form {
    display: none;
  }
  .nav {
    display: none;
  }
}
</style>
