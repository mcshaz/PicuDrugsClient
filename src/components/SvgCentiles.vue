<template>
        <svg :key="graphHash" v-if="measurements&&measurements.length"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
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
                
            <path v-for="(cl, indx) in controlLines" :key="chartType+cl.centile" :d="cl.path"
                    :class="['centile',indx%2===0?'even':'odd',isMale?'male':'female']">
                <title>
                    {{cl.centile}} centile
                </title>
            </path>
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
            <text class="y-label right" v-for="cl in controlLines" :key="chartType+(cl.centile*113)" :x="RMargin+textClearance" 
                    :y="cl.centileLastY">
                {{cl.centile}}
            </text>
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
interface IAxis { title: string; labels: IAxisLabel[]; majorTick: number; minorTick?: number; }

export type chartType = 'weight' | 'length' | 'head-circumference' | 'BMI';
const padR = 35;

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
    public xAxes: IAxis[] = [];
    public yAxis: IAxis | null = null;
    private padL = 34;
    private RMargin = 0;
    private lowerMargin = 0;
    private padBottom = 40;
    private padTop = 20;
    private textClearance = 5;
    private transformX: ((x: number) => number) | null = null;
    private transformY: ((y: number) => number) | null = null;

    @Inject('wtCentiles')
    private wtCentiles!: UKWeightData;
    @Inject('bmiCentiles')
    private bmiCentiles!: UKBMIData;
    @Inject('lengthCentiles')
    private lengthCentiles!: UKLengthData;
    @Inject('hcCentiles')
    private hcCentiles!: UKHeadCircumferenceData;

    private controlLines: ICentileLine[] = [];

    public async mounted() {
        await this.$ready();
        const container = (this.$refs.svg as SVGImageElement).parentElement!;
        this.RMargin = container.offsetWidth - padR;
        this.lowerMargin = container.offsetHeight - this.padBottom;
        this.yAxis = {} as IAxis;
        this.calculatePositions();
    }

    @Watch('chartType')
    private calculatePositions() {
        if (this.yAxis) {
            let centiles: CentileCollection;
            switch (this.chartType) {
                case 'weight':
                    centiles = this.wtCentiles;
                    this.yAxis.title = 'kg';
                    break;
                case 'length':
                    centiles = this.lengthCentiles;
                    this.yAxis.title = 'cm';
                    break;
                case 'head-circumference':
                    centiles = this.hcCentiles;
                    this.yAxis.title = 'cm';
                    break;
                case 'BMI':
                    centiles = this.bmiCentiles;
                    this.yAxis.title = 'kg/m<sup>2</sup>';
                    break;
                default:
                    throw new Error(`unrecognised chart type:'${this.chartType}'`);
            }
            const centileRange = this.isMale ? centiles.maleRange : centiles.femaleRange;
            const paths = svgPaths( this.measurements,
                                    this.gestAgeWeeks,
                                    centileRange,
                                    this.padL,
                                    this.padTop,
                                    this.RMargin,
                                    this.lowerMargin,
                                    this.pathType);
            if (paths !== null) {
                this.controlLines = paths.lines;
                this.yAxis.labels = new Array(paths.yLabels.count).fill(0).map((u, indx) => {
                    const val = paths.yLabels.start + indx * paths.yLabels.increment;
                    return {
                        label: val.toString(),
                        position: paths.transformY(val),
                        hash: hash('y', val),
                    };
                });
                const y0 = paths.transformY(0);
                this.yAxis.majorTick = y0 - paths.transformY(paths.yLabels.increment);
                this.yAxis.minorTick = paths.yLabels.minorTickIncrement
                    ? (y0 - paths.transformY(paths.yLabels.minorTickIncrement))
                    : void 0;
                const x0 = paths.transformX(0);
                this.xAxes = paths.xLabels.map((l) => ({
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
                                    position: paths.transformX(l.start + indx * l.increment),
                                    hash: hash('x', labelVal),
                                };
                            }),
                    majorTick: paths.transformX(l.increment) - x0,
                    minorTick: l.minorTickIncrement
                        ? paths.transformX(l.minorTickIncrement) - x0
                        : void 0,
                }));
            }
        }
    }

    // computed
    public get dataPoints(): Array<[number, number]> {
        if (!this.transformX || !this.transformY) {
            return [];
        }
        return this.measurements.map((p) => [this.transformX!(p.ageDays), this.transformY!(p.measure)] as [number, number]);
    }
    public get minorTickParams() {
        const noY = !this.yAxis || !this.yAxis.minorTick;
        const noX = !this.xAxes.length || !this.xAxes[0].minorTick;
        if (noX && noY) { return null; }
        const returnVar = {
            width: noX ? this.xAxes[0].majorTick : this.xAxes[0].minorTick!,
            height: noY ? this.yAxis!.majorTick : this.yAxis!.minorTick!,
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
