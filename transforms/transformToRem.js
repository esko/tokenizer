const _ = require('lodash');
const { deepObjKeys } = require('../util');

const nonUnitScales = [
  'fontWeight',
  'lineHeight',
]

module.exports = {
  'transform/to-rem': function (tokens) {
    const transformedTokens = Object.assign({}, tokens);
    deepObjKeys(transformedTokens).map((key) => {
      const innerValue = _.get(transformedTokens, key)
      if (!nonUnitScales.some((str) => key.includes(str)) && _.isNumber(innerValue)) {
        _.set(transformedTokens, key, innerValue + 'rem')
      }
    })
    return transformedTokens
  }
}
