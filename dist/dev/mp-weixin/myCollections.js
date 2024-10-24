"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = {
  data() {
    return {
      paperList: [
        {
          papername: "2022年全国普通高等学校招生全国 统一考试真题（全国甲卷）：语文",
          level: 6,
          quizProgress: 10,
          total: 22
        },
        {
          papername: "2022年全国普通高等学校招生全国 统一考试真题（全国甲卷）：数学",
          level: 6,
          quizProgress: 10,
          total: 22
        },
        {
          papername: "2022年全国普通高等学校招生全国 统一考试真题（全国甲卷）：英语",
          level: 6,
          quizProgress: 10,
          total: 22
        }
      ]
    };
  },
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.paperList && $data.paperList.length > 0
  }, $data.paperList && $data.paperList.length > 0 ? {
    b: common_vendor.f($data.paperList, (paper, index, i0) => {
      return {
        a: index
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/mine/myCollections.vue"]]);
exports.MiniProgramPage = MiniProgramPage;
