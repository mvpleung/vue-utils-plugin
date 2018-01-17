/*
 * @Author: liangzc 
 * @Date: 2017-07-31 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-01-17 14:00:38
 */
let defaultUtil = require('./default'),
    uiTool = require('./ui.tool');

let Utils = function () { };

/**
 * @param {Vue} Vue 
 * @param {Object} options {utils: {replace: Function,...}}
 */
let install = function (Vue, options) {
    Vue.prototype.$utils = Object.assign(new Utils(), uiTool, defaultUtil, (options || {}).utils || {});
    Vue.mixin({
        created: () => {
            this.$utils = Vue.prototype.$utils;
        }
    });
};
module.exports = install;