const _ = require('lodash');
const themeCSS = require('@theme-ui/css');
const { deepMapObj } = require('../util');

module.exports = {
  'resolve/variants': function (tokens) {
    return deepMapObj(tokens, function (key, value) {
      if (_.isObject(value) && _.has(value, 'variant')) {
        const variant = themeCSS.get(tokens, value.variant)
        const omittedValue = _.omit(value, 'variant')
        return [key, { ...variant, ...omittedValue }]
      } else {
        return [key, value]
      }
    })
  }
}
