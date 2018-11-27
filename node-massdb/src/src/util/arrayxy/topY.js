'use strict';

/**
 * Limit the number of peaks based on Y value
 * @param {object} xyArray
 * @param {object} [options]
 * @param {number} [options.limit=Number.MAX_VALUE]
 */
function topY(xyArray, options = {}) {
  const { limit = Number.MAX_VALUE } = options;
  let xs = xyArray.x;
  let ys = xyArray.y;

  if (xyArray.x.length <= limit) return xyArray;

  let points = [];
  for (let i = 0; i < xs.length; i++) {
    points.push({ x: xs[i], y: ys[i] });
  }

  points.sort((a, b) => b.y - a.y);
  if (limit < points.length) points.length = limit;
  points.sort((a, b) => a.x - b.x);
  return { x: points.map((p) => p.x), y: points.map((p) => p.y) };
}

module.exports = topY;
