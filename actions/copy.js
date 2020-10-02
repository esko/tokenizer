const fs = require("fs-extra");
const path = require("path");
const findUp = require("find-up");
const chalk = require("chalk");

const { logSuccess } = require("../util");

const gitRoot = path.resolve(findUp.sync(".git", { type: "directory" }), "..");

const reactRoot = "web/modules/custom/ssp_reactjs/js";
const themeRoot = "web/themes/custom/neste_ssp/";

const copyFiles = function (source, dest) {
  try {
    fs.copySync(source, dest);
    logSuccess(
      `Copying ${chalk.green(source.replace(gitRoot, ""))} to ${chalk.green(
        dest.replace(gitRoot, "")
      )}`
    );
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  "copy/react-icons": function (format, config) {
    format.output.forEach(function (files) {
      copyFiles(
        path.resolve(format.dest + "/" + files.filename),
        path.join(gitRoot, reactRoot, "src/assets/icons", files.filename)
      );
    });
    fs.readdirSync(path.resolve(config.figma.icons.dest)).map((file) => {
      copyFiles(
        path.join(config.figma.icons.dest, file),
        path.join(gitRoot, reactRoot, "icons/dist", file)
      );
    });
  },
  "copy/svg-sprite": function (format) {
    format.output.map(function (files) {
      copyFiles(
        path.resolve(format.dest + "/" + files.filename),
        path.join(gitRoot, themeRoot, "assets/icons", files.filename)
      );
    });
  },
};
