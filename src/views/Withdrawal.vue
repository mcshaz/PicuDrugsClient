<template>
  <div>
    <h2>Withdrawal Charting</h2>
    <b-row align-h="end" class="d-print-none">
      <b-col lg="7" order-lg="12" role="tablist">
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block href="#" v-b-toggle.opiod-benzo-wean variant="info">Opiods &amp; benzodiazepine weaning protocol
              <small class="when-closed">(click to open)</small>
            </b-button>
          </b-card-header>
          <b-collapse id="opiod-benzo-wean" v-model="opiodBenzoVis" accordion="weaning-info" role="tabpanel" @shown="notifyShown">
            <b-card-body>
              <h5>The <a href="https://www.starship.org.nz/guidelines/weaning-of-opioids-and-benzodiazepines/" target="_blank">full weaning protocol</a> is available on the Starship website</h5>
              <p class="card-text">Generally, weaning from opiods &amp; benzodiazepines is done over:</p>
              <ul class="list-group">
                <li class="list-group-item list-group-item-success">10 days if on the original medication for > 10 days.</li>
                <li class="list-group-item list-group-item-dark">5 days if on original medication for 5–10 days <strong>and</strong> WAT-1 score ≥ 3 on 2 consecutive occasions.</li>
                <li class="list-group-item list-group-item-primary">No weaning or WAT-1 scoring if on the original medication for &lt; 5 days.</li>
                <li class="list-group-item list-group-item-warning">
                  Occasionally over 20–40 days, particularly if requiring > 2 rescue doses per day while following the 10 day withdrawal plan.
                  Seek the opinion of a clinician experienced in managing drug withdrawal.
                </li>
              </ul>
              <p class="card-text">
                Generally the dose reduction is daily. However in some withdrawal plans involving multiple medications, each medications is weaned on an alternate day.
              </p>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block href="#" v-b-toggle.clonidine-wean variant="info">Clonidine weaning protocol
              <small class="when-closed">(click to open)</small>
            </b-button>
          </b-card-header>
          <b-collapse id="clonidine-wean" v-model="clonidineVis" accordion="weaning-info" role="tabpanel" @shown="notifyShown">
            <b-card-body>
              <h5>The <a href="https://www.starship.org.nz/guidelines/weaning-of-opioids-and-benzodiazepines/">full weaning protocol</a> is available on the Starship website</h5>
              <p class="card-text">Generally weaning from clonidine follows the protocol:</p>
              <ul class="list-group">
                <li class="list-group-item list-group-item-success">
                  Less than 7 days and dose is ≤ 4 microgram/kg/day → Stop without weaning.
                </li>
                <li class="list-group-item list-group-item-dark">
                  Less than 7 days and dose is ≥ 4 microgram/kg/day → Reduce by 50% every 24 hrs for 3 days then cease.
                </li>
                <li class="list-group-item list-group-item-primary">
                  More than 7 days → Reduce by 1 microgram/kg/dose every 24 hrs until dose reaches 1 microgram/kg/dose.
                  Continue until other medicines being weaned are ceased, then reduce clonidine by 50% every 24hrs for 3 days, then cease.
                </li>
              </ul>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.PICU-total-vol variant="info">Finding the 24 hours infusion volume on a PICU chart
              <small class="when-closed">(click to open)</small>
            </b-button>
          </b-card-header>
          <b-collapse id="PICU-total-vol" accordion="weaning-info" role="tabpanel" v-model="picuVolVis" @shown="notifyShown">
            <b-card-body>
              <p class="card-text>">
                The Starship PICU daily obs chart has a list of infusion dose rates (e.g. microg/kg/hr) and <em>below</em> this,
                a list containing the volume administered (in mL) of each infusion.
              </p>
              <p class="card-text">
                Each medication volume contains 2 rows – the final value recorded in the <em>bottom</em> of the 2 rows should be the number used
                <span class="text-muted">(<span class="vol-eg">52</span> in the chart below)</span>,
                as this value is independent of syringe changes.
              </p>
              <p class="card-text">
                It is important to use the <strong>total volume infused</strong>,
                as this includes any boluses the patient has received, plus accounts for any change in infusion rate during the 24 hours.
              </p>
            </b-card-body>
            <img src="../assets/example-vol-PICU.jpg" img-alt="Example PICU observation chart" class="card-img-bottom">
          </b-collapse>
        </b-card>
      </b-col>
      <validation-observer v-slot="{ handleSubmit, valid, failed }" slim>
        <form class="col-lg-5 order-lg-1" novalidate autocomplete="off" @submit.prevent="handleSubmit(createPDF)" @reset.prevent="clearAll">
          <b-form-group label="Patient details" id="patient-details" label-size="lg">
            <validated-input-group label="Surname" type="text" v-model="lastNm"
              placeholder="Family Name" trim/>
            <validated-input-group label="Given Name" type="text" v-model="firstNm"
              placeholder="Given Name" trim/>
            <nhi-input v-model="nhi"/>
            <dob-input v-model="dob" required/>
            <validated-bool-radio-group label="Gender" true-label="Male" false-label="Female" v-model="isMale" :stacked="false"/>
            <age-validated-weight :require-age="true" v-model="wtKg" :age="age" :allowMedianWeight="false" :is-male="isMale"/>
          </b-form-group><!--/patient-details-->
          <hr>
          <div v-for="d in drugs" :key="d.id">
            <!--  -->
            <withdrawal-drug
                :wtKg="wtKg"
                :ageLt1Yr="ageLt1Yr"
                :selectedDdOpts="selectedDrugs"
                @update:original-drug-name="d.originalDrug=$event"
                @update:original-conc="d.originalConc=$event"
                @update:original-vol="d.originalVol=$event"
                @update:weaning-drug="d.weaningDrug=$event"
                @update:weaning-dose-units="d.weaningDoseUnits=$event"
                @update:weaning-regime="d.weaningRegime=$event"
                @delete="remove($event)">
              <template #volume-details>
                where do I <a href="#PICU-total-vol" @click.prevent="openThenNav($event.target, picuVolVis=true)">find the volume given…</a>?
              </template>
              <template #clonidine-duration>
                how do I <a href="#clonidine-wean" @click.prevent="openThenNav($event.target, clonidineVis=true)">determine the clonidine wean duration…</a>?
              </template>
              <template #opiod-benzo-duration>
                how do I <a href="#opiod-benzo-wean" @click.prevent="openThenNav($event.target, opiodBenzoVis=true)">determine the wean duration…</a>?
              </template>
            </withdrawal-drug>
          </div>
          <button type="button" class="btn btn-primary mb-4" @click="drugs.push(createWeaningDrug())"><font-awesome-icon icon="plus"/> Another Medication</button>
          <hr>
          <validated-input-group label="Prescriber" type="text" v-model="prescriber" placeholder="Your Name" autocomplete="name" required min="2"/>
          <hr>
          <p v-if="valid" class="text-success">
            Ready to submit!
          </p>
          <p v-else-if="failed" class="text-danger">
            Please fix the fields highlighted in red above
          </p>
          <button type="submit" class="btn btn-success mb-4"><font-awesome-icon icon="print"/> Create <font-awesome-icon icon="file-pdf"/></button>
          <button type="reset" class="btn btn-warning mb-4 ml-2">Clear All <font-awesome-icon icon="eraser"/></button>
        </form>
      </validation-observer>
    </b-row>
  </div>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Vue } from 'vue-property-decorator';
import AgeValidatedWeight from '@/components/AgeValidatedWeight.vue';
import ValidatedInputGroup from '@/components/formGroups/ValidatedInputGroup.vue';
import NhiInput from '@/components/NhiInput.vue';
import DobInput from '@/components/DobInput.vue';
import ValidatedBoolRadioGroup from '@/components/formGroups/ValidatedBoolRadioGroup.vue';
import WithdrawalDrug from '@/components/WithdrawalDrug.vue';
import { ChildAge } from '@/services/infusion-calculations/';
// import { minWeightRecord, maxWeightRecord } from '@/services/utilities/weightHelpers';
import { getViewportSize, bootstrapSizes } from '@/services/utilities/viewportSize';
import { BAlert } from 'bootstrap-vue';
import { createAndDownloadPDF, IChartPatientDetails, IWeaningDrug } from '@/services/pdf-generation/create-filled-data-pdf-lib';

interface IWithdrawalDrug extends IWeaningDrug { id: number }
type vueNumber = number | '';
let id = 0;

@Component({
  components: {
    AgeValidatedWeight,
    NhiInput,
    DobInput,
    ValidatedInputGroup,
    BAlert,
    WithdrawalDrug,
    ValidatedBoolRadioGroup,
  },
})
export default class Withdrawal extends Vue {
  public prescriber = '';
  public wtKg: vueNumber = '';
  public dob: Date | null = null;
  public firstNm = '';
  public lastNm = '';
  public nhi = '';
  public isMale: boolean | null = null;
  public opiodBenzoVis = getViewportSize() >= bootstrapSizes.lg;
  public clonidineVis = false;
  public picuVolVis = false;
  public drugs: IWithdrawalDrug[] = [this.createWeaningDrug()];

  // unwatched
  private navTarget!: HTMLElement | null;
  private id!: number;

  public get ageLt1Yr() {
    return this.age
      ? this.age.years < 1
      : null;
  }

  public get age() {
    return this.dob
      ? new ChildAge({ dob: this.dob })
      : null;
  }

  public get selectedDrugs() {
    return this.drugs.reduce((accum, d) => {
      if (d.originalDrug) {
        accum.push(d.originalDrug);
      }
      return accum;
    }, [] as string[]);
  }

  public clearAll() {
    this.wtKg = '';
    this.nhi = '';
    this.firstNm = '';
    this.lastNm = '';
    this.isMale = null;
    this.dob = null;
    this.opiodBenzoVis = false;
    this.clonidineVis = false;
    this.picuVolVis = false;
    this.drugs = [];
    // Wait until the models are updated in the UI
    this.$nextTick((this.$refs.form as any).reset);
  }

  public async createPDF() {
    createAndDownloadPDF({
      firstN: this.firstNm,
      lastN: this.lastNm,
      isMale: this.isMale,
      nhi: this.nhi,
      weight: this.wtKg as number,
      dob: this.dob!,
      prescriber: this.prescriber,
      drugs: this.drugs,
    } as IChartPatientDetails);
  }

  public openThenNav(target: HTMLAnchorElement) {
    let href = target.href;
    href = href.substring(href.indexOf('#') + 1);
    this.navTarget = document.getElementById(href);
    if (this.navTarget!.classList.contains('show')) {
      this.notifyShown();
    }
  }

  public notifyShown() {
    if (this.navTarget) {
      this.navTarget.parentElement!.scrollIntoView({ behavior: 'smooth' });
      this.navTarget = null;
    }
  }

  public remove(id: number) {
    this.drugs.splice(this.drugs.findIndex(d => d.id === id), 1);
  }

  private createWeaningDrug(): IWithdrawalDrug {
    return {
      id: ++id,
      originalDrug: '',
      originalConc: '',
      originalVol: '',
      route: 'oral/NG',
      weaningDrug: '',
      weaningDoseUnits: '',
      weaningRegime: [],
    };
  }
}

</script>
<style>
#entered-details {
  list-style: none;
  margin-bottom: 0;
}
#entered-details dl {
  padding-left: 1em;
}
#entered-details dd {
  padding-left: 1em;
}
.vol-eg {
  color: red;
}

:not(.collapsed) > .when-closed {
  display: none;
}
.nobr { white-space: nowrap; }
</style>
