"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      user: {
        username: "",
        password: "",
        vercode: "",
        phonenum: ""
      },
      phoneIstrue: 0,
      sendcode: {
        isButtonDisabled: false,
        countdown: 0
      },
      passwordVisible: false
    };
  },
  methods: {
    //设置密码可见状态
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
      console.log("密码状态", this.passwordVisible);
    },
    registOnSubmit() {
      const requestData = {
        username: this.user.username,
        password: this.user.password,
        code: this.user.vercode,
        phone: this.user.phonenum
      };
      if (!requestData.username || !requestData.password || !requestData.code || !requestData.phone) {
        return;
      }
      this.isPhone(this.user.phonenum);
      if (this.phoneIstrue == 0) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号！",
          icon: "error",
          position: "top"
        });
        return;
      }
      this.$service.post("/user-service/api/auth/register", requestData).then((response2) => {
        if (response2.data.isSuccess == 1) {
          common_vendor.index.showToast({
            title: "注册成功",
            icon: "success",
            duration: 2e3
          });
          this.$router.push("../login/login");
        } else {
          common_vendor.index.showToast({
            title: "注册失败: " + response2.data.message,
            icon: "none",
            duration: 2200
          });
        }
      }).catch((error) => {
        common_vendor.index.showToast({
          title: "请求错误" + response.data.message,
          icon: "none",
          duration: 2e3
        });
        console.error("注册请求失败:", error);
      });
    },
    //验证电话号码
    isPhone(phone) {
      var reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (phone.length == 11) {
        if (!reg.test(phone)) {
          this.phoneIstrue = 0;
          console.log("电话号码输入错误！");
        } else {
          this.phoneIstrue = 1;
          console.log("电话号码输入正确！");
        }
      } else {
        console.log("电话号码输入错误！");
        this.phoneIstrue = 0;
      }
    },
    //发送验证码
    async getVercode() {
      try {
        this.isPhone(this.user.phonenum);
        if (this.phoneIstrue == 0) {
          common_vendor.index.showToast({
            title: "请输入正确的手机号！",
            icon: "error",
            position: "top"
          });
          return;
        }
        common_vendor.index.showLoading({
          title: "加载中",
          mask: true
        });
        const response2 = await this.$service.post("/user-service/api/auth/sms", {
          phone: this.user.phonenum
        });
        if (response2.data.isSuccess == 1) {
          this.startCountdown();
          common_vendor.index.showToast({
            title: "验证码已发送",
            icon: "success",
            duration: 2e3
          });
        } else {
          common_vendor.index.showToast({
            title: "发送失败,请重试",
            icon: "none",
            duration: 2e3
          });
        }
      } catch (err) {
        console.log(err);
        common_vendor.index.showToast({
          title: "请求出错",
          icon: "none",
          duration: 2400
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    //发送验证码间隔
    startCountdown() {
      this.sendcode.isButtonDisabled = true;
      this.sendcode.countdown = 60;
      const interval = setInterval(() => {
        this.sendcode.countdown--;
        if (this.sendcode.countdown === 0) {
          clearInterval(interval);
          this.sendcode.isButtonDisabled = false;
        }
      }, 1e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.user.username,
    b: common_vendor.o(($event) => $data.user.username = $event.detail.value),
    c: !$data.passwordVisible,
    d: $data.user.password,
    e: common_vendor.o(($event) => $data.user.password = $event.detail.value),
    f: $data.passwordVisible ? "../../static/image/symple/pin-visible.png" : "../../static/image/symple/pin-invisible.png",
    g: common_vendor.o((...args) => $options.togglePasswordVisibility && $options.togglePasswordVisibility(...args)),
    h: $data.user.phonenum,
    i: common_vendor.o(($event) => $data.user.phonenum = $event.detail.value),
    j: common_vendor.t($data.sendcode.countdown ? `${$data.sendcode.countdown}` : "获取验证码"),
    k: $data.sendcode.isButtonDisabled ? 1 : "",
    l: common_vendor.o((...args) => $options.getVercode && $options.getVercode(...args)),
    m: $data.sendcode.isButtonDisabled,
    n: $data.user.vercode,
    o: common_vendor.o(($event) => $data.user.vercode = $event.detail.value),
    p: common_vendor.o((...args) => $options.registOnSubmit && $options.registOnSubmit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/register/register.vue"]]);
wx.createPage(MiniProgramPage);
