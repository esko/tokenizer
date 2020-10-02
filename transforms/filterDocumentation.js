const _ = require('lodash');
const { deepMapObj } = require('../util');

const docKeys = ['comment', 'description', 'status'];

module.exports = {
  'filter/documentation': function (tokens) {
    return deepMapObj(tokens, function (key, value) {
      return [key, _.isObject(value) ? _.omit(value, docKeys) : value]
    })
  }
}
