'use strict';

function isValidLatLong(query) {
  // Check if query exists
  if (!query) {return false;}

  const lat = parseFloat(query.lat);
  const lon = parseFloat(query.lon);

  // Check if lat and lon are numbers
  if (!typeof lat === 'number' || !typeof lon === 'number') {
    return false;
  }
  // Check if the range is valid
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return false;
  }
  // If no problem, return true
  return true;
}

function isInTaipei(query) {
  return true;
}

module.exports = {
  isValidLatLong,
  isInTaipei
}
