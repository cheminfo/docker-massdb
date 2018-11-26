'use strict';

const MF = require('mf-parser').MF;

const topPeaks = require('../util/topPeaks.js');

const parseSDF = require('./parseSDF');
const parseMsp = require('./parseMsp');
const parseJcamp = require('./parseJcamp');

const debug = require('debug')('parseNIST');

async function parseNIST(baseFilename) {
  let results = [];
  let molfiles = await parseSDF(`${baseFilename}.sdf`);
  let msps = await parseMsp(`${baseFilename}.msp`);
  let jcamps = await parseJcamp(`${baseFilename}.jdx`);
  let followingBads = 0;
  for (let i = 0; i < msps.length; i++) {
    if (i % 10000 === 0) debug(`parseNIST: ${i}/${msps.length}`);
    let molfile = molfiles[i];
    let msp = msps[i];
    let jcamp = jcamps[i];

    if (!molfile || !msp || !jcamp) {
      debug(`Missing information for: ${molfile.name}`);
    } else {
      let molfileName = molfile.name
        .toLowerCase()
        .replace(/[^0-9a-z]/g, '')
        .substring(0, 20);
      let mspName = msp.name
        .toLowerCase()
        .replace(/[^0-9a-z]/g, '')
        .substring(0, 20);
      let jcampName = jcamp.name
        .toLowerCase()
        .replace(/[^0-9a-z]/g, '')
        .substring(0, 20);

      if (molfileName !== mspName || molfileName !== jcampName) {
        // debug(`Names do not match: ${molfileName} ${mspName}  ${jcampName} `);
        followingBads++;
        if (followingBads > 500) {
          throw new Error('too many consecutive bad name match');
        }
      } else {
        followingBads = 0;
      }

      let entry = getEntry(molfile, msp, jcamp);
      results.push(entry);
    }
  }

  return results;
}

function getEntry(molfile, msp, jcamp) {
  let result = {};
  if (!msp.formula) return result;

  let mf = new MF(msp.formula);
  let info = mf.getInfo();
  result.general = {
    description: msp.name,
    molfile: molfile.molfile,
    ocl: molfile.ocl,
    name: msp.synonyms.map((synonym) => {
      return { value: synonym };
    }),
    mf: msp.formula,
    mw: info.mass,
    em: info.monoisotopicMass,
    atom: info.atoms
  };
  result.identifier = { nist: msp.nist, cas: msp.rn };

  let peaks = topPeaks(msp.data, { limit: 20 });
  let index = [];
  for (let i = 0; i < peaks.x.length; i++) {
    if (peaks.y[i] >= 10) index.push(peaks.x[i]); // values are on 1000
  }

  result.mass = { index, x: msp.data.x, y: msp.data.y };
  result.misc = { source: msp.comments };
  return result;
}

module.exports = parseNIST;

/*
parseNIST(`${__dirname}/__tests__/data/nist`)
  .then((results) => console.log(results));
*/
