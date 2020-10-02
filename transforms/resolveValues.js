const _ = require('lodash');
const themeCSS = require('@theme-ui/css');
const { deepMapObj } = require('../util');

module.exports = {
  'resolve/values': function (tokens) {
    return deepMapObj(tokens, function (key, value) {
      return [key, _.isObject(value) ? themeCSS.css(value)(tokens) : value]
    });
  }
}
