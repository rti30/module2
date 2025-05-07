/* module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "no-console": "error",
    "import/prefer-default-export": "off",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/strict-boolean-expressions": "error",
  },
}; */

module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "no-empty-function": "off",
    "no-empty-pattern": "off",
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        useTabs: true,
        semi: true,
        trailingComma: "all",
        bracketSpacing: true,
        printWidth: 100,
        endOfLine: "auto",
      },
    ],
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/no-empty-function": ["off"],
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/ban-types": "off",
  },
};
