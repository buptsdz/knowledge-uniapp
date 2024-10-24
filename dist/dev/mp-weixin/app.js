"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
const utils_request = require("./utils/request.js");
if (!Math) {
  "./pages/basefunction/basefunction.js";
  "./pages/index_login/index_login.js";
  "./pages/login/login.js";
  "./pages/register/register.js";
  "./pages/schoolcicle/schoolcicle.js";
  "./pages/schoolcicle/verification.js";
  "./pages/pertifunction/pertifunction.js";
  "./pages/mine/mine.js";
  "./pages/mine/myCollections.js";
  "./pages/mine/recentlyView.js";
  "./pages/mine/scoreMall.js";
  "./pages/mine/wrongQuestions.js";
}
const _sfc_main = {
  // globalData: {
  // 	isLoggedIn: false,
  // },
  onLaunch: function() {
    console.log("App Launch");
    var token = this.$store.state.token;
    console.log("token：", token);
  },
  onShow: function() {
    console.log("App Show");
    this.checkLoginStatus();
  },
  onHide: function() {
    console.log("App Hide");
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      this.$store.state.token;
      var state = this.$store.state.isLoggedIn;
      console.log("登录状态：", state);
      if (state == true) {
        this.getUserInfo();
      } else {
        return;
      }
    },
    // 获取用户信息
    getUserInfo() {
      var userdataStr = common_vendor.index.getStorageSync("userdata");
      if (userdataStr) {
        var userdata = JSON.parse(userdataStr);
        console.log(typeof userdata, userdata);
        if (userdata.headImg) {
          store_index.store.commit("setAvatar", userdata.headImg);
          console.log("头像地址：", typeof userdata.headImg, userdata.headImg);
        } else {
          console.log("头像地址不存在");
        }
      } else {
        this.$service.get("user-service/api/user").then((response) => {
          console.log("用户信息：", response);
          if (response.data.isSuccess == 1) {
            var userdata2 = response.data.data;
            store_index.store.commit("login", userdata2);
            console.log("头像地址：", response.data.data.headImg);
          }
        }).catch((error) => {
          console.error("请求出错", error);
        });
      }
    }
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.config.globalProperties.$service = utils_request.service;
  app.use(store_index.store);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
