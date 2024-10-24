"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const topSearchAndLogin = () => "../../components/topSearchAndLogin.js";
const _sfc_main = {
  components: {
    topSearchAndLogin
  },
  data() {
    return {
      //传到顶部子组件的数据
      // loginInfo: {
      // 	isLoggedIn: false,
      // 	userAvatar: '../../static/image/resource/basepage-defaultAvatar.png', // 默认用户头像地址
      // },
      //顶部滑动大图数据
      topTitle: "登录",
      topUrlList: [
        "../../static/image/logo/logo.png",
        "../../static/image/resource/basepage-top.png",
        "../../static/image/resource/basepage-top.png"
      ],
      bottomList1: [
        {
          image: "../../static/image/logo/logo.png",
          text: "赛代表大撒大撒"
        },
        {
          image: "../../static/image/logo/logo.png",
          text: "1235432"
        },
        {
          image: "../../static/image/logo/logo.png",
          text: "你说什么"
        },
        {
          image: "../../static/image/logo/logo.png",
          text: "不知道不知道不知道"
        }
      ]
    };
  },
  // onLoad() {
  // 	var token = this.$store.state.token;
  // 	console.log("token：", token);
  // },
  onShow() {
  },
  methods: {}
};
if (!Array) {
  const _component_topSearchAndLogin = common_vendor.resolveComponent("topSearchAndLogin");
  _component_topSearchAndLogin();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: common_vendor.p({
      textMsg: $data.topTitle
    }),
    c: common_vendor.f($data.topUrlList, (url, index, i0) => {
      return {
        a: url,
        b: index
      };
    }),
    d: common_vendor.f($data.bottomList1, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.text),
        c: index
      };
    }),
    e: common_vendor.f($data.bottomList1, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.text),
        c: index
      };
    }),
    f: common_vendor.f($data.bottomList1, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.text),
        c: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/basefunction/basefunction.vue"]]);
wx.createPage(MiniProgramPage);
