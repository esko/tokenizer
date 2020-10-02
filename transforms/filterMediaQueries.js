const _ = require('lodash');

module.exports = {
  'filter/media-queries': function (tokens) {
    return _.omit(tokens, 'mediaQueries')
  }
}
