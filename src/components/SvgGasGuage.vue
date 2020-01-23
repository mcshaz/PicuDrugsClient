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
        <path :d="tickPaths.minor.map((p) => `M${p[0][0]} ${p[0][1]} L${p[1][0]} ${p[1][1]}`).join(' ')"
                stroke="black" stroke-width="1"/>
        <g id="major-ticks" v-for="t in tickPaths.major" :key="t[3]">
            <line :x1="t[0][0]" :y1="t[0][1]" :x2="t[1][0]" :y2="t[1][1]"
                stroke="black" stroke-width="2"/>
            <text :x="t[2][0]" :y="t[2][1]">
              {{t[3]}}
            </text>
        </g>
        <path id="guagePath" d="M -7 -7 L 14 -7 100 0 14 7 -7 7 Z" :transform="`rotate(${guageAngle} 0 0)`"
            fill="black" stroke="none"/>
        <circle cx="0" cy="0" r="2" fill="white" stroke="none"/>
        <text class="pressure-units" x="0" y="22">{{ isPSI ? 'PSI' : 'bar' }}</text>
        <text class="minor-pressure-units" x="0" y="39" v-if="!isPSI">(x 100 = kPa)</text>
    </svg>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Watch, Inject, Mixins } from 'vue-property-decorator';

const degreesToRadians = Math.PI / 180;

@Component
export default class SvgGasGuage extends Vue {
    @Prop({ default: 160 })
    public emptyAngle!: number;
    @Prop({ default: 300 })
    public fullAngle!: number;
    @Prop({ required: true })
    public fullPresBar!: number;
    @Prop({ default: 'KPa' })
    public pressureUnits!: 'KPa' | 'Bar' | 'PSI';
    @Prop({ required: true })
    public fractionRemain!: number;
    @Prop({ default: 1 })
    public fractionBegin!: number;

    public get angleSpan() {
      return this.fullAngle - this.emptyAngle;
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
      return this.emptyAngle + this.fractionRemain * this.angleSpan;
    }

    public get isPSI() {
      return this.pressureUnits === 'PSI';
    }

    public get tickPaths() {
      const ranges = this.isPSI
        ? steps(1000, 100, 3000)
        : steps(50, 10, 200);
      const psiToBar = (n: number) => n * 0.06894757;
      const returnVar = {
        major: this.tickPathsFromVals(this.isPSI ? ranges.major.map(psiToBar) : ranges.major, 94, 100),
        minor: this.tickPathsFromVals(this.isPSI ? ranges.minor.map(psiToBar) : ranges.minor, 97, 100),
      };
      const positionFactor = this.isPSI ? [0.71, 0.83] : [0.80, 0.83];
      returnVar.major.forEach((p, indx) => (p as any).push([p[1][0] * positionFactor[0], p[1][1] * positionFactor[1]], ranges.major[indx]));
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
      const greaterArc = Math.abs(fractionStart - fractionEnd) * this.angleSpan > 180 ? 1 : 0;
      return `${startArc[0]} ${startArc[1]} A${radius} ${radius} 0 ${greaterArc} 0 ${finishArc[0]} ${finishArc[1]}`;
    }

    private tickPathsFromVals(values: number[], innerRadius: number, outerRadius: number) {
      const innerToOuter = outerRadius / innerRadius;
      return values.map((v) => {
        const start = this.mapPosition(v / this.fullPresBar, innerRadius);
        const end = start.map((s) => s * innerToOuter);
        return [start, end] as [[number, number], [number, number]];
      });
    }

    private mapPosition(fraction: number, radius = 100): [number, number] {
      const angle = this.emptyAngle + this.angleSpan * fraction;
      return [
        Math.cos(angle * degreesToRadians) * radius,
        Math.sin(angle * degreesToRadians) * radius,
      ];
    }
}

function range(start: number, stop: number, step = 1) {
  return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
}

function steps(majorStep: number, minorStep: number, max: number) {
  return {
    major: range(0, max, majorStep),
    minor: range(minorStep, max - minorStep, minorStep).filter((s) => s % majorStep !== 0),
  };
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
