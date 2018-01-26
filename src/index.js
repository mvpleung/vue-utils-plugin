/*
 * @Author: liangzc 
 * @Date: 2017-07-31 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-01-26 10:00:17
 */
let configOptions;

let init = function () {
    this.$utils = Object.assign({}, require('./ui.tool'), require('./default'), (configOptions || {}).utils || {}); //添加vm实例验证属性
};
/**
 * @param {Vue} Vue 
 * @param {Object} options {utils: {replace: Function,...}}
 */
let install = function (Vue, options) {
    configOptions = options;
    Vue.mixin({
        created: init
    });
};
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(verify);
}
module.exports = install;