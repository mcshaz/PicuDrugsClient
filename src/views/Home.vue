<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <PatientAgeData/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import PatientWeightData from '@/components/PatientWeightData.vue'; // @ is an alias to /src
import PatientAgeData from '@/components/PatientAgeData.vue';

@Component({
  components: {
    PatientAgeData,
  },
})
export default class Home extends Vue {}
</script>
