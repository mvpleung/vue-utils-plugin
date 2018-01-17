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
- is 数据类型判断
- getUrlParams 获取URL参数
- evalJson 解析JSON
- formatDateTime 格式化日期
- uuid UUID
...
```

##### License
-------

[LICENSE](https://github.com/mvpleung/vue-utils-plugin/blob/master/LICENSE)

