<template>
  <div class="anaphylaxis">
    <form>
      <b-form-group  label-for="weight" label-cols-lg="2" label-cols-xl="2" label="Weight:" 
          :state="!errMsg" 
          class="was-validated" >
        <template slot="invalid-feedback" >
          {{errMsg}}
        </template>

        <b-input-group append="kg">
          <input class="form-control" name="weight" v-model.number="wtKg" placeholder="Weight" 
              type="number" required
              :min="minWt" :max="maxWt" autocomplete="off" step="0.1" />
        </b-input-group>
      </b-form-group>
    </form>
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

  public get errMsg() {
    if (this.wtKg === '') {
      return 'Weight is required';
    }
    if (this.wtKg < this.minWt || this.wtKg > this.maxWt) {
      return `weight must be between ${this.minWt} and ${this.maxWt} kg`;
    }
    return '';
  }
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