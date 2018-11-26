'use strict';

// query for molecules from monoisotopic mass
const massdbConnection = new (require('../../util/MassDBConnection'))();

const parse = require('mf-parser').parse;

/**
 * Find molecular formula from a monoisotopic mass
 * @param {object} [options={}]
 * @param {object} [options.limit=1000]
 * @param {Array} [options.mz=[]]
 * @param {Array} [options.intensity=[]]
 *  @param {Array} [options.minMass=0]
 *  @param {Array} [options.maxMass=+Infinity]
 * @return {Array}
 */
module.exports = async function mass(options = {}) {
  let {
    limit = 1e3,
    mf = '',
    mz = [],
    intensity = [],
    minMass = 0,
    maxMass = +Infinity
  } = options;
  if (limit > 1e4) limit = 1e4;
  if (limit < 1) limit = 1;
  let mzArray = mz
    .split(/[\t\r\n,; ]+/)
    .map((value) => Number(value))
    .filter((value) => value > 0);

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
  if (mz) {
    match['mass.x'] = { $all: mzArray };
    project['mass.y'] = 1;
    project['mass.x'] = 1;
  }
  let results = await collection
    .aggregate([
      {
        $match: match
      },
      { $limit: Number(limit) },
      { $project: project }
    ])
    .toArray();

  return results.length;
};

function calculateDistance(target, source) {}
