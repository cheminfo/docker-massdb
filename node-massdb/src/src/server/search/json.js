'use strict';

// query for molecules from monoisotopic mass
const massdbConnection = new (require('../../util/MassDBConnection'))();

/**
 * Find molecular formula from a monoisotopic mass
 * @param {string} url
 * @return {object}
 */
async function jcamp(url) {
  let id = url.replace('/json/', '');
  let collection = await massdbConnection.getMassCollection();

  const result = await collection.findOne({ _id: id });

  return result;
}

module.exports = jcamp;
