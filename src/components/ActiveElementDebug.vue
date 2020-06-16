<template>
    <b-card title="focused element:">
      <b-card-text>
        {{focusEl}}
      </b-card-text>
    </b-card>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class ActiveElementDebug extends Vue {
  public focusEl = 'null';
  private boundFocusChanged!: (evt: Event) => void;
  private created() {
    this.boundFocusChanged = this.focusChanged.bind(this);
    document.addEventListener('focusout', this.boundFocusChanged);
  }

  private beforeDestroy() {
    document.removeEventListener('focusout', this.boundFocusChanged);
  }

  private focusChanged(evt: Event) {
    const el = evt.target as HTMLElement | null;
    if (el === null) {
      this.focusEl = 'null';
      return;
    }
    this.focusEl = '<' + el.tagName;
    Array.prototype.forEach.call(el.attributes, (a: Attr) => {
      this.focusEl += ` ${a.name}="${a.value}"`;
    });
    this.focusEl += ' >';
  }
}
</script>
