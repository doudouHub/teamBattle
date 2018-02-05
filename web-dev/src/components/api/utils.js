/***
 * 工具类api
 **/

import Vue from 'vue';
import axios from 'axios';
import config from "../../config";

Vue.prototype.$axios = axios;

/***
 * ajax请求数据 - post
 * url 请求接口
 * formData 传输数据
 * cb 成功回调
 * cbl 自定义0时的回调
 * err 报错回调
 **/
Vue.prototype.$http = function (type, url, formData, cb, cbl, err, that) {
    // 当存在某些特定参数，独处理赋值
    // if (formData.key) {
    //     // 如果参数中需要传递key
    //     formData.safetime = (new Date()).valueOf();
    //     formData.safeid = this.userId;
    //     formData.key = md5(this.userId + formData.safetime + 'jevictek.homework');
    // }
    // if (formData.userId) {
    //     formData.userId = this.userId;
    // }
    // if (formData.userid) {
    //     formData.userid = this.userId;
    // }
    // if (formData.teacherId) {
    //     formData.teacherId = this.userId;
    // }

    let CancelToken = axios.CancelToken;
    axios.request({
        baseURL: config.host,
        url: url,
        method: type,
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        params: formData,
        data: formData,
        timeout: 60000,
        responseType: 'json',
        cancelToken: new CancelToken(function executor(c) {
            // executor 函数接收一个 cancel 函数作为参数
            try {
                that.cancelToken = c;
            } catch (err) {
            }
        })
    })
        .then(function (res) {
            // console.log(res, '请求返回');
            if (process.env.NODE_ENV === 'development') {
                cb(res.data)
                return;
            }
            let code = Number(res.data.code);
            switch (code) {
                case 0:

                    break;
                case 1:
                    if (code === -4004) {
                        // 未转换成功
                        cb(res.data)
                    } else {
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
                    }
                    break;
            }
        })
        .catch(function (error) {
            try {
                err(error);
            } catch (_err) {
                console.log(error);
            }
        });
};
// 离线缓存读取操作
Vue.prototype.$localSave = {
    get: function (key) {
        let data = localStorage.getItem(key);
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
};
// 会话缓存读取操作
Vue.prototype.$sessionSave = {
    get: function (key) {
        let data = sessionStorage.getItem(key);
        try {
            data = JSON.parse(sessionStorage.getItem(key));
        } catch (err) {
            // console.log(err)
        }
        return data;
    },
    set: function (key, val) {
        val = JSON.stringify(val);
        sessionStorage.setItem(key, val)
    }
};
// cookie存取操作
Vue.prototype.$cookieSave = {
    // 设置cookies
    set: function (name, value) {
        let Days = 30;
        let exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    //读取cookies
    get: function (name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
    // 删除cookies
    del: function (name) {
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
}

// 对象深层复制
Vue.prototype.$deepClone = function (data) {
    let obj = {};
    let originQueue = [data];
    let copyQueue = [obj];
    // 以下两个队列用来保存复制过程中访问过的对象，以此来避免对象环的问题（对象的某个属性值是对象本身）
    let visitQueue = [];
    let copyVisitQueue = [];
    while (originQueue.length > 0) {
        let _data = originQueue.shift();
        let _obj = copyQueue.shift();
        visitQueue.push(_data);
        copyVisitQueue.push(_obj);
        for (let key in _data) {
            let _value = _data[key];
            if (typeof _value !== 'object') {
                _obj[key] = _value;
            } else {
                // 使用indexOf可以发现数组中是否存在相同的对象(实现indexOf的难点就在于对象比较)
                let index = visitQueue.indexOf(_value);
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
        let val1 = obj1[prop];
        let val2 = obj2[prop];
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
