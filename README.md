# vue-utils-plugin

### install 
```
npm i @mvpleung/vue-utils
```

### use
```vue
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
参考 [./src/default](src/default.js)

|Method|Params|Description|
|---|----|----|
|**isEmpty**|`value` |是否为空|
|**isEmptyArray**|`value`| 是否为空数组|
|**isEmptyObject**|`value`| 是否为空对象|
|**trim**|`str:String`|去除空格|
|**is**|`type:String`, `val`|精准数据类型判断(Object/Array/String等)|
|**getUrlParams**|`key: String`, `url: String`|获取Url传参(a?code=123),Url默认取当前window.location|
|**getUrlVars**|`url: String`|获取URL全部参数，返回JSON对象,Url默认取当前location|
|**removeUrlParam**|`url: String`, `key: String`|移除URL参数,返回操作后的 Url|
|**setUrlParams**|`obj: Object`, `url: String`|批量设置URL参数,返回操作后的 Url,Url默认取当前location|
|**setSessionItem**|`key: String`, `value: Object`, `needCipher: Boolean`|存入 session 缓存 （自动转换为String，支持加密存储）|
|**getSessionItem**|`key: String`, `needDecipher: Boolean`|取出 session 缓存（自动转换为Object，支持解密，配合 `setSessionItem`）|
|**removeSessionItem**|`key: String`|清除session 缓存|
|**setLocalItem**|`key: String`, `value: Object`, `option: Object`|存入 local 缓存 （自动转换为String，支持加密存储）, `option: {exp: Number /**过期时间(秒)**/, needCipher: Boolean /**是否加密**/}`|
|**getLocalItem**|`key: String`, `option: Object`|取出 local 缓存（自动转换为Object）, `option: {exp: Number /**过期时间(秒)**/, needDecipher: Boolean /**是否解密**/, force: Boolean /**为true已过期数据返回null**/}`|
|**removeLocalItem**|`key: String`|清除local 缓存|
|**evalJson**|`jsonStr: String`|解析JSON字符串（过滤XSS攻击代码）|
|**replaceAll**|`value: String`, `replaceStr: String`, `replaceValue: String`|替换所有指定的字符,`replaceStr: /**待替换字符**/, replaceValue: /**替换后字符**/`|
|**formatDateTime**|`unixTime: [Date|String|Number]`, `pattern: String`|格式化日期(支持Date、时间戳、日期格式字符串),默认 yyyy-MM-dd|
|**stepYear**|`date: [Date|String]`, `year: Number`, `format: Boolean`|步进年份,`year: 正数加，负数减`, `format: 是否格式化为字符串，默认为 true`|
|**stepMonth**|`date: [Date|String]`, `month: Number`, `pattern: String`, `format: Boolean`|步进月份,`month: 正数加，负数减`, `pattern: 日期格式，默认为 yyyy-MM-dd`, `format: 是否格式化为字符串，默认为 true`|
|**stepDays**|`date: [Date|String]`, `days: Number`, `pattern: String`, `format: Boolean`|步进天数,`days: 正数加，负数减`, `pattern: 日期格式，默认为 yyyy-MM-dd`, `format: 是否格式化为字符串，默认为 true`|
|**calcAge**|`date: [Date|String]`, `today: [Date|String]`|计算周岁,`today: 非必填，默认今天`|
|**compareDate**|`date1: [Date|String|Number]`, `date2: [Date|String|Number]`|比较日期大小|
|**dateDiff**|`date1: [Date|String|Number]`, `date2: [Date|String|Number]`, `unit: String`|计算相差天数(小时、分钟、秒), `unit: 单位,取值范围['day', 'hour', 'minute', 'second']`|
|**uuid**||生成36位唯一码（同 Java UUID）|
|**pathToRegexp**|`prefix: String`, `path: String`|根据规则获取路径参数,返回Object（pathToRegexp(`/:code/:id`, `/123/456`）=> {code: `123`, id: `456`}|
|**get**|`object: Object`, `path: String`, `defaultValue: Object`|通过既定路径获取对象参数 get(obj, 'a.b.c')|
|**attribute**|`object: Object`, `path: String`, `create: Boolean`, `cb: Function`|同上,不存在则创建（此函数不支持数组）|
|**camelCase**|`value: String`, `reverse: Boolean`|转换驼峰命名（驼峰转连接符、连接符转驼峰）|
|**koala**|`el: HTMLElement`, `options: Object`|输入框延迟触发函数,`options: {delay: Number, keydown: Function, keypress: Function, keyup: Function}`|
|**forEach**|`arr: [Array|Object]`, `func: Function`|扩展 forEach，支持 Object/Array , 支持 return false 跳出循环（提高执行效率）|
|**inArray**|`val: Object`, `values: Array`|同 jQuery inArray , 是否存在某数组中，返回下标，-1：未找到|
|**revHash**|`data: Object`, `length: Number`|获取hash值,`length: 默认 10 位`|
|**cipher**|`data: Object`, `pwd: String`|使用 aes192 加密数据|
|**deCipher**|`encrypted: String`, `pwd: String`|使用 aes192 解密数据|
|**deepAssign**|`target: Object`, `source1: Object`, `...`|深度合并（Object.assign 升级版）|
|**deepClone**|`source: Object`|对象深拷贝|
|**assignClone**|`target: Object`, `source1: Object`, `...`|深度合并（深度合并克隆）|
|**debounce**|`func: Function`, `wait: Number`, `immediate: Boolean`|延迟触发（函数抖动）,`wait: 触发时间`, `immediate: 不等待上次结束，重新触发等待时间`|
|**toThousandslsFilter**|`num: Number`|千分位分割 1,000|
|**exportTableToExcel**|`selector: String`, `fileName: String`, `tHeader: [String|Array]`, `opts: Object`|导出table表格到 Excel, `selector: 表格选择器`, `tHeader: 表头数组或表头选择器`, `opts: {ignore: {index(下标), noneType: true|false (忽略类型)}}`|
|**exportJsonToExcel**|`tHeader: Array`, `jsonData: Array`, `fileName: String`, `opts: Object`, `filter: Function`|导出JSON数据到Excel, `tHeader: 表头数组`, `opts: {ignore: {index(下标), noneType: true|false (忽略类型)}}`|
|**formatMinutes**|`minutes: Number`|格式化分钟('5天 5小时 20分钟')|
|**formatSeconds**|`seconds: Number`|格式化秒数('5天 5小时 20分钟 20秒')|
|**clearAllTimeInterval**||清除所有的timeout、interval|
|**download**|`source: [String|Canvas|Blob]`, `saveName: String`|下载文件|
|**hideKeyboard**|`el: HTMLElement`|隐藏软键盘, `el: 不填写隐藏全局`|
|**toggle**|`el: HTMLElement`, `arrow: HTMLElement`, `deg: Number`|切换控件显示隐藏, `el: 隐藏的节点`, `arrow: 箭头Dom`, `deg: rotate角度`|
|**modalHelper**||解决弹窗滚动穿透(父层处理)|
|**bubbleScroll**|`layerNode: String`|处理弹层滚动穿透(弹出层处理), `layerNode: 需要滚动节点的选择器`|
|**createWebSocket**|`url: String`, `option: Object`|创建websocket, `option: {heartCheck: 是否开启心跳检测, reconnect: 是否重连,默认true, heartTime: 心跳时间,默认60s, callbacks: {onopen(event), onclose(event), onerror(event), onmessage(event)}, debug: 是否为调试模式}`|

##### License
-------

[LICENSE](https://github.com/mvpleung/vue-utils-plugin/blob/master/LICENSE)

