'use strict';

const debug = require('debug')('search-mass');
const parse = require('mf-parser').parse;

const massdbConnection = new (require('../../util/MassDBConnection'))();
const massSimilarity = require('../../util/arrayxy/massSimilarity');
const topY = require('../../util/arrayxy/topY');
const thresoldY = require('../../util/arrayxy/thresholdYFilter');


let moleculeDB;

/**
 * Find molecular formula from a monoisotopic mass
 * @param {object} [options={}]
 * @param {object} [options.limit=1000]
 * @param {string} [options.mz=''] comma separated list of mass
 * @param {string} [options.intensity=''] Comma separated list of intensity
 * @param {string} [options.idCode=''] An OCL fragment idCode for substructure
 * @param {number} [options.minMass=0]
 * @param {number} [options.maxMass=+Infinity]
 * @param {string} [options.minSimilarity=0.5] Minimal similarity
 * @param {string} [options.mf=''] range of mf to search like for example 'C1-10H1-20O0N0'
 *
 * @return {Array}
 */
module.exports = async function mass(options = {}) {
  let {
    limit = 1e3,
    mf = '',
    mz = '',
    intensity = '',
    minMass = 0,
    maxMass = +Infinity,
    minSimilarity = 0.5,
    idCode = ''
  } = options;
  if (limit > 1e4) limit = 1e4;
  if (limit < 1) limit = 1;


  moleculeDB = await require('../../util/createMoleculeDatabase')();

  let mzArray =
      mz ? mz.trim().split(/[\t\r\n,; ]+/).map((value) => Number(value)) : [];
  let intensityArray = intensity ?
    intensity.trim().split(/[\t\r\n,; ]+/).map((value) => Number(value)) :
    [];

  const collection = await massdbConnection.getMassCollection();

  let project = {
    _id: 1,
    'general.name': 1,
    'general.ocl': 1,
    'general.mf': 1,
    'general.em': 1
  };
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
          if (atom) {
            if (item.value === 0) {
              match[`general.atom.${atom}`] = { $exists: false };
            } else {
              match[`general.atom.${atom}`] = item.value;
            }
          }

          atom = '';
          break;
        default:
      }
    }
  }
  project['mass.y'] = 1;
  project['mass.x'] = 1;
  if (mzArray.length > 0) {
    // need to take only the 5 best ones if intensity is available
    if (intensityArray.length > 0) {
      let xy = topY({ x: mzArray, y: intensityArray }, { limit: 5 });
      xy = thresoldY(xy, { threshold: 0.1 });
      match['mass.index'] = { $all: xy.x };
    } else {
      match['mass.index'] = { $all: mzArray };
    }
  }
  if (idCode) {
    debug(`idCode: ${idCode}`);
    let result = moleculeDB.search(idCode).map((entry) => entry.data._id);
    match._id = { $in: result };
  }
  debug('Starting search');
  let results =
      await collection
        .aggregate([
          { $match: match }, { $limit: mzArray.length > 0 ? 1e6 : Number(limit) },
          { $project: project }
        ])
        .toArray();
  debug('Finished search');
  if (intensityArray.length > 0) {
    // need to calculate similarity
    for (let result of results) {
      result.similarity =
          massSimilarity({ x: mzArray, y: intensityArray }, result.mass, {
            maxNumberPeaks: 5,
            intensityPower: 0.6,
            massPower: 3,
            slotsPerUnit: 1
          });
    }
    if (minSimilarity) {
      results = results.filter((result) => result.similarity >= minSimilarity);
    }
    results.sort((a, b) => b.similarity - a.similarity);
  } else {
    results.sort((a, b) => a.general.em - b.general.em);
  }
  results = results.slice(0, limit);
  debug('Got sorted results');
  return results;
};
