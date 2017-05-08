'use strict';

function isValidLatLong(query) {
  // Check if query exists
  if (!query) {return false;}

  const {lat, lng} = query;

  // Check if lat and lng are numbers
  if (!typeof lat === 'number' || !typeof lng === 'number') {
    return false;
  }
  // Check if the range is valid
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
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
