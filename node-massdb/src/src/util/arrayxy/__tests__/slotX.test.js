'use strict';

const slotX = require('../slotX');

test('test slotX', () => {
  expect(slotX({ x: [1, 1.1, 2, 3, 3.1], y: [1, 2, 3, 4, 5] }, {
    slotsPerUnit: 1
  })).toEqual({ x: [1, 2, 3], y: [3, 3, 9] });
  expect(slotX({ x: [0.4, 0.9, 1.1], y: [1, 2, 3] }, {
    slotsPerUnit: 2
  })).toEqual({ x: [0.5, 1], y: [1, 5] });
});
