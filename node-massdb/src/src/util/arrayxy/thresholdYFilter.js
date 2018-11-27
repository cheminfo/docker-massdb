'use strict';

const maxY = require('array-xy-max-y');

/**
 * We filter the points if y is under a percent of the max Y
 * @param {object} xy - {x:[], y:[]}
 * @param {object} [options={}]
 * @param {number} [threshold=0.01] - by default peaks have to be at least 1%
 * @return {object} - New object
 */
function thresholdYFilter(xy, options = {}) {
  const { threshold } = options;
  let minimalY = maxY(xy).value * threshold;

  const xs = xy.x;
  const ys = xy.y;
  let result = { x: [], y: [] };
  for (let i = 0; i < ys.length; i++) {
    if (ys[i] >= minimalY) {
      result.x.push(xs[i]);
      result.y.push(ys[i]);
    }
  }
  return result;
}

module.exports = thresholdYFilter;
