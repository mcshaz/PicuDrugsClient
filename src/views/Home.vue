<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <PatientAgeWeightData/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import PatientWeightData from '@/components/PatientWeightData.vue'; // @ is an alias to /src
import PatientAgeWeightData from '@/components/PatientAgeWeightData.vue';

@Component({
  components: {
    PatientAgeWeightData,
  },
})
export default class Home extends Vue {}
</script>
