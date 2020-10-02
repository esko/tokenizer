const cheerio = require("cheerio");
const svgStore = require("svgstore");

const svgURLAttrs = [
  "style",
  "fill",
  "stroke",
  "filter",
  "clip-path",
  "mask",
  "marker-start",
  "marker-end",
  "marker-mid",
];

const svgURLAttrsSelector = svgURLAttrs.map((x) => `[${x}^="url(#"]`).join(",");

module.exports = {
  "format/svg-stack": function (icons) {
    const stack = svgStore();

    icons.forEach(function (icon) {
      const $ = cheerio.load(icon.data, { xmlMode: true });
      const hasChildrenWithURLAttrs = $.root().find(svgURLAttrsSelector).length;

      if (hasChildrenWithURLAttrs) {
        // Replace attributes with URL functions to refer to namespaced IDs
        $.root()
          .find(svgURLAttrsSelector)
          .each((_i, el) => {
            svgURLAttrs.forEach(function (attr) {
              const elAttr = $(el).attr(attr);
              if (elAttr && elAttr.startsWith("url(#")) {
                $(el).attr(attr, (_i, val) =>
                  val.split("#").join(`#${icon.name}-`)
                );
              }
            });
            return el;
          });

        // Namespace IDs of referenced <defs>
        $.root()
          .find("defs")
          .children()
          .each((_i, el) =>
            $(el).attr("id", (_i, val) => `${icon.name}-${val}`)
          );
      }

      stack.add(icon.componentName, $.html(), {
        symbolAttrs: {
          id: icon.name,
        },
        copyAttrs: ["fill", "viewBox"],
      });
    });

    stack.element.root().find("[fill='#000']").attr("fill", "currentColor");

    return stack.toString();
  },
};
