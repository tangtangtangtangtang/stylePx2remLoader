const loaderUtils = require('loader-utils');

// 默认参数
const defaultopts = {
    remUnit: 37.5,
    remFixed: 8,
};
const opts = loaderUtils.getOptions(this);
const config = Object.assign({}, defaultopts, opts);
//匹配style到style结束
const ZPXRegExp = /(style)(.*)((\d+)px).*\}\}/

module.exports = function (source) {
    let pxGlobalRegExp = new RegExp(ZPXRegExp.source, 'g');
    if (this.cacheable) {
        this.cacheable();
    }

    if (pxGlobalRegExp.test(source)) {
        return source.replace(pxGlobalRegExp, ($0, $1) => {
            let PXRegExp = /\d+px/
            let res = $0.replace(PXRegExp, ($0, $1) => {
                let val = $1 / config.remUnit;
                val = parseFloat(val.toFixed(config.remFixed));
                return val === 0 ? val : val + 'rem';
            })
            console.log(res)
            return res
        });
    } else {
        return source;
    }
};