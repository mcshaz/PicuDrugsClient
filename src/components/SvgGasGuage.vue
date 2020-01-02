<template>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            ref="svg" viewBox="-102 -102 204 204" class="guage">
        <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(30 0 0)"
                patternUnits="userSpaceOnUse" stroke="#aaa" stroke-width="1">
            <line x1="0" y1="0" x2="0" y2="10" />
        </pattern>
        <circle cx="0" cy="0" r="100" fill="white" stroke="black" stroke-width="2"/>
        <path :d="tankFullPath" fill="none" stroke="green" stroke-width="10"/>
        <path :d="tankNearlyEmptyPath" fill="red" stroke="none"/>
        <path :d="tankUsedPath" fill="url(#diagonalHatch)" fill-opacity="0.6"
                stroke="#aaa" stroke-width="1"/>
        <path :d="barMinorTickPaths.map((p) => `M${p[1][0]} ${p[1][1]} L${p[2][0]} ${p[2][1]}`).join(' ')"
                stroke="black" stroke-width="1"/>
        <g id="major-ticks" v-for="t in barMajorTickPaths" :key="t[0]">
            <line :x1="t[1][0]" :y1="t[1][1]" :x2="t[2][0]" :y2="t[2][1]"
                stroke="black" stroke-width="2"/>
            <text :x="t[3][0]" :y="t[3][1]">
              {{t[0]}}
            </text>
        </g>
        <path id="guagePath" d="M -7 -7 L 14 -7 100 0 14 7 -7 7 Z" :transform="`rotate(${guageAngle} 0 0)`"
            fill="black" stroke="none"/>
        <circle cx="0" cy="0" r="2" fill="white" stroke="none"/>
        <text class="pressure-units" x="0" y="22">bar</text>
        <text class="minor-pressure-units" x="0" y="39">(x 100 = kPa)</text>
    </svg>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Watch, Inject, Mixins } from 'vue-property-decorator';

const degreesToRadians = Math.PI / 180;

@Component
export default class SvgGasGuage extends Vue {
    @Prop({ default: 160 })
    public startAngle!: number;
    @Prop({ default: 300 })
    public endAngle!: number;
    @Prop({ required: true })
    public fullValue!: number;
    @Prop({ default: 'KPa' })
    public units!: string;
    @Prop({ required: true })
    public fractionRemain!: number;
    @Prop({ default: 1 })
    public fractionBegin!: number;

    public get angleSpan() {
      return this.endAngle - this.startAngle;
    }

    public get tankFullPath() {
      return this.arcPath(1.05, 0.95, 89, 99);
    }

    public get tankNearlyEmptyPath() {
      return this.segmentPath(0.1, 0, 99);
    }

    public get tankUsedPath() {
      return this.segmentPath(this.fractionBegin, this.fractionRemain);
    }

    public get guageAngle() {
      return this.startAngle + this.fractionRemain * this.angleSpan;
    }

    // psi = 3000 in thousands
    public get barMinorTickPaths() {
      const tickKPas = range(10, 190, 10).filter((k) => k % 5000 !== 0);
      return this.tickPaths(tickKPas, 97, 100);
    }

    public get barMajorTickPaths() {
      const tickKPas = range(0, 200, 50);
      const returnVar = this.tickPaths(tickKPas, 94, 100);
      for (const p of returnVar) {
        p.push([p[2][0] * 0.82 - 2, p[2][1] * 0.83]);
      }
      return returnVar;
    }

    private arcPath(fractionStart: number, fractionEnd: number, innerRadius: number, outerRadius: number) {
      return 'M' + this.arcBase(fractionStart, fractionEnd, (innerRadius + outerRadius) / 2);
    }

    private segmentPath(fractionStart: number, fractionEnd: number, radius = 100) {
      const startArc = this.mapPosition(fractionStart, radius);
      const finishArc = this.mapPosition(fractionEnd, radius);
      return 'M0 0 L' + this.arcBase(fractionStart, fractionEnd, radius) + ' Z';
    }

    private arcBase(fractionStart: number, fractionEnd: number, radius: number) {
      const startArc = this.mapPosition(fractionStart, radius);
      const finishArc = this.mapPosition(fractionEnd, radius);
      return `${startArc[0]} ${startArc[1]} A${radius} ${radius} 0 0 0 ${finishArc[0]} ${finishArc[1]}`;
    }

    private tickPaths(values: number[], innerRadius: number, outerRadius: number) {
      const innerToOuter = outerRadius / innerRadius;
      return values.map((v) => {
        const start = this.mapPosition(v / this.fullValue, innerRadius);
        const end = start.map((s) => s * innerToOuter);
        return [v, start, end] as [number, [number, number], [number, number]];
      });
    }

    private mapPosition(fraction: number, radius = 100): [number, number] {
      const angle = this.startAngle + this.angleSpan * fraction;
      return [
        Math.cos(angle * degreesToRadians) * radius,
        Math.sin(angle * degreesToRadians) * radius,
      ];
    }
}

function range(start: number, stop: number, step = 1) {
  return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
}

</script>
<style>
.guage text {
  dominant-baseline: middle;
  text-anchor: middle;
}
text.minor-pressure-units {
  font-size: 9pt;
  fill: #444;
}
</style>
