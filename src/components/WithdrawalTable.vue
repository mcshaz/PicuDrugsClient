<template>
    <div id="withdrawal-table">
        <div>
            <h5>ORIGINAL MEDICINE</h5>
            <dl>
                <dt>Medicine</dt>
                <dd>{{ originalDrugName }}</dd>
                <dt>Route</dt>
                <dd>{{ originalRoute }}</dd>
                <dt>24hr dose</dt>
                <dd>{{ original24HrDose }} {{ doseUnit }}</dd>
                <dt>Original duration</dt>
                <dd></dd>
            </dl>
            <h4>WEANING MEDICINE</h4>
            <dl>
                <dt>Medicine</dt>
                <dd>{{ drug }}</dd>
                <dt>Route</dt>
                <dd>{{ routeRegular }}</dd>
                <dt>24hr dose</dt>
                <dd>{{ startWean24Hr }} {{ doseUnit }}</dd>
                <dt>Frequency</dt>
                <dd>Q {{ qHourly }} H</dd>
                <dt>Start dose</dt>
                <dd>{{ startWeanDose }} {{ doseUnit }}</dd>
                <dt>Rescue Dose</dt>
                <dd>{{ startWeanDose }} {{ doseUnit }}</dd>
            </dl>
        </div>
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
    </div>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Inject, Watch } from 'vue-property-decorator';
import { roundToFixed } from '@/services/infusion-calculations/';

type vueNumber = number | '';
type route = 'po/ng' | 'iv' | 'patch' | 'subcut';
type doseUnits = 'mg' | 'microg';

@Component
export default class WithdrawalTable extends Vue {
    @Prop({required: true})
    public drug!: string;
    @Prop({default: ''})
    private originalDrug!: string;
    @Prop({ default: 'iv' })
    public originalRoute!: route;
    @Prop({required: true})
    public original24HrDose!: number;
    @Prop({default: 1})
    public bioavailability!: number;
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
    @Prop({default: false})
    public weanAlternateDays!: boolean;

    public get originalDrugName() {
        return this.originalDrug || this.drug;
    }

    public get startWean24Hr() {
        return roundToFixed(this.original24HrDose * this.bioavailability);
    }

    public get startWeanDose() {
        return roundToFixed(this.startWean24Hr * this.qHourly / 24);
    }

    public get weanRegime(): WeanDay[] {
        const dt = new Date();
        dt.setHours(0, 0, 0, 0);
        let returnVar = [] as WeanDay[];
        const dayDivisor = this.weanAlternateDays
            ? Math.ceil(this.weanOverDays / 2)
            : this.weanOverDays;
        const weanIncrement = this.startWeanDose / dayDivisor;
        for (let i = 0; i < dayDivisor; i++) {
            const wean = new WeanDay(new Date(dt), 
                                     this.startWeanDose - i * weanIncrement, 
                                     this.startWeanDose);
            wean.addDays(i);
            returnVar.push(wean);
        }
        if (this.weanAlternateDays){
            const isEven = this.weanOverDays % 2 === 0
            // 6 over 6 days
            // odd 6 4 4 2 2
            // even 6 6 4 4 2 2
            // date 1 2 3 4
            // even 1,0->1 . 2,1->3 . 3,2->5 . 4,3->7
            // odd 1,0->1 2,1->2 . 3,2->4 . 4,3->6
            returnVar = returnVar.reduce((prev, wd, indx) => {
                prev.push(wd);
                const addDays = indx - (isEven ? 0 : 1);
                if (addDays >= 0) {
                    wd.addDays(indx);
                    prev.push(wd.cloneForTomorrow());
                }
                return prev;
            }, [] as WeanDay[]);
        }
        return returnVar;
    }
}

class WeanDay {
    constructor(public readonly weanDate: Date,
                public regularDose: number,
                public rescueDose: number) {
        this.regularDose = roundToFixed(this.regularDose);
    }
    public get id() {
        return this.weanDate.getTime();
    }
    public addDays(days: number) {
        this.weanDate.setDate(this.weanDate.getDate() + days);
    }
    public cloneForTomorrow(): WeanDay {
        return new WeanDay(new Date(this.weanDate), this.regularDose, this.rescueDose);
        this.addDays(1);
    }
}
</script>

<style>
    .dose {
        color: red;
    }
</style>
