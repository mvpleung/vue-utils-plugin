# vue-utils-plugin

### install 
```
npm install vue-utils-plugin
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
参考 ./src/default

```js
- isEmpty:   //是否为空
- trim:   //去除空格
- is:   //数据类型判断(Object/Array/String等)
- getUrlParams:   //获取Url传参(a?code=123)
- getUrlVars:   //获取URL全部参数
- removeUrlParam:   //移除URL参数
- setUrlParams:   //设置URL参数
- setSessionStorage:   //存入 session 缓存 （自动转换为String，支持加密存储）
- getSessionStorage:   //取出 session 缓存（自动转换为Object）
- setLocalStorage:   //存入 local 缓存 （自动转换为String，支持加密存储）
- getLocalStorage:   //取出 local 缓存（自动转换为Object）
- evalJson:   //解析JSON字符串（过滤XSS攻击代码）
- replaceAll:   //替换所有指定的字符
- formatDateTime:   //格式化日期(支持Date、时间戳、日期格式字符串)
- calYear:   //计算相差年份
- calcAge:   //计算周岁
- compareDate:   //比较日期大小
- uuid:   //生成36位唯一码（同 Java UUID）
- hideKeyboard:   //隐藏软键盘
- pathToRegexp:   //根据规则获取路径参数（/123/456 => /:code/:id）
- get:   //通过既定路径获取对象参数 get(obj, 'a.b.c')
- attribute:   //同上（此函数不支持数组）
- camelCase:   //转换驼峰命名（驼峰转连接符、连接符转驼峰）
- koala:   //输入框延迟触发函数（输入完毕再触发，避免频繁触发）
- isEmptyObject:   //是否为空对象({}）
- forEach:   //扩展 forEach，支持 Object/Array , 支持 return false 跳出循环（提高执行效率）
- inArray:   //同 jQuery inArray , 是否存在某数组中，返回下标，-1：未找到
- revHash:   //获取hash值
- cipher:   //使用 aes192 加密数据
- deCipher:   //使用 aes192 解密数据
- deepAssign:   //对象深拷贝
- deepClone:   //对象深拷贝
- debounce:   //延迟触发（函数抖动）
- assignClone:   //深度合并（深度合并克隆）
- toThousandslsFilter:   //千分位分割
- exportTableToExcel:   //导出table表格到 Excel
- exportJsonToExcel:   //导出JSON数据到Excel
- resetModel:   //重置Model对象
- setModelValue //设置Model 数据 setModelValue(obj, value);
...
```

##### License
-------

[LICENSE](https://github.com/mvpleung/vue-utils-plugin/blob/master/LICENSE)

