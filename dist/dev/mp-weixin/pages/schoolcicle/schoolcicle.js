"use strict";
const common_vendor = require("../../common/vendor.js");
const verification = () => "./verification2.js";
const _sfc_main = {
  components: {
    verification
  },
  data() {
    return {};
  },
  methods: {
    //点击发布时的验证逻辑
    verification() {
      const token = this.$store.state.token;
      if (token == null || token.length == 0) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none",
          position: "top",
          duration: 2e3
        });
        console.log("请先登录");
        return;
      }
      var userdataStr = common_vendor.index.getStorageSync("userdata");
      if (userdataStr) {
        var userdata = JSON.parse(userdataStr);
        if (userdata.auth == "未认证") {
          common_vendor.index.showModal({
            content: "发布需要认证学生信息，是否去认证？",
            confirmText: "现在去",
            cancelText: "取消",
            success: (res) => {
              if (res.confirm) {
                console.log("用户点击确定");
                this.$refs.verificationRef.resetProperties();
              } else if (res.cancel) {
                console.log("用户点击取消");
                return;
              }
            }
          });
        }
      }
    }
  }
};
if (!Array) {
  const _component_verification = common_vendor.resolveComponent("verification");
  _component_verification();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.verification()),
    b: common_vendor.sr("verificationRef", "57bfea49-0")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/schoolcicle/schoolcicle.vue"]]);
wx.createPage(MiniProgramPage);
