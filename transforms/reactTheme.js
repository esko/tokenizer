const stringifyObject = require('stringify-object');

module.exports = {
  'format/react': function (tokens) { return `export default ${stringifyObject(tokens)}` }
}
