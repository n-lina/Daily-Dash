const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  
  /**
   * Get string version of day on devices phone
   * @param getShort true for short version (ex: mon) (long is Monday)
   */
  export const getDay = (getShort: boolean) => {
    const day = weekDays[new Date().getDay()];
    if (getShort) {
      return day.toLowerCase().substring(0, 3);
    }
    return day;
  };