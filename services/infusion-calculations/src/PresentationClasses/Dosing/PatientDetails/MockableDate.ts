export interface IDateProvider { today: Date; daysInPriorMonth: () => number; }

export class MockableDate  {
    public static daysInPriorMonth(anyDateInMonth: Date) {
        return new Date(anyDateInMonth.getFullYear(),
                        anyDateInMonth.getMonth(),
                        0).getDate();
    }

    constructor(public readonly today: Date = new Date()) {
        this.today.setHours(0, 0, 0, 0);
    }

    public daysInPriorMonth() {
        return MockableDate.daysInPriorMonth(this.today);
    }
}
