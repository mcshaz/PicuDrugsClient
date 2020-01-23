import Vue from 'vue';
// import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { FormGroupPlugin, InputGroupPlugin } from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCalendarAlt, faSyringe, faCalculator, faFilePrescription, faFileMedicalAlt, faRuler,
  faInfoCircle, faQuestion, faChartLine, faSave, faTrashAlt, faSortAmountDown, faCheck,
  faCalendarPlus, faEraser, faTape, faEdit, faBookMedical, faPlus, faEnvelope, faPrint, faAmbulance,
  faPlane, faHelicopter, faClock, faPlaneDeparture, faPlaneArrival, faFighterJet,
  faPrescriptionBottle, faPrescription, faFilePdf, faArrowRight, faLifeRing, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { ValidationProvider, extend, ValidationObserver } from 'vee-validate';
// eslint-disable-next-line camelcase
import { required, min_value, max_value, between, integer, required_if, oneOf } from 'vee-validate/dist/rules';
import { exactLength, nhiChecksum, nhiRegex, before, after } from '@/services/validation/validators';
import { messages } from 'vee-validate/dist/locale/en.json';

for (const [rule, validation] of Object.entries({ required, min_value, max_value, between, integer, required_if, oneOf, exactLength, nhiChecksum, nhiRegex, before, after })) {
  if (!validation.message) {
    validation.message = (messages)[rule];
  }
  extend(rule, validation);
}

library.add(...[faCalendarAlt, faSyringe, faCalculator, faFilePrescription, faFileMedicalAlt,
  faRuler, faInfoCircle, faQuestion, faChartLine, faSave, faTrashAlt, faSortAmountDown, faAmbulance,
  faCheck, faCalendarPlus, faEraser, faTape, faEdit, faBookMedical, faPlus, faEnvelope, faPrint,
  faPlane, faHelicopter, faClock, faPlaneDeparture, faPlaneArrival, faFighterJet,
  faPrescriptionBottle, faPrescription, faFilePdf, faArrowRight, faLifeRing, faTachometerAlt ]);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.component('validation-provider', ValidationProvider);
Vue.component('validation-observer', ValidationObserver);
Vue.use(FormGroupPlugin);
Vue.use(InputGroupPlugin);
// to import individual components https://bootstrap-vue.js.org/docs/#vue-cli-3
// Vue.use(BootstrapVue);

Vue.config.productionTip = false;
