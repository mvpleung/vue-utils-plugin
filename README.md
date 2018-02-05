# vue-utils-plugin

### install 
```
npm install vue-utils-plugin
```

### use
```js
<template>
  <div>
	<div>
	 <input v-model="name" v-if="$utils.isEmpty(info.name)" placeholder=""/>
	</div>
  </div>
</template>

<script>
    import Vue from "vue";
    import utilsPlugin from "vue-utils-plugin";
    Vue.use(utilsPlugin,{
        utils: {
		 replace: function(str, replace, replaceStr){}
	}
    });
    export default {
        name: 'app',
        data () {
            return {
                name: '',
			 info: {
				 name: ''
			 }
            }
        },
        methods:{
            submit: function () {
                this.$utils.replace('', '', '');
            }
        }
    }
</script>

```


### 配置说明
配置传入一个对象
```js
{
    utils:{}//自定义工具方法
}
```



##### 默认工具
参考 ./src/default

```js
- isEmpty(Object)   //是否为空
- trim(String)   //去除空格
- is([String|Object|Array|Number|...], Object)   //数据类型判断(Object/Array/String等)
- getUrlParams(key: String, url: String)   //获取Url传参(a?code=123)
- getUrlVars(url: String)   //获取URL全部参数，返回JSON对象
- removeUrlParam(url: String, key: String)   //移除URL参数
- setUrlParams(obj: Object, url: String)  //批量设置URL参数
- setSessionStorage(key: String, value: Object, needCipher: Boolean /**是否加密**/)   //存入 session 缓存 （自动转换为String，支持加密存储）
- getSessionStorage(key: String, needDecipher: Boolean /**是否需要解密**/)   //取出 session 缓存（自动转换为Object）
- setLocalStorage(key: String, value: Object, option: {exp: Number /**过期时间(秒)**/, needCipher: Boolean /**是否加密**/})   //存入 local 缓存 （自动转换为String，支持加密存储）
- getLocalStorage(key: String, option: {exp: Number /**过期时间(秒)**/, needDecipher: Boolean /**是否解密**/, force: Boolean /**为true已过期数据返回null**/})   //取出 local 缓存（自动转换为Object）
- evalJson(jsonStr: String)   //解析JSON字符串（过滤XSS攻击代码）
- replaceAll(value: String, replaceStr: Object /**待替换字符**/, replaceValue: Object /**替换后字符**/)   //替换所有指定的字符
- formatDateTime(unixTime: [Date|String|Number], pattern: String)   //格式化日期(支持Date、时间戳、日期格式字符串)
- calYear(date: [Date|String], year: Number /**负数减一年，正数加一年**/)   //计算相差年份
- calcAge(dateStr: [Date|String], [today: [Date|String]])   //计算周岁
- compareDate(date1: [Date|String|Number], date2: [Date|String|Number])   //比较日期大小
- uuid()  //生成36位唯一码（同 Java UUID）
- hideKeyboard([el: Element])   //隐藏软键盘
- pathToRegexp(prefix: String /**匹配规则**/, path: String)   //根据规则获取路径参数（/123/456 => /:code/:id）
- get(object: String, path: String, defaultValue: Object)   //通过既定路径获取对象参数 get(obj, 'a.b.c')
- attribute(obj:Object, path: String, create: Boolean /**不存在时是否创建**/, cb: Function)   //同上,不存在则创建（此函数不支持数组）
- camelCase(value: String, reverse: Boolean)   //转换驼峰命名（驼峰转连接符、连接符转驼峰）
- koala(el: Element, options: {delay: Number, keydown: Function, keypress: Function, keyup: Function})   //输入框延迟触发函数（输入完毕再触发，避免频繁触发）
- isEmptyObject(obj: Object)   //是否为空对象({}）
- forEach(arr: [Array|Object], func: Function)   //扩展 forEach，支持 Object/Array , 支持 return false 跳出循环（提高执行效率）
- inArray(val: Object, values: Array)   //同 jQuery inArray , 是否存在某数组中，返回下标，-1：未找到
- revHash(data: Object, length: Number):   //获取hash值
- cipher(data: Object, pwd: String):   //使用 aes192 加密数据
- deCipher(encrypted: String, pwd: String):   //使用 aes192 解密数据
- deepAssign(target: Object, source1: Object, source2: Object,...):   //深度合并（Object.assign 升级版）
- deepClone(source: Object):   //对象深拷贝
- debounce(func: Function, wait: Number, immediate: Boolean):   //延迟触发（函数抖动）
- assignClone(target: Object, source1: Object, source2: Object,...):   //深度合并（深度合并克隆）
- toThousandslsFilter(num: Number):   //千分位分割 1,000
- exportTableToExcel(selector: String, fileName: String, tHeader: [String|Array] /**表头数组或表头选择器**/, opts: {ignore: Number /**忽略下标**/}):   //导出table表格到 Excel
- exportJsonToExcel(tHeader: Array, jsonData: Array, fileName: String):   //导出JSON数据到Excel
- resetModel(model: [Array|Object], ignore: [Array|Object], deep: Boolean /**深度重置**/):   //重置Model对象
- setModelValue(target: Object, source: Object, keys: Array /**需要赋值的键名组合**/) //设置Model 数据 setModelValue(obj, value);
...
```

##### License
-------

[LICENSE](https://github.com/mvpleung/vue-utils-plugin/blob/master/LICENSE)

