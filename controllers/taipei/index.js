'use strict';

const rp = require('request-promise');

function processResults(parsed) {
  return parsed;
}

function isValidLatLong(query) {
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
