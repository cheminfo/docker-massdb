'use strict';

let join = require('path').join;

let parseMsp = require('../parseMsp');

test('Test Msp parsing', async () => {
  let file = join(__dirname, 'data/nist.msp');
  let result = await parseMsp(file);
  expect(Object.keys(result)).toHaveLength(2);
  expect(result).toMatchSnapshot();
});
