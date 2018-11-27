'use strict';

const thresholdYFilter = require('../thresholdYFilter');

test('test thresholdYFilter', async () => {
  let test1 = thresholdYFilter(
    { x: [1, 2, 3, 4, 5], y: [2, 3, 4, 5, 6] }, { threshold: 0.6 });

  expect(test1).toEqual({ x: [3, 4, 5], y: [4, 5, 6] });
});
