const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const _ = require("lodash");

const { chainFns, requireFns, logSuccess } = require("../util");

const transforms = requireFns("transforms");
const actions = requireFns("actions");

module.exports = function (configs, configFile) {
  configs.forEach(function (config) {
    logSuccess(`Importing tokens from ${chalk.yellow(config.source)}`);
    const parentPath = path.resolve(__dirname, "../");
    const theme = require(path.resolve(parentPath, config.source));

    config.format.forEach(async function (format) {
      const transformedTheme = await chainFns(
        format.transform,
        transforms,
        theme,
        config
      );

      for (const file of format.output) {
        const formatDest = path.resolve(parentPath, format.dest, file.filename);
        const result = await chainFns(
          file.transform,
          transforms,
          transformedTheme,
          config
        );
        logSuccess(
          `Writing ${chalk.cyan(format.name)} tokens to ${chalk.yellow(
            format.dest + "/" + file.filename
          )}`
        );
        fs.outputFileSync(formatDest, result);
      }

      if (_.isArray(format.action)) {
        format.action.forEach(function (action) {
          actions[action](format, configFile);
        });
      } else if (_.isString(format.action)) {
        actions[format.action](format, configFile);
      }
    });
  });
};
