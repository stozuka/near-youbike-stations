'use strict';

const debug = require('debug')('search-youbike-stations:server');
const rp = require('request-promise');
const geolib = require('geolib');
const queryValidator = require('../../lib/query_validator');

function processResults(stations, query) {
  const {lat, lng} = query;
  let ret = [];

  stations.forEach(station => {
    const numUbike = parseInt(station.sbi);

    // Continue if no bike is available for this station
    if (numUbike === 0) { return; }

    const dist = geolib.getDistance(
      {latitude: lat, longitude: lng},
      {latitude: station.lat, longitude: station.lng}
    );

    const obj = {station: station.sna, num_ubike: numUbike, dist: dist};

    ret.push(obj);
  });

  // If there was no station with available bike
  if (ret.length === 0) {
    return {code: 1, result: []};
  }

  // If there are stations available
  ret.sort((a, b) => a.dist - b.dist);
  ret.forEach(elem => delete elem.dist);
  return {code: 0, result: ret.slice(0, 2)};
}

function getStations(req, res, next) {
  const query = req.query;

  // Convert datatype of query from string to float
  for (let key in query) {
    query[key] = parseFloat(query[key])
  }

  // Validation of query values
  if (!queryValidator.isValidLatLong(query)) {
    return res.status(200).json({code: -1, result: []});
  }
  if (!queryValidator.isInTaipei(query)) {
    return res.status(200).json({code: -2, result: []});
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

  // Send GET request to YouBike API and process results
  rp.get(options)
    .then(response => processResults(response.result.results, query))
    .then(resObj => res.status(200).json(resObj))
    .catch(_ => res.status(200).json({code: -3, result: []}));
}

module.exports = {
  getStations
}
