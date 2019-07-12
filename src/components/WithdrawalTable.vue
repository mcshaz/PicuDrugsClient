<template>
    <table>
        <tbody>
            <tr>
                <th scope="row">
                    day #
                </th>
                <td v-for="d in weanRegime.length" :key="d">
                    {{ d }}
                </td>
            </tr>
            <tr>
                <th scope="row">
                    Date
                </th>
                <td v-for="d in weanRegime" :key="d.id">
                    {{ d.date.toLocaleDateString() }}
                </td>
            </tr>
            <tr class="dose regular">
                <th scope="row">
                    Regular Dose
                </th>
                <td v-for="d in weanRegime" :key="d.id">
                    {{ d.regularDose }} {{ doseUnit }}
                </td>
            </tr>
            <tr>
                <th scope="row">
                    Frequency
                </th>
                <td v-for="d in weanRegime.length" :key="d">
                    {{ qHourly }}
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
                    {{ d.rescueDose }}
                </td>
            </tr>
            <tr>
                <th scope="row">
                    Route
                </th>
                <td v-for="d in weanRegime.length" :key="d">
                    {{ routeRescue }} {{ doseUnit }}
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Inject, Watch } from 'vue-property-decorator';
import { syringeRounding } from '@/services/infusion-calculations/';

type vueNumber = number | '';
type route = 'po/ng' | 'iv' | 'patch' | 'subcut';
type doseUnits = 'mg' | 'microg';

interface weanDay { weanDate: Date; regularDose: number; rescueDose: number; id: Symbol }

@Component
export default class WithdrawalTable extends Vue {
    @Prop({required: true})
    public drugName!: number;
    @Prop({required: true})
    public start24HDose!: number;
    @Prop({required: true})
    public weanOverDays!: number;
    @Prop({default: 6})
    public qHourly!: number;
    @Prop({default: 'po/ng'})
    public routeRegular!: route;
    @Prop({default: 'po/ng'})
    public routeRescue!: route;
    @Prop({default: 'mg'})
    public doseUnit!: doseUnits;
    @Prop({default: null})
    public weanOdd!: boolean | null;

    public weanRegime: weanDay[] = [];

    public created() {
        const dt = new Date();
        const dayDivisor = this.weanOdd === null
            ? this.weanOverDays
            : (this.weanOverDays / 2);
        const startingDose = syringeRounding(this.start24HDose * this.qHourly / 24);
        const weanIncrementDaily = startingDose / dayDivisor;
        for (let i=0; i < dayDivisor; i++) {
            const weanDate = new Date(dt);
            weanDate.setDate(weanDate.getDate() + i);
            this.weanRegime.push({
                id: Symbol(),
                regularDose: syringeRounding(startingDose - i * weanIncrementDaily),
                weanDate,
                rescueDose: startingDose,
            });
        }
        if (this.weanOdd !== null) {
            this.weanRegime.reduce((prev, wd, indx) => {
                    if (prev.length > 0) {
                        wd.weanDate.setDate(prev[prev.length - 1].weanDate.getDate() + 1);
                    }
                    const next = Object.assign({}, wd);
                    next.weanDate = new Date(next.weanDate);
                    next.weanDate.setDate(next.weanDate.getDate() + 1);
                    prev.push(wd, next);
                    return prev;
                }, 
                this.weanOdd ? this.weanRegime.slice(0,1) : []);
        }
    }

}
</script>

<style>
    .dose {
        color: red;
    }
</style>
