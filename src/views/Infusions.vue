<template>
  <div class="home">
    <h2>Drug Calculator - Individual drug infusions</h2>
    <age-validated-weight :exactAge="selectedDrug&&!selectedDrug.isTitratable">
      <validated-input-group
            type="text"
            placeholder="please select a drug"
            label="Drug"
            v-model="selectedDrugVM"
            :datalist="searchableDrugs"
            required
            :rules="{ oneOf: searchableDrugs }"
          />
      <validated-select-group label="Ampule"
            v-model="selectedAmpuleIndx"
            required
            :disabled="!ampules.length"
          >
          <option :value="null" disabled>ampule concentration...</option>
          <option :v-for="a in ampules" :key="a.value">
            {{ a.text }}
          </option>
      </validated-select-group>
    </age-validated-weight>
    <p v-if="link">
      to link to this drug in documentation etc., use the link
      <a href="#">{{link}}</a>
    </p>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';
import { SiUnitMeasure } from '@/services/infusion-calculations';
import AgeValidatedWeight from '@/components/AgeValidatedWeight.vue';
import { IEntityInfusion, IDrugDB, appDataType } from '@/services/drugDb';
import { sortByStringProp } from '@/services/utilities/sortByProp';

interface ISelectOption {
  value: number;
  text: string;
  disabled?: boolean;
}

@Component({
  components: {
    AgeValidatedWeight,
  },
})
export default class Infusions extends Vue {
  public searchableDrugs: string[] = [];
  public selectedDrugName: string = '';
  public selectedAmpuleIndx: number | null = null;

  private baseRef!: string;
  private drugs!: Map<string, IEntityInfusion>;
  @Inject('db')
  private db!: IDrugDB;
  @Prop({ default: '' })
  private abbrev!: string;

  public created() {
    const drugsReady = this.db.infusionDrugs.toArray().then(data => {
      sortByStringProp(data, 'fullname');
      this.drugs = new Map<string, IEntityInfusion>();
      for (const d of data) {
        this.drugs.set(d.fullname, d);
        if (d.abbrev) { this.drugs.set(d.abbrev, d); }
      }
    });
    this.baseRef = window.location.origin + this.$route.path;
    if (!this.baseRef.endsWith('/')) {
      this.baseRef += '/';
    }
    if (this.abbrev) {
      this.baseRef = this.baseRef.slice(0, -1 - this.abbrev.length);
      drugsReady.then(() => (this.selectedDrugName = this.abbrev));
    }
  }

  public get selectedDrug() {
    return this.drugs.get(this.selectedDrugName);
  }

  public get ampules() {
    if (this.selectedDrug) {
      return this.selectedDrug.drugAmpuleConcentrations.map((c, indx) =>
        ({
          value: indx,
          text: `${c.concentration * c.volume} ${new SiUnitMeasure(
            this.selectedDrug!.siPrefix,
            this.selectedDrug!.siUnitId
          ).toString()} in ${c.volume} ml`,
        } as ISelectOption)
      );
    }
    return [];
  }

  @Watch('ampules')
  public selectionChange(newVal: ISelectOption[]) {
    this.selectedAmpuleIndx = newVal.length === 1 ? 0 : null;
  }

  public get link() {
    return this.selectedDrug
      ? this.baseRef + encodeURIComponent(this.selectedDrug.abbrev)
      : '';
  }
}
</script>
