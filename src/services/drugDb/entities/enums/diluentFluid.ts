export enum diluentFluid {
    saline = 1,
    glucose,
    wfi,
}

export function diluentFluidName(df: diluentFluid): string {
  switch (df) {
    case diluentFluid.saline:
      return '0.9% Saline';
    case diluentFluid.glucose:
      return '5% Glucose';
    case diluentFluid.wfi:
      return 'Water For Inj.';
  }
}
