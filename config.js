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
      format: [
        {
          name: "sass",
          dest: "build/sass",
          transform: [
            "resolve/variants",
            "resolve/values",
            "filter/documentation",
            "filter/media-queries",
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
          transform: ["filter/documentation", "transform/to-rem"],
          output: [
            {
              transform: ["format/react"],
              filename: "theme.js",
            },
          ],
        },
      ],
    },
    {
      source: "tokens/icons.js",
      format: [
        {
          name: "icons-react",
          dest: "build/react/icons",
          output: [
            {
              transform: ["filter/only-16px-icons", "format/react-icons"],
              filename: "16.js",
            },
            {
              transform: ["filter/only-24px-icons", "format/react-icons"],
              filename: "24.js",
            },
          ],
          action: "copy/react-icons",
        },
        {
          name: "icons-svg-sprite",
          dest: "build/icons",
          output: [
            {
              transform: ["transform/svgo", "format/svg-stack"],
              filename: "sprite.svg",
            },
          ],
          action: "copy/svg-sprite",
        },
      ],
    },
  ],
};

module.exports = config;
