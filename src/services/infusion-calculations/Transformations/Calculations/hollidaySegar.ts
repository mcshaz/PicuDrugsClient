// daily maintenance in mL
export function dailyMaintenanceFluid(weightKg: number): number {
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

// hourly rate @ 5% dehydration
export function fullplus5(weightKg: number) {
  let dailyMl = dailyMaintenanceFluid(weightKg);
  dailyMl += weightKg * 5 * 10;
  return dailyMl;
}
