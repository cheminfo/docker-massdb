'use strict';

const MF = require('mf-parser').MF;

const parseSDF = require('./parseSDF');
const parseMsp = require('./parseMsp');
const parseJcamp = require('./parseJcamp');

async function parseNIST(baseFilename) {
  let results = [];
  let molfiles = await parseSDF(`${baseFilename}.sdf`);
  let msps = await parseMsp(`${baseFilename}.msp`);
  let jcamps = await parseJcamp(`${baseFilename}.jdx`);
  for (let key of Object.keys(molfiles)) {
    let molfile = molfiles[key];
    let msp = msps[key];
    let jcamp = jcamps[key];
    if (!molfile || !msp || !jcamp) {
      console.log(`Missing information for: ${key}`);
    } else {
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
    description: molfile.name,
    molfile: molfile.molfile,
    name: msp.synonyms.map((synonym) => {
      return { value: synonym };
    }),
    mf: msp.formula,
    mw: info.mass,
    em: info.monoisotopicMass,
    atom: info.atoms
  };
  result.identifier = { nist: msp.nist, cas: msp.rn };
  result.mass = { mz: msp.data.x, intensity: msp.data.y };
  result.misc = { source: msp.comments };
  return result;
}

module.exports = parseNIST;

/*
parseNIST(`${__dirname}/__tests__/data/nist`)
  .then((results) => console.log(results));
*/
