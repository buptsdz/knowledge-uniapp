"use strict";
const common_vendor = require("../common/vendor.js");
const store = common_vendor.createStore({
  state: {
    //防止调试时刷新页面重置vuex中数据
    isLoggedIn: common_vendor.index.getStorageSync("isLoggedIn") || false,
    //用户是否登录
    userdata: {},
    //用户数据
    token: common_vendor.index.getStorageSync("token")
  },
  //mutations定义同步操作的方法
  mutations: {
    setAvatar(state, url) {
      state.userdata.headImg = url;
    },
    //设置登录
    setLoggedIn(state) {
      state.isLoggedIn = true;
      common_vendor.index.setStorageSync("isLoggedIn", state.isLoggedIn);
      console.log("登录状态：", state.isLoggedIn);
    },
    //存token
    setToken(state, token) {
      state.token = token;
      common_vendor.index.setStorageSync("token", token);
      console.log("token已保存：", token);
    },
    //登录
    login(state, userdata) {
      state.userdata = userdata;
      console.log(typeof userdata, userdata);
      common_vendor.index.setStorageSync("userdata", JSON.stringify(userdata));
      console.log("登录信息:", state.userdata);
    },
    // 退出登录
    logout(state) {
      state.isLoggedIn = false;
      state.userdata = {};
      state.token = "";
      common_vendor.index.removeStorageSync("userdata");
      common_vendor.index.removeStorageSync("token");
      common_vendor.index.setStorageSync("isLoggedIn", false);
      console.log("已退出登录");
      console.log("token：", state.token);
      console.log("登录信息", common_vendor.index.getStorageSync("userdata"));
    }
  },
  actions: {}
});
exports.store = store;
