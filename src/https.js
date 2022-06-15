import Notification from 'element-ui/lib/notification';
import axios from 'axios';
import Vue from 'vue';
import qs from 'qs';
// import * as Sentry from '@sentry/browser';
//todo 设置默认token 方便测试
// var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTMxMjYwNDksInVzZXIiOiJ7XCJwYXJlbnRUZW5hbnRJZFwiOjAsXCJ0ZW5hbnRJZFwiOjEsXCJ0ZW5hbnROYW1lXCI6XCLmtYvor5Xnp5_miLdcIixcInRpbWVcIjpcIjE2MTI2OTQwNDk2MThcIixcInVzZXJJZFwiOjEsXCJ1c2VyTmFtZVwiOlwi6LaF57qn566h55CG5ZGYXCJ9IiwiaWF0IjoxNjEyNjk0MDQ5fQ.1mNDSL-umzk07SW9fzKCkBaa1X_IGhAedPmtFSFd8H4';
// window.localStorage.setItem('token', token);
// console.log(window.localStorage.getItem('token'))
axios.defaults.headers.common["token"] = window.localStorage.getItem('token');
export const http = axios.create({
    baseURL: process.env.VUE_APP_API,
    timeout: 1000 * 30,
    withCredentials: true
});

function isNewReturnType(data) {
    let keys = Object.keys(data);
    if (keys.length !== 3) return false;
    return ['code', 'data', 'msg'].every(e => keys.includes(e));
}

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    try {
        let data = JSON.parse(window.localStorage.getItem('user'));
        let u = {
            'username': data.userName,
            'id': data.userId
        }
        // Sentry.setUser(u);
    } catch (e) {
    }
    if (config.method === 'get') {
        config.paramsSerializer = params => {
            return qs.stringify(params, {indices: false});
        }
    }
    return config;
});

http.interceptors.response.use(response => {
    if (isNewReturnType(response.data)) {
        switch (response.data.code) {
            case 200:
                return response.data;
            case 401:
                // window.location.href = 'https://iot.tracentsure.com';
                window.location.href = '#/login';
                window.localStorage.removeItem('user'); //  如果请求超时返回 401, 则清除缓存数据, 下次请求返回登录界面
                return Promise.reject({response});
            case 403:
                Notification.error({
                    message: '您没有权限请求信息，请联系管理员。',
                    onClose: function () {
                        window.localStorage.removeItem('noticeError');
                    }
                });
                return Promise.reject({response});
            case 400:
                return Promise.reject({response});
            default:
                return Promise.reject({response});
        }
    } else {
        return response;
    }
}, error => {
    let noticeTipKey = 'noticeError';
    let notice = window.localStorage.getItem(noticeTipKey);
    let response = error.response;

    if (notice === '1' && response && response.status !== 401) {
        return Promise.reject(error);
    } else {
        window.localStorage.setItem(noticeTipKey, '1');
    }
    if (!response || response.status === 500) {
        Notification.warning({
            message: '服务器太久没有响应, 请重试',
            onClose: function () {
                window.localStorage.removeItem(noticeTipKey);
               
            }
        });
        return Promise.reject(error);
    }
    if (response.status === 401) { //  Unauthorized, redirect to login
        let lastUrl = window.localStorage.getItem('lastUrl');
        if (!lastUrl || lastUrl.indexOf('/base/dict') === -1) {
        }
        window.localStorage.removeItem('user'); //  如果请求超时返回 401, 则清除缓存数据, 下次请求返回登录界面
        // window.location.href = 'https://iot.tracentsure.com';
        window.location.href = '#/login';
        return Promise.reject(error);
    }
    if (response.status === 403) {
        Notification.error({
            message: '您没有权限请求信息，请联系管理员。',
            onClose: function () {
                window.localStorage.removeItem(noticeTipKey);
            }
        });
    }
    if (response.status === 400) {
        Notification.error({
            message: '请求失败',
            onClose: function () {
                window.localStorage.removeItem(noticeTipKey);
            }
        });
    }
    if (response.status === 502) {
        Notification.error({
            message: '系统请求失败',
            onClose: function () {
                window.localStorage.removeItem(noticeTipKey);
            }
        });
    }
    return Promise.reject(error);
});

Vue.prototype.$http = http;


/**
 * 发送post请求 添加记录
 * @param url
 * @param params
 * @returns {Promise<unknown>}
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        http.post(url, params)
            .then(response => {
                console.log("POST", url, response)
                resolve( params.isResponse ? response : response.data)
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export function put(url, params) {
    return new Promise((resolve, reject) => {
        http.put(url, params)
            .then(response => {
                resolve(params.isResponse ? response : response.data)
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * 发送get请求
 * @param url
 * @param param
 * @returns {Promise<unknown>}
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        http.get(url, {params: params})
            .then(response => {
                //console.log("GET", url, response)
                resolve(response.data)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export function destroy(url, params) {
    return new Promise((resolve, reject) => {
        http.delete(url, {params: params})
            .then(response => {
                //console.log("DELETE", url, response)
                resolve(response.data)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export default {
    post,
    put,
    get,
    destroy
}
