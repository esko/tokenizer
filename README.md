# Tokenizer

A design token build tool that imports tokens from Figma, processes, transforms and exports them to different formats.

## Quick Start

Generate a Figma API token and add it to `.env` dotfile:

```
FIGMA_API_TOKEN=xxxxx-xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Import icons from Figma
```
npm run import:icons
```
Icons are imported as SVGs into `assets/icons` and a manifest file is generated into `tokens/icons.js`

### Build all design tokens
```
npm run build
```
This runs all the tasks that are defined in `config.js` under `build` configuration key.

Output files are written into `build/` directory by default..

## CLI
The build tool can also be used from shell by running the `tokenizer.js` script in project root:
```
▶ ./tokenizer.js
Usage: tokenizer [options] [command]

Options:
  -V, --version        output the version number
  -c, --config <file>  Path to config file
  -h, --help           display help for command

Commands:
  build [tasks...]     Process token source files and build specified tasks
  import <tokens...>   Import specified tokens from Figma file
  help [command]       display help for command
```
Path to config file is a mandatory option. The default config file is `config.js`.
```
./tokenizer.js -c config.js ...
```

### Run all build tasks
```
./tokenizer.js -c config.js build
```
### Run specific build tasks
Specific task names can be defined after the `build` command.
```
./tokenizer.js -c config.js build sass react
```
### Import icons from Figma
```
./tokenizer.js -c config.js import icons
```
Currently only icon importing is supported. Other import tasks will be added in a future version.

## Config
Build configuration is specified in a configuration file:
```
const config = {
  figma: {
    icons: {
      tokenFile: "tokens/icons.js",
      dest: "assets/icons",
      fileKey: "DIF0RUAoKz0qKQBXsmdnBq",
      frameNames: ["16px", "24px", "128px"],
    },
  },
  build: [
    {
      source: "tokens/index.js",
      process: [
        {
          name: "sass",
          dest: "build/sass",
          transform: [
            "resolve/values",
            "transform/to-rem",
          ],
          output: [
            {
              transform: ["format/sass-variables", "format/prettier/css"],
              filename: "_variables.scss",
            },
          ],
        },
        {
          name: "react",
          dest: "build/react",
          transform: ["transform/to-rem"],
          output: [
            {
              transform: ["format/react"],
              filename: "theme.js",
            },
          ],
        },
      ],
    },
  ],
};

module.exports = config;
```
The file contains two keys, `figma` and `build` which contain settings for Figma importing and build process.
### Figma configuration options
| Key        | Type   | Description                              |
|------------|--------|------------------------------------------|
| tokenFile  | string | Token source file to write               |
| dest       | string | Destination directory for assets         |
| fileKey    | string | Node ID of the Figma file to import from |
| frameNames | Array  | List of Figma frame IDs to process       |
### Build configuration options
| Key | Type | Description |
|---|---|---|
| source | string | Token source file to process |
| format | Array | A set of transforms to generate one or more output file, e\.g\. SASS, React |
| name | string | Process identifier |
| dest | string | Destination directory |
| transform | Array or string | Transforms take the source file as an input and process it\. Multiple transforms can be chained together, so that their output as passed on as the input of the next transform in the array\. Transforms can be defined both for format and for individual outputs |
| output | Array | Array of output files to be generated from the format, e\.g\. \_variables\.scss, \_mixins\.scss |
| filename | string | Output filename |


## How to
### Create or modify design tokens
Importing tokens other than icons from Figma is not implemented yet, so all token definitions are made in `tokens/index.js`. The tokens  follows the [Theme UI theme specification](https://theme-ui.com/theme-spec) to ensure portability and interoperability.
### Create your own transforms
Transforms are functions that take the format source or the previous transform as parameter and return the transformed value. Transforms are defined in `transforms/` directory, and export an object with the name of the transform as key and the transform function as value.
```
module.exports = {
  "transform/dummy": function (tokens) {
    return tokens
  }
}
```
Transforms can be asynchronous and return a Promise, it will be resolved by the build system.
