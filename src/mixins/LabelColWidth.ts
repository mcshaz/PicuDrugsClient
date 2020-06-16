import 'reflect-metadata';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class LabelColWidth extends Vue {
  @Prop({ default: 3 })
  labelColsLg!: number;

  @Prop({ default: void 0 })
  labelColsXl?: number;
}
