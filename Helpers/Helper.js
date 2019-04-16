const partsOfDay = {
  morning: {
    from: 0,
    to: 839
  },
  afternoon: {
    from: 840,
    to: 1079
  },
  evening: {
    from: 1080,
    to: 1440
  }
}


function getPartsOfDay() {
  return partsOfDay;
}
function getTodayInMinutes() {
  let today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  return today.getTime() / 1000 / 60;
}
function getTodayAfterXDaysInMinutes(daysCount) {
  return getTodayInMinutes() + 1440 * daysCount;
}

exports.getPartsOfDay = getPartsOfDay;
exports.getTodayInMinutes = getTodayInMinutes;
exports.getTodayAfterXDaysInMinutes = getTodayAfterXDaysInMinutes;