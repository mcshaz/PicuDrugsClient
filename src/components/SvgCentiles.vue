<template>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            ref="svg">
        <!--units will be: x axis: days, y axis - measure (cm, kg, kg/m2)
            gridlines include younger children - weeks-->
            <defs v-if="yAxis">
                <pattern id="smallGrid" :width="minorTickParams.width" :height="minorTickParams.height" patternUnits="userSpaceOnUse">
                    <path :d="minorTickParams.path" fill="none" stroke="gray" stroke-width="0.5"/>
                </pattern>
                <pattern v-if="yAxis&&xAxes.length" id="grid" :width="xAxes[0].majorTick" :height="yAxis.majorTick" patternUnits="userSpaceOnUse">
                    <rect v-if="minorTickParams" :width="xAxes[0].majorTick" :height="yAxis.majorTick" fill="url(#smallGrid)"/>
                    <path :d="`M ${xAxes[0].majorTick} 0 L 0 0 0 ${yAxis.majorTick}`" 
                            fill="none" stroke="gray" stroke-width="1"/>
                </pattern>
            </defs>
            <g v-if="centileLines">
                <path v-for="(cl, indx) in centileLines.lines" :key="chartType+cl.centile" :d="cl.path"
                        :class="['centile',indx%2===0?'even':'odd',isMale?'male':'female']">
                    <title>
                        {{cl.centile}} centile
                    </title>
                </path>
                    <text class="y-label right" v-for="cl in centileLines.lines" :key="chartType+(cl.centile*113)" :x="RMargin+textClearance" 
                            :y="cl.centileLastY">
                    {{cl.centile}}
                </text>
            </g>
            <g v-if="yAxis" >
                <text class="y-label left" v-for="yl in yAxis.labels" :key="yl.hash" :x="padL-textClearance" :y="yl.position">
                    {{yl.label}}
                </text>
            </g>
            <g v-if="xAxes.length" >
                <text class="x-label bottom" v-for="xl1 in xAxes[0].labels" :key="xl1.hash" :x="xl1.position" 
                        :y="lowerMargin+textClearance">
                    {{xl1.label}}
                </text>
            </g>
            <g v-if="xAxes.length > 1" >
                <text class="x-label top" v-for="xl2 in xAxes[1].labels" :key="xl2.hash" :x="xl2.position" 
                        :y="padTop-textClearance">
                    {{xl2.label}}
                </text>
            </g>
            <rect :width="RMargin-padL" :height="lowerMargin-padTop" fill="url(#grid)" 
                :transform="`scale(1,-1) translate(${padL},-${lowerMargin})`" />
            <circle v-for="m in dataPoints" :key="hash(m)" :cx="m[0]" :cy="m[1]" class="data-point" />
            <!--
                 
            <text x="20" y="100%" class="x-label" >4</text>
            <text y="120" class="y-label" >2</text>
            <rect :width="width" :height="height" fill="url(#grid)" />
            -->
        </svg>
    </template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Watch, Inject, Mixins } from 'vue-property-decorator';
import { svgPaths, pathTypes, ICentileLine, ICentileLines, CentileCollection, labelAgeUnits,
        UKWeightData, UKBMIData, UKLengthData, UKHeadCircumferenceData, IAnthropometry } from '@/services/anthropometry';
import Ready from '@/mixins/Ready';
import { hash } from '@/services/utilities/hash';
interface IAxisLabel { position: number; label: string; hash: number; }
interface IAxis { labels: IAxisLabel[]; majorTick: number; minorTick?: number; }

export type chartType = 'weight' | 'length' | 'head-circumference' | 'BMI';
const padR = 40;

@Component
export default class SvgCentiles extends Mixins(Ready) {
    @Prop({required: true})
    public measurements!: IAnthropometry[];
    @Prop({required: true})
    public isMale!: boolean;
    @Prop({required: true})
    public chartType!: chartType;
    @Prop({required: true})
    public gestAgeWeeks!: number;

    public pathType = pathTypes.polyline;
    public yAxisTitle = '';

    private RMargin = 300; // values to prevent negative rect dimensions
    private lowerMargin = 300; // values to prevent negative rect dimensions
    private padL = 34;
    private padBottom = 40;
    private padTop = 20;
    private textClearance = 5;
    private centileLines: ICentileLines | null = null;
    private emptyArray!: any[];

    @Inject('wtCentiles')
    private wtCentiles!: UKWeightData;
    @Inject('bmiCentiles')
    private bmiCentiles!: UKBMIData;
    @Inject('lengthCentiles')
    private lengthCentiles!: UKLengthData;
    @Inject('hcCentiles')
    private hcCentiles!: UKHeadCircumferenceData;

    public created() {
        this.emptyArray = [];
    }
    public async mounted() {
        await this.$ready();
        const container = (this.$refs.svg as SVGImageElement).parentElement!;
        this.RMargin = container.offsetWidth - padR;
        this.lowerMargin = container.offsetHeight - this.padBottom;
        this.calculatePositions();
    }

    @Watch('chartType')
    public calculatePositions() {
        let centiles: CentileCollection;
        switch (this.chartType) {
            case 'weight':
                centiles = this.wtCentiles;
                this.yAxisTitle = 'kg';
                break;
            case 'length':
                centiles = this.lengthCentiles;
                this.yAxisTitle = 'cm';
                break;
            case 'head-circumference':
                centiles = this.hcCentiles;
                this.yAxisTitle = 'cm';
                break;
            case 'BMI':
                centiles = this.bmiCentiles;
                this.yAxisTitle = 'kg/m<sup>2</sup>';
                break;
            default:
                throw new Error(`unrecognised chart type:'${this.chartType}'`);
        }
        const centileRange = this.isMale ? centiles.maleRange : centiles.femaleRange;
        this.centileLines = svgPaths( this.measurements,
                                this.gestAgeWeeks,
                                centileRange,
                                this.padL,
                                this.padTop,
                                this.RMargin,
                                this.lowerMargin,
                                this.pathType);
    }

    // computed
    public get dataPoints(): Array<[number, number]> {
        if (this.centileLines === null) {
            return this.emptyArray;
        }
        return this.measurements.map((p) => [this.centileLines!.transformX!(p.ageDays), this.centileLines!.transformY!(p.measure)] as [number, number]);
    }
    public get minorTickParams() {
        const yAxis = this.yAxis;
        const xAxes = this.xAxes;
        const noY = !yAxis || !yAxis.minorTick;
        const noX = !xAxes.length || !xAxes[0].minorTick;
        if (noX && noY) { return null; }
        const returnVar = {
            width: noX ? xAxes[0].majorTick : xAxes[0].minorTick!,
            height: noY ? yAxis!.majorTick : yAxis!.minorTick!,
            path: '',
        };
        if (noY) {
            returnVar.path = `M ${returnVar.width} 0 V ${returnVar.height}`;
        } else if (noX) {
            returnVar.path = `M 0 ${returnVar.height} H ${returnVar.width}`;
        } else {
            returnVar.path = `M ${returnVar.width} 0 V ${returnVar.height} H 0 `;
        }
        return returnVar;
    }
    public get yAxis(): IAxis | null {
        if (!this.centileLines) { return null; }
        const lab = this.centileLines.yLabels;
        const transform = this.centileLines.transformY;
        const y0 = transform(0);
        console.log('x-axis');
        return {
            labels: new Array(lab.count).fill(0).map((u, indx) => {
                const val = lab.start + indx * lab.increment;
                return {
                    label: val.toString(),
                    position: transform(val),
                    hash: hash('y', val),
                };
            }),
            majorTick: y0 - transform(lab.increment),
            minorTick: lab.minorTickIncrement
                ? (y0 - transform(lab.minorTickIncrement))
                : void 0,
        };
    }
    public get xAxes(): IAxis[] {
        if (!this.centileLines) { return this.emptyArray; }
        const transform = this.centileLines.transformX;
        const x0 = transform(0);
        console.log('y-axes');
        return this.centileLines.xLabels.map((l) => ({
            title: labelAgeUnits[l.units],
            labels: new Array(l.count).fill(0).map((u, indx) => {
                        const labelVal = l.startLabelAt + indx * l.incrementLabelBy;
                        let label: string;
                        if (l.units === labelAgeUnits.weeks && labelVal <= 0) {
                            label = labelVal === 0 ? 'term' : (40 + labelVal).toString();
                        } else {
                            label = Math.trunc(labelVal).toString();
                            if (labelVal % 1 === 0.5) {
                                label += '½';
                            }
                        }
                        return {
                            label,
                            position: transform(l.start + indx * l.increment),
                            hash: hash('x', labelVal),
                        };
                    }),
            majorTick: transform(l.increment) - x0,
            minorTick: l.minorTickIncrement
                ? transform(l.minorTickIncrement) - x0
                : void 0,
        }));
    }

    // methods
    public hash(...args: Array<string | number | Array<number | undefined | null> | null | undefined>) {
        return hash(...args);
    }
}
function hashAxis(...axes: IAxis[]) {
    hash(axes.map((a) => [a.minorTick, ...a.labels.map((l) => l.hash)]).flat());
}
</script>
<style scoped>
.x-label {
    text-anchor: middle;
}
.y-label {
    dominant-baseline: central;
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
