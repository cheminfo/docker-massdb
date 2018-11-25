'use strict';

let join = require('path').join;

let parseJcamp = require('../parseJcamp');

test('creation of jcamp parsing', async () => {
  let file = join(__dirname, 'data/nist.jdx');
  let result = await parseJcamp(file);
  expect(Object.keys(result)).toHaveLength(2);
  expect(result).toMatchSnapshot();
});
