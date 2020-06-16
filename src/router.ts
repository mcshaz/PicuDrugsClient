import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Infusions from './views/Infusions.vue';
import WardChart from './views/WardChart.vue';
import SetDefaults from './views/SetDefaults.vue';
import Centiles from './views/Centiles.vue';
import WeightCalculations from './views/WeightCalculations.vue';
import MultiWeight from './views/MultiWeight.vue';
import WardMultiChart from './views/WardMultiChart.vue';
import TransportTimes from './views/TransportTimes.vue';
import Anaphylaxis from './views/Anaphylaxis.vue';
import Withdrawal from './views/Withdrawal.vue';
import About from './views/About.vue';
import GasCalcs from './views/GasCalcs.vue';
import AltitudeCalcs from './views/AltitudeCalcs.vue';
import Tests from './views/Tests.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/infusions/:abbrev?',
      name: 'infusions',
      component: Infusions,
      props: true,
    }, {
      path: '/ward-chart',
      name: 'ward-chart',
      component: WardChart,
      props: true,
    }, {
      path: '/about',
      name: 'about',
      component: About,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    }, {
      path: '/browser-defaults',
      name: 'browser-defaults',
      component: SetDefaults,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    }, {
      path: '/centiles',
      name: 'centiles',
      component: Centiles,
    }, {
      path: '/weight-calculations',
      name: 'weight-calculations',
      component: WeightCalculations,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    }, {
      path: '/booklet/:wardName?',
      name: 'booklet',
      component: MultiWeight,
      props: true,
    }, {
      path: '/multi-chart',
      name: 'multi-chart',
      component: WardMultiChart,
      props: true,
    }, {
      path: '/retrievals',
      name: 'retrievals',
      component: TransportTimes,
    }, {
      path: '/withdrawal',
      name: 'withdrawal',
      component: Withdrawal,
    }, {
      path: '/anaphylaxis',
      name: 'anaphylaxis',
      component: Anaphylaxis,
    }, {
      path: '/gas-calcs',
      name: 'gas-calculations',
      component: GasCalcs,
    }, {
      path: '/altitude-calcs',
      name: 'altitude-calculations',
      component: AltitudeCalcs,
    }, {
      path: '/tests',
      name: 'tests',
      component: Tests,
    }, { // NB THIS MUST COME LAST
      path: '/:wardName?',
      name: 'home',
      component: Home,
      props: true,
    }, // NB THIS MUST COME LAST
  ],
});
