let Utils = (function() {
  /**########  属性工具 start ########*/
  /**
   * 日期格式化
   * @param {String} fmt 日期格式
   */
  Date.prototype.Format = function(fmt = 'yyyy-MM-dd') {
    //author: meizz
    let o = {
      'M+': this.getMonth() + 1, //月份
      'd+': this.getDate(), //日
      'h+': this.getHours(), //小时
      'm+': this.getMinutes(), //分
      's+': this.getSeconds(), //秒
      'q+': Math.floor((this.getMonth() + 3) / 3), //季度
      S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        String(this.getFullYear()).substr(4 - RegExp.$1.length)
      );
    for (let k in o)
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ?
            o[k] :
            ('00' + o[k]).substr(String(o[k]).length)
        );
    return fmt;
  };

  /**
   * 以某个字符开头
   * @param {Object} str 字符
   * @param {Object} ignoreCase 忽略大小写
   *
   * @returns {Boolean}
   */
  String.prototype.startWith = function(str, ignoreCase) {
    if (isEmpty(str) || this.length === 0 || str.length > this.length) {
      return false;
    }
    if (
      ignoreCase &&
        this.toUpperCase().substr(0, str.length) === str.toUpperCase() ||
      !ignoreCase && this.substr(0, str.length) === str
    ) {
      return true;
    }
    return false;
  };

  /**
   * 以某个字符结尾
   * @param {Object} str 字符
   * @param {Object} ignoreCase 忽略大小写
   *
   * @returns {Boolean}
   */
  String.prototype.endWith = function(str, ignoreCase) {
    if (isEmpty(str) || this.length === 0 || str.length > this.length) {
      return false;
    }
    if (
      ignoreCase &&
        this.toUpperCase().substring(this.length - str.length) ===
          str.toUpperCase() ||
      !ignoreCase && this.substring(this.length - str.length) === str
    ) {
      return true;
    }
    return false;
  };

  /**
   * 占位符格式化
   */
  String.prototype.format = function(argus) {
    let arguArray = argus && Array.isArray(argus) ? argus : arguments,
      s = this;
    if (arguArray.length === 0) return this;
    for (let i = 0; i < arguArray.length; i++)
      s = s.replace(new RegExp('\\{' + i + '\\}', 'g'), arguArray[i]);
    return s;
  };

  Array.prototype.remove = function(val) {
    let index = this.indexOf(val);
    if (index > -1) {
      this.splice(index, 1);
    }
  };
  Array.prototype.removeIndex = function(index) {
    if (index > -1) {
      this.splice(index, 1);
    }
  };
  /**########  属性工具 end ########*/

  /**
   * 是否为空
   * @param  {*}  value
   * @return {Boolean}
   */
  function isEmpty(value) {
    return (
      !value ||
      value === undefined ||
      trim(value) === '' ||
      trim(value) === 'null' ||
      value === '' ||
      value.length === 0
    );
  }

  /**
   * 是否为空数组
   * @param  {*}  value
   * @return {Boolean}
   */
  function isEmptyArray(value) {
    return Array.isArray(value) ? value.length <= 0 : true;
  }

  /**
   * 去除空格
   * @param  {String}  str 字符串
   * @return {String}
   */
  function trim(str) {
    return str && !(str instanceof Object) ?
      String(str).replace(/(^\s+)|(\s+$)/g, '') :
      str;
  }

  /**
   * check value type
   * @param  {String}  type 类型
   * @param  {*}  val  校验的值
   * @return {Boolean}
   */
  function is(type, val) {
    return Object.prototype.toString.call(val) === '[object ' + type + ']';
  }

  /**
   * 获取Url参数
   * @param  {String}  name 参数名
   * @param {String} url Url地址非必填（默认取当前window.location）
   * @return {String}
   */
  function getUrlParams(name, url) {
    let reg = new RegExp(name + '=([^&]*)(&|$)');
    let r = (url || window.location.search.substr(1)).match(reg);
    if (r !== null) return decodeURIComponent(r[1]);
    r = (url ?
      url.split('#')[1] || window.location.hash :
      window.location.hash
    ).match(reg);
    if (r !== null) return decodeURIComponent(r[1]);
    return null;
  }

  /**
   * 获取Url全部参数
   * @param {String} url 地址
   * @returns {Object}
   */
  function getUrlVars(url) {
    let vars = {},
      hash;
    let getParam = url => {
      let hashes = (url || window.location.search)
        .slice((url || window.location.search).indexOf('?') + 1)
        .split('&');
      for (let i = 0; i < hashes.length; i++) {
        if (!isEmpty(hashes[i])) {
          hash = hashes[i].split('=');
          hash[1] &&
            (vars[hash[0]] = hash[1].endWith('/') ?
              hash[1].slice(0, hash[1].length - 1) :
              hash[1]);
        }
      }
    };
    getParam(url);
    getParam(url ? url.split('#')[1] || location.hash : location.hash);
    return vars;
  }

  /**
   * 移除URL中的参数
   * @param {String} url url
   * @param {String} name 参数key
   */
  function removeUrlParam(url, name) {
    if (!url) return url;
    var querys = url.split('?');
    if (querys[1] && querys[1].indexOf(name) > -1) {
      var obj = {};
      var arr = querys[1].split('&');
      for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].split('=');
        obj[arr[i][0]] = arr[i][1];
      }
      delete obj[name];
      let queryStr = JSON.stringify(obj)
        .replace(/[\"\{\}]/g, '')
        .replace(/\:/g, '=')
        .replace(/\,/g, '&');
      return querys[0] + (!isEmpty(queryStr) ? '?' + queryStr : '');
    }
    return url;
  }

  /**
   * 设置UrlParams
   * @param {Object} data 参数对象
   * @param {String} url 非必填
   * @returns {String} 填充参数后的URL
   */
  function setUrlParams(data, url) {
    if (!data || isEmptyObject(data)) return;
    url = url ? decodeURIComponent(url) : url;
    let urlArray = (url || window.location.href).split('#'),
      newUrl = urlArray[1] || urlArray[0],
      params = [],
      split = (url || window.location.href).indexOf('#') >= 0 ? '#' : '';
    forEach(data, (value, key) => {
      newUrl = removeUrlParam(newUrl, key);
      params.push(`${key}=${value}`);
    });
    newUrl = newUrl || urlArray[1] || '';
    return (
      (urlArray[1] ? urlArray[0] : '') +
      split +
      newUrl +
      (newUrl.indexOf('?') !== -1 ?
        `&${params.join('&')}` :
        `?${params.join('&')}`)
    );
  }

  /**
   * 存入session数据
   * @param {String} key 键名
   * @param {*} value 要存入的数据
   * @param {Boolean} needCipher 是否加密存储
   */
  function setSessionItem(key, value, needCipher) {
    let str = value instanceof Object ? JSON.stringify(value) : value;
    sessionStorage[key] = str && needCipher ? cipher(str) : str;
  }

  /**
   * 获取session数据
   * @param {String} key 键名
   * @param {Boolean} needDecipher 是否需要解密获取数据
   * @return {*}
   */
  function getSessionItem(key, needDecipher) {
    try {
      return JSON.parse(
        sessionStorage[key] && needDecipher ?
          deCipher(sessionStorage[key]) :
          sessionStorage[key]
      );
    } catch (e) {
      console.warn('SessionStorage.Parse:', '[key:', key, ']', e.message);
      return sessionStorage[key];
    }
  }

  /**
   * 移除Session
   * @param {String} key 键名
   */
  function removeSessionItem(key) {
    sessionStorage.removeItem(key);
  }

  /**
   * 存入local数据
   * @param {String} key 键名
   * @param {*} value 要存入的数据
   * @param {Object} option 配置项
   *
   * @param {option} exp 过期时间，单位：秒
   * @param {option} needCipher 是否加密存储
   */
  function setLocalItem(key, value, option) {
    try {
      if (typeof option === 'boolean') {
        option = { needCipher: option };
      }
      let localStr;
      if (option && typeof option.exp === 'number') {
        localStr = JSON.stringify({
          data: value,
          time: Date.now(),
          exp: option.exp
        });
      } else {
        localStr = value instanceof Object ? JSON.stringify(value) : value;
      }
      localStorage[key] =
        localStr && option && option.needCipher ? cipher(localStr) : localStr;
      return true;
    } catch (e) {
      alert(
        '您的web浏览器不支持本地存储设置。在Safari中，最常见的原因是使用“私人浏览模式”或“无痕浏览”。有些设置可能无法保存或某些功能可能无法正常工作。'
      );
      return false;
    }
  }

  /**
   * 获取local数据
   * @param {String} key 键名
   * @param {option} needDecipher 是否需要解密存储的数据
   *
   * @return {*} 存在 exp : {data: value, time: 过期时间, expire: 是否过期} , 不存在 exp ： 原路返回
   */
  function getLocalItem(key, needDecipher) {
    try {
      let local = JSON.parse(
        localStorage[key] && needDecipher ?
          deCipher(localStorage[key]) :
          localStorage[key]
      );
      if (local && is('Object', local) && local.time && local.exp) {
        local.expire = new Date().getTime() - local.time > local.exp * 1000;
        if (local.expire) {
          return null;
        }
        return local.data;
      }
      return local;
    } catch (e) {
      console.warn('LocalStorage.Parse:', '[key:', key, ']', e.message);
      return localStorage[key];
    }
  }

  /**
   * 移除Local
   * @param {String} key 键名
   */
  function removeLocalItem(key) {
    localStorage.removeItem(key);
  }

  /**
   * JSON串转JSON对象
   * @param {String} jsonStr 要解析的JSON串
   * @return {*}
   */
  function evalJson(jsonStr) {
    if (isEmpty(jsonStr) || jsonStr instanceof Object) {
      return jsonStr;
    }
    let result;
    try {
      result = JSON.parse(jsonStr);
    } catch (error) {}
    if (!result) {
      result = replaceAll(jsonStr, '\\[|\\]', ''); //过滤数组
      result = result.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
      result = result.replace(
        /\s*('|"|)([\w\-]+)('|"|)\s*\:(("|')[^"\\\n\r]*("|')|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/gi,
        ']:]'
      );
      result = result.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
      result = result.replace(/\s*('|"|)([\w\-]+)('|"|)\s*/gi, ']');
      if (/^[\],:{}\s]*$/.test(result)) {
        try {
          return eval('(' + jsonStr + ')');
        } catch (e) {
          return jsonStr;
        }
      } else {
        return jsonStr;
      }
    } else {
      return result;
    }
  }

  /**
   * 全部替换
   * @param {String} value 需要替换的Value
   * @param {String} replaceStr 需要被替换的字符
   * @param {String} replaceValue 需要替换之后的字符
   * @return {String}
   */
  function replaceAll(value, replaceStr, replaceValue) {
    return isEmpty(value) ?
      value :
      value.replace(new RegExp(replaceStr, 'gm'), replaceValue);
  }

  /**
   * 变幻Date，兼容 iOS
   * @param {String} date
   */
  function flatDateStr(date) {
    if (is('String', date) && !isEmpty(date)) {
      date = date
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '')
        .replace(/(-)/g, '/');
      if (date.indexOf('.') > 0) date = date.slice(0, date.indexOf('.'));
    }
    return date;
  }

  /**
   * 格式化时间
   * @param {Number|Date} unixTime 日期或时间戳
   * @param {String} pattern 日期格式规则(如:YYYY-MM-dd)
   * @return {*}
   */
  function formatDateTime(unixTime, pattern = 'yyyy-MM-dd') {
    if (unixTime instanceof Date) {
      return unixTime.Format(pattern);
    }
    if (is('String', unixTime) && !isEmpty(unixTime)) {
      unixTime = flatDateStr(unixTime);
      if (unixTime.length === 8) {
        unixTime =
          unixTime.substring(0, 4) +
          '-' +
          unixTime.substring(4, 6) +
          '-' +
          unixTime.substring(6, 8);
      }
    }
    return !unixTime || isEmpty(unixTime) ?
      '' :
      new Date(unixTime).Format(pattern);
  }

  /**
   * 计算周岁
   * @param {Object} dateStr 日期字符串或日期对象
   * @param {Date|String|Number} today 今天
   * @return {Number}
   */
  function calcAge(dateStr, today) {
    if (isEmpty(dateStr)) return 0;
    dateStr = dateStr instanceof Date ? dateStr.Format('yyyy-MM-dd') : dateStr;
    let r = dateStr.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (isEmpty(r)) return 0;
    let birth = new Date(r[1], r[3] - 1, r[4]);
    if (
      birth.getFullYear() === r[1] &&
      birth.getMonth() + 1 === r[3] &&
      birth.getDate() === r[4]
    ) {
      today = isEmpty(today) ?
        new Date() :
        typeof today === 'object' ? today : new Date(flatDateStr(today));
      let age = today.getFullYear() - r[1];
      if (today.getMonth() > birth.getMonth()) {
        return age;
      }
      if (today.getMonth() === birth.getMonth()) {
        if (today.getDate() >= birth.getDate()) {
          return age;
        }
        return age - 1;
      }
      if (today.getMonth() < birth.getMonth()) {
        return age - 1;
      }
      today = null;
    }
    return 0;
  }

  /**
   * 步进年份，返回 yyyy-MM-dd
   * @param {Data|String} date 日期对象或日期字符串
   * @param {Number} year 负数减一年，正数加一年
   * @param {Boolean} format 是否格式化为字符串，默认为 true
   *
   * @returns {String}
   */
  function stepYear(date, year, format = true) {
    if (is('Boolean', year)) {
      format = year;
      year = 0;
    }
    if (is('Number', date)) {
      year = date;
      date = null;
    }
    date = flatDateStr(date);
    let d = is('Date', date) ? date : new Date(date || Date.now());
    let nextYear = d.getFullYear() + year;
    let month = d.getMonth() + 1;
    let day = d.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    let dateStr = nextYear + '-' + month + '-' + day;
    return format ? dateStr : new Date(flatDateStr(dateStr));
  }

  /**
   * 步进月份，返回 yyyy-MM-dd
   * @param {*} date 日期
   * @param {Number} month 月份，正：往后 负：往前
   * @param {String} pattern 日期格式，默认未 yyyy-MM-dd
   * @param {Boolean} format 是否格式化为字符串，默认为 true
   */
  function stepMonth(date, month, pattern = 'yyyy-MM-dd', format = true) {
    if (is('Boolean', pattern)) {
      format = pattern;
      pattern = 'yyyy-MM-dd';
    }
    if (is('String', month)) {
      pattern = month;
      month = null;
    }
    if (is('Boolean', month)) {
      format = month;
      month = null;
    }
    if (is('Number', date)) {
      month = date;
      date = null;
    }
    date = flatDateStr(date);
    let d = is('Date', date) ? date : new Date(date || Date.now());
    d.setMonth(d.getMonth() + month);
    return format ? d.Format(pattern) : d;
  }

  /**
   * 步进天数，返回 yyyy-MM-dd
   * @param {*} date 日期
   * @param {Number} days 天数，正：往后 负：往前
   * @param {String} pattern 日期格式，默认未 yyyy-MM-dd
   * @param {Boolean} format 是否格式化为字符串，默认为 true
   */
  function stepDays(date, days, pattern = 'yyyy-MM-dd', format = true) {
    if (is('Boolean', pattern)) {
      format = pattern;
      pattern = 'yyyy-MM-dd';
    }
    if (is('String', days)) {
      pattern = days;
      days = null;
    }
    if (is('Boolean', days)) {
      format = days;
      days = null;
    }
    if (is('Number', date)) {
      days = date;
      date = null;
    }
    date = flatDateStr(date);
    let d = is('Date', date) ? date : new Date(date || Date.now());
    d.setDate(d.getDate() + days);
    return format ? d.Format(pattern) : d;
  }

  /**
   * 比较日期大小
   * @param {Object} date1 日期1
   * @param {Object} date2 日期2
   *
   * @return {Boolean} true:date1>date2 false:date2>date1
   */
  function compareDate(date1, date2) {
    if (!date1 || !date2) {
      return false;
    }
    let dateTime1 =
      date1 instanceof Date ?
        date1.getTime() :
        /^(\+|-)?\d+($|\.\d+$)/.test(date1) ?
          date1 :
          new Date(flatDateStr(date1)).getTime();
    let dateTime2 =
      date2 instanceof Date ?
        date2.getTime() :
        /^(\+|-)?\d+($|\.\d+$)/.test(date2) ?
          date2 :
          new Date(flatDateStr(date2)).getTime();
    return dateTime1 > dateTime2;
  }

  /**
   * 计算两个日期相差的天数、小时、分钟、秒（第一个参数为减数）
   * @param {Object} sDate1 日期1
   * @param {Object} sDate2 日期2
   * @param {String} unit 单位，默认 day: 天, 取值范围[ 'day', 'hour', 'minute', 'second']
   *
   * @returns {Number}
   */
  function dateDiff(date1, date2, unit = 'day') {
    if (!date1 || !date2) {
      return 0;
    }
    let dateTime1 =
      date1 instanceof Date ?
        date1.getTime() :
        /^(\+|-)?\d+($|\.\d+$)/.test(date1) ?
          date1 :
          new Date(flatDateStr(date1)).getTime();
    let dateTime2 =
      date2 instanceof Date ?
        date2.getTime() :
        /^(\+|-)?\d+($|\.\d+$)/.test(date2) ?
          date2 :
          new Date(flatDateStr(date2)).getTime();
    let second = (dateTime1 - dateTime2) / 1000;
    if (unit === 'second') {
      return second;
    }
    if (unit === 'minute') {
      return parseInt(second / 60);
    }
    if (unit === 'hour') {
      return parseInt(second / 60 / 60);
    }
    return parseInt(second / 60 / 60 / 24); //把相差的毫秒数转换为天数
  }

  /**
   * 生成36位随机码（java uuid）
   * @return {String}
   */
  function uuid() {
    let s = [];
    let hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';

    let uuid = s.join('');
    return uuid;
  }

  /**
   * 动态匹配参数
   * @param {String} prefix 匹配规则（如：/productCal/:id/:code）
   * @param {String} path 匹配路径，非必填，默认取当前Hash路径(如:/productCal/123/456)
   * @return {Object} 如:{id:'123',code:'456'}
   */
  function pathToRegexp(prefix, path) {
    if (typeof require === 'undefined') {
      console.warn('如需使用 pathToRegexp ，请使用模块化加载 Utils 模块 ！');
      return null;
    }
    Utils.regexp = Utils.regexp || require('./path-to-regexp.min');
    let keys = [],
      reg = Utils.regexp(prefix, keys),
      indexof = window.location.hash.indexOf('?'),
      execArray =
        reg.exec(
          path ||
            window.location.hash.substring(
              1,
              indexof === -1 ? window.location.hash.length : indexof
            )
        ) || [],
      params = {};
    keys.forEach((item, index) => {
      params[item.name] = execArray[index + 1];
    });
    return params;
  }

  /**
   * 获取属性值
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   */
  function get(object, path, defaultValue) {
    if (typeof require === 'undefined') {
      console.warn('get 方法依赖模块化加载环境 ！');
      return null;
    }
    try {
      Utils.lodash = Utils.lodash || require('lodash');
      return Utils.lodash.get(object, path, defaultValue);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * 获取Object属性（不存在则创建）
   * @param {String} path 取值路径
   * @param {Boolean} create 不存在是否创建
   * @param {Function} cb 回调
   * @returns {Object} 返回属性
   */
  function attribute(obj, path, create, cb) {
    if (typeof create === 'function') {
      cb = create;
      create = null;
    }
    const arr = path.split('.'),
      length = arr.length;
    arr.forEach((atr, i) => {
      let _obj = obj[atr];
      if (i < length - 1 && _obj === undefined) {
        create && (obj[atr] = {});
        cb && cb(atr, obj[atr]);
        obj = obj[atr];
        return '';
      }
      obj = _obj;
    });
    return obj;
  }

  /**
   * 转换驼峰命名法
   * @param {Object} value 需要转换的字符串
   * @param {Boolean} reverse 反转（互转）
   */
  function camelCase(value, reverse) {
    if (isEmpty(value)) return value;
    if (reverse) {
      return value.replace(/([A-Z])/g, '_$1').toLowerCase();
    }
    let result = value
      .replace(/\d/gm, '')
      .replace(/[-|_](\w)/g, function($0, $1) {
        return $1.toUpperCase();
      })
      .replace(/[-|_]/gm, '');
    return isEmpty(result) ?
      value :
      result.substring(0, 1).toLowerCase() + result.substring(1);
  }

  /**
   * 延迟触发
   * @param {*} el dom节点
   * @param {Object} options
   * @param {Function} options.keyup
   * @param {Function} options.keydown
   * @param {Function} options.keypress
   */
  function koala(el, options) {
    if (isEmpty(el)) return;
    let defaults = {
      delay: 200
    };

    let events = ['keydown', 'keypress', 'keyup'];
    let opts = Object.assign(defaults, defaults, options);

    let _koala = function(el, func) {
      return function(event) {
        let $koala = el.getAttribute('koala-timer');
        if (typeof $koala !== 'undefined' && $koala !== null) {
          let now = new Date().getTime();
          if (now - $koala.time < opts.delay) {
            clearTimeout($koala.timer);
          }
        }
        let timer = setTimeout(() => {
          func.call(this, event);
          el.removeAttribute('koala-timer');
        }, opts.delay);
        el.setAttribute('koala-timer', {
          timer: timer,
          time: new Date().getTime()
        });
      };
    };

    el = Array.isArray(el) ? el : [el];
    el.forEach(that => {
      events.forEach(e => {
        if (opts[e] && typeof opts[e] === 'function') {
          if (that !== null) {
            let _el = that.$refs ? that.$refs.input : that;
            _el.addEventListener(e, _koala(_el, opts[e]));
          }
        }
      });
    });
  }

  /**
   * 是否为空对象
   * @param {Object} obj
   */
  function isEmptyObject(obj) {
    let name;
    for (name in obj) {
      return false;
    }
    return true;
  }

  /**
   * 自定义forEach函数，支持 return false
   * @param {Object|Array} arr 需要循环的对象
   * @param {Function} func 回调函数
   */
  function forEach(arr, func) {
    if (isEmpty(arr) || !func) return;
    if (Array.isArray(arr)) {
      for (let i = 0; i < arr.length; i++) {
        let ret = func(arr[i], i); //回调函数
        if (typeof ret !== 'undefined' && (ret === null || ret === false))
          break;
      }
    } else {
      for (let item in arr) {
        let ret = func(arr[item], item); //回调函数
        if (typeof ret !== 'undefined' && (ret === null || ret === false))
          break;
      }
    }
  }

  /**
   * 查找是否存在某数组中
   * @param {*} val 需要查找的值
   * @param {Array} values 需要查找的目标数组
   * @return {Number} -1:没有找到 i:下标位置
   */
  function inArray(val, values) {
    if (!val || !values || !Array.isArray(values)) return -1;
    let indexOf = -1;
    values.forEach((value, i) => {
      if (val === value) {
        indexOf = i;
      }
    });
    return indexOf;
  }

  /**
   * 获取 crypto 模块
   */
  function crypto() {
    return window.nj_crypto || (window.nj_crypto = require('crypto'));
  }

  /**
   * 获取hash值
   * @param {String} data 需要hash编码的值
   * @param {Number} length 长度
   */
  function revHash(data, length) {
    return (
      window.nj_crypto_md5 ||
      (window.nj_crypto_md5 = crypto()
        .createHash('md5')
        .update(data || '')
        .digest('hex')
        .slice(0, length || 10))
    );
  }

  /**
   * 使用 aes192 加密数据
   * @param {String} data 加密的数据
   * @param {String} pwd 加密的密码(默认为系统提供)
   */
  function cipher(data, pwd) {
    const cipher = crypto().createCipher('aes192', pwd || '5d40af863c18');

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * 使用 aes192 解密数据
   * @param {String} encrypted 需要解密的加密串
   * @param {String} pwd 解密的密码(默认为系统提供)
   */
  function deCipher(encrypted, pwd) {
    const decipher = crypto().createDecipher('aes192', pwd || '5d40af863c18');

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * 深度合并（Object.assign 升级版）
   */
  function deepAssign() {
    if (typeof require === 'undefined') {
      console.warn('deepAssign 方法依赖模块化加载环境 ！');
      return null;
    }
    Utils.lodash = Utils.lodash || require('lodash');
    return Utils.lodash.defaultsDeep.apply(this, arguments);
  }

  /**
   * 深拷贝
   * @param {Object} source
   * @param {Array} ignoreKeys 忽略键名
   */
  function deepClone(source, ignoreKeys) {
    if (!source && typeof source !== 'object') {
      throw new Error('error arguments', 'shallowClone');
    }
    ignoreKeys = Array.isArray(ignoreKeys) ? ignoreKeys : [];
    const targetObj = source.constructor === Array ? [] : {};
    for (const keys in source) {
      if (source.hasOwnProperty(keys) && !ignoreKeys.includes(keys)) {
        if (source[keys] && typeof source[keys] === 'object') {
          targetObj[keys] = source[keys].constructor === Array ? [] : {};
          targetObj[keys] = deepClone(source[keys]);
        } else {
          targetObj[keys] = source[keys];
        }
      }
    }
    return targetObj;
  }

  /**
   * 延迟触发
   * @param {Function} func 回调函数
   * @param {Number} wait 等待时间
   * @param {Boolean} immediate 不等待上次结束，重新触发等待时间
   */
  function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result;

    const later = function() {
      // 据上一次触发时间间隔
      const last = Number(new Date()) - timestamp;

      // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function(...args) {
      context = this;
      timestamp = Number(new Date());
      const callNow = immediate && !timeout;
      // 如果延时不存在，重新设定延时
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  }

  /**
   * 深度合并克隆（参数同 Object.assign）
   */
  function assignClone() {
    let assign = deepAssign.apply(this, arguments);
    return deepClone(assign);
  }

  /**
   * 千分位分割
   * @param {Number} num 数字
   * @param {Number} fixed 小数位数，默认2位
   */
  function toThousandslsFilter(num, fixed = 2) {
    let number = Number(num);
    if (isNaN(number)) return num;
    return (number.toFixed(fixed) || 0)
      .toString()
      .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
  }

  /**
   * 导出 table 标签到 excel
   * @param {String} selector table 选择器，比如 .el-table
   * @param {String} fileName 导出的文件名
   * @param {Array/String} tHeader 表头数组或表头选择器
   * @param {Object} opts 配置项目(忽略:{ignore: {index(下标), noneType: true|false (忽略类型)}})
   */
  function exportTableToExcel(selector, fileName, tHeader, opts) {
    return new Promise((resolve, reject) => {
      if (isEmpty(selector) || !is('String', selector)) {
        reject({
          message: '没有可用于导出的表格'
        });
        return;
      }
      require.ensure([], () => {
        const { export_table_to_excel } =
          Utils.Export2Excel ||
          (Utils.Export2Excel = require('./Export2Excel'));
        export_table_to_excel(selector, fileName, tHeader, opts);
        resolve();
      });
    });
  }

  /**
   * 导出JSON数据到Excel
   * @param {Array} tHeader 表头 (子项可以 String或者{key: 'birthday', value: '生日', type: 'date'})
   * @param {Array} jsonData 表体(当 tHeader 包含 key、value、type 时，根据对应的 key 过滤 jsonData 导出的数据)
   * @param {String} fileName 文件名
   * @param {Object} opts 配置项目(忽略:{ignore: {index(下标), noneType: true|false (忽略类型)}})
   * @param {Function} filter 过滤函数，用于处理循环过程中的数据
   */
  function exportJsonToExcel(tHeader, jsonData, fileName, opts, filter) {
    if (typeof opts === 'function') {
      filter = opts;
      opts = null;
    }
    return new Promise((resolve, reject) => {
      if (
        !Array.isArray(tHeader) ||
        !Array.isArray(jsonData) ||
        tHeader.length === 0 ||
        jsonData.length === 0
      ) {
        reject({ message: '没有可用于导出的数据' });
        return;
      }
      require.ensure([], () => {
        let data = jsonData,
          headerArray = [];
        tHeader = tHeader.filter(header => header.key !== undefined);
        if (is('Object', tHeader[0]) && tHeader.length > 0) {
          data = jsonData.map(v =>
            tHeader.map(j => {
              let data = filter ? filter(v) : v;
              headerArray.length < tHeader.length && headerArray.push(j.value);
              if (j.type === 'date') {
                return formatDateTime(data[j.key]);
              }
              return data[j.key];
            })
          );
        }
        const { export_json_to_excel } =
          Utils.Export2Excel ||
          (Utils.Export2Excel = require('./Export2Excel'));
        export_json_to_excel(headerArray, data, fileName, opts);
        resolve();
      });
    });
  }

  /**
   * 数字是个位数的话在前面添加0
   */
  function singeZero(val) {
    return String(val).length < 2 ? '0' + val : val;
  }
  /**
   * 分钟转换为小时
   */
  function formatMinutes(minutes) {
    if (minutes / 60 / 24 >= 1) {
      return (
        singeZero(parseInt(minutes / 60 / 24)) +
        '天' +
        singeZero(parseInt(minutes / 60 % 24)) +
        '小时' +
        singeZero(minutes % 60) +
        '分钟'
      );
    } else if (minutes / 60 >= 1) {
      return (
        singeZero(parseInt(minutes / 60)) +
        '小时' +
        singeZero(minutes % 60) +
        '分钟'
      );
    }
    return singeZero(minutes) + '分钟';
  }
  /**
   * 秒转换为分钟
   */
  function formatSeconds(seconds) {
    if (seconds / 60 / 60 / 24 >= 1) {
      return (
        singeZero(parseInt(seconds / 60 / 60 / 24)) +
        '天' +
        singeZero(parseInt(seconds / 60 / 60 % 24)) +
        '小时' +
        singeZero(parseInt(seconds / 60 % 60)) +
        '分钟' +
        singeZero(seconds % 60) +
        '秒'
      );
    } else if (seconds / 60 / 60 >= 1) {
      return (
        singeZero(parseInt(seconds / 60 / 60)) +
        '小时' +
        singeZero(parseInt(seconds / 60 % 60)) +
        '分钟' +
        singeZero(seconds % 60) +
        '秒'
      );
    } else if (seconds / 60 >= 1) {
      return (
        singeZero(parseInt(seconds / 60)) +
        '分钟' +
        singeZero(seconds % 60) +
        '秒'
      );
    }
    return singeZero(seconds) + '秒';
  }

  /**
   * 清楚所有的 timeout、interval
   */
  function clearAllTimeInterval() {
    var id = setTimeout(function() {}, 0);
    for (let i = id; i > 0; i--) {
      clearTimeout(i);
    }
  }

  /**
   * 下载文件
   * @param {String|Canvas|Blob} source 下载地址
   */
  function download(source, saveName) {
    if (
      Boolean(window.ActiveXObject) ||
      'ActiveXObject' in window ||
      navigator.userAgent.indexOf('Edge') > -1 //Edge
    ) {
      if (is('HTMLCanvasElement', source)) {
        var blob = source.msToBlob();
        window.navigator.msSaveBlob(
          blob,
          `${saveName || '下载'}.${blob.type.split('/')[1]}`
        );
      } else if (
        is('String', source) &&
        /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i.test(
          source
        )
      ) {
        //为 base64 字符串
        var canvas = document.createElement('canvas');
        var img = new Image();
        img.onload = function() {
          canvas.drawImage(img);
          download(canvas, saveName);
          window.URL && window.URL.revokeObjectURL(source);
        };
        img.src = source;
      } else {
        let oPop = window.open(
          source,
          '',
          'width=1, height=1, top=5000, left=5000'
        );
        for (; oPop.document.readyState !== 'complete'; ) {
          if (oPop.document.readyState === 'complete') break;
        }
        oPop.document.execCommand('SaveAs');
        oPop.close();
        oPop = null;
      }
    } else {
      var a = document.createElement('a');
      var event = new MouseEvent('click');
      a.download = saveName || '下载图片';
      a.href = is('HTMLCanvasElement', source) ? source.toDataURL() : source;
      a.dispatchEvent(event);
    }
  }

  return {
    isEmpty: isEmpty, //是否为空
    isEmptyArray: isEmptyArray, //是否为空数组
    trim: trim, //去除空格
    is: is, //数据类型判断(Object|Array|String等)
    getUrlParams: getUrlParams, //获取Url传参(a?code=123)
    getUrlVars: getUrlVars, //获取URL全部参数
    removeUrlParam: removeUrlParam, //移除URL参数
    setUrlParams: setUrlParams, //设置URL参数
    setSessionItem: setSessionItem, //存入 session 缓存 （自动转换为String）
    getSessionItem: getSessionItem, //取出 session 缓存（自动转换为Object）
    removeSessionItem: removeSessionItem, //移除SessionItem
    setLocalItem: setLocalItem, //存入 local 缓存 （自动转换为String）
    getLocalItem: getLocalItem, //取出 local 缓存（自动转换为Object）
    removeLocalItem: removeLocalItem, //移除localItem
    evalJson: evalJson, //解析JSON字符串（过滤XSS攻击代码）
    replaceAll: replaceAll, //替换所有指定的字符
    formatDateTime: formatDateTime, //格式化日期(支持Date、时间戳、日期格式字符串)
    stepYear: stepYear, //步进年份
    stepMonth: stepMonth, //步进月份
    stepDays: stepDays, //步进天数
    calcAge: calcAge, //计算周岁
    compareDate: compareDate, //比较日期大小
    dateDiff: dateDiff, //计算日期相差天数
    uuid: uuid, //生成36位唯一码（同 Java UUID）
    pathToRegexp: pathToRegexp, //根据规则获取路径参数（/123/456 => /:code/:id）
    get: get, //通过既定路径获取对象参数 get(obj, 'a.b.c')
    attribute: attribute, //同上（此函数不支持数组）
    camelCase: camelCase, //转换驼峰命名（驼峰转连接符、连接符转驼峰）
    koala: koala, //输入框延迟触发函数（输入完毕再触发，避免频繁触发）
    isEmptyObject: isEmptyObject, //是否为空对象({}）
    forEach: forEach, //扩展 forEach，支持 Object|Array , 支持 return false 跳出循环（提高执行效率）
    inArray: inArray, //同 jQuery inArray , 是否存在某数组中，返回下标，-1：未找到
    revHash: revHash, //获取hash值
    cipher: cipher, //使用 aes192 加密数据
    deCipher: deCipher, //使用 aes192 解密数据
    deepAssign: deepAssign, //深度合并（Object.assign 升级版）
    deepClone: deepClone, //对象深拷贝
    debounce: debounce, //延迟触发（函数抖动）
    assignClone: assignClone, //深度合并（深度合并克隆）
    toThousandslsFilter: toThousandslsFilter, //千分位分割
    exportTableToExcel: exportTableToExcel, //导出table表格到 Excel
    exportJsonToExcel: exportJsonToExcel, //导出JSON数据到Excel
    formatMinutes: formatMinutes, // 分钟转为小时，天
    formatSeconds: formatSeconds, //秒数转换为分钟，小时
    clearAllTimeInterval: clearAllTimeInterval, //清楚所有的timeout、interval
    download: download //下载文件
  };
})();

typeof exports === 'object' && typeof module !== 'undefined' ?
  module.exports = Utils :
  window.Utils = Utils;
