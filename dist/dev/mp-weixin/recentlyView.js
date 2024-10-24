"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = {
  data() {
    return {
      listArr: [
        {
          imageUrl: "/static/image/test/dog.jpg",
          title: "重庆医科大学 xxxxxx"
        },
        {
          imageUrl: "/static/image/test/beida.jpg",
          title: "北京邮电大学 xxxxxx"
        },
        {
          imageUrl: "/static/image/test/qinghua.jpg",
          title: "dbiasbcabcaocbsadasdadqawwvevcwsvw"
        },
        {
          imageUrl: "/static/image/test/dazhuan.jpg",
          title: "北京邮电大专 xxxxxx"
        },
        {
          imageUrl: "/static/image/test/dog.jpg",
          title: "jj"
        },
        {
          imageUrl: "/static/image/test/dog.jpg",
          title: "重庆医科大学 xxxxxx"
        },
        {
          imageUrl: "/static/image/test/beida.jpg",
          title: "北京邮电大学 xxxxxx"
        },
        {
          imageUrl: "/static/image/test/qinghua.jpg",
          title: "dbiasbcabcaocbsadasdadqawwvevcwsvw"
        }
      ]
    };
  },
  computed: {
    // 处理后的行数据，每行两个元素
    rows() {
      let rows = [];
      for (let i = 0; i < this.listArr.length; i += 2) {
        rows.push(this.listArr.slice(i, i + 2));
      }
      return rows;
    }
  },
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($options.rows, (row, index, i0) => {
      return {
        a: common_vendor.f(row, (item, k1, i1) => {
          return {
            a: item.imageUrl,
            b: common_vendor.t(item.title),
            c: item.title
          };
        }),
        b: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/mine/recentlyView.vue"]]);
exports.MiniProgramPage = MiniProgramPage;
