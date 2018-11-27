'use strict';

const massSimilarity = require('../massSimilarity');

test('test massSimilarity', async () => {
  expect(massSimilarity(
    { x: [1, 2, 3], y: [1, 2, 1] }, { x: [1, 2, 3], y: [1, 2, 1] }))
    .toBe(1);

  expect(massSimilarity(
    { x: [1.1, 1.9, 3], y: [1, 2, 1] }, { x: [1, 2, 3], y: [1, 2, 1] }))
    .toBe(1);

  expect(massSimilarity(
    { x: [1, 2, 3, 4], y: [1, 2, 1, 0.01] },
    { x: [1, 2, 3], y: [1, 2, 1] }, { thresholdFilter: 0.1 }))
    .toBe(1);

  expect(massSimilarity(
    { x: [1, 2, 3, 4, 5], y: [1, 2, 1, 0.01, 0.05] },
    { x: [1, 2, 3, 4, 5], y: [1, 2, 1, 0.1, 0.4] }, { medianFilter: 1 }))
    .toBe(1);

  expect(massSimilarity(
    { x: [1, 2, 3, 4, 5], y: [1, 2, 0.3, 0.01, 0.05] },
    { x: [1, 2, 3, 4, 5], y: [1, 2, 0.2, 0.1, 0.4] },
    { maxNumberPeaks: 2 }))
    .toBe(1);
});
