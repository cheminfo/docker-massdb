'use strict';

const normedY = require('./normedY');
const slotX = require('./slotX');
const topY = require('./topY');
const cosine = require('./cosine');
const medianYFilter = require('./medianYFilter');
const thresholdYFilter = require('./thresholdYFilter');
/**
 * Cosine similarity between two arrayXY
 * @param {object} xy1 - First {x:[], y:[]}
 * @param {object} xy2 - Second {x:[], y:[]}
 * @param {object} [options={}] - Options object
 * @param {number} [options.thresholdFilter = 0] - Every peak that it's bellow the main peak times this factor fill be removed (when is 0 there's no filter)
 * @param {number} [options.maxNumberPeaks = Number.MAX_VALUE] - Maximum number of peaks for each mass spectra (when is Number.MAX_VALUE there's no filter)
 * @param {number} [options.slotsPerUnit = 1] - We group the peaks in slot
 * @param {number} [options.medianFilter = 0] - Filter all objects that are below `noiseFilter` times the median of the height
 * @param {number} [options.massPower = 3] - Power applied to the mass values
 * @param {number} [options.intensityPower = 0.6] - Power applied to the abundance values
 * @return {number} - Similarity between two arrayXY
 */
function massSimilarity(xy1, xy2, options = {}) {
  const {
    thresholdFilter = 0,
    maxNumberPeaks = Number.MAX_VALUE,
    slotsPerUnit = 1,
    medianFilter = 0,
    massPower = 3,
    intensityPower = 0.6
  } = options;

  // we should first join the peaks to a slot
  if (slotsPerUnit > 0) {
    xy1 = slotX(xy1, { slotsPerUnit: 1 });
    xy2 = slotX(xy2, { slotsPerUnit: 1 });
  }
  // noise filter based on the median
  // only useful if both spectra have noise !!!
  if (medianFilter > 0) {
    xy1 = medianYFilter(xy1, { factor: medianFilter });
    xy2 = medianYFilter(xy2, { factor: medianFilter });
  }

  if (thresholdFilter > 0) {
    xy1 = thresholdYFilter(xy1, { threshold: thresholdFilter });
    xy2 = thresholdYFilter(xy2, { threshold: thresholdFilter });
  }

  if (maxNumberPeaks < Number.MAX_VALUE) {
    xy1 = topY(xy1, { limit: maxNumberPeaks });
    xy2 = topY(xy2, { limit: maxNumberPeaks });
  }

  // we prepare the data based on massPower and intensityPower
  xy1 = {
    x: xy1.x.map((value) => Math.pow(value, massPower)),
    y: xy1.y.map((value) => Math.pow(value, intensityPower))
  };

  xy2 = {
    x: xy2.x.map((value) => Math.pow(value, massPower)),
    y: xy2.y.map((value) => Math.pow(value, intensityPower))
  };

  xy1 = normedY(xy1);
  xy2 = normedY(xy2);


  return cosine(xy1, xy2);
}

module.exports = massSimilarity;
