'use strict';

// query for molecules from monoisotopic mass
const massdbConnection = new (require('../../util/MassDBConnection'))();
const massSimilarity = require('../../util/arrayxy/massSimilarity');

const parse = require('mf-parser').parse;

/**
 * Find molecular formula from a monoisotopic mass
 * @param {object} [options={}]
 * @param {object} [options.limit=1000]
 * @param {Array} [options.mz=''] - comma separated list of mass
 * @param {Array} [options.intensity=''] - Comma separated list of intensity
 * @param {Array} [options.minMass=0]
 * @param {Array} [options.maxMass=+Infinity]
 * @return {Array}
 */
module.exports = async function mass(options = {}) {
  let {
    limit = 1e3,
    mf = '',
    mz = '',
    intensity = '',
    minMass = 0,
    maxMass = +Infinity
  } = options;
  if (limit > 1e4) limit = 1e4;
  if (limit < 1) limit = 1;

  let mzArray = mz.trim().split(/[\t\r\n,; ]+/).map((value) => Number(value));
  let intensityArray =
      intensity.trim().split(/[\t\r\n,; ]+/).map((value) => Number(value));

  const collection = await massdbConnection.getMassCollection();

  let project = { _id: 1, 'general.name': 1, 'general.ocl': 1 };
  let match = {};
  if (minMass > 0 || maxMass < +Infinity) {
    match['general.em'] = { $gte: Number(minMass), $lte: Number(maxMass) };
  }
  if (mf) {
    let parsed = parse(mf);
    let atom = '';
    for (let item of parsed) {
      switch (item.kind) {
        case 'atom':
          atom = item.value;
          break;
        case 'multiplierRange':
          if (atom) {
            match[`general.atom.${atom}`] = {
              $gte: item.value.from,
              $lte: item.value.to
            };
          }
          atom = '';
          break;
        case 'multiplier':
          if (atom) match[`general.atom.${atom}`] = item.value;
          atom = '';
          break;
        default:
      }
    }
  }
  if (mzArray.length > 0) {
    match['mass.x'] = { $all: mzArray };
    project['mass.y'] = 1;
    project['mass.x'] = 1;
  }
  let results =
      await collection
        .aggregate(
          [{ $match: match }, { $limit: Number(limit) }, { $project: project }])
        .toArray();

  if (intensityArray.length > 0) {
    // need to calculate similarity
    for (let result of results) {
      result.similarity =
          massSimilarity({ x: mzArray, y: intensityArray }, result.mass, {
            maxNumberPeaks: 6,
            intensityPower: 0.6,
            massPower: 3,
            slotsPerUnit: 1
          });
    }
  }

  return results;
};
