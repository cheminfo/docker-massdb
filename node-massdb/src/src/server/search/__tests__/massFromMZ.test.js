'use strict';

var massFromMZ = require('../massFromMZ');

test('massFromMZ.js', async () => {
  await expect(massFromMZ())
    .rejects.toEqual(new Error('mz parameter must be specified'));
});
