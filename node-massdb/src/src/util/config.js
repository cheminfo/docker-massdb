'use strict';

let join = require('path').join;

let config = require('../config.json');

config.importFolder = join(__dirname, '../../../data');

module.exports = config;
