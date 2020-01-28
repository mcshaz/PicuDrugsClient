<template>
  <div class="home">
    <h2>Starship Transport Times</h2>
      <validated-input-group
        type="text"
        label="Hospital"
        placeholder="hospital"
        v-model="hospitalName"
        :datalist="hospitalNames"
        :rules="{ oneOf: hospitalNames }"
        required
      />
    <validated-select-group label="Mode" required v-model="mode">
      <option value disabled>select transport mode...</option>
      <option value="road" :disabled="!selectedHospital||!selectedHospital.road">
        Road Ambulance
        <!--<font-awesome-icon icon="ambulance" />-->
      </option>
      <option value="rotary" :disabled="!selectedHospital||!selectedHospital.rotary">
        Rotary Wing
        <!--<font-awesome-icon icon="helicopter" />-->
      </option>
      <optgroup label="Fixed Wing">
        <option value="prop" :disabled="!selectedHospital||!selectedHospital.prop">
          Turboprop
          <!--<font-awesome-icon icon="plane" />-->
        </option>
        <option value="jet" :disabled="!selectedHospital||!selectedHospital.jet">
          Jet
          <!--<font-awesome-icon icon="fighter-jet" />-->
        </option>
      </optgroup>
    </validated-select-group>
    <validated-date-time-group label="Depart Starship" v-model="departSS" required />
    <validated-date-time-group label="Takeoff" v-if="mode==='prop'||mode==='jet'" v-model="takeOff">
      <template #description>
        <duration-stats :value="minsToTakeOff" departFrom="departing Starship"/>
      </template>
    </validated-date-time-group>
    <validated-date-time-group
      name="arriveDest"
      v-model="arriveDest"
    >
      <template #label>
        Arrive
          <span v-if="selectedHospital">{{ selectedHospital.name }}</span>
          <small v-else class="text-muted">[select place]</small>
      </template>
      <template #description>
        <duration-stats :value="minsToArriveDest" :departFrom="mode==='prop'||mode==='jet'?'takeoff':'departing Starship'"/>
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
      <template #prepend>15<small class="text-muted">min</small></template>
      <template #append>4<small class="text-muted">hr</small></template>
      <template #range-value>
        <span class="time-estimate">estimate <duration-display :value="timeAtCentre"/></span> &nbsp;
        <duration-stats :value="timeAtCentreStats"/>
      </template>
    </validated-input-group>
    <validated-date-time-group
      name="departDest"
      v-model="departDest"
    >
      <template #label>
        Leave
          <span v-if="selectedHospital">{{ selectedHospital.name }}</span>
          <small v-else class="text-muted">[select place]</small>
      </template>
    </validated-date-time-group>
    <validated-date-time-group label="Return to Starship" v-model="arriveSS">
      <template #description>
        <duration-stats :value="minsToReturn" :departFrom="selectedHospital?selectedHospital.name:'referring centre'"/>
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
import DurationDisplay from '@/components/DurationDisplay.vue';
import DurationStats from '@/components/DurationStats.vue';
import ValidatedDateTimeGroup from '@/components/formGroups/ValidatedDateTimeGroup.vue';

type modes = 'prop' | 'jet' | 'road' | 'rotary' | '';

@Component({
  components: {
    ValidatedDateTimeGroup,
    DurationDisplay,
    DurationStats,
  },
})
export default class TransportTimes extends Vue {
  public hospitalName: string = '';
  public hospitalNames: string[] = []
  public mode: modes = '';
  public arriveDest: Date | null = null;
  public timeAtCentreStats = timeInCentre;
  public arriveSS: Date | null = null;
  private departSS: Date | null = null;
  private takeOff: Date | null = null;
  private timeAtCentre = timeInCentre.p50;
  private departDest: Date | null = null;

  public created() {
    this.hospitalNames = Object.entries(hospitals).map(([name, props]) => props.alt
      ? `${name} (${props.alt})`
      : name);
    this.departSS = new Date();
    this.departSS.setSeconds(0, 0);
  }

  public get selectedHospital() {
    if (this.hospitalName && this.hospitalName.length) {
      const name = this.hospitalName.replace(/ \(.+/, '');
      const returnVar = hospitals[name];
      if (returnVar) {
        return { name, ...returnVar };
      }
    }
    return null;
  }

  public get minsToTakeOff() {
    if (
      this.selectedHospital &&
      this.mode &&
      this.departSS &&
      (this.mode === 'jet' || this.mode === 'prop')
    ) {
      return getAirportDriveTime(this.departSS);
    }
    return null;
  }

  public get minsToArriveDest() {
    if (this.selectedHospital && this.mode) {
      if (this.departSS && this.mode === 'road') {
        if (this.selectedHospital.name === 'Middlemore') {
          return getMMHDrive(this.departSS);
        }
        if (this.selectedHospital.name === 'Waitakere') {
          return getWaitakereDrive(this.departSS);
        }
      }
      return this.selectedHospital[this.mode]!.there;
    }
    return null;
  }

  public get minsToReturn() {
    if (this.selectedHospital && this.mode) {
      if (this.departDest && this.mode === 'road') {
        if (this.selectedHospital.name === 'Middlemore') {
          return getMMHDrive(this.departDest);
        }
        if (this.selectedHospital.name === 'Waitakere') {
          return getWaitakereDrive(this.departDest);
        }
      }
      return this.selectedHospital[this.mode]!.back;
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
}
</script>
<style scoped>
.time-estimate {
  color: indigo;
}
</style>
