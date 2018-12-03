'use strict';

const OCLE = require('openchemlib-extended');
const debug = require('debug')('createMoleculeDatabase');

const massdbConnection = new (require('./MassDBConnection'))();

let moleculeDB;

async function createMoleculeDatabase() {
  if (moleculeDB) return moleculeDB;
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

  await massdbConnection.close();
  debug(`Found ${results.length} entries in mongo`);
  debug('Creating OCLE db');
  moleculeDB = new OCLE.DB();
  let i = 0;
  for (let result of results) {
    moleculeDB.pushMoleculeInfo(result, result);
    if (i++ % 10000 === 0) {
      debug(`Loading ${i}/${results.length}`);
    }
  }
  debug(`Found ${moleculeDB.getDB().length} entries in moleculeDB`);
  return moleculeDB;
}

module.exports = createMoleculeDatabase;
