module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": [
    "plugin:vue/essential",
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 7,
    "parser":"babel-eslint"
  },
  "plugins": [
    "vue"
  ],
  "rules": {}
}