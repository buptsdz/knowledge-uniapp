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
		</view>
		<view class="down-section">
			<view class="input-section">
				<view class="phone-num">
					<view style="font-size: 20px;font-weight: 600;">
						手机号
					</view>
					<view class="uni-input1">
						<input style="margin-left: 7%;" placeholder="请输入您的手机号" />
					</view>
				</view>
				<view class="pin-code">
					<view style="font-size: 20px;font-weight: 600;">
						密码
					</view>
					<view class="uni-input2">
						<input style="margin-left: 7%;" focus placeholder="请输入您的密码" />
					</view>
				</view>
				<view class="forget-pin" @tap="goto()">忘记密码?</view>
			</view>
			<view class="button-section">
				<view class="sign-in">
					<button class="bt-sign-in" @tap="goto()">登录</button>
				</view>
				<view class="sign-up">
					<button class="bt-sign-up" @tap="goto()">注册</button>
				</view>
			</view>
			<view class="otherway-sign-in">
				<view class="other-way">
				    <image class="other-way-img" src="../../static/logo.png" mode="aspectFit"></image>
					<image class="other-way-img" src="../../static/logo.png" mode="aspectFit"></image>
					<image class="other-way-img" src="../../static/logo.png" mode="aspectFit"></image>
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

			}
		},
		methods: {
			goto(url) {
				uni.navigateTo({
					url: url
				})
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
		.up-section-text {
			display: flex;
			flex-direction: column;
			margin-left: 4%;
			margin-bottom: 35px;
			color: white;

			.up-section-text-big {
				font-size: 20px;
				margin-top: 25%;

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

			.uni-input1 {
				display: flex;
				align-items: center;
				margin-top: 15px;
				background-color: rgb(205, 222, 252);
				width: 92%;
				height: 50px;
				border-radius: 15px;
			}

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
			margin-top: 25px;
			margin-left: 6%;
			display: flex;
			flex-direction: column;

			.sign-in {
				margin-bottom: 20px;
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
					background: linear-gradient(to right, rgb(206, 223, 253), rgb(232, 238, 254));
					color: black;
					box-shadow: 0 4px 4px 2px rgb(210, 210, 210);
				}
			}
		}

		.otherway-sign-in {
			flex-grow: 1;
			bottom: 40px;
			display: flex;
			flex-direction: column-reverse;
			align-items: center;
            position: relative;
			.split-line {
				color: rgb(90, 90, 90);
				margin-bottom: 15px;
			}
			.other-way{
				display: flex;
				flex-direction: row;
				gap: 35px;
				.other-way-img{
					height: 40px;
					width: 40px;
					border-radius: 20px;
				}
			}
		}
	}
</style>