"use strict";
const common_vendor = require("../common/vendor.js");
require("../store/index.js");
const common_assets = require("../common/assets.js");
const _sfc_main = {
  name: "topSearchAndLogin",
  props: ["textMsg"],
  data() {
    return {
      defaultAvatarUrl: "/static/image/resource/basepage-defaultAvatar.png"
    };
  },
  computed: common_vendor.mapState({
    // 从state中拿到数据 箭头函数可使代码更简练
    isLoggedIn: (state) => state.isLoggedIn,
    userAvatar: (state) => state.userdata.headImg
  }),
  methods: {
    goToMine() {
      common_vendor.index.switchTab({
        url: "/pages/mine/mine"
      });
    },
    // 未登录状态点击头像跳转到登录页面
    goToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/index_login/index_login"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$2,
    b: _ctx.isLoggedIn
  }, _ctx.isLoggedIn ? {
    c: _ctx.userAvatar ? _ctx.userAvatar : $data.defaultAvatarUrl,
    d: common_vendor.o((...args) => $options.goToMine && $options.goToMine(...args))
  } : {
    e: common_vendor.t($props.textMsg),
    f: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/components/topSearchAndLogin.vue"]]);
wx.createComponent(Component);
