'use strict';

const debug = require('debug')('search-youbike-stations:server');
const rp = require('request-promise');
const queryValidator = require('../../lib/query_validator');

function processResults(parsed) {
  return parsed;
}

function getStations(req, res, next) {
  const query = req.query;

  // Validation of query values
  if (!queryValidator.isValidLatLong(query)) {
    return res.status(200).json({code: -1, results: []});
  }
  if (!queryValidator.isInTaipei(query)) {
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
    .then(resObj => res.status(200).json(resObj))
    .catch(_ => res.status(200).json({code: -3, results: []}));
}

module.exports = {
  getStations
}
