"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../store/index.js");
const _sfc_main = {
  data() {
    return {
      title: "Hello",
      xieyichecked: false
    };
  },
  onLoad() {
    var token = this.$store.state.token;
    console.log("token:", token);
  },
  methods: {
    //检查是否勾选协议
    xieyiConfirm() {
      this.xieyichecked = !this.xieyichecked;
      console.log(this.xieyichecked);
    },
    goLogin1() {
      console.log("到登录页面1");
      common_vendor.index.navigateTo({
        url: "../login/login"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => _ctx.goTo1()),
    b: common_vendor.o(($event) => $options.goLogin1()),
    c: common_vendor.o(($event) => $options.goLogin1()),
    d: common_vendor.o(($event) => $options.xieyiConfirm())
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/index_login/index_login.vue"]]);
wx.createPage(MiniProgramPage);
