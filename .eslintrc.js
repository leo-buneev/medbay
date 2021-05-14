module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: ['plugin:tyrecheck/recommended'],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': [process.env.NODE_ENV === 'production' ? 'error' : 'off', { allow: ['warn', 'error'] }],
  },
}
