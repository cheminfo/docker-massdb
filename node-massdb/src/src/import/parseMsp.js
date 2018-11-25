'use strict';

const fs = require('fs-extra');
const bufferSplit = require('buffer-split');

const fieldMapping = {
  'num peaks': '',
  'nist#': 'nist',
  'db#': '',
  'cas#': 'rn',
  mw: ''
};

async function parseMsp(src) {
  let split = new Buffer.from('\r\n\r\n');
  let msps = bufferSplit(await fs.readFile(src), split, true);
  let results = {};
  for (let mspBuffer of msps) {
    let msp = mspBuffer.toString();
    let result = processMsp(msp);
    if (result.name) results[result.name] = result;
  }
  return results;
}

function processMsp(msp) {
  let lines = msp.split(/[\r\n]+/).filter((line) => line);
  let result = { synonyms: [], data: { x: [], y: [] } };
  for (let line of lines) {
    if (line.includes(':')) {
      let parts = line.split(/; */);
      for (let part of parts) {
        let keyValue = part.split(/: */, 2);
        let key = keyValue[0].toLowerCase();
        let value = keyValue[1];
        if (fieldMapping[key] === '') key = '';
        if (fieldMapping[key]) key = fieldMapping[key];

        if (key) {
          if (key === 'synon') {
            result.synonyms.push(value);
          } else {
            result[key.toLowerCase()] = value;
          }
        }
      }
    } else {
      let parts = line.split(/ *; */);
      for (let part of parts) {
        let xy = part.split(/ /);
        if (xy.length === 2) {
          result.data.x.push(Number(xy[0]));
          result.data.y.push(Number(xy[1]));
        }
      }
    }
  }
  return result;
}

module.exports = parseMsp;
