'use strict';

const medianYFilter = require('../medianYFilter');

test('test medianYFilter', async () => {
  let test1 =
      medianYFilter({ x: [1, 2, 3, 4, 5], y: [2, 3, 4, 5, 6] }, { factor: 2 });

  expect(test1).toEqual({ x: [3, 4, 5], y: [4, 5, 6] });
});
