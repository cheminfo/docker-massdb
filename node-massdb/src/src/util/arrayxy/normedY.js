'use strict';

const arrayNormed = require('ml-array-normed');

/**
 * Normed the Y vector
 * @param {object} xy - {x:[], y:[]}
 * @return {object} - New object
 */
function normedY(xy) {
  return { x: xy.x, y: arrayNormed(xy.y) };
}

module.exports = normedY;
