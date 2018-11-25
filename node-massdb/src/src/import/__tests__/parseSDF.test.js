'use strict';

let join = require('path').join;

let parseSDF = require('../parseSDF');

test('test SDF parsing', async () => {
  let file = join(__dirname, 'data/nist.sdf');
  let result = await parseSDF(file);
  expect(Object.keys(result)).toHaveLength(2);
  expect(result).toMatchSnapshot();
});
