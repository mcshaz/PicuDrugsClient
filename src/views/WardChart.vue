<template>
  <div class="chart">
    <variable-infusions />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
// import PatientWeightData from '@/components/PatientWeightData.vue'; // @ is an alias to /src
import VariableInfusions from '@/components/VariableInfusions.vue';

@Component({
  components: {
    VariableInfusions,
  },
})
export default class WardChart extends Vue {
  @Prop({required: true})
  patientDetails: ;
}
</script>