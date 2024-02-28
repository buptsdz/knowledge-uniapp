<template>
	<view class="status_bar">
		<!-- 这里是状态栏 -->
	</view>
	<button @tap="verification()">发布</button>
	<uv-overlay :show="show" style="z-index: 100">
		<view class="warp">
			<!-- 选择身份 -->
			<view class="rect" @tap.stop v-if="state == 0">
				<image @tap="noTitlemodalTap()" class="rect-cancel" src="../../static/image/symple/cancel.svg" mode="">
				</image>
				<view class="rect-title">
					<text class="title-text"> 选择身份 </text>
					<image style="height: 25px; width: 72%" src="../../static/image/resource/split-line.png"
						mode="aspectFit"></image>
				</view>
				<view class="choose-grade">
					<button v-for="(item, index) in buttons" :key="index" :class="{
                            'highlight-background': highlightedIndex === index,
                        }" @click="handleButtonClick(index)">
						{{ item.label }}
						<image v-show="highlightedIndex === index" style="height: 25px; width: 25px"
							src="../../static/image/symple/arrow-forward.png" mode=""></image>
					</button>
				</view>
				<!-- 确认动画 -->
				<view class="check" style="margin-top: -5px">
					<svg width="40" height="40">
						<circle class="circle" fill="none" stroke="#32CD32" stroke-width="3" cx="20" cy="20" r="18"
							stroke-linecap="round" transform="rotate(-90,20,20)"
							:class="{ animateCircle: isAnimating }" />
						<polyline class="tick" fill="none" stroke="#32CD32" stroke-width="4" points="9,21 17,28 30,14"
							stroke-linecap="round" stroke-linejoin="round" :class="{ animateTick: isAnimating }" />
					</svg>
				</view>
			</view>
			<!-- 选择学校 -->
			<view class="rect" @tap.stop v-if="state == 1">
				<image @tap="noTitlemodalTap()" class="rect-cancel" src="../../static/image/symple/cancel.svg" mode="">
				</image>
				<view class="rect-title">
					<text class="title-text"> 选择学校 </text>
					<image style="height: 25px; width: 72%" src="../../static/image/resource/split-line.png"
						mode="aspectFit"></image>
				</view>
				<view class="choose-school">
					<text class="choose-school-text">你的学校</text>
					<view class="input-section">
						<uni-combox class="choose-school-input" v-model="selectedSchoolName" :candidates="
                                this.schoolCandidates.map(
                                    (school) => school.name
                                )
                            " placeholder="请选择所在学校"></uni-combox>
					</view>
				</view>
				<!-- 确认动画 -->
				<view style="flex-grow: 1; display: flex">
					<view class="check">
						<svg width="40" height="40">
							<circle class="circle" fill="none" stroke="#32CD32" stroke-width="3" cx="20" cy="20" r="18"
								stroke-linecap="round" transform="rotate(-90,20,20)"
								:class="{ animateCircle: isAnimating }" />
							<polyline class="tick" fill="none" stroke="#32CD32" stroke-width="4"
								points="9,21 17,28 30,14" stroke-linecap="round" stroke-linejoin="round"
								:class="{ animateTick: isAnimating }" />
						</svg>
					</view>
				</view>
				<view class="bottom">
					<view class="back" @tap="back()">
						<image style="height: 30px; width: 30px" src="../../static/image/symple/arrow-back.png" mode="">
						</image>
						<text>返回上一页</text>
					</view>
					<view class="next" @tap="next()">
						<text>继续</text>
						<image style="height: 30px; width: 30px" src="../../static/image/symple/arrow-forward.png"
							mode=""></image>
					</view>
				</view>
			</view>
			<!-- 选择年级 -->
			<view class="rect" @tap.stop v-if="state == 2">
				<image @tap="noTitlemodalTap()" class="rect-cancel" src="../../static/image/symple/cancel.svg" mode="">
				</image>
				<view class="rect-title">
					<text class="title-text"> 选择年级 </text>
					<image style="height: 25px; width: 72%" src="../../static/image/resource/split-line.png"
						mode="aspectFit"></image>
				</view>
				<view class="choose-classes">
					<text class="choose-classes-text">你的年级</text>
					<view class="input-section">
						<uni-combox class="choose-classes-input" :candidates="currentclasses" placeholder="请选择所在年级"
							v-model="classes"></uni-combox>
					</view>
				</view>
				<!-- 确认动画 -->
				<view style="flex-grow: 1; display: flex">
					<view class="check">
						<svg width="40" height="40">
							<circle class="circle" fill="none" stroke="#32CD32" stroke-width="3" cx="20" cy="20" r="18"
								stroke-linecap="round" transform="rotate(-90,20,20)"
								:class="{ animateCircle: isAnimating }" />
							<polyline class="tick" fill="none" stroke="#32CD32" stroke-width="4"
								points="9,21 17,28 30,14" stroke-linecap="round" stroke-linejoin="round"
								:class="{ animateTick: isAnimating }" />
						</svg>
					</view>
				</view>
				<view class="bottom">
					<view class="back" @tap="back()">
						<image style="height: 30px; width: 30px" src="../../static/image/symple/arrow-back.png" mode="">
						</image>
						<text>返回上一页</text>
					</view>
					<view class="next" @tap="next()">
						<text>继续</text>
						<image style="height: 30px; width: 30px" src="../../static/image/symple/arrow-forward.png"
							mode=""></image>
					</view>
				</view>
			</view>
			<!-- 填写基本信息 -->
			<view class="rect" @tap.stop v-if="state == 3">
				<image @tap="noTitlemodalTap()" class="rect-cancel" src="../../static/image/symple/cancel.svg" mode="">
				</image>
				<view class="rect-title">
					<text class="title-text"> 填写基本信息 </text>
					<image style="height: 25px; width: 72%" src="../../static/image/resource/split-line.png"
						mode="aspectFit"></image>
				</view>
				<view class="common-input">
					<text class="common-text">你的姓名</text>
					<view class="input-section">
						<input class="input" type="text" v-model="name" />
					</view>
				</view>
				<view class="common-input">
					<text class="common-text">你的学号</text>
					<view class="input-section">
						<input class="input" type="number" v-model="classNumber" />
					</view>
				</view>
				<view class="common-input">
					<text class="common-text">上传学生证|校园卡</text>
				</view>
				<!-- 上传学生证 -->
				<view class="upload" @tap="uploadPhoto()">
					<image v-if="studentCardImageSrc" :src="studentCardImageSrc" class="uploaded-image"></image>
					<image v-else style="height: 35px; width: 35px; opacity: 0.4"
						src="../../static/image/symple/upload.png"></image>
				</view>
				<!-- 确认动画 -->
				<view style="flex-grow: 1; display: flex">
					<view class="check">
						<svg width="40" height="40">
							<circle class="circle" fill="none" stroke="#32CD32" stroke-width="3" cx="20" cy="20" r="18"
								stroke-linecap="round" transform="rotate(-90,20,20)"
								:class="{ animateCircle: isAnimating }" />
							<polyline class="tick" fill="none" stroke="#32CD32" stroke-width="4"
								points="9,21 17,28 30,14" stroke-linecap="round" stroke-linejoin="round"
								:class="{ animateTick: isAnimating }" />
						</svg>
					</view>
				</view>
				<!-- 底部 -->
				<view class="bottom">
					<view class="back" @tap="back()">
						<image style="height: 30px; width: 30px" src="../../static/image/symple/arrow-back.png" mode="">
						</image>
						<text>返回上一页</text>
					</view>
					<view class="next" @tap="upload()" :disabled="isSubmitting">
						<text>提交</text>
						<image style="height: 30px; width: 30px" src="../../static/image/symple/done.png" mode="">
						</image>
					</view>
				</view>
			</view>
			<!-- 末尾结束页-->
			<view class="rect" @tap.stop v-if="state == 4">
				<view class="rect-title">
					<text class="title-text" style="margin-top: 18px">
						填写完毕
					</text>
					<image style="height: 25px; width: 72%" src="../../static/image/resource/split-line.png"
						mode="aspectFit"></image>
				</view>
				<view class="end-page">
					<text>您已完成填写，请等待审核！</text>
				</view>
				<view style="
                        flex-grow: 1;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    ">
					<view class="quit" @tap="quit()">
						<image style="height: 32px; width: 32px" src="../../static/image/symple/arrow-forward.png"
							mode=""></image>
					</view>
				</view>
			</view>
		</view>
	</uv-overlay>
</template>
<script>
	export default {
		data() {
			return {
				show: false,
				state: 0, //弹窗进行阶段
				isAnimating: false, // 控制动画的播放
				highlightedIndex: null, // 用来跟踪当前高亮的按钮索引
				buttons: [{
						label: "我是初中生",
					},
					{
						label: "我是高中生",
					},
					{
						label: "我是本科生",
					},
					{
						label: "我是研究生",
					},
				],
				classNumber: "", //学号
				currentclasses: [], //目前待选年级
				classesCandidates: [
					["初一", "初二", "初三"],
					["高一", "高二", "高三"],
					["大一", "大二", "大三", "大四"],
					["研一", "研二", "研三"],
				],
				classes: "", //年级
				name: "",
				originalschoolCandidates: [{
						id: 2,
						name: "清华大学",
					},
					{
						id: 3,
						name: "北京大学",
					},
					// "北京大学",
					// "中国人民大学",
					// "清华大学",
					// "北京交通大学",
					// "北京工业大学",
					// "北京航空航天大学",
					// "北京理工大学",
					// "北京科技大学",
					// "北方工业大学",
					// "北京化工大学",
					// "北京服装学院"
				],
				schoolCandidates: [{
						id: 2,
						name: "清华大学",
					},
					{
						id: 3,
						name: "北京大学",
					},
				], // 学校对象数组
				selectedSchoolName: "", // 临时存储选中的学校名称
				schoolId: "", // 存储选中的学校ID
				studentCardImageSrc: "", //学生证照片本地存储路径
				debounceTimer: null, // 用于存储防抖定时器
				isSubmitting: false, //是否处于提交中
			};
		},
		onLoad() {},
		watch: {
			// 监听schoolName的变化
			selectedSchoolName(newVal, oldVal) {
				//输入为空或长度为0时清空待选项
				if (newVal == null || newVal.length == 0) {
					this.schoolCandidates = this.originalschoolCandidates;
					console.log("关键字长度为0");
				}
				//变化而且长度增加时调用接口
				if (newVal !== oldVal && newVal.length >= oldVal.length) {
					this.fetchSchoolDetailsDebounced(newVal); // 当schoolName变化时执行的方法
				}
			},
		},
		methods: {
			//点击发布时的验证逻辑
			verification() {
				//检查是否已登录
				//const token = uni.getStorageSync("token");
				const token = this.$store.state.token;
				if (token == null || token.length == 0) {
					uni.showToast({
						title: "请先登录",
						icon: "none",
						position: "top",
						duration: 2000,
					});
					console.log("请先登录");
					return;
				}
				var userdataStr = uni.getStorageSync("userdata");
				//检查是否已经认证
				if (userdataStr) {
					// 将字符串转换回对象
					var userdata = JSON.parse(userdataStr);
					if (userdata.auth == "未认证") {
						uni.showModal({
							content: "发布需要认证学生信息，是否去认证？",
							confirmText: "现在去",
							cancelText: "取消",
							success: (res) => {
								// 使用箭头函数
								if (res.confirm) {
									console.log("用户点击确定");
									//重置状态
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
								} else if (res.cancel) {
									console.log("用户点击取消");
									return;
								}
							},
						});
					} else {
						//进入发布逻辑
					}
				}
			},
			//选择身份时点击
			handleButtonClick(index) {
				if (this.isAnimating) {
					// 如果动画正在执行，不执行任何操作
					return;
				}
				if (this.highlightedIndex === index) {
					// 如果点击的按钮已经是高亮的，视为确认操作
					console.log("确认: ", this.buttons[index].label);
					this.performAction(index); // 执行跳转或其他操作
				} else {
					// 否则，更新高亮的按钮索引为当前点击的按钮
					this.highlightedIndex = index;
					console.log("当前选中：", this.buttons[index].label);
				}
			},
			//选择身份时确认
			performAction(index) {
				console.log("执行操作，身份索引: ", index);
				//得到当前候选项
				this.currentclasses = this.classesCandidates[index];
				// 触发打勾动画
				this.isAnimating = true;
				// 动画持续2秒后停止
				setTimeout(() => {
					this.state = 1;
					this.isAnimating = false;
					console.log(this.schoolCandidates);
				}, 2000);
			},
			//防抖请求学校信息
			fetchSchoolDetailsDebounced(newVal) {
				clearTimeout(this.debounceTimer); // 清除之前的定时器
				this.debounceTimer = setTimeout(() => {
					this.fetchSchoolDetails(newVal); // 延迟执行请求
				}, 400); // 延迟500毫秒执行
			},
			fetchSchoolDetails(newVal) {
				// 使用trim()移除前后空白，然后检查是否为空字符串
				if (
					this.selectedSchoolName.trim().length === 0 ||
					this.selectedSchoolName == null
				) {
					return;
				}
				// 使用正则表达式检查是否只包含英文字符（包括空格）
				// 这里假设“为英文”意味着只包含英文字母和空格
				if (/^[a-zA-Z\s]*$/.test(this.selectedSchoolName.trim())) return;
				//发送请求
				this.$service
					.get("user-service/api/school", {
						params: {
							current: 1,
							size: 2,
						},
					})
					.then((response) => {
						// 处理成功响应
						console.log("请求学校响应信息：", response);
						if (response.data.isSuccess == 1) {
							// 映射数据到包含name和id的对象
							this.schoolCandidates = response.data.data.data.map(
								(school) => ({
									name: school.name,
									id: school.id,
								})
							);
							console.log("待选学校：", this.schoolCandidates);
							//找到当前学校对应的id
							const selectedSchool = this.schoolCandidates.find(
								(school) => school.name === newVal
							);
							if (selectedSchool) {
								this.schoolId = selectedSchool.id; // 更新schoolId为选中学校的ID
							}
							console.log("当前学校id：", this.schoolId);
						} else {
							// 处理错误情况或者显示提示信息
							console.error(
								"获取学校信息失败:",
								response.data.message
							);
						}
					})
					.catch((error) => {
						// 处理错误
						console.error("请求出错", error);
						uni.showToast({
							title: "获取学校信息失败",
							icon: "none",
							position: "top",
							duration: 2000,
						});
					});
			},
			//上一页
			back() {
				if (this.isAnimating) {
					// 如果动画正在执行，不执行任何操作
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
					// 如果动画正在执行，不执行任何操作
					return;
				}
				this.isAnimating = true;
				setTimeout(() => {
					this.state = this.state + 1;
					this.isAnimating = false;
				}, 2000);
			},
			//结束填写
			quit() {
				setTimeout(() => {
					this.show = false;
				}, 800);
			},
			//关闭弹窗
			noTitlemodalTap: function(e) {
				uni.showModal({
					content: "确认关闭吗？这会丢失当前的填写信息",
					confirmText: "确定",
					cancelText: "取消",
					success: (res) => {
						// 使用箭头函数
						if (res.confirm) {
							console.log("用户点击确定");
							this.show = false; // 这里的this正确地指向Vue实例
							console.log("this.show:", this.show);
						} else if (res.cancel) {
							console.log("用户点击取消");
						}
					},
				});
			},
			//上传照片
			uploadPhoto() {
				uni.showActionSheet({
					itemList: ["从相册选择", "拍照"],
					success: (res) => {
						console.log("选择了第" + (res.tapIndex + 1) + "个选项");
						if (res.tapIndex == 0) {
							uni.chooseImage({
								count: 1, //上传图片的数量，默认是9
								sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
								sourceType: ["album"], //从相册选择
								success: (res) => {
									const tempFilePaths = res.tempFilePaths; //拿到选择的图片，是一个数组
									this.studentCardImageSrc = tempFilePaths[0]; // 存储图片路径
								},
							});
						} else {
							uni.chooseImage({
								count: 1, //上传图片的数量，默认是9
								sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
								sourceType: ["camera"], //拍照
								success: (res) => {
									const tempFilePaths = res.tempFilePaths; //拿到选择的图片，是一个数组
									this.studentCardImageSrc = tempFilePaths[0]; // 存储图片路径
								},
							});
						}
					},
					fail: (err) => {
						console.log("弹窗取消");
					},
				});
			},
			//最后上传所有信息
			upload() {
				if (this.isSubmitting) {
					// 如果已经在提交中，则直接返回，避免重复提交
					return;
				}
				// 检查必填项
				// 定义一个映射关系，关联字段与提示消息
				const fieldMappings = [{
						key: "classNumber",
						message: "请填写学号",
					},
					{
						key: "classes",
						message: "请选择年级",
					},
					{
						key: "name",
						message: "请填写姓名",
					},
					{
						key: "schoolId",
						message: "请选择学校",
					},
					{
						key: "studentCardImageSrc",
						message: "请上传学生证或校园卡照片",
					},
				];

				// 查找第一个未填写的项
				const unfilledItem = fieldMappings.find((item) => !this[item.key]);

				// 如果找到了未填写的项，则提示并返回
				if (unfilledItem) {
					uni.showToast({
						title: unfilledItem.message, // 使用找到的未填项的提示消息
						icon: "none",
						position: "top",
						duration: 2000,
					});
					console.log(unfilledItem.message); // 控制台输出具体未填项的提示消息
					return; // 停止执行后续的上传逻辑
				}
				// 开始提交前，禁用提交按钮
				this.isSubmitting = true;

				// 显示加载提示
				uni.showLoading({
					title: "正在上传...",
				});
				const token = uni.getStorageSync("token");
				uni.uploadFile({
					url: "http://www.liuchen.work:280/user-service/api/auth/identity", //post请求的地址
					filePath: this.studentCardImageSrc,
					name: "image",
					header: {
						token: token,
					},
					formData: {
						//formData是指除了图片以外，额外加的字段
						classNumber: this.classNumber,
						classes: this.classes,
						name: this.name,
						schoolId: this.schoolId,
					},
					success: (uploadFileRes) => {
						console.log("接口调用成功");
						// 尝试解析响应数据
						let responseData;
						try {
							responseData = JSON.parse(uploadFileRes.data);
						} catch (error) {
							console.error("解析响应数据失败", error);
							uni.showToast({
								title: "上传出错，请重试",
								icon: "none",
							});
							return; // 解析失败，终止处理
						}
						console.log("响应信息：", responseData);
						uni.hideLoading();
						if (responseData.isSuccess) {
							console.log("认证信息上传成功！");
							uni.showToast({
								title: "上传成功！请等待审核",
								icon: "success",
								duration: 2000,
							});
							setTimeout(() => {
								this.next();
							}, 1200);
						} else {
							console.log("上传出错：", responseData.message);
							uni.showToast({
								title: "上传出错：" + responseData.message,
								icon: "none",
							});
						}
					},
					fail: () => {
						console.log("接口调用失败");
						console.log(uploadFileRes.errMsg);
						uni.hideLoading();
						uni.showToast({
							title: "网络出错，请重试",
							icon: "error",
						});
						// 可以在这里处理上传失败后的逻辑
					},
					complete: () => {
						this.isSubmitting = false;
					},
				});
			},
			//更新用户信息
			getUserInfo() {
				this.$service
					.get("/user-service/api/user")
					.then((response) => {
						// 处理成功响应
						console.log("响应信息：", response);
						if (response.data.isSuccess == 1) {
							// 直接使用响应数据
							const userdata = response.data.data;

							// 使用uni.setStorageSync同步地保存userdata到本地存储
							uni.setStorageSync(
								"userdata",
								JSON.stringify(userdata)
							);

							// 打印头像地址用于验证
							console.log("用户信息", userdata);
						}
					})
					.catch((error) => {
						// 处理请求错误
						console.error("请求出错", error);
					});
			},
		},
	};
</script>
<style lang="scss">
	//状态栏占位
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	//遮罩层
	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	//确认时动画
	.check {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-grow: 1;

		.circle {
			stroke-dasharray: 113;
			stroke-dashoffset: 113;
		}

		.tick {
			stroke-dasharray: 33;
			stroke-dashoffset: 33;
		}

		@keyframes circle {
			from {
				stroke-dashoffset: 113;
			}

			to {
				stroke-dashoffset: 226;
			}
		}

		@keyframes tick {
			from {
				stroke-dashoffset: 33;
			}

			to {
				stroke-dashoffset: 0;
			}
		}

		.animateCircle {
			animation: circle 1s ease-in-out;
			animation-fill-mode: forwards;
		}

		.animateTick {
			animation: tick 0.8s ease-out;
			animation-fill-mode: forwards;
			animation-delay: 0.95s;
		}
	}

	//弹窗
	.rect {
		width: 70%;
		margin-top: -15%;
		height: 50%;
		background-color: rgba(229, 237, 248, 1);
		border-radius: 15px;
		display: flex;
		flex-direction: column;

		//弹窗底部
		.bottom {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			margin-top: auto;
			margin-bottom: 5px;

			.next,
			.back {
				display: flex;
				flex-direction: row;
				align-items: center;
				width: fit-content;
			}
		}

		//弹窗顶部
		.rect-title {
			margin-top: -10px;
			margin-left: 7%;
			display: flex;
			flex-direction: column;

			.title-text {
				color: rgba(44, 47, 173, 1);
				font-size: 16px;
				font-weight: 600;
			}
		}

		//选择身份
		.choose-grade {
			margin-top: -5px;
			display: flex;
			flex-direction: column;

			.highlight-background {
				background-color: white;
				color: black;
			}
		}

		.choose-grade>button {
			margin-top: 25px;
			font-size: 15px;
			background-color: rgba(76, 123, 237, 1);
			width: 50%;
			height: 55px;
			color: white;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 10px;
		}

		//选择学校
		.choose-school {
			display: flex;
			margin-top: 5px;
			margin-left: 13%;
			flex-direction: column;

			.choose-school-text {
				color: rgba(64, 127, 245, 1);
			}

			.input-section {
				width: 84%;
				height: 35px;
				color: #383838;
				border-radius: 5px;
				background-color: rgba(204, 222, 252, 1);
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.choose-school-input {
				margin-left: 4px;
				font-size: 18px;
			}
		}

		//普通输入框
		.common-input {
			display: flex;
			margin-top: 5px;
			margin-left: 13%;
			flex-direction: column;
			margin-bottom: 10px;

			.common-text {
				color: rgba(64, 127, 245, 1);
			}

			.input-section {
				width: 84%;
				height: 35px;
				color: #383838;
				border-radius: 5px;
				background-color: rgba(204, 222, 252, 1);
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.input {
				margin-left: 8px;
				font-size: 16px;
			}
		}

		//上传学生证或校园卡
		.upload {
			margin-top: -6px;
			justify-self: center;
			align-self: center;
			width: 74%;
			height: 26%;
			background-color: rgba(204, 222, 252, 1);
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 5px;

			.uploaded-image {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}

		.end-page {
			margin-left: 8%;
			margin-top: 15px;
			font-size: 18px;
		}

		.quit {
			margin-top: -25px;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 3px 3px;
			background-image: linear-gradient(to right,
					rgb(120, 195, 255),
					rgb(54, 94, 254));
			color: #fff;
			border-radius: 4px;
			border: none;
			cursor: pointer;
			position: relative;
			height: 60px;
			width: 60px;
			border-radius: 50%;
			box-shadow: 0 2px 25px rgba(30, 90, 233, 0.5);
			outline: 0;
			transition: transform ease-in 0.1s, background-color ease-in 0.1s,
				box-shadow ease-in 0.25s;
		}

		.quit::before {
			position: absolute;
			content: "";
			left: -20px;
			right: -20px;
			top: -20px;
			bottom: -20px;
			pointer-events: none;
			background-repeat: no-repeat;
			background-image: radial-gradient(circle,
					rgb(85, 150, 254) 20%,
					transparent 20%),
				radial-gradient(circle, rgb(85, 150, 254) 20%, transparent 20%),
				radial-gradient(circle, rgb(85, 150, 254) 20%, transparent 20%),
				radial-gradient(circle, rgb(85, 150, 254) 20%, transparent 20%),
				radial-gradient(circle, rgb(85, 150, 254) 20%, transparent 20%),
				radial-gradient(circle, rgb(85, 150, 254) 20%, transparent 20%),
				radial-gradient(circle, rgb(85, 150, 254) 20%, transparent 20%),
				radial-gradient(circle, rgb(85, 150, 254) 20%, transparent 20%),
				radial-gradient(circle, rgb(85, 150, 254) 20%, transparent 20%),
				radial-gradient(circle, rgb(85, 150, 254) 20%, transparent 20%),
				radial-gradient(circle, rgb(85, 150, 254) 20%, transparent 20%),
				radial-gradient(circle, rgb(85, 150, 254) 20%, transparent 20%),
				radial-gradient(circle, rgb(85, 150, 254) 20%, transparent 20%),
				radial-gradient(circle, rgb(85, 150, 254) 20%, transparent 20%),
				radial-gradient(circle, rgb(85, 150, 254) 20%, transparent 20%),
				radial-gradient(circle, rgb(85, 150, 254) 20%, transparent 20%);
			background-position: 5% 30%, -5% 30%, 7% 10%, 23% -5%, 37% -10%,
				58% -23%, 80% -20%, 100% -2%, -5% 80%, 100% 55%, 10% 90%, 23% 110%,
				42% 120%, 70% 110%, 78% 100%, 100% 80%;
			background-size: 0% 0%;
			transition: background-position 0.5s ease-in-out,
				background-size 0.75s ease-in-out;
		}

		.quit:active::before {
			transition: 0s;
			background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%,
				15% 15%, 10% 10%, 18% 18%, 15% 15%, 20% 20%, 18% 18%, 20% 20%,
				15% 15%, 10% 10%, 20% 20%;
			background-position: 18% 40%, 20% 31%, 30% 22%, 40% 18%, 50% 16%,
				57% 15%, 65% 18%, 80% 32%, 15% 60%, 83% 60%, 18% 70%, 25% 73%,
				41% 80%, 50% 84%, 64% 78%, 80% 71%;
		}

		//选择年级
		.choose-classes {
			display: flex;
			margin-top: 5px;
			margin-left: 13%;
			flex-direction: column;

			.choose-classes-text {
				color: rgba(64, 127, 245, 1);
			}

			.input-section {
				width: 84%;
				height: 35px;
				color: #383838;
				border-radius: 5px;
				background-color: rgba(204, 222, 252, 1);
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.choose-classes-input {
				margin-left: 4px;
				font-size: 18px;
			}
		}
	}

	//取消弹窗按钮
	.rect-cancel {
		position: relative;
		top: 5px;
		right: 5px;
		margin-left: auto;
		height: 25px;
		width: 25px;
	}
</style>