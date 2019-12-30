export interface IStats {p50: number; p25: number; p75: number; }

export const timeInCentre = { p50: 65, p25: 36, p75: 105 }

export function getAirportDriveTime (leave: Date): IStats {
  const day = leave.getDay()
  if (day > 0 && day < 6) {
    const hr = leave.getHours()
    if (hr === 7 || hr === 8 || (hr >= 15 && hr <= 17)) { // peak
      return { p50: 65, p25: 60, p75: 75 }
    }
    if ((hr >= 9 && hr <= 14) || (hr >= 18 && hr <= 20)) { // shoulder
      return { p50: 60, p25: 55, p75: 70 }
    }
  }
  return { p50: 56, p25: 50, p75: 70 } // offPeak
}

export function getMMHDrive (leave: Date): IStats {
  const hr = leave.getHours()
  if (hr === 7 || hr === 8 || (hr >= 15 && hr <= 17)) { // peak
    return { p50: 30, p25: 25, p75: 35 }
  }
  return { p50: 25, p25: 20, p75: 35 }
}

export function getWaitakereDrive (leave: Date): IStats {
  return getMMHDrive(leave) // running stats came up with exactly the same answer!
}
