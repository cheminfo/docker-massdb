'use strict';

const MassDBConnection = require('../util/MassDBConnection');

const parseNIST = require('./parseNIST');

module.exports = processNIST;

async function processNIST(baseFilename) {
  const massdbConnection = new MassDBConnection();
  const collection = await massdbConnection.getMassCollection();

  const data = await parseNIST(baseFilename);
  for (let datum of data) {
    await collection.updateOne(
      { _id: `NIST_${datum.identifier.nist}` }, { $set: datum }, { upsert: true });
  }

  await collection.createIndex({ 'general.em': 1 });
  massdbConnection.close();
}

processNIST(`${__dirname}/../../data/nist/NIST`);
