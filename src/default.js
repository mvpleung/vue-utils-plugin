let _regexp,
    _lodash;
module.exports = (function () {
    let now;

    /**########  属性工具 start ########*/
    /**
     * 日期格式化
     */
    Date.prototype.Format = function (fmt) { //author: meizz   
        let o = {
            "M+": this.getMonth() + 1, //月份   
            "d+": this.getDate(), //日   
            "h+": this.getHours(), //小时   
            "m+": this.getMinutes(), //分   
            "s+": this.getSeconds(), //秒   
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
            "S": this.getMilliseconds() //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    /**
     * 以某个字符开头
     * @param {Object} str
     * @param {Object} ignoreCase 忽略大小写
     */
    String.prototype.startWith = function (str, ignoreCase) {
        if (isEmpty(str) || this.length === 0 || str.length > this.length)
            return false;
        if ((ignoreCase && this.toUpperCase().substr(0, str.length) == str.toUpperCase()) || (!ignoreCase && this.substr(0, str.length) == str))
            return true;
        else
            return false;
        return true;
    };

    /**
     * 以某个字符结尾
     * @param {Object} str
     * @param {Object} ignoreCase 忽略大小写
     */
    String.prototype.endWith = function (str, ignoreCase) {
        if (isEmpty(str) || this.length === 0 || str.length > this.length)
            return false;
        if ((ignoreCase && this.toUpperCase().substring(this.length - str.length) == str.toUpperCase()) || (!ignoreCase && this.substring(this.length - str.length) == str))
            return true;
        else
            return false;
        return true;
    };

    /**
     * 占位符格式化
     */
    String.prototype.format = function (argus) {
        let arguArray = argus && Array.isArray(argus) ? argus : arguments,
            s = this;
        if (arguArray.length === 0) return this;
        for (let i = 0; i < arguArray.length; i++)
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguArray[i]);
        return s;
    };

    Array.prototype.indexOf = function (val) {
        for (let i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function (val) {
        let index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    Array.prototype.removeIndex = function (index) {
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
        return !value || value === undefined || trim(value) === "" || trim(value) === "null" || value === '' || value.length === 0;
    }

    /**
     * 去除空格 
     * @param  {String}  str
     * @return {String}
     */
    function trim(str) {
        return str && !(str instanceof Object) ? String(str).replace(/(^\s+)|(\s+$)/g, "") : str;
    }

    /**
     * check value type
     * @param  {String}  type
     * @param  {*}  val
     * @return {Boolean}
     */
    function is(type, val) {
        return Object.prototype.toString.call(val) === ("[object " + type + "]")
    }

    /**
     * 获取Url参数
     * @param  {String}  name 参数名
     * @param {String} url Url地址非必填（默认取当前window.location）
     * @return {String}
     */
    function getUrlParams(name, url) {
        let reg = new RegExp(name + "=([^&]*)(&|$)");
        let r = (url || window.location.search.substr(1)).match(reg);
        if (r !== null) return decodeURIComponent(r[1]);
        r = (url ? url.split('#')[1] || window.location.hash : window.location.hash).match(reg);
        if (r !== null) return decodeURIComponent(r[1]);
        return null;
    }

    /**
     * 移除URL中的参数
     * @param {String} url 
     * @param {String} name 
     */
    function removeUrlParam(url, name) {
        if (!url) return url;
        var querys = url.split('?');
        if (querys[1] && querys[1].indexOf(name) > -1) {
            var obj = {}
            var arr = querys[1].split("&");
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].split("=");
                obj[arr[i][0]] = arr[i][1];
            };
            delete obj[name];
            let queryStr = JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
            return querys[0] + (!isEmpty(queryStr) ? ('?' + queryStr) : '');
        }
        return url;
    }

    /**
     * 设置UrlParams
     * @param {Object} data 
     * @param {String} url 非必填 
     */
    function setUrlParams(data, url) {
        if (!data || isEmptyObject(data)) return;
        let urlArray = (url || window.location.href).split('#'),
            newUrl = urlArray[1],
            params = [];
        forEach(data, (value, key) => {
            newUrl = removeUrlParam(newUrl, key);
            params.push(`${key}=${value}`);
        });
        newUrl = newUrl || urlArray[1] || '';
        return urlArray[0] + '#' + newUrl + (newUrl.indexOf('?') != -1 ? `&${params.join('&')}` : `?${params.join('&')}`);
    }

    /**
     * 存入session数据
     * @param {String} key 键名
     * @param {*} value 要存入的数据
     */
    function setSessionStorage(key, value) {
        sessionStorage[key] = value instanceof Object ? JSON.stringify(value) : value;
    }

    /**
     * 获取session数据
     * @param {String} key 键名
     * @return {*}
     */
    function getSessionStorage(key) {
        try {
            return JSON.parse(sessionStorage[key]);
        } catch (e) {
            console.warn('SessionStorage.Parse:', '[key:', key, ']', e.message);
            return sessionStorage[key];
        }
    }

    /**
     * 存入local数据
     * @param {String} key 键名
     * @param {*} value 要存入的数据
     * @param {Number} exp 过期时间，单位：秒
     */
    function setLocalStorage(key, value, exp) {
        try {
            if (exp && typeof exp === 'number') {
                let expDate = new Date();
                expDate.setSeconds(exp);
                localStorage[key] = JSON.stringify({
                    data: value,
                    time: expDate.getTime()
                });
            } else {
                localStorage[key] = value instanceof Object ? JSON.stringify(value) : value;
            }
            return true;
        } catch (e) {
            alert('您的web浏览器不支持本地存储设置。在Safari中，最常见的原因是使用“私人浏览模式”或“无痕浏览”。有些设置可能无法保存或某些功能可能无法正常工作。');
            return false;
        }
    }

    /**
     * 获取local数据
     * @param {String} key 键名
     * @param {Number} exp 过期时间（是否超过此时间）
     * @param {Boolean} force 是否强制删除已过期数据，true：已过期数据返回空
     * @return {*} 存在 exp : {data: value, time: 过期时间, expire: 是否过期} , 不存在 exp ： 原路返回
     */
    function getLocalStorage(key, exp, force) {
        try {
            let local = JSON.parse(localStorage[key]);
            if (exp && typeof exp === 'number' && local && is('Object', local) && local.time) {
                local.expire = new Date().getTime() - local.time > exp * 1000;
                if (force && local.expire) {
                    return null;
                }
            }
            return local;
        } catch (e) {
            console.warn('LocalStorage.Parse:', '[key:', key, ']', e.message);
            return localStorage[key];
        }
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
        } catch (error) {

        }
        if (!result) {
            result = replaceAll(jsonStr, '\\[|\\]', ''); //过滤数组
            result = result.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@");
            result = result.replace(/\s*('|"|)([\w\-]+)('|"|)\s*\:(("|')[^"\\\n\r]*("|')|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/ig, "]:]");
            result = result.replace(/(?:^|:|,)(?:\s*\[)+/g, "");
            result = result.replace(/\s*('|"|)([\w\-]+)('|"|)\s*/ig, ']');
            if (/^[\],:{}\s]*$/.test(result)) {
                try {
                    return eval("(" + jsonStr + ")");
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
        return isEmpty(value) ? value : value.replace(new RegExp(replaceStr, 'gm'), replaceValue);
    }

    /**
     * 格式化时间
     * @param {Number} unixTime 日期或时间戳
     * @param {String} pattern 日期格式规则(如:YYYY-MM-dd)
     * @return {*}
     */
    function formatDateTime(unixTime, pattern) {
        if (unixTime instanceof Date) {
            return unixTime.Format(pattern ? pattern : 'yyyy-MM-dd');
        }
        if (is('String', unixTime)) {
            if (unixTime.length === 8) {
                unixTime = unixTime.substring(0, 4) + '-' + unixTime.substring(4, 6) + '-' + unixTime.substring(6, 8);
            }
        }
        return !unixTime || isEmpty(unixTime) ? '' : !/^(\+|-)?\d+($|\.\d+$)/.test(unixTime) ? unixTime : new Date(unixTime).Format(pattern ? pattern : 'yyyy-MM-dd');
    }

    /**
     * 计算年份，返回 yyyy-MM-dd
     * @param {Data/String} date 日期对象或日期字符串
     * @param {Number} year 负数减一年，正数加一年
     * @returns {String}
     */
    function calYear(date, year) {
        let d = typeof date === 'object' ? date : new Date(date);
        let nextYear = d.getFullYear() + year;
        let month = d.getMonth() + 1;
        let day = d.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        return nextYear + "-" + month + "-" + day;
    }

    /**
     * 计算周岁
     * @param {Object} dateStr 日期字符串或日期对象
     * @param {Date} today
     * @return {Number}
     */
    function calcAge(dateStr, today) {
        if (isEmpty(dateStr)) return 0;
        dateStr = dateStr instanceof Date ? dateStr.Format('yyyy-MM-dd') : dateStr;
        let r = dateStr.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if (isEmpty(r)) return 0;
        let birth = new Date(r[1], r[3] - 1, r[4]);
        if (birth.getFullYear() == r[1] && (birth.getMonth() + 1) == r[3] && birth.getDate() == r[4]) {
            today = isEmpty(today) ? (now = new Date()) : typeof today === 'object' ? today : new Date(today);
            let age = today.getFullYear() - r[1];
            if (today.getMonth() > birth.getMonth()) {
                return age;
            }
            if (today.getMonth() == birth.getMonth()) {
                if (today.getDate() >= birth.getDate()) {
                    return age;
                } else {
                    return age - 1;
                }
            }
            if (today.getMonth() < birth.getMonth()) {
                return age - 1;
            }
            today = null;
        }
        return 0;
    }

    /**
     * 生成36位随机码（java uuid）
     * @return {String}
     */
    function uuid() {
        let s = [];
        let hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        let uuid = s.join("");
        return uuid;
    }

    /**
     * 隐藏软键盘
     * @param {Element} el 需要隐藏软键盘的Dom节点或父节点（选填）
     */
    function hideKeyboard(el) {
        document.activeElement.blur();
        if (el) {
            el.blur();
            el.querySelector('input').blur();
        } else {
            document.querySelector('input').blur();
        }
    }

    /**
     * 动态匹配参数
     * @param {String} prefix 匹配规则（如：/productCal/:id/:code）
     * @param {String} path 匹配路径，非必填，默认取当前Hash路径(如:/productCal/123/456)
     * @return {Object} 如:{id:'123',code:'456'}
     */
    function pathToRegexp(prefix, path) {
        _regexp = _regexp || require('./path-to-regexp.min');
        let keys = [],
            reg = _regexp(prefix, keys),
            indexof = window.location.hash.indexOf('?'),
            execArray = reg.exec(path || window.location.hash.substring(1, indexof === -1 ? window.location.hash.length : indexof)) || [],
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
        try {
            _lodash = _lodash || require('lodash');
            return _lodash.get(object, path, defaultValue);
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
     */
    function attribute(obj, path, create, cb) {
        if (typeof create === 'function') {
            cb = create;
            create = null;
        }
        const arr = path.split("."),
            length = arr.length;
        arr.forEach((atr, i) => {
            let _obj = obj[atr];
            if (i < (length - 1) && _obj === undefined) {
                create && (obj[atr] = {});
                cb && cb(atr, obj[atr]);
                obj = obj[atr];
                return ('');
            } else {
                obj = _obj;
            }
        });
        return (obj);
    };

    /**
     * 转换驼峰命名法
     * @param {Object} value
     * @param {Boolean} reverse 反转（互转）
     */
    function camelCase(value, reverse) {
        if (isEmpty(value)) return value;
        if (reverse) {
            return value.replace(/([A-Z])/g, "_$1").toLowerCase();
        }
        let result = value.replace(/\d/gm, '').replace(/[-|_](\w)/g, function ($0, $1) {
            return $1.toUpperCase();
        }).replace(/[-|_]/gm, '');
        return isEmpty(result) ? value : result.substring(0, 1).toLowerCase() + result.substring(1);
    }

    /**
     * 延迟触发
     * @param {*} el 
     * @param {Object} options 
     */
    function koala(el, options) {
        if (isEmpty(el)) return;
        let defaults = {
            delay: 200
        };

        let events = ["keydown", "keypress", "keyup"];
        let opts = Object.assign(defaults, defaults, options);

        let koala = function (el, func) {
            return function (event) {
                let koala = el.getAttribute('koala-timer');
                if (typeof (koala) !== 'undefined' && koala !== null) {
                    let now = (new Date()).getTime();
                    if (now - koala.time < opts.delay) {
                        clearTimeout(koala.timer);
                    }
                }
                let _this = this;
                let timer = setTimeout(function () {
                    func.call(_this, event);
                    el.removeAttribute('koala-timer');
                }, opts.delay);
                el.setAttribute('koala-timer', {
                    timer: timer,
                    time: (new Date()).getTime()
                });
            };
        };

        el = Array.isArray(el) ? el : [el];
        el.forEach(that => {
            events.forEach(e => {
                if (opts[e] && typeof (opts[e]) === "function") {
                    if (that !== null) {
                        let _el = that.$refs ? that.$refs.input : that;
                        _el.addEventListener(e, koala(_el, opts[e]));
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
     * @param {Object/Array} arr 需要循环的对象
     * @param {Function} func 回调函数
     */
    function forEach(arr, func) {
        if (isEmpty(arr)) return;
        if (Array.isArray(arr)) {
            for (let i = 0; i < arr.length; i++) {
                let ret = func.call(this, arr[i], i); //回调函数
                if (typeof ret !== "undefined" && (ret === null || ret === false)) break;
            }
        } else {
            for (let item in arr) {
                let ret = func.call(this, arr[item], item); //回调函数
                if (typeof ret !== "undefined" && (ret === null || ret === false)) break;
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
     * 获取hash值
     * @param {String} data 需要hash编码的值
     * @param {Number} length 长度
     */
    function revHash(data, length) {
        let crypto = window.wp_crypto;
        if (!crypto) {
            crypto = require('crypto');
            window.wp_crypto = crypto;
        }
        return crypto.createHash('md5').update(data || '').digest('hex').slice(0, length || 10);
    }

    /**
     * 设置model
     * @param {Object} model 需要设置的对象
     * @param {Object} value 赋值来源
     * @param {Array} keys 需要赋值的键名
     */
    function setModelValue(model, value, keys) {
        if (is('Object', value)) {
            value = value || {};
            if (keys && Array.isArray(keys)) {
                keys.forEach(key => {
                    setModelValue(model[key], value[key]);
                });
            } else {
                model.val = value.value || value.val;
                model.val_text = value.label || value.val_text;
            }
        } else {
            model.val = model.val_text = value;
        }
        return model;
    }

    return {
        isEmpty: isEmpty, //是否为空
        trim: trim, //去除空格
        is: is, //数据类型判断(Object/Array/String等)
        getUrlParams: getUrlParams, //获取Url传参(a?code=123)
        removeUrlParam: removeUrlParam, //移除URL参数
        setUrlParams: setUrlParams, //设置URL参数
        setSessionStorage: setSessionStorage, //存入 session 缓存 （自动转换为String）
        getSessionStorage: getSessionStorage, //取出 session 缓存（自动转换为Object）
        setLocalStorage: setLocalStorage, //存入 local 缓存 （自动转换为String）
        getLocalStorage: getLocalStorage, //取出 local 缓存（自动转换为Object）
        evalJson: evalJson, //解析JSON字符串（过滤XSS攻击代码）
        replaceAll: replaceAll, //替换所有指定的字符
        formatDateTime: formatDateTime, //格式化日期(支持Date、时间戳、日期格式字符串)
        calYear: calYear, //计算相差年份
        calcAge: calcAge, //计算周岁
        uuid: uuid, //生成36位唯一码（同 Java UUID）
        hideKeyboard: hideKeyboard, //隐藏软键盘
        pathToRegexp: pathToRegexp, //根据规则获取路径参数（/123/456 => /:code/:id）
        get: get, //通过既定路径获取对象参数 get(obj, 'a.b.c')
        attribute: attribute, //同上（此函数不支持数组）
        camelCase: camelCase, //转换驼峰命名（驼峰转连接符、连接符转驼峰）
        koala: koala, //输入框延迟触发函数（输入完毕再触发，避免频繁触发）
        isEmptyObject: isEmptyObject, //是否为空对象({}）
        forEach: forEach, //扩展 forEach，支持 Object/Array , 支持 return false 跳出循环（提高执行效率）
        inArray: inArray, //同 jQuery inArray , 是否存在某数组中，返回下标，-1：未找到
        revHash: revHash, //获取hash值
        setModelValue: setModelValue //设置Model 数据 setModelValue(obj, value);
    }
})();