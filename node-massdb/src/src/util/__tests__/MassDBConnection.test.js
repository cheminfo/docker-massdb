'use strict';

const massdbConnection = new (require('../MassDBConnection'))();

test('connection to DB', async () => {
  let database = await massdbConnection.getDatabase();
  expect(database.databaseName).toBe('mass');
});
