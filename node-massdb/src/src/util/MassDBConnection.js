'use strict';

const delay = require('delay');
const MongoClient = require('mongodb').MongoClient;

const config = require('./config');

function MassDBConnection() {}

MassDBConnection.prototype.close = function close() {
  if (this.connection) return this.connection.close();
  return undefined;
};

MassDBConnection.prototype.getMassCollection = async function getDatabase() {
  let collection = (await this.getDatabase()).collection('mass');
  await collection.createIndex({ 'general.em': 1 });
  return collection;
};

MassDBConnection.prototype.getDatabase = async function getDatabase() {
  while (true) {
    try {
      await this.init();
      break;
    } catch (e) {
      console.log('Connection to mongo failed, waiting 5s');
      await delay(5000);
    }
  }
  return this.connection.db(config.databaseName);
};

MassDBConnection.prototype.getCollection = async function getCollection(
  collectionName
) {
  return (await this.getDatabase()).collection(collectionName);
};

MassDBConnection.prototype.init = async function init() {
  if (this.connection) return;

  this.connection = await MongoClient.connect(
    config.mongodbUrl,
    {
      autoReconnect: true,
      useNewUrlParser: true,
      keepAlive: true,
      connectTimeoutMS: 6 * 60 * 60 * 1000,
      socketTimeoutMS: 6 * 60 * 60 * 1000
    }
  );
};

module.exports = MassDBConnection;
