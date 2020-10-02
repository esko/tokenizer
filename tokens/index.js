const deepmerge = require("deepmerge");
const Color = require("color");

const hexToRGBA = (hex, alpha) => Color(hex).alpha(alpha).rgb().string();

const baseColors = {
  greys: {
    "900": "#333333",
    "800": "#4a4a4a",
    "700": "#666666",
    "600": "#8a8a8a",
    "500": "#a8a8a8",
    "400": "#bdbdbd",
    "300": "#d7d7d7",
    "200": "#e6e6e6",
    "100": "#f4f4f4",
    "50": "#fafafa",
  },
  greens: {
    "900": "#283f17",
    "800": "#3d6222",
    "700": "#487b23",
    "600": "#68bc29",
    "500": "#78dd2e",
    "400": "#a1f25a",
    "300": "#bef58f",
    "200": "#dcf8c3",
    "100": "#e9fdd8",
    "50": "#f4feeb",
  },
  blues: {
    "900": "#073c87",
    "800": "#1057ad",
    "700": "#226dc3",
    "600": "#5599d5",
    "500": "#89b8e1",
    "400": "#a8c9e6",
    "300": "#c5daec",
    "200": "#e3eef8",
    "100": "#f0f5fa",
    "50": "#f8fafc",
  },
  reds: {
    "500": "#d70000",
    "400": "#da4b4f",
  },
  yellows: {
    "500": "#ff6a10",
  },
  white: "#ffffff",
  black: "#000000",
};

const space = {
  "50": "0.25rem", // 4px
  "60": "0.3125rem", // 5px
  "100": "0.5rem", // 8px
  "125": "0.625rem", // 10px
  "150": "0.75rem", // 12px
  "175": "0.875rem", // 14px
  "190": "0.9375rem", // 15px
  "200": "1rem", // 16px
  "250": "1.25rem", // 20px
  "300": "1.5rem", // 24px
  "375": "1.875rem", // 30px
  "400": "2rem", // 32px
  "500": "2.5rem", // 40px
  "600": "3rem", // 48px
};

const fontSizes = {
  default: "1rem",
  "50": "0.75rem", // 12px
  "75": "0.8125rem", // 13px
  "100": "0.875rem", // 14px
  "150": "0.9375rem", // 15px
  "200": "1rem", // 16px
  "300": "1.125rem", // 18px
  "400": "1.25rem", // 20px
  "500": "1.75rem", // 28px
  "600": "2.375rem", // 38px
};

const lineHeights = {
  "50": "0.875rem", // 14px
  "100": "1.125rem", // 18px
  "200": "1.25rem", // 20px
  "300": "1.5rem", // 24px
  "400": "1.75rem", // 28px
  "500": "1.875rem", // 30px
  "600": "2.25rem", // 36px
  "700": "2.625rem", // 42px
};

const fontWeights = {
  "100": 100,
  "200": 200,
  "300": 300,
  "400": 400,
  "500": 500,
  "600": 600,
  "700": 700,
};

const radii = {
  default: "0.25rem",
  "100": "0.25rem", // 4px
  "200": "0.5rem", // 8px
  "300": "0.75rem", // 12px
  "400": "1rem", // 16px
  "500": "1.5rem", // 20px
  "600": "2rem", // 32px
  full: "9999rem",
  round: "50%",
};

const namedColors = {
  primary: baseColors.blues[900],
  primaryAccent: baseColors.blues[600],
  primaryBackground: baseColors.blues[50],
  secondary: baseColors.greens[600],
  secondaryAccent: baseColors.greens[500],
  secondaryBackground: baseColors.greens[100],
  bodyTextDark: baseColors.greys[900],
  bodyTextLight: baseColors.greys[700],
  muted: baseColors.greys[600],
  genericBorder: baseColors.greys[300],
  genericShadow: hexToRGBA(baseColors.black, 0.1),
  genericShadowStrong: hexToRGBA(baseColors.black, 0.5),
  genericBackground: baseColors.greys[100],
  /** 'white' and 'black' are challenging if dark mode comes in future */
  white: baseColors.white,
  black: baseColors.black,
  warning: baseColors.reds[500],
  attention: baseColors.yellows[500],
  approve: baseColors.greens[500],
  declined: baseColors.reds[500],
  draft: baseColors.blues[600],
  expired: baseColors.greys[700],
  inputNeeded: baseColors.yellows[500],
  inReview: baseColors.blues[900],
  review: baseColors.blues[900],
  invited: baseColors.blues[600],
  notApplicable: baseColors.greys[700],
  pending: baseColors.greys[700],
  published: baseColors.greens[500],
  rejected: baseColors.reds[500],
  renewal: baseColors.reds[500],
  requested: baseColors.blues[900],
  submitted: baseColors.blues[600],
  sustainabilityReview: baseColors.blues[900],
};

// 768px, 1000px, 1300px, 1440px, 1680px
const breakpoints = ["48em", "62.5em", "81.25em", "90em", "105em"];

// aliases
const mediaQueries = {
  small: `@media screen and (min-width: ${breakpoints[0]})`,
  medium: `@media screen and (min-width: ${breakpoints[1]})`,
  large: `@media screen and (min-width: ${breakpoints[2]})`,
  xlarge: `@media screen and (min-width: ${breakpoints[3]})`,
  xxlarge: `@media screen and (min-width: ${breakpoints[4]})`,
};

// input shadow
const inputShadows = {
  passive: `none`,
  highlight: `0 6px 4px -4px ${hexToRGBA(namedColors.secondary, 0.3)}`,
  errorHighlight: `0 6px 4px -4px ${hexToRGBA(namedColors.warning, 0.3)}`,
  disabledHighlight: `0 6px 4px -4px ${namedColors.genericShadow}`,
};

const dropdownShadows = {
  highlight: `0 3px 4px ${hexToRGBA(namedColors.secondary, 0.5)}`,
};

module.exports = {
  colors: deepmerge(baseColors, namedColors),
  space,
  fontSizes,
  lineHeights,
  fontWeights,
  radii,
  breakpoints,
  mediaQueries,
  inputShadows,
  dropdownShadows,
};
