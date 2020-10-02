const fs = require("fs");
const SVGO = require("svgo");

module.exports = {
  "transform/svgo": async function (icons) {
    svgo = new SVGO({
      plugins: [
        {
          removeDimensions: true,
        },
        {
          removeAttrs: { attrs: "(clip-rule|fill-rule)" },
        },
      ],
    });
    const optimizedIcons = await Promise.all(
      icons.map(async (icon) => {
        const file = fs.readFileSync(icon.path).toString();
        const { data } = await svgo.optimize(file);
        icon.data = data;
        return icon;
      })
    );
    return optimizedIcons;
  },
};
