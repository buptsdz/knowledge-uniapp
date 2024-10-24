"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const _sfc_main = {
  data() {
    return {
      user: {
        //测试号码17315718923,用户名11,密码11
        //15805293579,用户名sdzsdzsdz2,密码12345678
        usernameOrPhone: "",
        password: ""
      },
      passwordVisible: false
      //密码是否可见
    };
  },
  onLoad() {
    console.log("密码状态", this.passwordVisible);
  },
  methods: {
    //设置密码可见状态
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
      console.log("密码状态", this.passwordVisible);
    },
    async onSubmit(values) {
      if (this.user.usernameOrPhone.length == 0 || this.user.password == 0) {
        common_vendor.index.showToast({
          title: "输入的手机号或密码不能为空！",
          icon: "error",
          position: "top"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "登录中",
        mask: true
      });
      this.$service.post("/user-service/api/auth/login", {
        usernameOrPhone: this.user.usernameOrPhone,
        password: this.user.password
      }).then((res) => {
        console.log("登录信息：", res);
        if (res.data.isSuccess == 1) {
          var token = res.data.data.token;
          store_index.store.commit("setToken", token);
          store_index.store.commit("setLoggedIn");
          common_vendor.index.showToast({
            title: "登录成功！",
            icon: "success"
          });
          this.setUserInfo();
          setTimeout(() => {
            common_vendor.index.switchTab({
              url: "/pages/basefunction/basefunction"
            });
          }, 500);
        } else {
          common_vendor.index.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2e3
          });
        }
      }).catch((err) => {
        console.log(err);
        common_vendor.index.showToast({
          title: "网络错误，请重试",
          icon: "none",
          duration: 2e3
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    // 获取用户信息
    async setUserInfo(retryCount = 3) {
      try {
        const response = await this.$service.get("/user-service/api/user");
        console.log("响应信息：", response);
        if (response.data.isSuccess == 1) {
          const userdata = response.data.data;
          console.log(typeof userdata);
          store_index.store.commit("login", userdata);
          store_index.store.commit("setLoggedIn");
        } else {
          throw new Error("未获取到用户信息");
        }
      } catch (error) {
        console.log("请求出错", error);
        if (retryCount > 0) {
          console.log(`尝试重新获取用户信息，剩余重试次数：${retryCount - 1}`);
          await this.setUserInfo(retryCount - 1);
        } else {
          common_vendor.index.showToast({
            title: "获取用户信息失败",
            icon: "none",
            duration: 2e3
          });
        }
      }
    },
    goTores() {
      console.log("到注册页面");
      common_vendor.index.navigateTo({
        url: "../register/register"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.user.usernameOrPhone,
    b: common_vendor.o(($event) => $data.user.usernameOrPhone = $event.detail.value),
    c: !$data.passwordVisible,
    d: $data.user.password,
    e: common_vendor.o(($event) => $data.user.password = $event.detail.value),
    f: common_vendor.o((...args) => $options.togglePasswordVisibility && $options.togglePasswordVisibility(...args)),
    g: $data.passwordVisible ? "../../static/image/symple/pin-visible.png" : "../../static/image/symple/pin-invisible.png",
    h: common_vendor.o(($event) => _ctx.goTo()),
    i: common_vendor.o((...args) => $options.onSubmit && $options.onSubmit(...args)),
    j: common_vendor.o(($event) => $options.goTores())
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
