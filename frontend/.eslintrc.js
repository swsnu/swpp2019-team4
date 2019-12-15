module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'airbnb', 'plugin:react/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "max-len": ["error", { "ignoreComments": true, "code" : 120}],
    "react/destructuring-assignment": ["off"],
    "prefer-promise-reject-errors": ["off"],
    "react/no-array-index-key": ["off"],
    "react/display-name": ["off"],
    "jsx-a11y/label-has-associated-control": ["off"],
    "jsx-a11y/heading-has-content": ["off"],
  }
};
