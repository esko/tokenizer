const pluralize = require("pluralize");
const _ = require("lodash");

module.exports = {
  "format/sass-variables": function (tokens) {
    const customProperties = [];

    const generateProperties = (object, previousKey) => {
      Object.entries(object).forEach(([key, value]) => {
        let formattedKey = _.kebabCase(pluralize(key, 1));
        //.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

        const newKey = previousKey
          ? previousKey + "-" + formattedKey
          : formattedKey;

        if (Array.isArray(value)) {
          value.forEach((item, i) => {
            customProperties.push(`$${newKey}-${i}: ${item};`);
          });
        } else if (Object(value) === value) {
          generateProperties(value, newKey);
        } else {
          customProperties.push(`$${newKey}: ${value};`);
        }
      });
    };
    generateProperties(tokens);

    return customProperties.join("");
  },
};
