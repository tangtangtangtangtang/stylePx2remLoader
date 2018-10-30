const loaderUtils = require('loader-utils');

// 默认参数
const defaultopts = {
    remUnit: 37.5,
    remFixed: 8,
};
const opts = loaderUtils.getOptions(this);
const config = Object.assign({}, defaultopts, opts);
//匹配template标签
const templateRegExpString = /<template>(.||\n)<\/template>/
//匹配render函数
const renderRegExpString = /render\(\)(\s){0,}.+?\}/
//匹配style到style结束,非贪婪模式全球匹配
const styleRegExpString = /style(\s){0,}(=){1,1}(\s){0,}\{(\s){0,}\{.+?\}(\s){0,}\}/

module.exports = function (source) {
    let preRes, templateRegExpg = new RegExp(templateRegExpString),
        renderRegExp = new RegExp(renderRegExpString),
        styleRegExp = new RegExp(styleRegExpString.source, 'g')
    //有template标签
    if (templateRegExpString.test(source)) {
        preRes = templateRegExpg.match(source)[0]
    }
    //有render方法
    // if (renderRegExpString.test(source)) {
    //     preRes = renderRegExp.match(source)[0]
    // }
    //preRes中匹配style并缩小范围
    preRes = preRes ? preRes : source
    if (styleRegExp.test(preRes)) {
        return preRes.replace(styleRegExp, ($0, $1) => {
            let PXRegExp = /\d+px/g
            let res = $0.replace(PXRegExp, ($0, $1) => {
                let val = $0.substr(0, $0.length - 2) / config.remUnit;
                val = parseFloat(val.toFixed(config.remFixed));
                return val === 0 ? val : val + 'rem';
            })
            return res
        });
    } else {
        return source;
    }
};