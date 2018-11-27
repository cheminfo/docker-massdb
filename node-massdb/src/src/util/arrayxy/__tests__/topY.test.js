'use strict';

const topY = require('../topY');

test('test topY', async () => {
  let test1 = topY({ x: [1, 2, 3, 4, 5, 6], y: [1, 2, 3, 4, 5, 6] }, { limit: 4 });

  expect(test1).toEqual({ x: [3, 4, 5, 6], y: [3, 4, 5, 6] });
});
