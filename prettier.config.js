/** @implements {import("prettier").Config} */
const config = {
  attributeGroups: ["$DEFAULT"],
  attributeSort: "ASC",
  plugins: ["prettier-plugin-go-template", "prettier-plugin-organize-attributes"],
  printWidth: 140,
};

module.exports = config;
