<template>
    <div id="withdrawal-table">
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th scope="row">
                        day #
                    </th>
                    <th scope="col" v-for="d in weanRegime.length" :key="d">
                        {{ d }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">
                        Date
                    </th>
                    <td v-for="d in weanRegime" :key="d.id">
                        {{ d.weanDateString }}
                    </td>
                </tr>
                <tr class="dose regular">
                    <th scope="row">
                        Regular Dose
                    </th>
                    <td v-for="d in weanRegime" :key="d.id">
                        {{ d.regularDose }}{{ doseUnit }}
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        Frequency
                    </th>
                    <td v-for="d in weanRegime.length" :key="d">
                        Q {{ qHourly }} H
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        Route
                    </th>
                    <td v-for="d in weanRegime.length" :key="d">
                        {{ routeRegular }}
                    </td>
                </tr>
                <tr class="dose rescue divide">
                    <th scope="row">
                        Rescue Dose - PRN
                    </th>
                    <td v-for="d in weanRegime" :key="d.id">
                        {{ d.rescueDose }}{{ doseUnit }}
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        Route
                    </th>
                    <td v-for="d in weanRegime.length" :key="d">
                        {{ routeRescue }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Inject, Watch } from 'vue-property-decorator';
import { roundToFixed } from '@/services/infusion-calculations/';
import { WeanDay } from '@/services/pharmacokinetics/WeanDay';
import { linearWean, alternateWean, exponentialWean } from '@/services/pharmacokinetics/weaningRegimes';

type vueNumber = number | '';
type route = 'po/ng' | 'iv' | 'patch' | 'subcut';
type doseUnits = 'mg' | 'microg';

@Component
export default class WithdrawalTable extends Vue {
    @Prop({required: true})
    public drug!: string;
    @Prop({required: true})
    public start24HrDose!: number;
    @Prop({required: true})
    public qHourly!: number;
    @Prop({default: 'po/ng'})
    public routeRegular!: route;
    @Prop({default: 'po/ng'})
    public routeRescue!: route;
    @Prop({default: 'mg'})
    public doseUnit!: doseUnits;
    @Prop({default: null})
    public linearWean!: ({ weanOverDays: number, weanAlternateDays: boolean } | null);
    @Prop({default: null})
    public clonidineWean!: ({ weightKg: number, rapidWean: boolean } | null);

    public get weanRegime(): WeanDay[] {
        let individualDose = this.start24HrDose * this.qHourly / 24;
        if (this.linearWean) {
            if (this.linearWean.weanAlternateDays) {
                return alternateWean(individualDose, this.linearWean.weanOverDays);
            } else {
                return linearWean(individualDose, 1 / this.linearWean.weanOverDays);
            }
        }
        if (this.clonidineWean) {
            let returnVar: WeanDay[] = [];
            let startWeanDate: Date;
            if (!this.clonidineWean.rapidWean && individualDose > this.clonidineWean.weightKg) {
                returnVar = linearWean(individualDose, this.clonidineWean.weightKg / individualDose, this.clonidineWean.weightKg);
                startWeanDate = new Date(returnVar[returnVar.length - 1].weanDate);
                startWeanDate.setDate(startWeanDate.getDate() + 1);
                individualDose = this.clonidineWean.weightKg;
            } else {
                startWeanDate = new Date();
            }
            return returnVar.concat(exponentialWean(individualDose, 0.5, 4, startWeanDate));
        }
        return [];
    }
}

</script>

<style>
    .dose {
        color: red;
    }
</style>
