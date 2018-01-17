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
- is 数据类型判断
- getUrlParams 获取URL参数
- evalJson 解析JSON
- formatDateTime 格式化日期
- uuid UUID
...
```

License
-------

    Copyright 2017 mvpleung

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

