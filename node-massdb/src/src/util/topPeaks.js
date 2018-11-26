'use strict';

function topPeaks(xyArray, options = {}) {
  const { limit = 20 } = options;
  let xs = xyArray.x;
  let ys = xyArray.y;

  if (xyArray.x.length <= limit) return xyArray;

  let points = [];
  for (let i = 0; i < xs.length; i++) {
    points.push({ x: xs[i], y: ys[i] });
  }

  points.sort((a, b) => b.y - a.y);
  points.length = limit;
  points.sort((a, b) => a.x - b.x);
  return {
    x: points.map((p) => p.x),
    y: points.map((p) => p.y)
  };
}

module.exports = topPeaks;
