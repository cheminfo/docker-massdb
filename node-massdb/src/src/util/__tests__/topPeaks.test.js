'use strict';

const topPeaks = require('../topPeaks');

test('test topPeaks', async () => {
  let test1 = topPeaks(
    {
      x: [1, 2, 3, 4, 5, 6],
      y: [1, 2, 3, 4, 5, 6]
    },
    { limit: 4 }
  );

  expect(test1).toEqual({
    x: [3, 4, 5, 6],
    y: [3, 4, 5, 6]
  });
});
