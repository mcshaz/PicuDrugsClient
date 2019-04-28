import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Infusions from './views/Infusions.vue';
import WardChart from './views/WardChart.vue';
import SetDefaults from './views/SetDefaults.vue';

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
      path: '/:wardName?',
      name: 'home',
      component: Home,
      props: true,
    },
  ],
});
