// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  "plugins": [
    "postcss-flexbugs-fixes",
    "postcss-nested",
    ["postcss-preset-env", {
      "autoprefixer": {
        "flexbox": "no-2009",
      },
      "features": {
        "custom-properties": false,
      },
      "stage": 3,
    }]
  ],
};
