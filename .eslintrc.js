module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    "@typescript-eslint/member-delimiter-style": ["error", {
      multiline: {
        delimiter: 'none',// 'none' or 'semi' or 'comma'
        requireLast: true,
      },
      singleline: {
        delimiter: 'comma',    // 'none' or 'comma'
        requireLast: false,
      },
    }],
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/no-this-alias": "off"
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ],
  globals: {
    // 'web3': true,
  },
  // ignorePatterns: ["**/*.js"],
}
