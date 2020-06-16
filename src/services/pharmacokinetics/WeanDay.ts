import { roundToFixed } from '@/services/infusion-calculations/';

export class WeanDay {
    public rescueDose: number;
    constructor(public readonly weanDate: Date,
                public regularDose: number,
                public frequency: string,
                rescueDose?: number) {
      this.regularDose = roundToFixed(this.regularDose);
      this.rescueDose = rescueDose ? roundToFixed(rescueDose) : this.regularDose;
    }

    public get id() {
      return this.weanDate.getTime();
    }

    public get weanDateString() {
      return WeanDay.formatter.format(this.weanDate); // .replace('/0', '/'); // hack because all browsers currently seems to give 2 digit month
    }

    public addDays(days: number) {
      this.weanDate.setDate(this.weanDate.getDate() + days);
    }

    public cloneForTomorrow(): WeanDay {
      const returnVar = new WeanDay(new Date(this.weanDate), this.regularDose, this.frequency);
      returnVar.addDays(1);
      return returnVar;
    }

    private static formatter = new Intl.DateTimeFormat(navigator.languages as string[],
      {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
      });
}
