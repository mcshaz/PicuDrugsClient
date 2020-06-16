
import { Component, Prop } from 'vue-property-decorator';
import ValidatedFormEl from '@/mixins/ValidatedFormEl';

@Component
export default class ValidateDateEl extends ValidatedFormEl {
    @Prop({ default: void 0 })
    min?: Date;

    @Prop({ default: void 0 })
    max?: Date;
}
