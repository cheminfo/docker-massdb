'use strict';

/**
 * Groups Y based on X slots
 * x has to be sorted !
 * @param {object} xy - {x:[], y:[]}
 * @param {object} [options={}]
 * @param {object} [slotsPerUnit=1]
 * @return {object} - New object
 */
function slotX(xy, options = {}) {
  const { slotsPerUnit = 1 } = options;
  const xs = xy.x;
  const ys = xy.y;
  const result = { x: [], y: [] };
  for (let i = 0; i < xs.length; i++) {
    let slot = Math.round(xs[i] * slotsPerUnit) / slotsPerUnit;
    if (result.x[result.x.length - 1] === slot) {
      result.y[result.x.length - 1] += ys[i];
    } else {
      result.x.push(slot);
      result.y.push(ys[i]);
    }
  }
  return result;
}

module.exports = slotX;
