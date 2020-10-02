const { pascalCase } = require("../util");

module.exports = {
  "format/react-icons": function (icons) {
    return icons
      .map(
        (icon) =>
          `export { default as ${pascalCase(
            icon.componentName
          )} } from '@icons/${icon.name}.svg';`
      )
      .join("\n");
  },
};
