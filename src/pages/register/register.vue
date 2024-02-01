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
				<view class="user-name">
					<view style="font-size: 20px;font-weight: 600;">
						用户名
					</view>
					<view class="uni-input1">
						<input style="margin-left: 7%;" focus placeholder="请输入您的用户名" v-model="user.username" />
					</view>
				</view>
				<view class="pass-word">
					<view style="margin-top:15px;font-size: 20px;font-weight: 600;">
						密码
					</view>
					<view class="uni-input2">
						<input :password="!passwordVisible" style="margin-left: 7%;" placeholder="请输入您的密码"
							v-model="user.password" />
						<view style="flex-grow: 1;display: flex;justify-content: flex-end;">
							<image style="height: 18px;width: 18px;right: 20%;"
								:src="passwordVisible ? '../../static/image/symple/pin-visible.png' : '../../static/image/symple/pin-invisible.png'"
								mode="aspectFit" @tap="togglePasswordVisibility"></image>
						</view>
					</view>
				</view>
				<view class="phone-num">
					<view style="margin-top:15px; font-size: 20px;font-weight: 600;">
						验证码
					</view>
					<view class="uni-input3">
						<input type="tel" style="margin-left: 7%;" placeholder="请输入您的手机号" v-model="user.phonenum" />
						<view class="get-verification-code">
							<button class="get-verification-code-button"
								:class="{ 'button-disabled': sendcode.isButtonDisabled}" @tap="getVercode"
								:disabled="sendcode.isButtonDisabled">
								{{ sendcode.countdown ? `${sendcode.countdown}` : '获取验证码' }}
							</button>
						</view>
					</view>
				</view>
				<view class="verification-ensure">
					<view class="uni-input4">
						<input style="margin-left: 7%;" placeholder="请输入验证码" v-model="user.vercode" />
					</view>
				</view>
			</view>
			<view class="button-section">
				<view class="sign-up">
					<button class="bt-sign-up" @tap="registOnSubmit">注册</button>
				</view>
			</view>
			<!-- 下面两块颠倒了 -->
			<view class=" otherway-sign-up">
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
					— 其他注册方式 —
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {
					username: "",
					password: "",
					vercode: "",
					phonenum: "",
				},
				phoneIstrue: 0,
				sendcode: {
					isButtonDisabled: false,
					countdown: 0,
				},
				passwordVisible: false,
			}
		},
		methods: {
			//设置密码可见状态
			togglePasswordVisibility() {
				this.passwordVisible = !this.passwordVisible;
				console.log("密码状态", this.passwordVisible);
			},
			registOnSubmit() {
				// 请求数据
				const requestData = {
					username: this.user.username,
					password: this.user.password,
					code: this.user.vercode,
					phone: this.user.phonenum,
				};
				//console.log(requestData);
				// 检查所有字段是否填写
				if (!requestData.username || !requestData.password || !requestData.code || !requestData.phone) {
					return; // 阻止进一步执行
				}
				this.isPhone(this.user.phonenum);
				if (this.phoneIstrue == 0) {
					uni.showToast({
						title: "请输入正确的手机号！",
						icon: "error",
						position: "top",
					});
					return;
				}
				// 发送 POST 请求
				this.$service.post('/user-service/api/auth/register', requestData)
					.then(response => {
						// 请求成功处理
						if (response.data.isSuccess == 1) {
							// 注册成功的处理逻辑，例如提示用户
							uni.showToast({
								title: '注册成功',
								icon: 'success',
								duration: 2000
							});
							this.$router.push("../basefunction/basefunction");
						} else {
							// 注册失败的处理逻辑
							uni.showToast({
								title: '注册失败: ' + response.data.message,
								icon: 'none',
								duration: 2200
							});
						}
					})
					.catch(error => {
						// 请求失败处理
						uni.showToast({
							title: '请求错误' + response.data.message,
							icon: 'none',
							duration: 2000
						});
						console.error('注册请求失败:', error);
					});
			},
			//验证电话号码
			isPhone(phone) {
				var reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
				if (phone.length == 11) {
					if (!reg.test(phone)) {
						this.phoneIstrue = 0;
						console.log('电话号码输入错误！');
					} else {
						this.phoneIstrue = 1;
						console.log('电话号码输入正确！');
					}
				} else {
					console.log('电话号码输入错误！');
					this.phoneIstrue = 0;
				}
			},
			//发送验证码
			async getVercode() {
				try {
					this.isPhone(this.user.phonenum);
					if (this.phoneIstrue == 0) {
						uni.showToast({
							title: "请输入正确的手机号！",
							icon: "error",
							position: "top",
						});
						return;
					}
					const response = await this.$service.post('/user-service/api/auth/sms', {
						phone: this.user.phonenum
					});
					// 检查响应是否表示操作成功
					if (response.data.isSuccess == 1) {
						// 如果成功，显示弹窗
						this.startCountdown();
						uni.showToast({
							title: '验证码已发送',
							icon: 'success',
							duration: 2000
						});
					} else {
						// 如果不成功，也可以显示一个消息
						uni.showToast({
							title: '发送失败,请重试',
							icon: 'none',
							duration: 2000
						});
					}
				} catch (err) {
					// 处理请求错误
					console.log(err)
					uni.showToast({
						title: '请求出错',
						icon: 'none',
						duration: 2000
					});
				}
			},
			//发送验证码间隔
			startCountdown() {
				this.sendcode.isButtonDisabled = true;
				this.sendcode.countdown = 60; // 设置倒计时时间，例如 30 秒
				const interval = setInterval(() => {
					this.sendcode.countdown--;
					if (this.sendcode.countdown === 0) {
						clearInterval(interval);
						this.sendcode.isButtonDisabled = false;
					}
				}, 1000);
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
			top: 9%;
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
				margin-top: 18%;

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
		z-index: 10;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		background-color: $uni-bg-color-signin;
		border-top-right-radius: 20px;
		border-top-left-radius: 20px;
		margin-top: -20px;

		.input-section {
			margin-top: 30px;
			margin-left: 6%;

			.phone-num {
				margin-bottom: 20px;
			}

			.pin-code {}

			.uni-input1,
			.uni-input2,
			.uni-input4,
			.uni-input5 {
				display: flex;
				align-items: center;
				margin-top: 15px;
				background-color: rgb(205, 222, 252);
				width: 92%;
				height: 50px;
				border-radius: 15px;
			}

			.uni-input3 {
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-top: 15px;
				background-color: rgb(205, 222, 252);
				width: 92%;
				height: 50px;
				border-radius: 15px;
			}

			.get-verification-code {
				flex-grow: 1;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.get-verification-code-button {
				margin-right: 0;
				display: flex;
				width: 120px;
				height: 50px;
				font-size: 16px;
				align-items: center;
				justify-content: center;
				border-radius: 15px;
			}

			.button-disabled {
				background-color: rgb(220, 220, 220);
				color: #000;
				font-size: 18px;
				/* 按钮禁用时的背景颜色 */
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

		.otherway-sign-up {
			flex-grow: 1;
			margin-bottom: 40px;
			display: flex;
			flex-direction: column-reverse;
			align-items: center;
			position: relative;

			.split-line {
				color: rgb(90, 90, 90);
				margin-bottom: 15px;
				padding-top: 20px;
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