"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = {
  data() {
    return {
      papers: [
        {
          title: "2023全国乙卷数学高考真题 3题",
          imgSrc: "/static/image/resource/samplePaper.png"
        },
        {
          title: "2023全国乙卷数学高考真题 3题",
          imgSrc: "/static/image/resource/samplePaper.png"
        },
        {
          title: "2023全国乙卷数学高考真题 3题",
          imgSrc: "/static/image/resource/samplePaper.png"
        },
        {
          title: "2023全国乙卷数学高考真题 3题",
          imgSrc: "/static/image/resource/samplePaper.png"
        }
      ]
    };
  },
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.papers, (paper, index, i0) => {
      return {
        a: paper.imgSrc,
        b: common_vendor.t(paper.title),
        c: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/mine/wrongQuestions.vue"]]);
exports.MiniProgramPage = MiniProgramPage;
