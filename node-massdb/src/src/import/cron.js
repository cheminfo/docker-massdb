'use strict';

const join = require('path').join;

const delay = require('delay');
const debug = require('debug')('importLoop');

const importFolder = require('../util/config').importFolder;

const importNIST = require('./importNIST');

process.on('unhandledRejection', function (e) {
  throw e;
});

async function importProcess() {
  while (true) {
    await importNIST(join(importFolder, 'nist'));
    debug('wating 60s');
    await delay(60000);
  }
}

module.exports = importProcess;

importProcess();
