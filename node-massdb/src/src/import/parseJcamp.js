'use strict';

const fs = require('fs-extra');
const bufferSplit = require('buffer-split');
const convert = require('jcampconverter').convert;
const debug = require('debug')('parseJcamp');

async function parseJcamp(src) {
  let split = new Buffer.from('##END=');
  let jcamps = bufferSplit(await fs.readFile(src), split, true);
  let results = [];
  for (let i = 0; i < jcamps.length; i++) {
    let jcampBuffer = jcamps[i];
    if (i % 10000 === 0) debug(`parseJcamp: ${i}/${jcamps.length}`);
    let jcamp = jcampBuffer.toString();
    let parsed = convert(jcamp, { xy: true }).spectra[0];
    if (parsed && parsed.title) {
      parsed.name = parsed.title;
      results.push(parsed);
    }
  }
  return results;
}

module.exports = parseJcamp;
