"use strict";
const common_vendor = require("../common/vendor.js");
const store_index = require("../store/index.js");
const url_all = {
  "DEV": "http://127.0.0.1:280",
  //本地开发
  "TEST": "http://www.liuchen.work:280"
  // 测试
};
const service = common_vendor.axios.create({
  // baseURL 将自动加在 url`前面，除非 url 是一个绝对 URL。
  baseURL: url_all["DEV"],
  // 调整当前环境
  // timeout设置一个请求超时时间，如果请求时间超过了timeout，请求将被中断，单位为毫秒（ms）
  timeout: 2500,
  // headers是被发送的自定义请求头，请求头内容需要根据后端要求去设置，这里我们使用本项目请求头。
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
});
service.interceptors.request.use(
  (config) => {
    var token = store_index.store.state.token;
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
exports.service = service;
