module.exports = {
  root: true,

  extends: [
    'plugin:vue-libs/recommended',
    'plugin:vue/recommended'
  ],

  rules: {
    indent: ['error', 2, { MemberExpression: 'off' }],

    'no-undef': ['error'],

    'operator-linebreak': ['error', 'before'],

    'vue/match-component-file-name': [
      'error',
      {
        extensions: ['js', 'vue'],
        shouldMatchCase: false
      }
    ]
  }
}
