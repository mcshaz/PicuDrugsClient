
import { EttDetails } from './EttDetails';
import { RangeFactory } from '../../Utilities/RangeFactory';
import { roundingMethod } from '../../Utilities/roundingMethod';
export function getETTSize(ageInMonths: number, weight: number = 0.0, gestAgeBirth: number = 40.0): EttDetails {
  ageInMonths = ageInMonths - (40.0 - gestAgeBirth) * 0.23076923076923078;
  const ett: EttDetails = new EttDetails();
  const rangeFactory: RangeFactory = new RangeFactory();
  rangeFactory.rounding = roundingMethod.fixedDecimalPlaces;
  rangeFactory.precision = 1;
  if (ageInMonths < 1.0) {
    if (weight <= 0.0) {
      ett.InternalDiameterRange = rangeFactory.create(2.5, 3.5);
      ett.Note = 'Exact measurements will depend on gestation and weight (not specified)';
    } else {
      if (weight < 0.7) {
        ett.InternalDiameter = 2.0;
        ett.LengthAtLip = 5.0;
        ett.LengthAtNose = 6.0;
        ett.InternalDiameterRange = rangeFactory.create(2.0, 2.5);
      } else {
        if (weight < 1.0) {
          ett.InternalDiameter = 2.5;
          ett.LengthAtLip = 5.5;
          ett.LengthAtNose = 7.0;
          ett.InternalDiameterRange = rangeFactory.create(2.0, 2.5);
        } else {
          if (weight <= 1.5) {
            ett.InternalDiameter = 3;
            ett.LengthAtLip = 6.0;
            ett.LengthAtNose = 7.5;
            ett.InternalDiameterRange = rangeFactory.create(2.5, 3.0);
          } else {
            if (weight <= 2.0) {
              ett.InternalDiameter = 3;
              ett.LengthAtLip = 7.0;
              ett.LengthAtNose = 9.0;
              ett.InternalDiameterRange = rangeFactory.create(2.5, 3.0);
            } else {
              if (weight <= 3.0) {
                ett.InternalDiameter = 3.0;
                ett.LengthAtLip = 8.5;
                ett.LengthAtNose = 10.5;
                ett.InternalDiameterRange = rangeFactory.create(2.5, 3.5);
              } else {
                ett.InternalDiameter = 3.5;
                ett.LengthAtLip = 9.0;
                ett.LengthAtNose = 11.0;
                ett.InternalDiameterRange = rangeFactory.create(3.0, 3.5);
              }
            }
          }
        }
      }
    }
  } else {
    if (ageInMonths <= 6.0) {
      ett.InternalDiameter = 3.5;
      ett.LengthAtLip = 10.0;
      ett.LengthAtNose = 12.0;
      ett.InternalDiameterRange = rangeFactory.create(3.0, 4.0);
    } else {
      if (ageInMonths <= 18.0) {
        ett.InternalDiameter = 4.0;
        ett.LengthAtLip = 11.0;
        ett.LengthAtNose = 14.0;
      } else {
        if (ageInMonths <= 30.0) {
          ett.InternalDiameter = 4.5;
          ett.LengthAtLip = 12.0;
          ett.LengthAtNose = 15.0;
        } else {
          if (ageInMonths <= 42.0) {
            ett.InternalDiameter = 4.5;
            ett.LengthAtLip = 13.0;
            ett.LengthAtNose = 16.0;
          } else {
            if (ageInMonths <= 54.0) {
              ett.InternalDiameter = 5.0;
              ett.LengthAtLip = 14.0;
              ett.LengthAtNose = 17.0;
            } else {
              if (ageInMonths <= 84.0) {
                ett.InternalDiameter = 5.5;
                ett.LengthAtLip = 15.0;
                ett.LengthAtNose = 19.0;
              } else {
                if (ageInMonths <= 108.0) {
                  ett.InternalDiameter = 6;
                  ett.LengthAtLip = 16.0;
                  ett.LengthAtNose = 20.0;
                } else {
                  ett.Note = 'routine nasal not indicated in this age';
                  if (ageInMonths <= 132.0) {
                    ett.InternalDiameter = 6.5;
                    ett.LengthAtLip = 17.0;
                    ett.LengthAtNose = 21.0;
                  } else {
                    if (ageInMonths <= 156.0) {
                      ett.InternalDiameter = 7;
                      ett.LengthAtLip = 18.0;
                      ett.LengthAtNose = 22.0;
                    } else {
                      if (ageInMonths < 180.0) {
                        ett.InternalDiameter = 7.5;
                        ett.LengthAtLip = 19.0;
                        ett.LengthAtNose = 23.0;
                      } else {
                        ett.InternalDiameter = 8;
                        ett.LengthAtLip = 20.0;
                        ett.LengthAtNose = 24.0;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if (ett.InternalDiameter <= 2.5) {
    ett.SuctionWith = 6;
  } else {
    if (ett.InternalDiameter === 3.0) {
      ett.SuctionWith = 7;
    } else {
      if (ett.InternalDiameter <= 4.5) {
        ett.SuctionWith = 8;
      } else {
        if (ett.InternalDiameter <= 6.0) {
          ett.SuctionWith = 10;
        } else {
          ett.SuctionWith = 12;
        }
      }
    }
  }
  if (ett.InternalDiameterRange === null) {
    ett.InternalDiameterRange = rangeFactory.create(ett.InternalDiameter - 0.5, ett.InternalDiameter + 0.5);
  }
  return ett;
}
export function DailyMaintenanceFluid(weightKg: number): number {
  const flag: boolean = weightKg >= 65.0;
  let result: number;
  if (flag) {
    result = 2400;
  } else {
    if (weightKg >= 20.0) {
      result = 1500.0 + 20.0 * (weightKg - 20.0);
    } else {
      if (weightKg >= 10.0) {
        result = 1000.0 + 50.0 * (weightKg - 10.0);
      } else {
        result = 100.0 * weightKg;
      }
    }
  }
  return result;
}
