'use strict';

const fs = require('fs-extra');
const bufferSplit = require('buffer-split');
const convert = require('jcampconverter').convert;

async function parseJcamp(src) {
  let split = new Buffer.from('##END=');
  let jcamps = bufferSplit(await fs.readFile(src), split, true);
  let results = {};
  for (let jcampBuffer of jcamps) {
    let jcamp = jcampBuffer.toString();
    let parsed = convert(jcamp, { xy: true }).spectra[0];
    if (parsed && parsed.title) {
      results[parsed.title] = parsed;
    }
  }
  return results;
}

module.exports = parseJcamp;
