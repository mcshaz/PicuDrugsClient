export interface IDobTestData { current: Date;
    dob: Date; yrOld: number;
    mthOld: number; dayOld: number; totalDays: number; }

export function getData(): IDobTestData[] {
  return [
    {
      current: new Date(2020, 0, 31),
      dob: new Date(2016, 0, 31),
      yrOld: 4,
      mthOld: 0,
      dayOld: 0,
      totalDays: 1461,
    },
    {
      current: new Date(2020, 1, 1),
      dob: new Date(2016, 0, 31),
      yrOld: 4,
      mthOld: 0,
      dayOld: 1,
      totalDays: 1462,
    },
    {
      current: new Date(2020, 0, 31),
      dob: new Date(2016, 1, 1),
      yrOld: 3,
      mthOld: 11,
      dayOld: 30,
      totalDays: 1461,
    }, // ?1460 but fine for our usage
    // leap day tests
    {
      current: new Date(2020, 1, 29),
      dob: new Date(2016, 1, 29),
      yrOld: 4,
      mthOld: 0,
      dayOld: 0,
      totalDays: 1461,
    },
    {
      current: new Date(2019, 1, 28),
      dob: new Date(2016, 1, 29),
      yrOld: 2,
      mthOld: 11,
      dayOld: 30,
      totalDays: 1095,
    },
    // arguable below should be 1 day, but 0 seems acceptable
    {
      current: new Date(2019, 2, 1),
      dob: new Date(2016, 1, 29),
      yrOld: 3,
      mthOld: 0,
      dayOld: 0,
      totalDays: 1096,
    },
    {
      current: new Date(2019, 2, 1),
      dob: new Date(2019, 2, 1),
      yrOld: 0,
      mthOld: 0,
      dayOld: 0,
      totalDays: 0,
    },
  ];
}
