<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <DateInputPollyfill @input="dt = $event" />
    {{dt ? dt.toString(): 'null'}}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import PatientWeightData from '@/components/PatientWeightData.vue'; // @ is an alias to /src
import DateInput from '@/components/DateInput.vue';
import DateInputPollyfill from '@/components/DateInputPollyfill.vue';

@Component({
  components: {
    DateInputPollyfill,
  },
})
export default class About extends Vue {
  public dt: Date | null = null;
}
</script>