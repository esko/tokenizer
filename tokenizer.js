#!/usr/bin/env node

require("dotenv").config();

const path = require("path");
const program = require("commander");

const build = require("./lib/build");
const fetchIcons = require("./lib/fetch-icons");

program
  .version(require("./package.json").version)
  .requiredOption("-c, --config <file>", "Path to config file");

program
  .command("build [tasks...]")
  .description("Process token source files and build specified tasks")
  .action(function (tasks) {
    const config = require(path.resolve(__dirname, program.config));
    let buildConfig = config.build;
    if (tasks.length) {
      buildConfig = buildConfig
        .map(({ format, ...rest }) => {
          const filteredTasks = format.filter((task) =>
            tasks.includes(task.name)
          );
          if (filteredTasks.length) {
            return { format: filteredTasks, ...rest };
          }
        })
        .filter(Boolean);
    }
    build(buildConfig, config);
  });

program
  .command("import <tokens...>")
  .description("Import specified tokens from Figma file")
  .action(function (tokens) {
    let { figma: config } = require(path.resolve(__dirname, program.config));
    tokens.forEach(function (token) {
      switch (token) {
        case "icons":
          fetchIcons(config);
          break;
        default:
          console.error(`error: invalid argument '${tokens.join(" ")}'`);
          break;
      }
    });
  });

program.parse(process.argv);
//fetchIcons(config.figma);
//build(config.build);
