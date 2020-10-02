module.exports = {
  "filter/only-16px-icons": function (icons) {
    return icons.filter((icon) => icon.type === "16px");
  },
  "filter/only-24px-icons": function (icons) {
    return icons.filter((icon) => icon.type === "24px");
  },
};
