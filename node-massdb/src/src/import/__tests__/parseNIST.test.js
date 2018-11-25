'use strict';

let join = require('path').join;

let parseNIST = require('../parseNIST');

test('test NIST parsing', async () => {
  let file = join(__dirname, 'data/nist');
  let result = await parseNIST(file);
  expect(Object.keys(result)).toHaveLength(2);
  expect(result).toMatchSnapshot();
});
