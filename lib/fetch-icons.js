const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const chalk = require("chalk");
const ora = require("ora");
const stringifyObject = require("stringify-object");
const { mergeByKey } = require("../util");

/**
 * Polyfill Array.prototype.flatMap
 */
const flatMap = require("array.prototype.flatmap");
delete Array.prototype.flatMap;
flatMap.shim();

const { figma: config } = require("../config.js");

const headers = {
  "X-FIGMA-TOKEN": process.env.FIGMA_API_TOKEN,
};

const instanceFiles = axios.create({
  baseURL: `https://api.figma.com/v1/files/${config.icons.fileKey}`,
  headers,
});

const instanceImages = axios.create({
  baseURL: `https://api.figma.com/v1/images/${config.icons.fileKey}`,
  headers,
});

const getIconFrames = async (spinner) => {
  try {
    const { data: file } = await instanceFiles.get("/");
    return file.document.children
      .find((node) => node.name === "Icons")
      .children.filter((frame) => config.icons.frameNames.includes(frame.name));
  } catch (e) {
    spinner.fail();
    console.error(chalk.red(`Error loading Figma document:\n${e.message}`));
    process.exit(1);
  }
};

const getSVGImageUrls = async (icons, spinner) => {
  try {
    const iconIds = icons.map((icon) => icon.id);
    const { data } = await instanceImages.get(
      `/?ids=${encodeURIComponent(iconIds.join(","))}&format=svg`
    );
    return Object.entries(data.images).map(([id, url]) => ({ id, url }));
  } catch (e) {
    spinner.fail();
    console.error(chalk.red(`Error resolving icon URLs:\n${e.message}`));
    process.exit(1);
  }
};

const fetchIconSVGs = async (icons, spinner) => {
  return Promise.all(
    icons.map(async function (icon) {
      const iconFilename = icon.name + ".svg";
      const iconPath = path.join(config.icons.dest, iconFilename);
      const { data } = await axios.get(icon.url);
      spinner.text = `Fetching ${chalk.green(iconFilename)}`;
      spinner.render();
      fs.outputFileSync(iconPath, data);
      return { id: icon.id, path: iconPath };
    })
  ).catch((e) => {
    spinner.fail();
    console.error(chalk.red(`Error fetching icons:\n${e.message}`));
    process.exit(1);
  });
};

const iconsTemplate = (icons) => `module.exports = ${stringifyObject(icons)}`;

module.exports = async function (config) {
  const spinner = ora();

  spinner.start("Loading Figma document");
  const iconFrames = await getIconFrames(spinner);
  spinner.succeed();

  let icons = iconFrames.flatMap((frame) => {
    const namePrefix = `icon-${frame.name}-`;
    return frame.children.map((icon) => ({
      type: frame.name,
      componentName: icon.name,
      name: namePrefix + icon.name,
      id: icon.id,
    }));
  });

  spinner.start("Resolving icon URLs");
  const iconImageURLs = await getSVGImageUrls(icons, spinner);
  spinner.succeed();

  icons = mergeByKey(icons, iconImageURLs, "id");

  spinner.start("Fetching icons");
  const iconsWithSVG = await fetchIconSVGs(icons, spinner);
  spinner.text = "Fetching icons";
  spinner.succeed();

  icons = mergeByKey(icons, iconsWithSVG, "id");

  spinner.start(`Writing tokens to ${chalk.yellow(config.icons.tokenFile)}`);
  fs.outputFileSync(
    path.resolve("./", config.icons.tokenFile),
    iconsTemplate(icons.map(({ id, url, ...rest }) => rest))
  );
  spinner.succeed();
};
