<template>
	<!-- 主页 分成三部分 logo部分 中间部分 底部协议-->
	<view class="page">
		<view class="logo">
			<img src="../../static/logo.png" alt="" />
			<text style="margin-top: 6px;">
				儒升
			</text>
		</view>
		<view class="signin-section">
			<view class="button-section">
				<view class="sign-in-wx">
					<button class="wx-in" @tap="goTo1()">
						<img src="../../static/logo.png" style="height: 20px;align-self: center;margin-right: 6px;" />
						<text>微信登录</text>
					</button>
				</view>
				<view class="sign-in-phonenum">
					<button class="phonenum-in" @tap="goTo2()">手机号登录</button>
				</view>
			</view>
			<view class="sign-in-account">
				<text @tap="goSignin_account()">账号密码登录</text>
			</view>
			<view class=" otherway-sign-in">
				<view class="split-line">
					— 其他登录方式 —
				</view>
				<view class="other-way">
					<image class="other-way-img" src="../../static/logo.png" mode="aspectFit"></image>
					<image class="other-way-img" src="../../static/logo.png" mode="aspectFit"></image>
					<image class="other-way-img" src="../../static/logo.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>
		<view class="xieyi-section">
			<label>
				<checkbox @tap="xieyiConfirm()" value="cb" color="white" activeBackgroundColor="blue"
					style="transform:scale(0.7)" />
				<text>我已阅读并同意《学智通用户协议》
					《隐私协议》《支付协议》</text>
			</label>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				xieyichecked: false,
			}
		},
		onLoad() {},
		methods: {
			xieyiConfirm() {
				this.xieyichecked=!this.xieyichecked;
				console.log(this.xieyichecked);
			},
			goSignin_account(){
				console.log("到注册页面1")
				uni.navigateTo({
					url: "../signin/signin",
				});
			}
		},
	}
</script>

<style lang="scss">
	@import "../../uni.scss";

	body {
		background-color: $uni-bg-color-signin;
	}

	.page {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		.logo {
			margin-top: 23%;
			display: flex;
			flex-direction: column;
			font-size: 20px;
			align-items: center;
			color: blue;
		}

		.signin-section {
			margin-top: 35px;
			display: flex;
			flex-direction: column;
			width: 100%;

			.sign-in-account {
				margin-top: 20px;
				align-self: center;
				color: rgb(90, 90, 90);
			}

			.button-section {
				margin-top: 20px;
				margin-left: 6%;
				display: flex;
				flex-direction: column;

				.sign-in-wx {
					margin-bottom: 18px;
					width: 92%;

					.wx-in {
						display: flex;
						flex-direction: row;
						justify-content: center;
						height: 50px;
						border-radius: 25px;
						background-color: rgb(72, 128, 247);
						color: white;
						box-shadow: 0 3px 3px 2px rgb(200, 200, 200);
					}
				}

				.sign-in-phonenum {
					width: 92%;

					.phonenum-in {
						height: 50px;
						border-radius: 25px;
						background-color: rgb(205, 222, 252);
						color: black;
						box-shadow: 0 4px 4px 2px rgb(210, 210, 210);
					}
				}
			}

			.otherway-sign-in {
				margin-top: 48px;
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;

				.split-line {
					color: rgb(30, 30, 30);
					margin-bottom: 15px;
					font-size: 14px;
				}

				.other-way {
					display: flex;
					flex-direction: row;
					gap: 35px;

					.other-way-img {
						height: 40px;
						width: 40px;
						border-radius: 20px;
					}
				}
			}
		}

		.xieyi-section {
			position: absolute;
			flex-direction: row;
			bottom: 25px;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 14px;
			width: 70%;
		}
	}
</style>