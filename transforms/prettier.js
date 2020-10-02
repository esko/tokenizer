const _prettier = require("prettier");

module.exports = {
  'format/prettier/css': function (css) { return _prettier.format(css, { parser: 'css' }) },
  'format/prettier/js': function (js) { return _prettier.format(js, { parser: 'babel' }) }
}
