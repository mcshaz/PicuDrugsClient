<template>
  <div class="hello">
    <div class="form-group row">
      <label for="name" class="col-sm-2 col-form-label">Name</label>
      <div class="col-sm-10">
        <input class="form-control" type="text" id="name" v-model="name" placeholder="Patient Name" >
      </div>
    </div>
    <div class="form-group row">
      <label for="nhi" class="col-sm-2 col-form-label">NHI</label>
      <div class="col-sm-10">
        <input class="form-control" type="text" id="nhi" v-model="nhi" placeholder="NHI" >
      </div>
    </div>
    <div class="form-group row">
      <label for="weight" class="col-sm-2 col-form-label">Weight</label>
      <div class="col-sm-10">
        <div class="input-group">
          <input class="form-control" id="weight" v-model.number="weightKg" placeholder="Weight" type="number" >
          <div class="input-group-append">
            <span class="input-group-text" >kg</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class PatientWeightData extends Vue {
  public name!: string;
  public nhi!: string;
  public weightKg?: number;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
