'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/taipei');

router.get('/', function (req, res, next) {
  res.status(200).json({msg: 'API Working'});
});

router.get('/v1/ubike-station/taipei', controller.getStations);

module.exports = router;
