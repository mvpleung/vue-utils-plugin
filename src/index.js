/*
 * @Author: liangzc 
 * @Date: 2017-07-31 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-01 15:00:46
 */
let $utils;

let init = function (Vue, options) {
  $utils = Object.assign({}, require('./ui.tool'), require('./default'), (options || {}).utils || {}); //添加vm实例验证属性
  Vue.$utils = $utils; //添加vm实例验证属性
};
/**
 * @param {Vue} Vue 
 * @param {Object} options {utils: {replace: Function,...}}
 */
let install = function (Vue, options) {
  init(Vue, options);
  Vue.mixin({
    created: function () {
      this.$utils = $utils;
    }
  })
};
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}
module.exports = install;