/**
   * Get string version of a given time. With 24 hr or 12 hr support
   * @param timeMode 24 for 24 hr clock or 12 for 12 hr clock
   * @param time minutes (ex: 1230 -> 20:30)
   */
  export const getDisplayTime = (timeMode: number, time: number) => {
    let hours = Math.floor(time / 60);
    let usePM = false;
    const minutes = Math.round(time - hours * 60);
    if (timeMode === 12) {
        if (hours >= 12) usePM = true;
        if (hours > 12) hours -= 12;
        if (hours == 0) hours = 12;
    }
    let timeStr = hours + ":";
    if (minutes < 10) timeStr += "0";
    timeStr += minutes;
    if (timeMode === 12) {
        timeStr += (" " + (usePM ? "pm" : "am" ));
    }
    return timeStr;
  };