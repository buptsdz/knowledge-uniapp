"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const common_assets = require("../../common/assets.js");
const topSearchAndLogin = () => "../../components/topSearchAndLogin.js";
const wrongQuestions = () => "./wrongQuestions2.js";
const recentlyView = () => "./recentlyView2.js";
const myCollections = () => "./myCollections2.js";
const scoreMall = () => "./scoreMall2.js";
const _sfc_main = {
  components: {
    topSearchAndLogin,
    wrongQuestions,
    recentlyView,
    myCollections,
    scoreMall
  },
  data() {
    return {
      topTitle: "我的",
      userdata: {
        avatar: "/static/image/resource/basepage-defaultAvatar.png",
        username: "用户1654351435",
        level: 1,
        location: "武汉",
        identity: "学生",
        score: 0,
        //积分
        fans: 0,
        //粉丝
        follow: 0,
        //关注
        creatity: 0,
        //创作
        friends: 0
        //好友
      },
      buttons: ["近期错题", "最近浏览", "我的收藏", "积分商城"],
      activeIndex: 0
      // 初始值为0表示第一个按钮被选中
    };
  },
  computed: common_vendor.mapState({
    // 从state中拿到数据 箭头函数可使代码更简练
    userAvatar: (state) => state.userdata.headImg,
    isloggdin: (state) => state.isLoggedIn
  }),
  onShow() {
    console.log("登录状态", this.isloggdin);
  },
  methods: {
    changeColor(index) {
      this.activeIndex = index;
    },
    logOut() {
      store_index.store.commit("logout");
      common_vendor.index.showToast({
        title: "已退出登录",
        icon: "success",
        duration: 2e3
      });
    }
  }
};
if (!Array) {
  const _component_topSearchAndLogin = common_vendor.resolveComponent("topSearchAndLogin");
  const _component_wrongQuestions = common_vendor.resolveComponent("wrongQuestions");
  const _component_recentlyView = common_vendor.resolveComponent("recentlyView");
  const _component_myCollections = common_vendor.resolveComponent("myCollections");
  const _component_scoreMall = common_vendor.resolveComponent("scoreMall");
  (_component_topSearchAndLogin + _component_wrongQuestions + _component_recentlyView + _component_myCollections + _component_scoreMall)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      textMsg: $data.topTitle
    }),
    b: _ctx.userAvatar ? _ctx.userAvatar : this.userdata.avatar,
    c: common_vendor.t($data.userdata.username),
    d: common_vendor.t($data.userdata.level),
    e: common_assets._imports_0$1,
    f: common_assets._imports_1,
    g: common_vendor.t($data.userdata.location),
    h: common_vendor.t($data.userdata.identity),
    i: common_vendor.t($data.userdata.score),
    j: common_vendor.t($data.userdata.fans),
    k: common_vendor.t($data.userdata.follow),
    l: common_vendor.t($data.userdata.creatity),
    m: common_vendor.t($data.userdata.friends),
    n: common_assets._imports_2,
    o: common_assets._imports_3,
    p: common_assets._imports_4,
    q: common_vendor.f($data.buttons, (button, index, i0) => {
      return {
        a: common_vendor.t(button),
        b: index,
        c: common_vendor.o(($event) => $options.changeColor(index), index),
        d: $data.activeIndex === index ? 1 : ""
      };
    }),
    r: _ctx.isloggdin === false
  }, _ctx.isloggdin === false ? {} : {}, {
    s: $data.activeIndex === 0 && _ctx.isloggdin === true,
    t: $data.activeIndex === 1 && _ctx.isloggdin === true,
    v: $data.activeIndex === 2 && _ctx.isloggdin === true
  }, $data.activeIndex === 2 && _ctx.isloggdin === true ? {} : {}, {
    w: $data.activeIndex === 3 && _ctx.isloggdin === true
  }, $data.activeIndex === 3 && _ctx.isloggdin === true ? {} : {}, {
    x: common_vendor.o((...args) => $options.logOut && $options.logOut(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/mine/mine.vue"]]);
wx.createPage(MiniProgramPage);
