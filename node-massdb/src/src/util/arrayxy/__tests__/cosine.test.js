'use strict';

const cosine = require('../cosine');

test('test cosine', async () => {
  expect(cosine({ x: [1, 2, 3], y: [1, 2, 1] }, { x: [1, 2, 3], y: [1, 2, 1] }))
    .toBe(1);
  expect(cosine({ x: [1, 2, 3], y: [1, 2, 1] }, { x: [4, 5, 6], y: [1, 2, 1] }))
    .toBe(0);
  expect(cosine({ x: [1, 2, 3], y: [1, 2, 1] }, { x: [1, 4, 3], y: [1, 2, 1] }))
    .toBeCloseTo(0.027, 2);
});
