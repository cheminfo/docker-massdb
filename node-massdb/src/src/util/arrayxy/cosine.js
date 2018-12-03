'use strict';

/**
 * Cosine similarity between two arrayXY
 * @param {object} xy1 - First {x:[], y:[]}
 * @param {object} xy2 - Second {x:[], y:[]}
 * @return {number} - Similarity between two arrayXY
 */
function cosine(xy1, xy2) {
  let index1 = 0;
  let index2 = 0;

  let product = 0;
  let norm1 = 0;
  let norm2 = 0;

  while (index1 < xy1.x.length || index2 < xy2.x.length) {
    let w1 = xy1.y[index1];
    let w2 = xy2.y[index2];
    if (index2 === xy2.x.length || xy1.x[index1] < xy2.x[index2]) {
      norm1 += w1 * w1;
      index1++;
    } else if (index1 === xy1.x.length || xy2.x[index2] < xy1.x[index1]) {
      norm2 += w2 * w2;
      index2++;
    } else {
      product += w1 * w2;
      norm1 += w1 * w1;
      norm2 += w2 * w2;
      index1++;
      index2++;
    }
  }

  var norm1Norm2 = norm1 * norm2;
  if (norm1Norm2 === 0) {
    return 0;
  } else {
    return (product * product) / norm1Norm2;
  }
}

module.exports = cosine;
