<template>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                ref="svg" viewbox="-1.5 -1.5 3 3" >
            <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(30 0 0)"
                    patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" />
            </pattern>
            <circle cx="0" cy="0" r="100" fill="white" stroke="black" stroke-width="2"/>
            <path :d="tankFullPath" fill="none" stroke="green" stroke-width="10"/>
            <path :d="tankNearlyEmptyPath" fill="red" stroke="none"/>
            <path :d="tankUsedPath" fill="url(#diagonalHatch)" fill-opacity="0.6"
                    stroke="#aaa" stroke-width="1"/>
            <path :d="kPaMinorTickPaths.map((p) => `M${p[1][0]} ${p[1][1]} L${p[2][0]} ${p[2][1]}`).join(' ')"
                    stroke="black" stroke-width="1"/>
            <g id="major-ticks" v-for="t in kPaMajorTickPaths" :key="t[0]">
                <line :x1="t[1][0]" :y1="t[1][1]" :x2="t[2][0]" :y2="t[2][1]" />
                <text :x="t[3][0]" :y="t[3][1]">{{t[0]}}</text>
            </g>
            <path :d="guagePath" fill="black" stroke="none"/>
            <circle cx="0" cy="0" r="2" fill="white" stroke="none"/>
        </svg>
    </template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Watch, Inject, Mixins } from 'vue-property-decorator';

const degreesToRadians = Math.PI / 180;

@Component
export default class SvgGasGuage extends Vue {
    @Prop({ default: -100 })
    public startAngle!: number;
    @Prop({ default: 70 })
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
      return this.arcPath(0.95, 1.05, 100, 105);
    }

    public get tankNearlyEmptyPath() {
      return this.segmentPath(0, 0.1);
    }

    public get tankUsedPath() {
      return this.segmentPath(this.fractionBegin, this.fractionRemain);
    }

    public get guagePath() {
      const tipPos = this.mapPosition(this.fractionRemain);
      const tailLen = 10;
      const opp1 = this.mapPosition(this.fractionRemain + 120 / this.angleSpan, tailLen);
      const opp2 = this.mapPosition(this.fractionRemain - 120 / this.angleSpan, tailLen);
      return `M ${tipPos[0]} ${tipPos[1]} L${opp1[0]} ${opp1[1]} ${opp2[0]} ${opp2[1]} Z`;
    }

    public get kPaMinorTickPaths() {
      const tickKPas = range(1000, 24000, 1000).filter((k) => k % 5000 !== 0);
      return this.tickPaths(tickKPas, 97, 100);
    }

    public get kPaMajorTickPaths() {
      const tickKPas = range(0, 25000, 5000);
      const returnVar = this.tickPaths(tickKPas, 94, 100);
      for (const p of returnVar) {
        p.push([p[2][0] * 0.85, p[2][1] * 0.85]);
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
      const angle = this.angleSpan * fraction;
      return [
        Math.sin(angle * degreesToRadians) * radius,
        -Math.cos(angle * degreesToRadians) * radius,
      ];
    }
}

function range(start: number, stop: number, step = 1) {
  return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
}

</script>
<style scoped>
.x-label {
    text-anchor: middle;
}
.y-label {
    dominant-baseline: central;
}
@media (max-height: 350px) {
    .large-only.y-label {
        visibility: hidden;
    }
}
.right {
    text-anchor: start;
}
.left {
    text-anchor: end;
}
.top {
    dominant-baseline: baseline;
}
.bottom {
    dominant-baseline: hanging;
}
.data-point {
    r: 5;
    stroke-width: 2;
    stroke: black;
    fill:yellow;
}
.even {
    stroke-dasharray: 10,5;
}
.centile {
    fill: none;
    pointer-events:all;
    stroke-width: 2;
}
.male {
    stroke: lightblue;
}
.female {
    stroke: lightpink;
}
svg { position:fixed; left:0; height:100%; width:100% }
</style>
