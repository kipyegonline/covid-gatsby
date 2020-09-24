module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
  ],
  env: {
    node: true,
    browser: true,
    jquery: true,
    es6: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 10,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    semi: [2, "always"],
    quotes: [2, "double"],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    indent: 0,
    "react/jsx-filename-extension": "off",
    "react/jsx-indent": ["off", 12],
  },
  plugins: ["react", "jsx-a11y", "prettier", "react-hooks"],
}
