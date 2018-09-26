const loaderUtils = require('loader-utils');

// 默认参数
const defaultopts = {
    remUnit: 37.5,
    remFixed: 8,
};
const opts = loaderUtils.getOptions(this);
const config = Object.assign({}, defaultopts, opts);
//匹配style到style结束
const styleRegExp = /style(.||\n)*(\d+)px(.||\n)*\}\}/
//匹配script标签
const scriptRegExp = /\<script\>(.||\n)*\<\/script\>/

module.exports = function (source) {
    let scriptGlobalRegExp = new RegExp(scriptRegExp.source, 'g');
    let styleGlobalRegExp = new RegExp(styleRegExp.source, 'g')
    if (scriptGlobalRegExp.test(source) && styleGlobalRegExp.test(source)) {
        return source.replace(styleGlobalRegExp, ($0, $1) => {
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
