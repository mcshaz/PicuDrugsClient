import Vue from 'vue';
import Component from 'vue-class-component';

// You can declare a mixin as the same style as components.
@Component
export default class Ready extends Vue {
  public async $ready() {
    if (process.env.NODE_ENV === 'production') {
      return this.$nextTick();
    }
    return new Promise((resolve, reject) => {
      setTimeout(async() => {
        await this.$nextTick();
        resolve();
      });
    });
  }
}
