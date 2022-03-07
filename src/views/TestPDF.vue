<template>
  <form @submit.prevent="createPDF">
    <label>
      <input type="number" v-model="step"/>
    </label>
    <label>
      <input type="number" v-model="xMax"/>
    </label>
    <label>
      <input type="number" v-model="yMax"/>
    </label>
    <label>
      <input type="submit" value="submit" />
    </label>
  </form>
</template>
<script lang="ts">
import Vue from 'vue';
import { degrees, PDFDocument } from 'pdf-lib';
import download from 'downloadjs';
export default Vue.extend({
  data() {
    return {
      xMax: 1200,
      yMax: 900,
      step: 200,
    };
  },
  methods: {
    async createPDF() {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pdfUrl = require('@/assets/pdf/WeaningProtocol2Page.pdf');
      const pdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes, { updateMetadata: true });
      const firstPg = pdfDoc.getPage(0);
      const size = 8;
      const rotate = degrees(90);
      for (let x = 0; x < this.xMax; x += this.step) {
        for (let y = 0; y < this.yMax; y += this.step) {
          firstPg.drawText(`[${x},${y}]`, { x, y, size, rotate });
        }
      }
      const savedBytes = await pdfDoc.save();
      download(savedBytes, 'pdf-lib_creation_example.pdf', 'application/pdf');
    },
  },
});
</script>
