'use strict';

const debug = require('debug')('search-youbike-stations:server');
const rp = require('request-promise');
const keys = require('../config/keys');

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

function CheckGeoInfo(response) {
  debug(response);
  
  // Check response status
  if (response.status !== 'OK') {
    return Promise.reject(new Error('Failed to get geo info'));
  }

  // Check if it's in Taipei
  let cityName = response.results[0].address_components[0].long_name;
  if (cityName === 'Taipei City') {
    debug('IN TAIPEI');
    return true;
  } else {
    debug('NOT IN TAIPEI');
    return false;
  }
}

function isInTaipei(query) {
  const options = {
    uri: 'https://maps.googleapis.com/maps/api/geocode/json',
    qs: {
      latlng: query.lat + ',' + query.lng,
      key: keys.api,
      language: 'en',
      result_type: 'administrative_area_level_1',
      timeout: 1000 * 60 * 3 // 3 mins
    },
    json: true
  };
  return rp.get(options).then(response => CheckGeoInfo(response));
}

module.exports = {
  isValidLatLong,
  isInTaipei
}
