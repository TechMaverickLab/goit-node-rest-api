module.exports = {
  transform: {
    "^.+\\.[t|j]sx?$": "<rootDir>/babelTransform.js",
  },
  transformIgnorePatterns: ["/node_modules/(?!nanoid)"],
};
