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
         faCalendarPlus, faEraser, faTape, faEdit, faBookMedical, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(...[faCalendarAlt, faSyringe, faCalculator, faFilePrescription, faFileMedicalAlt,
                faRuler, faInfoCircle, faQuestion, faChartLine, faSave, faTrashAlt, faSortAmountDown,
                faCheck, faCalendarPlus, faEraser, faTape, faEdit, faBookMedical, faPlus ]);
Vue.component('font-awesome-icon', FontAwesomeIcon);
// to import individual components https://bootstrap-vue.js.org/docs/#vue-cli-3
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
