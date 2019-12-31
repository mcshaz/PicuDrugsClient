import Vue from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import './registerServiceWorker';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCalendarAlt, faSyringe, faCalculator, faFilePrescription, faFileMedicalAlt, faRuler,
  faInfoCircle, faQuestion, faChartLine, faSave, faTrashAlt, faSortAmountDown, faCheck,
  faCalendarPlus, faEraser, faTape, faEdit, faBookMedical, faPlus, faEnvelope, faPrint, faAmbulance,
  faPlane, faHelicopter, faClock, faPlaneDeparture, faPlaneArrival, faFighterJet,
  faPrescriptionBottle, faPrescription, faFilePdf, faArrowRight, faLifeRing } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// import Vuelidate from 'vuelidate';

library.add(...[faCalendarAlt, faSyringe, faCalculator, faFilePrescription, faFileMedicalAlt,
  faRuler, faInfoCircle, faQuestion, faChartLine, faSave, faTrashAlt, faSortAmountDown, faAmbulance,
  faCheck, faCalendarPlus, faEraser, faTape, faEdit, faBookMedical, faPlus, faEnvelope, faPrint,
  faPlane, faHelicopter, faClock, faPlaneDeparture, faPlaneArrival, faFighterJet,
  faPrescriptionBottle, faPrescription, faFilePdf, faArrowRight, faLifeRing ]);
Vue.component('font-awesome-icon', FontAwesomeIcon);
// to import individual components https://bootstrap-vue.js.org/docs/#vue-cli-3
Vue.use(BootstrapVue);
// Vue.use(Vuelidate);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
