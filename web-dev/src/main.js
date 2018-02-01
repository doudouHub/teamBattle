import Vue from 'vue';
import App from './App';
import {router} from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import "babel-polyfill";
import store from 'store/index'
// 配置文件
import config from 'config.js'

Vue.use(ElementUI);
Vue.prototype.$axios = axios;

const vm = new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');

/***
 * ajax请求数据 - post
 * url 请求接口
 * formData 传输数据
 * cb 成功回调
 * cbl 自定义0时的回调
 * err 报错回调
 **/
Vue.prototype.$http = function (url, formData, cb, cbl, err) {
    axios.post(config.host + url, formData)
        .then(function (res) {
            console.log(res, '获取到数据啦');
            let code = Number(res.data.code);
            switch (code) {
                case 0:
                    try {
                        cbl(res.data.msg);
                    } catch (err) {
                        vm.$message.error(res.data.msg);
                    }
                    break;
                case 1:
                    // 数据返回正确回调
                    let _data = res.data.data;
                    if ((typeof _data == 'string') && _data.constructor == String) {
                        try {
                            _data = JSON.parse(_data);
                        } catch (err) {
                            // console.log(err)
                        }
                    }
                    cb(_data, res.data.msg);
                    break;
                case 2:
                    vm.$router.push('Login');
                    break;
            }
        })
        .catch(function (error) {
            try {
                err(error);
            } catch (_err) {
                console.log(error, '获取失败')
            }
        });
};
// 缓存读取操作
Vue.prototype.$localSave = {
    get: function (key) {
        var data = localStorage.getItem(key);
        try {
            data = JSON.parse(localStorage.getItem(key));
        } catch (err) {
            // console.log(err)
        }
        return data;
    },
    set: function (key, val) {
        val = JSON.stringify(val);
        localStorage.setItem(key, val)
    }
}
// cookie存取操作
Vue.prototype.$cookieSave = {
    // 设置cookies
    set: function (name, value) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    //读取cookies
    get: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
    // 删除cookies
    del: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
}

// 对象深层复制
Vue.prototype.$deepClone = function (data) {
    var obj = {};
    var originQueue = [data];
    var copyQueue = [obj];
    // 以下两个队列用来保存复制过程中访问过的对象，以此来避免对象环的问题（对象的某个属性值是对象本身）
    var visitQueue = [];
    var copyVisitQueue = [];
    while (originQueue.length > 0) {
        var _data = originQueue.shift();
        var _obj = copyQueue.shift();
        visitQueue.push(_data);
        copyVisitQueue.push(_obj);
        for (var key in _data) {
            var _value = _data[key];
            if (typeof _value !== 'object') {
                _obj[key] = _value;
            } else {
                // 使用indexOf可以发现数组中是否存在相同的对象(实现indexOf的难点就在于对象比较)
                var index = visitQueue.indexOf(_value);
                if (index >= 0) {
                    _obj[key] = copyVisitQueue[index];
                }
                originQueue.push(_value);
                _obj[key] = {};
                copyQueue.push(_obj[key]);
            }
        }
    }
    return obj;
};

// 数组对象排序
Vue.prototype.$sortBy = function (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }
}
