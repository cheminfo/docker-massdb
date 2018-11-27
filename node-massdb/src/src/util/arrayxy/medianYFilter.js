'use strict';

const arrayMedian = require('ml-array-median');

/**
 * We filter the points if y is under x time the median
 * @param {object} xy - {x:[], y:[]}
 * @param {object} [options={}]
 * @param {number} [factor=2] - by default all peaks with Y under 2 times median are removed
 * @return {object} - New object
 */
function medianYFilter(xy, options = {}) {
  const { factor = 2 } = options;
  if (factor <= 0) return xy;
  const xs = xy.x;
  const ys = xy.y;
  let median = arrayMedian(ys);
  let result = { x: [], y: [] };
  for (let i = 0; i < ys.length; i++) {
    if (ys[i] >= median) {
      result.x.push(xs[i]);
      result.y.push(ys[i]);
    }
  }
  return result;
}

module.exports = medianYFilter;
