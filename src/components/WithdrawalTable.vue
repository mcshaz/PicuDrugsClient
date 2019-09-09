<template>
    <div id="withdrawal-table">
        <table class="table table-bordered table-striped" v-if="wideFormat">
            <thead>
                <tr>
                    <th scope="row">
                        day #
                    </th>
                    <th scope="col" v-for="d in weanRegime.length" :key="d" class="day-no">
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
                <tr>
                    <td v-for="d in (weanRegime.length + 1)" :key="d" class="blank">
                    </td>
                </tr>
                <tr class="dose rescue divide">
                    <th scope="row">
                        <font-awesome-icon icon="life-ring"/>Rescue Dose-PRN
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
        <table class="table table-bordered table-quad-striped" v-else>
            <thead>
                <tr v-if="$slots.default && $slots.default.length" id="patient-data">
                    <td colspan="7">
                        <slot>
                        </slot>
                    </td>
                </tr>
                <tr>
                    <th scope="col" class="day-no">
                        day
                    </th>
                    <th scope="col">
                        Date
                    </th>
                    <th scope="col">
                        Medication
                    </th>
                    <th scope="col">
                        Role
                    </th>
                    <th scope="col">
                        Dose
                    </th>
                    <th scope="col">
                        Route
                    </th>
                    <th scope="col">
                        Frequency
                    </th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(d, indx) in weanRegime">
                    <tr :key="d.id" class="regular">
                        <th scope="row" rowspan="2">
                            {{indx+1}}
                        </th>
                        <td rowspan="2">
                            {{ d.weanDateString }}
                        </td>
                        <td rowspan="2">
                            {{ drug }}
                        </td>
                        <td>
                            regular
                        </td>
                        <td>
                            {{ d.regularDose }}{{ doseUnit }}
                        </td>
                        <td>
                            {{ routeRegular }}
                        </td>
                        <td>
                            Q{{ qHourly }}H
                        </td>
                    </tr>
                    <tr class="rescue" :key="'rescue' + d.id">
                        <td>
                            <font-awesome-icon icon="life-ring"/>rescue
                        </td>
                        <td>
                            {{ d.rescueDose }}{{ doseUnit }}
                        </td>
                        <td>
                            {{ routeRescue }}
                        </td>
                        <td>
                            Q{{ qHourly }}H PRN*
                        </td>
                    </tr>
                </template>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="7" class="rescue">
                        *<em>if requiring more than 2 rescue doses in a day,
                            revert to prior (higher) regular dose and consider slowing wean</em>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { roundToFixed } from '@/services/infusion-calculations/';
import { WeanDay } from '@/services/pharmacokinetics/WeanDay';
import { linearWean, alternateWean, exponentialWean } from '@/services/pharmacokinetics/weaningRegimes';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { BaseConfig, HTMLConfig } from 'jspdf-autotable';
import { pdfTemplate } from '@/services/utilities/pdfTemplate';

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
    @Prop({default: true})
    public wideFormat!: boolean;

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

    public createPDF() {
        const doc = new jsPDF('l', 'mm', 'a4');
        // start dom manip
        const maxCols = 11;
        const htmlTable = document.querySelector('#withdrawal-table table') as HTMLTableElement;
        const htmlTables: HTMLTableElement[] = [];
        const cols = htmlTable.querySelector('tr')!.childElementCount - 1;
        if (cols > maxCols) {
            const its = Math.ceil(cols / maxCols);
            for (let i = 0; i < its; ++i) {
                htmlTables.push(htmlTable.cloneNode(true) as HTMLTableElement);
                for (const tr of htmlTables[htmlTables.length - 1].querySelectorAll('tr')) {
                    const els = Array.from(tr.children);
                    els.splice(0, 1); // the row headers
                    els.splice(i * maxCols, maxCols);
                    els.forEach((e, indx) => e.remove());
                }
            }
        } else {
            htmlTables.push(htmlTable);
        }
        const headColWidth = 34;
        const cellWidth = 21;
        const lineWidth = 0.1;
        const widths = new Set<number>();
        const template: BaseConfig = Object.assign(pdfTemplate(doc), {
            theme: 'grid',
            pageBreak: 'avoid',
            tableWidth: 'wrap',
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: 0,
                fontStyle: 'bold',
            },
            styles: { halign: 'center', cellWidth },
            columnStyles: { 0: { halign: 'left', fontStyle: 'bold', cellWidth: headColWidth }},
            didParseCell: (data) => {
                if (data.row.section === 'head' && data.column.dataKey === '0') {
                    data.cell.styles.halign = 'left';
                }
            },
        } as BaseConfig);
        // const colStyle = { cellWidth };
        // for (let i = 1; i <= maxCols; ++i) {
        //   (template.columnStyles![i.toString()] as any) = colStyle;
        // }
        htmlTables.forEach((t, indx) => {
            (template as HTMLConfig).html = t;
            if (indx === htmlTables.length - 1) {
                template.tableWidth = (cols % maxCols) * cellWidth + headColWidth - lineWidth * (cols + 2);
            }
            // @ts-ignore
            doc.autoTable(template);
        });
        // doc.autoPrint();
        doc.save('withdrawal-plan.pdf');
    }
}

</script>

<style>
    .table-quad-striped tbody tr:nth-child(4n+1) > [rowspan="2"] {
        background-color: #f5ffff;
    }
    .table-quad-striped tbody tr:nth-child(4n+1) > td{
        background-color: #e5eeee;
    }
    .table-quad-striped tbody tr:nth-child(4n+2) > td{
        background-color: #faffff;
    }
    .table-quad-striped tbody tr:nth-child(4n+3) > [rowspan="2"] {
        background-color:#fffff5;
    }
    .table-quad-striped tbody tr:nth-child(4n+3) > td{
        background-color: #fafaef;
    }
    .table-quad-striped tbody tr:nth-child(4n+4) > td{
        background-color: #fffffb;
    }

    .rescue {
        color: darkred;
    }
    .table-quad-striped.table td, .table-quad-striped.table th {
        vertical-align: middle;
    }
    @media print {
        @page {
            size: A4;
            margin: 0;
        }
        html, body.bg-light {
            width: 210mm;
            height: 297mm;
            margin: 0;
            min-width: 210mm !important;
        }
        .regular {
            page-break-inside: avoid;
        }
        .rescue {
            page-break-before: avoid;
        }
    }
</style>
