
import Vue from 'vue';
import Component from 'vue-class-component';

// You can declare a mixin as the same style as components.
@Component
export default class CombineErrors extends Vue {
  combineErrors(observerContext: any) {
    return Object.values(observerContext.errors).flat().join(' AND ');
  }
}
