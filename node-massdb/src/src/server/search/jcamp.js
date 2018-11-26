'use strict';

const fromJson = require('convert-to-jcamp').fromJson;

// query for molecules from monoisotopic mass
const massdbConnection = new (require('../../util/MassDBConnection'))();

/**
 * Find molecular formula from a monoisotopic mass
 * @param {string} url
 * @return {string}
 */
async function jcamp(url) {
  let id = url.replace('/jcamp/', '');
  let collection = await massdbConnection.getMassCollection();

  const result = await collection.findOne({ _id: id });

  let jcamp = fromJson(
    { x: result.mass.mz, y: result.mass.intensity },
    {
      title: result.general.description,
      type: 'MASS SPECTRUM',
      xUnit: 'M/Z',
      yUnit: 'relative abundance'
    }
  );

  return jcamp;
}

module.exports = jcamp;
