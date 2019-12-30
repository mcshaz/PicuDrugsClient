<template>
    <div tabindex="-1" role="alert" aria-live="assertive" aria-atomic="true"
            class="invalid-feedback" :class="validator.$invalid?'d-block':''">
        <span v-if="validator.required===false">
            Please {{isSelect!==false ? 'select' : 'enter'}} {{indefinateArticle}} {{label}}
        </span>
        <span v-else-if="validator.between===false">
            {{label}} must be {{minStr}}–{{maxStr}} {{units}}
        </span>
        <span v-else-if="validator.minLength===false">
            {{label}} must be at least {{ validator.$params.minLength.min }} characters
        </span>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Validation } from 'vuelidate'
import { shortFormatter } from '@/services/utilities/dateHelpers'

const vowels = 'aeiouAEIOU'
@Component({})
export default class VuelidateMessage extends Vue {
    @Prop({ required: true })
    public validator!: Validation;
    @Prop({ default: 'value' })
    public label!: string;
    @Prop({ default: '' })
    public units!: string;
    @Prop({ default: false })
    public isSelect!: boolean;

    public get indefinateArticle () {
      if (this.label.startsWith('the ') || this.label.startsWith('your ')) { return '' }
      if (this.label.length >= 2) {
        const begin = this.label.substring(0, 2)
        if (begin === 'eu' || begin === 'ur') { return 'a' }
        if (begin === 'ho') {
          return ['hour', 'honest', 'honor'].some((h) => this.label.startsWith(h))
            ? 'an'
            : 'a'
        }
        if (begin === 'un' && this.label[2] === 'i') { return 'a' } // note un prefix, unidentified, unimportant actually 'an'
      }
      return vowels.includes(this.label[0])
        ? 'an'
        : 'a'
    }
    public get minStr () {
      const min: Date | number = this.validator.$params.between!.min
      return (typeof min === 'number')
        ? min.toString()
        : shortFormatter.format(min)
    }
    public get maxStr () {
      const max: Date | number = this.validator.$params.between!.max
      return (typeof max === 'number')
        ? max.toString()
        : shortFormatter.format(max)
    }
}
</script>
