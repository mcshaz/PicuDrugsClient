import Vue from 'vue';
import App from './App.vue';
import router from './router';
// import BootstrapVue from 'bootstrap-vue';
import {
  FormGroupPlugin, InputGroupPlugin, NavbarPlugin,
  DropdownPlugin, LayoutPlugin, CardPlugin, ButtonPlugin, ModalPlugin
} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import './registerServiceWorker';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCalendarAlt, faSyringe, faCalculator, faFilePrescription, faFileMedicalAlt, faRuler,
  faInfoCircle, faQuestion, faChartLine, faSave, faTrashAlt, faSortAmountDown, faCheck,
  faCalendarPlus, faEraser, faTape, faEdit, faBookMedical, faPlus, faEnvelope, faPrint, faAmbulance,
  faPlane, faHelicopter, faClock, faPlaneDeparture, faPlaneArrival, faFighterJet,
  faPrescriptionBottle, faPrescription, faFilePdf, faArrowRight, faLifeRing, faTachometerAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ValidationProvider, extend, ValidationObserver } from 'vee-validate';
/* eslint-disable @typescript-eslint/camelcase */
import { required, min_value, max_value, between, integer, required_if, oneOf } from 'vee-validate/dist/rules';
import { requiredIfEmpty } from '@/services/validation/requiredIfEmpty';
import { exactLength, nhiChecksum, nhiRegex, before, after } from '@/services/validation/validators';
import { messages } from 'vee-validate/dist/locale/en.json';
import { ValidationRuleSchema } from 'vee-validate/dist/types/types';
import ValidatedInputGroup from '@/components/formGroups/ValidatedInputGroup.vue';
import ValidatedSelectGroup from '@/components/formGroups/ValidatedSelectGroup.vue';
import ValidatedDateGroup from '@/components/formGroups/ValidatedDateGroup.vue';

for (const [rule, validation] of Object.entries({ required, min_value, max_value, between, integer, required_if, oneOf, exactLength, nhiChecksum, nhiRegex, before, after, requiredIfEmpty } as { [key: string]: ValidationRuleSchema })) {
  if (!validation.message) {
    validation.message = (messages as any)[rule];
  }
  extend(rule, validation);
}

Vue.component('validation-provider', ValidationProvider);
Vue.component('validation-observer', ValidationObserver);
Vue.component('validated-input-group', ValidatedInputGroup);
Vue.component('validated-select-group', ValidatedSelectGroup);
Vue.component('validated-date-group', ValidatedDateGroup);

library.add(...[faCalendarAlt, faSyringe, faCalculator, faFilePrescription, faFileMedicalAlt,
  faRuler, faInfoCircle, faQuestion, faChartLine, faSave, faTrashAlt, faSortAmountDown, faAmbulance,
  faCheck, faCalendarPlus, faEraser, faTape, faEdit, faBookMedical, faPlus, faEnvelope, faPrint,
  faPlane, faHelicopter, faClock, faPlaneDeparture, faPlaneArrival, faFighterJet,
  faPrescriptionBottle, faPrescription, faFilePdf, faArrowRight, faLifeRing, faTachometerAlt]);
Vue.component('font-awesome-icon', FontAwesomeIcon);

// to import individual components https://bootstrap-vue.js.org/docs/#vue-cli-3
Vue.use(FormGroupPlugin);
Vue.use(InputGroupPlugin);
Vue.use(NavbarPlugin);
Vue.use(DropdownPlugin);
Vue.use(LayoutPlugin);
Vue.use(CardPlugin);
Vue.use(ButtonPlugin);
Vue.use(ModalPlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
