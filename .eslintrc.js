// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        "node":true,
        browser: true,
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        'plugin:vue/essential',
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        'standard'
    ],
    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    // add your custom rules here 0 不提示，1 警告，2 抛出错误
    rules: {
        // 生成器函数*的前后空格
        'generator-star-spacing': 'off',
        // 禁止使用debugger
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // 空格2个
        'indent': [0, 4, {'SwitchCase': 1}],
        // 引号类型 `` "" ''
        "quotes": [0, "single"],
        // if while function 后面的{必须与if在同一行，java风格。
        'brace-style': [0, '1tbs', {'allowSingleLine': true}],
        // 语句强制分号结尾
        "semi": [0, "always"],
        // 连续声明
        "one-var": 0,

    }
}
