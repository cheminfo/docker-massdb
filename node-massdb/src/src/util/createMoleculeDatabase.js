'use strict';

const OCLE = require('openchemlib-extended');
const debug = require('debug')('createMoleculeDatabase');

const massdbConnection = new (require('./MassDBConnection'))();

async function createMoleculeDatabase() {
  const collection = await massdbConnection.getMassCollection();

  let project = {
    _id: 1,
    idCode: '$general.ocl.idCode',
    index: '$general.ocl.index',
    mw: 'general.mw'
  };

  debug('Searching in mongoDB');
  let results = await collection
    .aggregate([
      // { $limit: 10000 },
      { $project: project }
    ])
    .toArray();

  massdbConnection.close();
  debug(`Found ${results.length} entries in mongo`);
  debug('Creating OCLE db');
  const moleculeDB = new OCLE.DB();
  for (let result of results) {
    moleculeDB.pushMoleculeInfo(result, result);
  }
  debug(`Found ${moleculeDB.getDB().length} entries in moleculeDB`);
  return moleculeDB;
}

module.exports = createMoleculeDatabase;
