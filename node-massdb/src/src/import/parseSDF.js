'use strict';

const fs = require('fs-extra');
const bufferSplit = require('buffer-split');
const OCLE = require('openchemlib-extended');

async function parseSDF(src) {
  let split = new Buffer.from('$$$$\r\n');
  let molfiles = bufferSplit(await fs.readFile(src), split, true);
  let results = {};
  for (let molfileBuffer of molfiles) {
    let result = {};
    let molfile = molfileBuffer.toString();
    result.name = molfile.split(/[\r\n]+/)[0].trim();
    result.molfile = molfile;
    let molecule = OCLE.Molecule.fromMolfile(molfile);
    if (result.name) results[result.name] = result;
  }
  return results;
}

module.exports = parseSDF;

/*
parseSDF(`${__dirname}/__tests__/data/nist.sdf`)
  .then((results) => console.log(results));
*/

// parseSDF(`${__dirname}/../../data/nist/NIST.sdf`);
