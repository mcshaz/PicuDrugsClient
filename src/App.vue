<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">
        <img src="./assets/logo.svg" class="d-inline-block align-top" alt="Paediatric Drugs Logo" height="32">
        Paediatric Drugs
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item-dropdown>
            <template #button-content>
              <font-awesome-icon icon="file-medical-alt" />
              Calculations
            </template>
            <b-dropdown-item to="/">
              <font-awesome-icon icon="file-prescription" />
              Resus Charts
            </b-dropdown-item>
            <b-dropdown-item to="/infusions">
              <font-awesome-icon icon="syringe" />
              Infusions
              <font-awesome-icon icon="calculator" /></b-dropdown-item>
            <b-dropdown-item to="/centiles">
              <font-awesome-icon icon="ruler" />
              Centiles
            </b-dropdown-item>
            <b-dropdown-item to="/weight-calculations">
              <font-awesome-icon icon="tape" />
              Under/Overweight calculators
            </b-dropdown-item>
            <b-dropdown-item to="/booklet">
              <font-awesome-icon icon="book-medical" />
              create booklet
              <font-awesome-icon icon="print" />
            </b-dropdown-item>
            <b-dropdown-item to="/retrievals">
              <font-awesome-icon icon="plane-departure" />
              retrieval times
              <font-awesome-icon icon="plane-arrival" />
            </b-dropdown-item>
            <b-dropdown-item to="/gas-calcs">
              <font-awesome-icon icon="tachometer-alt" />
              gas calculations
            </b-dropdown-item>
            <b-dropdown-item to="/withdrawal">
              <!--?file-signature ?hands ?life-ring ?mortar-pestle ?notes-medical ?prescription bottle
                ?sort-numeric-down-alt-->
              <font-awesome-icon icon="prescription-bottle" />
              withdrawal charting
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item to="/about"><font-awesome-icon icon="info-circle" /> About</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <b-nav-item-dropdown text="Starship Protocols" right>
            <b-dropdown-item href="#">Cardiac</b-dropdown-item>
            <b-dropdown-item href="#">ED</b-dropdown-item>
            <b-dropdown-item href="#">General</b-dropdown-item>
            <b-dropdown-item href="#">NICU</b-dropdown-item>
            <b-dropdown-item href="#">Oncology</b-dropdown-item>
            <b-dropdown-item href="#">PICU</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container fluid>
      <router-view/>
    </b-container>
  </div>
</template>
<script lang="ts">
import 'reflect-metadata';
import Vue from 'vue';
import Component from 'vue-class-component';
import { drugDbContainer, IDrugDB, TYPES, IAppData, IRegisterEmail } from '@/services/drugDb';

@Component({
  name: 'App',
  // Provides IoC container at the top level of VueComponent
  provide: {
    db: drugDbContainer.get<IDrugDB>(TYPES.IDrugDB),
    appData: drugDbContainer.get<IAppData>(TYPES.IAppData),
    serverCom: drugDbContainer.get<IRegisterEmail>(TYPES.IRegisterEmail),
  },
})
export default class App extends Vue {
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
