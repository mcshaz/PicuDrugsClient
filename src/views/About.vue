<template>
  <div class="about">
    <DateInputPolyfill @input="dt = $event" />
    {{dt ? dt.toString(): 'null'}}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import PatientWeightData from '@/components/PatientWeightData.vue'; // @ is an alias to /src
import DateInput from '@/components/DateInput.vue'
import DateInputPolyfill from '@/components/DateInputPolyfill.vue'

@Component({
  components: {
    DateInputPolyfill
  }
})
export default class About extends Vue {
  public dt: Date | null = null;
}
</script>
