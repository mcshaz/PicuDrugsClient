<template>
  <div class="home">
    <h2>Starship Transport Times</h2>
    <validation-provider v-slot="errors" name="Hospital">
      <b-form-group
        label-cols-lg="2"
        label-cols-xl="2"
        label="Hospital:"
        :invalid-feedback="errors[0]"
        :state="!!hospital"
      >
        <vue-single-select
          placeholder="hospital"
          v-model="hospital"
          keyField="id"
          :filterBy="filterSearch"
          :options="hospitalOptions"
          required
          textField="label"
        />
      </b-form-group>
    </validation-provider>
    <validated-select-group label="Mode" required>
      <option value disabled>select transport mode...</option>
      <option value="road" :disabled="!hospitalTimes||!hospitalTimes.road">
        Road Ambulance
        <!--<font-awesome-icon icon="ambulance" />-->
      </option>
      <option value="rotary" :disabled="!hospitalTimes||!hospitalTimes.rotary">
        Rotary Wing
        <!--<font-awesome-icon icon="helicopter" />-->
      </option>
      <optgroup label="Fixed Wing">
        <option value="prop" :disabled="!hospitalTimes||!hospitalTimes.prop">
          Turboprop
          <!--<font-awesome-icon icon="plane" />-->
        </option>
        <option value="jet" :disabled="!hospitalTimes||!hospitalTimes.jet">
          Jet
          <!--<font-awesome-icon icon="fighter-jet" />-->
        </option>
      </optgroup>
    </validated-select-group>
    <validated-date-time-group label="Depart Starship:" v-model="departSS" required />
    <validated-date-time-group label="Takeoff" v-if="mode==='prop'||mode==='jet'" v-model="takeOff">
      <template #description>
        <span v-html="timeStatsFilter(minsToTakeOff,'departing Starship')"></span>
      </template>
    </validated-date-time-group>
    <validated-date-time-group
      :label="`Arrive ${hospital?hospital.label:''}:`" :name="arrive-dest"
      v-model="arriveDest"
    >
      <template #description>
        <span
          v-html="timeStatsFilter(minsToArriveDest,mode==='prop'||mode==='jet'?'takeoff':'departing Starship')"
        ></span>
      </template>
    </validated-date-time-group>
    <validated-input-group
      label="Time @ centre"
      prepend="15"
      append="240"
      min="15"
      max="240"
      type="range"
      v-model="timeAtCentre"
    >
      <template #description>
        <span class="time-estimate">estimate {{ timeAtCentre | timeFilter }}</span> &nbsp;
        <span v-html="timeStatsFilter(timeAtCentreStats)"></span>
      </template>
    </validated-input-group>
    <validated-date-time-group
      :label="`Leave ${hospital?hospital.label:''}:`"
      name="depart-dest"
      v-model="departDest"
    />
    <validated-date-time-group label="Return to Starship:" v-model="arriveSS">
      <template #description>
        <span
          v-html="timeStatsFilter(minsToReturn,'departing '+(hospital?hospital.label:'referring centre'))"
        ></span>
      </template>
    </validated-date-time-group>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';
import {
  timeInCentre,
  getAirportDriveTime,
  getMMHDrive,
  getWaitakereDrive,
  IStats
} from '@/services/transports/roadTimes';
import { hospitals, IHospital } from '@/services/transports/timeData';
import { timeFilter } from '@/services/transports/timeFilter';
import VueSingleSelect from '@/components/vendor/VueSingleSelect.vue';
import DateTimeInput from '@/components/formGroups/DateTimeInput.vue';

const sepChar = '|';
interface ISearchableHospitals {
  id: string;
  label: string;
  searchable: string;
}
type modes = 'prop' | 'jet' | 'road' | 'rotary' | '';

@Component({
  components: {
    VueSingleSelect,
    DateTimeInput,
  },
  filters: {
    timeFilter,
  },
})
export default class TransportTimes extends Vue {
  public hospitalOptions: ISearchableHospitals[] = Object.keys(hospitals).map(
    h => {
      const alt = hospitals[h].alt;
      return {
        id: h,
        label: alt ? `${h} (${alt})` : h,
        searchable: h.toLowerCase() + sepChar + (alt || '').toLowerCase(),
      };
    }
  );

  public hospital: ISearchableHospitals | null = null;
  public hospitalTimes: IHospital | null = null;
  public mode: modes = '';
  public arriveDest: Date | null = null;
  public timeAtCentreStats = timeInCentre;
  public arriveSS: Date | null = null;
  private departSS: Date | null = new Date();
  private takeOff: Date | null = null;
  private timeAtCentre = timeInCentre.p50;
  private departDest: Date | null = null;

  @Watch('hospital')
  public hospitalChange() {
    this.hospitalTimes =
      this.hospital === null ? null : hospitals[this.hospital.id] || null;
  }

  public get minsToTakeOff() {
    if (
      this.hospitalTimes &&
      this.mode &&
      this.departSS &&
      (this.mode === 'jet' || this.mode === 'prop')
    ) {
      return getAirportDriveTime(this.departSS);
    }
    return null;
  }

  public get minsToArriveDest() {
    if (this.hospitalTimes && this.mode) {
      if (this.departSS && this.mode === 'road') {
        if (this.hospital!.id === 'Middlemore') {
          return getMMHDrive(this.departSS);
        }
        if (this.hospital!.id === 'Waitakere') {
          return getWaitakereDrive(this.departSS);
        }
      }
      return this.hospitalTimes[this.mode]!.there;
    }
    return null;
  }

  public get minsToReturn() {
    if (this.hospitalTimes && this.mode) {
      if (this.departDest && this.mode === 'road') {
        if (this.hospital!.id === 'Middlemore') {
          return getMMHDrive(this.departDest);
        }
        if (this.hospital!.id === 'Waitakere') {
          return getWaitakereDrive(this.departDest);
        }
      }
      return this.hospitalTimes[this.mode]!.back;
    }
    return null;
  }

  @Watch('departSS')
  @Watch('minsToTakeOff')
  @Watch('minsToArriveDest')
  public afterDepartSS() {
    if (this.departSS) {
      const nextTime = new Date(this.departSS);
      if (this.minsToTakeOff) {
        nextTime.setMinutes(nextTime.getMinutes() + this.minsToTakeOff.p50);
        this.takeOff = nextTime;
        return;
      } else if (this.minsToArriveDest) {
        nextTime.setMinutes(nextTime.getMinutes() + this.minsToArriveDest.p50);
        this.arriveDest = nextTime;
        return;
      }
    }
    this.takeOff = this.arriveDest = null;
  }

  @Watch('takeOff')
  @Watch('minsToArriveDest')
  public afterTakeOff() {
    if (this.takeOff && this.minsToArriveDest) {
      const nextTime = new Date(this.takeOff);
      nextTime.setMinutes(nextTime.getMinutes() + this.minsToArriveDest.p50);
      this.arriveDest = nextTime;
    }
  }

  @Watch('timeAtCentre')
  @Watch('arriveDest')
  public afterTimeAtCentre() {
    if (this.timeAtCentre && this.arriveDest) {
      const nextTime = new Date(this.arriveDest);
      nextTime.setMinutes(nextTime.getMinutes() + this.timeAtCentre);
      this.departDest = nextTime;
    }
  }

  @Watch('minsToReturn')
  @Watch('departDest')
  public afterDepartDest() {
    if (this.departDest && this.minsToReturn) {
      const nextTime = new Date(this.departDest);
      nextTime.setMinutes(nextTime.getMinutes() + this.minsToReturn.p50);
      this.arriveSS = nextTime;
    }
  }

  public filterSearch(option: ISearchableHospitals, searchText: string) {
    return option.searchable.includes(searchText.toString().toLowerCase());
  }

  public timeStatsFilter(minutes?: IStats, from = '') {
    if (!minutes) {
      return '';
    }
    const returnVar = `median ${timeFilter(
      minutes.p50
    )} min <small class="iqr">(IQR ${timeFilter(minutes.p25)}–${timeFilter(
      minutes.p75
    )})</small>`;
    return from ? `${returnVar} from ${from}` : returnVar;
  }
}
</script>
<style scoped>
.time-estimate {
  color: indigo;
}
</style>
