'use strict';

const fs = require('fs-extra');
const bufferSplit = require('buffer-split');
const OCLE = require('openchemlib-extended');
const debug = require('debug')('parseSDF');

async function parseSDF(src) {
  let split = new Buffer.from('$$$$\r\n');
  let molfiles = bufferSplit(await fs.readFile(src), split, true);
  let results = [];
  for (let i = 0; i < molfiles.length; i++) {
    let molfileBuffer = molfiles[i];
    if (i % 10000 === 0) debug(`parseSDF: ${i}/${molfiles.length}`);
    let result = {};
    let molfile = molfileBuffer.toString();
    result.name = molfile.split(/[\r\n]+/)[0].trim();
    result.molfile = molfile;
    let molecule = OCLE.Molecule.fromMolfile(molfile);
    result.ocl = molecule.getIDCodeAndCoordinates();
    result.ocl.index = molecule.getIndex();
    if (result.name) results.push(result);
  }
  return results;
}

module.exports = parseSDF;

/*
parseSDF(`${__dirname}/__tests__/data/nist.sdf`)
  .then((results) => debug(results));
*/

// parseSDF(`${__dirname}/../../data/nist/NIST.sdf`);
