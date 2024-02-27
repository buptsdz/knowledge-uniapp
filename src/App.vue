<script>
	import store from '@/store/index.js'
	export default {
		// globalData: {
		// 	isLoggedIn: false,
		// },
		onLaunch: function() {
			console.log("App Launch");
			var token = this.$store.state.token;
			console.log("token：", token);
		},
		onShow: function() {
			console.log("App Show");
			this.checkLoginStatus();
		},
		onHide: function() {
			console.log("App Hide");
		},
		methods: {
			// 检查登录状态
			checkLoginStatus() {
				var token = this.$store.state.token;
				// console.log("token:",token);
				// console.log(typeof token);
				//getApp().globalData.isLoggedIn = token !== null && token.length !== 0;
				//var state = getApp().globalData.isLoggedIn;
				var state = this.$store.state.isLoggedIn;
				console.log("登录状态：", state);
				if (state) {
					this.getUserInfo();
				} else {
					return;
				}
			},
			// 获取用户信息
			getUserInfo() {
				var userdataStr = uni.getStorageSync('userdata');
				if (userdataStr) {
					// 将字符串转换回对象
					var userdata = JSON.parse(userdataStr);
					console.log(typeof userdata,userdata);
					// 检查头像（headImg）是否存在且不为空
					if (userdata.headImg) {
						console.log("头像地址：",userdata.headImg);
					} else {
						console.log("头像地址不存在");
					}
				} else {
					this.$service.get("user-service/api/user")
						.then(response => {
							// 处理成功响应
							console.log("用户信息：", response);
							if (response.data.isSuccess == 1) {
								var userdata=response.data.data;
								store.commit('login',userdata);
								console.log("头像地址：", response.data.data.headImg)
							}
						})
						.catch(error => {
							// 处理错误
							console.error('请求出错', error);
						});
				}
			},
		}
	};
</script>

<style>
	::-webkit-scrollbar {
		display: none;
		/* 隐藏滚动条但保留滚动功能 */
	}

	/* 字体 */
	@font-face {
		font-family: "SourceHanSansCN";
		src: url("./static/fonts/SourceHanSansCN-Regular.ttf") format("truetype");
	}

	body {
		font-family: "SourceHanSansCN", sans-serif;
	}

	uni-modal {
		z-index: 99999 !important;
	}

	uni-toast {
		z-index: 99999 !important;
	}
</style>