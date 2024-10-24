"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = {
  data() {
    return {
      show: false,
      state: 0,
      //弹窗进行阶段
      isAnimating: false,
      // 控制动画的播放
      highlightedIndex: null,
      // 用来跟踪当前高亮的按钮索引
      buttons: [
        {
          label: "我是初中生"
        },
        {
          label: "我是高中生"
        },
        {
          label: "我是本科生"
        },
        {
          label: "我是研究生"
        }
      ],
      classNumber: "",
      //学号
      currentclasses: [],
      //目前待选年级
      classesCandidates: [
        ["初一", "初二", "初三"],
        ["高一", "高二", "高三"],
        ["大一", "大二", "大三", "大四"],
        ["研一", "研二", "研三"]
      ],
      classes: "",
      //年级
      name: "",
      originalschoolCandidates: [
        {
          id: 2,
          name: "清华大学"
        },
        {
          id: 3,
          name: "北京大学"
        },
        {
          id: 119,
          name: "中国人民大学"
        },
        {
          id: 319,
          name: "北京交通大学"
        },
        {
          id: 340,
          name: "北京工业大学"
        },
        {
          id: 352,
          name: "北京服装学院"
        },
        {
          id: 374,
          name: "北京航空航天大学"
        },
        {
          id: 356,
          name: "北京理工大学"
        },
        {
          id: 363,
          name: "北京科技大学"
        },
        {
          id: 386,
          name: "北方工业大学"
        },
        {
          id: 330,
          name: "北京化工大学"
        },
        {
          id: 323,
          name: "北京体育大学"
        },
        {
          id: 334,
          name: "北京印刷学院"
        },
        {
          id: 381,
          name: "北京邮电大学"
        }
      ],
      schoolCandidates: [],
      // 学校对象数组
      selectedSchoolName: "",
      // 临时存储选中的学校名称
      schoolId: "",
      // 存储选中的学校ID
      studentCardImageSrc: "",
      //学生证照片本地存储路径
      debounceTimer: null,
      // 用于存储防抖定时器
      isSubmitting: false
      //是否处于提交中
    };
  },
  mounted() {
    this.schoolCandidates = this.originalschoolCandidates;
  },
  watch: {
    // 监听schoolName的变化
    selectedSchoolName(newVal, oldVal) {
      if (newVal == null || newVal.length == 0) {
        this.schoolCandidates = this.originalschoolCandidates;
        this.schoolId = null;
        console.log("关键字长度为0");
        return;
      }
      if (newVal !== oldVal) {
        this.fetchSchoolDetailsDebounced(newVal);
      }
    }
  },
  methods: {
    resetProperties() {
      this.state = 0;
      this.isAnimating = false;
      this.highlightedIndex = null;
      this.selectedSchoolName = "";
      this.studentCardImageSrc = "";
      this.name = "";
      this.schoolId = null;
      this.classes = "";
      this.classNumber = "";
      this.show = true;
    },
    //选择身份时点击
    handleButtonClick(index) {
      if (this.isAnimating) {
        return;
      }
      if (this.highlightedIndex === index) {
        console.log("确认: ", this.buttons[index].label);
        this.performAction(index);
      } else {
        this.highlightedIndex = index;
        console.log("当前选中：", this.buttons[index].label);
      }
    },
    //选择身份时确认
    performAction(index) {
      console.log("执行操作，身份索引: ", index);
      this.currentclasses = this.classesCandidates[index];
      this.isAnimating = true;
      setTimeout(() => {
        this.state = 1;
        this.isAnimating = false;
        console.log(this.schoolCandidates);
      }, 2e3);
    },
    //防抖请求学校信息
    fetchSchoolDetailsDebounced(newVal) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.fetchSchoolDetails(newVal);
      }, 400);
    },
    fetchSchoolDetails(newVal) {
      if (this.selectedSchoolName.trim().length === 0 || this.selectedSchoolName == null) {
        return;
      }
      if (/^[a-zA-Z\s]*$/.test(this.selectedSchoolName.trim()))
        return;
      this.$service.post("/search-service/api/school", {
        "q": newVal,
        "current": 1,
        "size": 25
      }).then((response) => {
        console.log("请求学校响应信息：", response);
        if (response.data.isSuccess == 1) {
          this.schoolCandidates = response.data.data.data.map(
            (school) => ({
              name: school.name,
              id: school.id
            })
          );
          console.log("待选学校：", this.schoolCandidates);
          const schoolCandidatesAfterProcess = this.schoolCandidates.map((school) => {
            return {
              ...school,
              name: school.name.replace(/<em>/g, "").replace(/<\/em>/g, "")
            };
          });
          const selectedSchool = schoolCandidatesAfterProcess.find(
            (school) => school.name === newVal
          );
          if (selectedSchool) {
            this.schoolId = selectedSchool.id;
            this.schoolCandidates = [selectedSchool];
          } else {
            this.schoolId = null;
          }
          console.log("当前学校id：", this.schoolId);
        } else {
          console.error(
            "获取学校信息失败:",
            response.data.message
          );
        }
      }).catch((error) => {
        console.error("请求出错", error);
        common_vendor.index.showToast({
          title: "获取学校信息失败",
          icon: "none",
          position: "top",
          duration: 2e3
        });
      });
    },
    //上一页
    back() {
      if (this.isAnimating) {
        return;
      }
      if (this.state == 2) {
        this.classes = "";
      }
      if (this.state == 3) {
        if (this.isSubmitting == true) {
          return;
        }
      }
      this.state = this.state - 1;
    },
    //下一页
    next() {
      if (this.isAnimating) {
        return;
      }
      if (this.state === 1 && this.schoolId == null) {
        common_vendor.index.showToast({
          title: "请填写学校信息",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      if (this.state === 2 && this.classes === "") {
        common_vendor.index.showToast({
          title: "请填写年级信息",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      this.isAnimating = true;
      setTimeout(() => {
        this.state = this.state + 1;
        this.isAnimating = false;
      }, 2e3);
    },
    //结束填写
    quit() {
      setTimeout(() => {
        this.show = false;
      }, 800);
    },
    //关闭弹窗
    noTitlemodalTap: function(e) {
      common_vendor.index.showModal({
        content: "确认关闭吗？这会丢失当前的填写信息",
        confirmText: "确定",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            console.log("用户点击确定");
            this.show = false;
            console.log("this.show:", this.show);
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    //上传照片
    uploadPhoto() {
      common_vendor.index.showActionSheet({
        itemList: ["从相册选择", "拍照"],
        success: (res) => {
          console.log("选择了第" + (res.tapIndex + 1) + "个选项");
          if (res.tapIndex == 0) {
            common_vendor.index.chooseImage({
              count: 1,
              //上传图片的数量，默认是9
              sizeType: ["original", "compressed"],
              //可以指定是原图还是压缩图，默认二者都有
              sourceType: ["album"],
              //从相册选择
              success: (res2) => {
                const tempFilePaths = res2.tempFilePaths;
                this.studentCardImageSrc = tempFilePaths[0];
              }
            });
          } else {
            common_vendor.index.chooseImage({
              count: 1,
              //上传图片的数量，默认是9
              sizeType: ["original", "compressed"],
              //可以指定是原图还是压缩图，默认二者都有
              sourceType: ["camera"],
              //拍照
              success: (res2) => {
                const tempFilePaths = res2.tempFilePaths;
                this.studentCardImageSrc = tempFilePaths[0];
              }
            });
          }
        },
        fail: (err) => {
          console.log("弹窗取消");
        }
      });
    },
    //最后上传所有信息
    upload() {
      if (this.isSubmitting) {
        return;
      }
      const fieldMappings = [
        {
          key: "name",
          message: "请填写姓名"
        },
        {
          key: "classNumber",
          message: "请填写学号"
        },
        {
          key: "classes",
          message: "请选择年级"
        },
        {
          key: "schoolId",
          message: "请选择学校"
        },
        {
          key: "studentCardImageSrc",
          message: "请上传学生证或校园卡照片"
        }
      ];
      const unfilledItem = fieldMappings.find((item) => !this[item.key]);
      if (unfilledItem) {
        common_vendor.index.showToast({
          title: unfilledItem.message,
          // 使用找到的未填项的提示消息
          icon: "none",
          position: "top",
          duration: 2e3
        });
        console.log(unfilledItem.message);
        return;
      }
      this.isSubmitting = true;
      common_vendor.index.showLoading({
        title: "正在上传..."
      });
      const token = common_vendor.index.getStorageSync("token");
      common_vendor.index.uploadFile({
        url: "http://127.0.0.1:280/user-service/api/auth/identity",
        //post请求的地址
        filePath: this.studentCardImageSrc,
        name: "image",
        header: {
          token
        },
        formData: {
          //formData是指除了图片以外，额外加的字段
          classNumber: this.classNumber,
          classes: this.classes,
          name: this.name,
          schoolId: this.schoolId
        },
        success: (uploadFileRes2) => {
          console.log("接口调用成功");
          let responseData;
          try {
            responseData = JSON.parse(uploadFileRes2.data);
          } catch (error) {
            console.error("解析响应数据失败", error);
            common_vendor.index.showToast({
              title: "上传出错，请重试",
              icon: "none"
            });
            return;
          }
          console.log("响应信息：", responseData);
          common_vendor.index.hideLoading();
          if (responseData.isSuccess) {
            console.log("认证信息上传成功！");
            common_vendor.index.showToast({
              title: "上传成功！请等待审核",
              icon: "success",
              duration: 2e3
            });
            setTimeout(() => {
              this.next();
            }, 1200);
          } else {
            console.log("上传出错：", responseData.message);
            common_vendor.index.showToast({
              title: "上传出错：" + responseData.message,
              icon: "none"
            });
          }
        },
        fail: () => {
          console.log("接口调用失败");
          console.log(uploadFileRes.errMsg);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "网络出错，请重试",
            icon: "error"
          });
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    },
    //更新用户信息
    getUserInfo() {
      this.$service.get("/user-service/api/user").then((response) => {
        console.log("响应信息：", response);
        if (response.data.isSuccess == 1) {
          const userdata = response.data.data;
          common_vendor.index.setStorageSync(
            "userdata",
            JSON.stringify(userdata)
          );
          console.log("用户信息", userdata);
        }
      }).catch((error) => {
        console.error("请求出错", error);
      });
    }
  }
};
if (!Array) {
  const _component_circle = common_vendor.resolveComponent("circle");
  const _component_polyline = common_vendor.resolveComponent("polyline");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _easycom_uni_combox2 = common_vendor.resolveComponent("uni-combox");
  const _easycom_uv_overlay2 = common_vendor.resolveComponent("uv-overlay");
  (_component_circle + _component_polyline + _component_svg + _easycom_uni_combox2 + _easycom_uv_overlay2)();
}
const _easycom_uni_combox = () => "./uni_modules/uni-combox/components/uni-combox/uni-combox.js";
const _easycom_uv_overlay = () => "./uni_modules/uv-overlay/components/uv-overlay/uv-overlay.js";
if (!Math) {
  (_easycom_uni_combox + _easycom_uv_overlay)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.state == 0
  }, $data.state == 0 ? {
    b: common_vendor.o(($event) => $options.noTitlemodalTap()),
    c: common_vendor.f($data.buttons, (item, index, i0) => {
      return {
        a: common_vendor.t(item.label),
        b: $data.highlightedIndex === index,
        c: index,
        d: $data.highlightedIndex === index ? 1 : "",
        e: common_vendor.o(($event) => $options.handleButtonClick(index), index)
      };
    }),
    d: $data.isAnimating ? 1 : "",
    e: common_vendor.p({
      fill: "none",
      stroke: "#32CD32",
      ["stroke-width"]: "3",
      cx: "20",
      cy: "20",
      r: "18",
      ["stroke-linecap"]: "round",
      transform: "rotate(-90,20,20)"
    }),
    f: $data.isAnimating ? 1 : "",
    g: common_vendor.p({
      fill: "none",
      stroke: "#32CD32",
      ["stroke-width"]: "4",
      points: "9,21 17,28 30,14",
      ["stroke-linecap"]: "round",
      ["stroke-linejoin"]: "round"
    }),
    h: common_vendor.p({
      width: "40",
      height: "40"
    }),
    i: common_vendor.o(() => {
    })
  } : {}, {
    j: $data.state == 1
  }, $data.state == 1 ? {
    k: common_vendor.o(($event) => $options.noTitlemodalTap()),
    l: common_vendor.o(($event) => $data.selectedSchoolName = $event),
    m: common_vendor.p({
      candidates: this.schoolCandidates.map((school) => school.name),
      placeholder: "请选择所在学校",
      modelValue: $data.selectedSchoolName
    }),
    n: $data.isAnimating ? 1 : "",
    o: common_vendor.p({
      fill: "none",
      stroke: "#32CD32",
      ["stroke-width"]: "3",
      cx: "20",
      cy: "20",
      r: "18",
      ["stroke-linecap"]: "round",
      transform: "rotate(-90,20,20)"
    }),
    p: $data.isAnimating ? 1 : "",
    q: common_vendor.p({
      fill: "none",
      stroke: "#32CD32",
      ["stroke-width"]: "4",
      points: "9,21 17,28 30,14",
      ["stroke-linecap"]: "round",
      ["stroke-linejoin"]: "round"
    }),
    r: common_vendor.p({
      width: "40",
      height: "40"
    }),
    s: common_vendor.o(($event) => $options.back()),
    t: common_vendor.o(($event) => $options.next()),
    v: common_vendor.o(() => {
    })
  } : {}, {
    w: $data.state == 2
  }, $data.state == 2 ? {
    x: common_vendor.o(($event) => $options.noTitlemodalTap()),
    y: common_vendor.o(($event) => $data.classes = $event),
    z: common_vendor.p({
      candidates: $data.currentclasses,
      placeholder: "请选择所在年级",
      modelValue: $data.classes
    }),
    A: $data.isAnimating ? 1 : "",
    B: common_vendor.p({
      fill: "none",
      stroke: "#32CD32",
      ["stroke-width"]: "3",
      cx: "20",
      cy: "20",
      r: "18",
      ["stroke-linecap"]: "round",
      transform: "rotate(-90,20,20)"
    }),
    C: $data.isAnimating ? 1 : "",
    D: common_vendor.p({
      fill: "none",
      stroke: "#32CD32",
      ["stroke-width"]: "4",
      points: "9,21 17,28 30,14",
      ["stroke-linecap"]: "round",
      ["stroke-linejoin"]: "round"
    }),
    E: common_vendor.p({
      width: "40",
      height: "40"
    }),
    F: common_vendor.o(($event) => $options.back()),
    G: common_vendor.o(($event) => $options.next()),
    H: common_vendor.o(() => {
    })
  } : {}, {
    I: $data.state == 3
  }, $data.state == 3 ? common_vendor.e({
    J: common_vendor.o(($event) => $options.noTitlemodalTap()),
    K: $data.name,
    L: common_vendor.o(($event) => $data.name = $event.detail.value),
    M: $data.classNumber,
    N: common_vendor.o(($event) => $data.classNumber = $event.detail.value),
    O: $data.studentCardImageSrc
  }, $data.studentCardImageSrc ? {
    P: $data.studentCardImageSrc
  } : {}, {
    Q: common_vendor.o(($event) => $options.uploadPhoto()),
    R: $data.isAnimating ? 1 : "",
    S: common_vendor.p({
      fill: "none",
      stroke: "#32CD32",
      ["stroke-width"]: "3",
      cx: "20",
      cy: "20",
      r: "18",
      ["stroke-linecap"]: "round",
      transform: "rotate(-90,20,20)"
    }),
    T: $data.isAnimating ? 1 : "",
    U: common_vendor.p({
      fill: "none",
      stroke: "#32CD32",
      ["stroke-width"]: "4",
      points: "9,21 17,28 30,14",
      ["stroke-linecap"]: "round",
      ["stroke-linejoin"]: "round"
    }),
    V: common_vendor.p({
      width: "40",
      height: "40"
    }),
    W: common_vendor.o(($event) => $options.back()),
    X: common_vendor.o(($event) => $options.upload()),
    Y: $data.isSubmitting,
    Z: common_vendor.o(() => {
    })
  }) : {}, {
    aa: $data.state == 4
  }, $data.state == 4 ? {
    ab: common_vendor.o(($event) => $options.quit()),
    ac: common_vendor.o(() => {
    })
  } : {}, {
    ad: common_vendor.p({
      show: $data.show
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/HBuilderX/Program_files/knowledge-uniapp/src/pages/schoolcicle/verification.vue"]]);
exports.MiniProgramPage = MiniProgramPage;
