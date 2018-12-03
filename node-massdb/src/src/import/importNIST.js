'use strict';

const join = require('path').join;

const fs = require('fs-extra');
const debug = require('debug')('massdb:processNIST');

const MassDBConnection = require('../util/MassDBConnection');

const parseNIST = require('./parseNIST');


module.exports = importNIST;

async function importNIST(baseFolder) {
  const massdbConnection = new MassDBConnection();
  const collection = await massdbConnection.getMassCollection();

  const sourceDir = join(baseFolder, 'to_process');

  if (!fs.pathExistsSync(sourceDir)) return;

  const dir = await fs.readdir(sourceDir);
  const keys = {};
  debug(`checking directory: ${sourceDir}`);
  for (let file of dir) {
    let name = file.replace(/(.*)\.(.*)/, '$1');
    let extension = file.replace(/(.*)\.(.*)/, '$2');
    if (extension.match(/^(msp|sdf|jdx)/)) {
      if (!keys[name]) keys[name] = [];
      if (!keys[name].includes(extension)) keys[name].push(extension);
    }
  }
  for (let name of Object.keys(keys)) {
    let extensions = keys[name];
    if (extensions.length === 3) {
      debug(`parsing data: ${name}`);
      const data = await parseNIST(join(sourceDir, name));
      for (let i = 0; i < data.length; i++) {
        let datum = data[i];
        if (i % 2500 === 0) debug(`importNIST: ${i}/${data.length}`);
        await collection.updateOne(
          { _id: `NIST_${datum.identifier.nist}` },
          { $set: datum },
          { upsert: true }
        );
      }
      // we mode the files in the imported folder
      let targetDir = join(baseFolder, 'processed');
      await fs.mkdirp(targetDir);
      for (let extension of extensions) {
        fs.move(
          join(sourceDir, `${name}.${extension}`),
          join(targetDir, `${name}.${extension}`)
        );
      }
    }
  }

  massdbConnection.close();
}
