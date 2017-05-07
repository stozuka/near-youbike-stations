'use strict';

const rp = require('request-promise');
const debug = require('debug')('search-youbike-stations:server');

function processResults(parsed) {
  return parsed;
}

function isValidLatLong(query) {
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

function getStations(req, res, next) {
  const query = req.query;

  // Validation of query values
  if (!isValidLatLong(query)) {
    return res.status(200).json({code: -1, results: []});
  }
  if (!isInTaipei(query)) {
    return res.status(200).json({code: -2, results: []});
  }

  // Settings of GET request
  const options = {
    uri: 'http://data.taipei/opendata/datalist/apiAccess',
    qs: {
      scope: 'resourceAquire',
      rid: 'ddb80380-f1b3-4f8e-8016-7ed9cba571d5'
    },
    json: true
  };

  // Send GET request and send reponse
  rp.get(options)
    .then(results => processResults(results))
    .then(processed => res.status(200).json(processed))
    .catch(_ => res.status(200).json({code: -3, results: []}));
}

module.exports = {
  getStations
}
