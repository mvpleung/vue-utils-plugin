/*
 * @Author: liangzc 
 * @Date: 2017-07-31 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-11 11:03:57
 */
/**
 * @param {Vue} Vue 
 * @param {Object} options {utils: {replace: Function,...}}
 */
let install = function (Vue, options) {
  if (install.installed) return;
  Vue.$utils = Vue.prototype.$utils = Object.assign({}, require('./ui.tool'), require('./default'), (options || {}).utils || {}); //添加vm实例验证属性
};
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}
module.exports = install;