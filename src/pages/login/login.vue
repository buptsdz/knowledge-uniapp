<template>
	<view class="page">
		<view class="up-section">
			<view class="up-section-text">
				<view class="up-section-text-big">
					<p class="big-p">您好！</p>
					<p class="big-p">欢迎来到儒升</p>
				</view>
				<view class="up-section-text-small">
					第一代数字化知识交互学习软件(鸿蒙版)
				</view>
			</view>
			<view class="logo-section">
				<image style="height:48vw;" src="../../static/image/logo/logo-light.png" alt="" mode="aspectFit" />
			</view>
		</view>
		<view class="down-section">
			<view class="input-section">
				<view class="phone-num">
					<view style="font-size: 20px;font-weight: 600;">
						手机号
					</view>
					<view class="uni-input1">
						<input type="text" style="margin-left: 7%;" placeholder="请输入您的手机号或用户名" v-model="user.usernameOrPhone" />
					</view>
				</view>
				<view class="pin-code">
					<view style="font-size: 20px;font-weight: 600;">
						密码
					</view>
					<view class="uni-input2">
						<input type="safe-password" style="margin-left: 7%;" focus placeholder="请输入您的密码"
							v-model="user.password" />
						<view style="flex-grow: 1;display: flex;justify-content: flex-end;">
							<image style="height: 18px;width: 18px;right: 20%;"
								src="../../static/image/symple/pin-visualable.png" mode="aspectFit"></image>
						</view>
					</view>
				</view>
				<view class="forget-pin" @tap="goTo()">忘记密码?</view>
			</view>
			<view class="button-section">
				<view class="sign-in">
					<button class="bt-sign-in" @tap="onSubmit">登录</button>
				</view>
				<view class="sign-up">
					<button class="bt-sign-up" @tap="goTores()">注册</button>
				</view>
			</view>
			<view class=" otherway-sign-in">
				<view class="other-way">
					<view class="other-way-img">
						<image style="height: 25px;width: 25px;" src="../../static/image/logo/wx-logo-raw.png"
							mode="aspectFit"></image>
					</view>
					<view class="other-way-img">
						<image style="height: 24px;width: 24px;" src="../../static/image/logo/qq-logo-raw.png"
							mode="aspectFit"></image>
					</view>
					<view class="other-way-img">
						<image style="height: 22px;width: 22px;margin-top: -5px;"
							src="../../static/image/logo/apple-logo-raw.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="split-line">
					— 其他登录方式 —
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user:{
					//测试号码17315718923,用户名sdzsdzsdz,密码12345678
					//15805293579,用户名sdzsdzsdz2,密码12345678
					//15189182031,用户名sdzsdzsdz3,密码12345678
					usernameOrPhone: "", 
				    password: "", 
				}
			}
		},
		onLoad() {
			var token = localStorage.getItem("token");
			console.log("token:",token);
		},
		methods: {
			test() {
				console.log(this.user.usernameOrPhone, this.user.password);
			},
			async onSubmit(values) {
				//点击登录
				// console.log("submit", values);
				//首先判断用户名和密码不能为空,如果为空就不提交请求
				if (this.user.usernameOrPhone.length == 0 || this.user.password == 0) {
					uni.showToast({
						title: "输入的手机号或密码不能为空！",
						icon: "error",
						position: "top",
					});
					return;
				}
				// 请求登录接口并配置参数
				this.$service.post("/user-service/api/auth/login", {
						usernameOrPhone: this.user.usernameOrPhone,
						password: this.user.password
					})
					.then((res) => {
						// 检查响应中的issuccess字段
						console.log(res);
						if (res.data.isSuccess==1) {
							// 请求成功且服务器返回成功状态
							var token = res.data.data.token; // 读取token
							localStorage.setItem("token", token); // 保存token
							// 登录成功的提示
							uni.showToast({
								title: "登录成功！",
								icon: "success",
							})
							// 跳转到首页
							this.$router.push("../basefunction/basefunction");
						} else {
							// 服务器返回失败状态
							uni.showToast({
								title: res.data.message,
								icon: "none",
								duration: 2000
							});
						}
					})
					.catch((err) => {
						// 网络或其他错误
						console.log(err);
						uni.showToast({
							title: "网络错误",
							icon: "none",
							duration: 2000
						});
					});
			},
			goTores() {
				console.log("到注册页面");
				uni.navigateTo({
					url: "../register/register",
				});
			}
		}
	}
</script>

<style lang="scss">
	@import '../../uni.scss';

	body {
		height: 100%;
		margin: 0;
		padding: 0;
	}

	.page {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.page .up-section {
		background-image: linear-gradient(to right, rgb(120, 195, 255), rgb(54, 94, 254));

		.logo-section {
			position: absolute;
			left: 27%;
			top: 10%;
			z-index: 2;
		}

		.up-section-text {
			display: flex;
			flex-direction: column;
			margin-left: 4%;
			margin-bottom: 35px;
			color: white;

			.up-section-text-big {
				font-size: 20px;
				margin-top: 20%;

				.big-p {
					margin-top: 8px;
				}

			}

			.up-section-text-small {
				font-size: 12px;
				margin-top: 10px;
				color: rgba(255, 255, 255, 0.85);
			}
		}
	}

	.page .down-section {
		flex-grow: 1;
		z-index: 9;
		display: flex;
		flex-direction: column;
		background-color: $uni-bg-color-signin;
		border-top-right-radius: 20px;
		border-top-left-radius: 20px;
		margin-top: -20px;

		.input-section {
			margin-top: 35px;
			margin-left: 6%;

			.phone-num {
				margin-bottom: 20px;
			}

			.pin-code {}

			.uni-input1,
			.uni-input2 {
				display: flex;
				align-items: center;
				margin-top: 15px;
				background-color: rgb(205, 222, 252);
				width: 92%;
				height: 50px;
				border-radius: 15px;
			}

			.forget-pin {
				margin-top: 10px;
				color: royalblue;
			}
		}

		.button-section {
			margin-top: 20px;
			margin-left: 6%;
			display: flex;
			flex-direction: column;

			.sign-in {
				margin-bottom: 23px;
				width: 92%;

				.bt-sign-in {
					height: 50px;
					border-radius: 25px;
					background-color: rgb(72, 128, 247);
					color: white;
					box-shadow: 0 3px 3px 2px rgb(200, 200, 200);
				}
			}

			.sign-up {
				width: 92%;

				.bt-sign-up {
					height: 50px;
					border-radius: 25px;
					background-image: linear-gradient(to right, rgb(206, 223, 253), rgb(232, 238, 254));
					color: black;
					box-shadow: 0 4px 4px 2px rgb(210, 210, 210);
				}
			}
		}

		.otherway-sign-in {
			flex-grow: 1;
			margin-bottom: 40px;
			display: flex;
			flex-direction: column-reverse;
			align-items: center;
			position: relative;

			.split-line {
				color: rgb(90, 90, 90);
				margin-bottom: 15px;
			}

			//其他方式图标的排列
			.other-way {
				display: flex;
				flex-direction: row;
				gap: 35px;

				//每个图标的区域
				.other-way-img {
					border: 1px solid black;
					display: flex;
					justify-content: center;
					align-items: center;
					height: 38px;
					width: 38px;
					border-radius: 21px;
					background-color: white;
				}
			}
		}
	}
</style>