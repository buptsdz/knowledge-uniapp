<template>
	<view class="status_bar">
		<!-- 这里是状态栏 -->
	</view>
	<button @tap="verification()">发布</button>
	<verification ref="verificationRef"></verification>
</template>
<script>
	import verification from "./verification.vue"
	export default {
		components: {
			verification,
		},
		data() {
			return {};
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
									this.$refs.verificationRef.resetProperties();
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
		},
	};
</script>
<style lang="scss">
	//状态栏占位
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
</style>