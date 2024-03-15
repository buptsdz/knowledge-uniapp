<template>
	<view class="top-img">
		<image class="img" src="@/static/image/background/bg-basefunction-top.png" mode="scaleToFill"></image>
	</view>
	<view class="status_bar">
		<!-- 这里是状态栏 -->
	</view>
	<topSearchAndLogin :textMsg="topTitle"></topSearchAndLogin>
	<view class="top-swiper-section">
		<swiper class="swiper" indicator-color="white" indicator-active-color="#FFDE89" :indicator-dots="true"
			:autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(url, index) in topUrlList" :key="index" class="swiper-img">
				<image :src="url" style="height: 100%; width: 96%;" mode="scaleToFill"></image>
			</swiper-item>
		</swiper>
	</view>
	<view style="display: flex;justify-content: center;">
		<view class="four-button">
			<view class="four-button-item">
				<image class="four-button-item-img" src="../../static/image/resource/basepage-psycho.png" mode="">
				</image>
				<text>心理</text>
			</view>
			<view class="four-button-item">
				<image class="four-button-item-img" src="../../static/image/resource/basepage-paper.png" mode="">
				</image>
				<text>随机组卷</text>
			</view>
			<view class="four-button-item">
				<image class="four-button-item-img" src="../../static/image/resource/basepage-search.png" mode="">
				</image>
				<text>题库检索</text>
			</view>
			<view class="four-button-item">
				<image class="four-button-item-img" src="../../static/image/resource/basepage-analysis.png" mode="">
				</image>
				<text>数据分析</text>
			</view>
		</view>
	</view>
	<view class="goto-notebook">
		<image class="goto-notebook-bg" src="../../static/image/background/bg-notebook.png" mode=""></image>
		<button class="goto-notebook-button">
			<text>GO</text>
		</button>
	</view>
	<view class="detail-section">
		<!-- 学长学姐说 -->
		<view class="detail-section-item">
			<view class="title">
				<view class="title-start">
					<image class="title-start-img" src="../../static/image/resource/basepage-swiper-1.png" mode="">
					</image>
					<text class="title-start-text">学长学姐说</text>
				</view>
				<view class="title-end">
					<text class="title-end-text">更多</text>
					<image class="title-end-img" src="../../static/image/symple/more-right.png" mode="">
					</image>
				</view>
			</view>
			<swiper class="swiper-list" :autoplay="false" :indicator-dots="false" :display-multiple-items="3">
				<swiper-item v-for="(item, index) in bottomList1" :key="index" class="swiper-list-item">
					<image class="swiper-list-item-img" :src="item.image" mode="scaleToFill"></image>
					<text class="swiper-list-item-text">{{ item.text }}</text>
				</swiper-item>
			</swiper>
		</view>
		<!-- 小伙伴说 -->
		<view class="detail-section-item">
			<view class="title">
				<view class="title-start">
					<image class="title-start-img" src="../../static/image/resource/basepage-swiper-2.png" mode="">
					</image>
					<text class="title-start-text">小伙伴说</text>
				</view>
				<view class="title-end">
					<text class="title-end-text">更多</text>
					<image class="title-end-img" src="../../static/image/symple/more-right.png" mode="">
					</image>
				</view>
			</view>
			<swiper class="swiper-list" :autoplay="false" :indicator-dots="false" :display-multiple-items="3">
				<swiper-item v-for="(item, index) in bottomList1" :key="index" class="swiper-list-item">
					<image class="swiper-list-item-img" :src="item.image" mode="scaleToFill"></image>
					<text class="swiper-list-item-text">{{ item.text }}</text>
				</swiper-item>
			</swiper>
		</view>
		<!-- 趣味知识 -->
		<view class="detail-section-item">
			<view class="title">
				<view class="title-start">
					<image class="title-start-img" src="../../static/image/resource/basepage-swiper-3.png" mode="">
					</image>
					<text class="title-start-text">趣味知识</text>
				</view>
				<view class="title-end">
					<text class="title-end-text">更多</text>
					<image class="title-end-img" src="../../static/image/symple/more-right.png" mode="">
					</image>
				</view>
			</view>
			<swiper class="swiper-list" :autoplay="false" :indicator-dots="false" :display-multiple-items="3">
				<swiper-item v-for="(item, index) in bottomList1" :key="index" class="swiper-list-item">
					<image class="swiper-list-item-img" :src="item.image" mode="scaleToFill"></image>
					<text class="swiper-list-item-text">{{ item.text }}</text>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import topSearchAndLogin from "@/components/topSearchAndLogin.vue"
	export default {
		components: {
			topSearchAndLogin,
		},
		data() {
			return {
				//传到顶部子组件的数据
				// loginInfo: {
				// 	isLoggedIn: false,
				// 	userAvatar: '../../static/image/resource/basepage-defaultAvatar.png', // 默认用户头像地址
				// },
				//顶部滑动大图数据
				topTitle: "登录",
				topUrlList: [
					"../../static/image/logo/logo.png",
					"../../static/image/resource/basepage-top.png",
					"../../static/image/resource/basepage-top.png",
				],
				bottomList1: [{
						image: "../../static/image/logo/logo.png",
						text: "赛代表大撒大撒"
					},
					{
						image: "../../static/image/logo/logo.png",
						text: "1235432"
					},
					{
						image: "../../static/image/logo/logo.png",
						text: "你说什么"
					},
					{
						image: "../../static/image/logo/logo.png",
						text: "不知道不知道不知道"
					},
				]
			}
		},
		// onLoad() {
		// 	var token = this.$store.state.token;
		// 	console.log("token：", token);
		// },
		onShow() {},
		methods: {

		},
	}
</script>

<style lang="scss">
	@import "../../uni.scss";

	page {
		width: 100%;
		background-color: $uni-bg-color-home;
		z-index: -2;
	}

	//状态栏占位
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.top-img {
		position: fixed;
		width: 100%;
		height: fit-content;
		z-index: 0;

		.img {
			width: 100%;
			height: calc(270px + var(--status-bar-height));
		}
	}

	.top-swiper-section {
		margin-top: 5px;
		margin-left: 2%;
		width: 96%;

		.swiper {
			width: 100%;
			height: 160px;

			.swiper-img {
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 16px;
			}
		}
	}

	.four-button {
		display: flex;
		flex-direction: row;
		margin-top: 18px;
		gap: 8vw;
		z-index: 10;

		.four-button-item {
			display: flex;
			flex-direction: column;
			align-items: center;

			.four-button-item-img {
				height: 60px;
				width: 60px;
				margin-bottom: 5px;
			}
		}
	}

	.goto-notebook {
		margin-top: 15px;
		display: flex;
		align-items: center;
		height: 85px;
		margin-left: 4%;
		width: 92%;

		.goto-notebook-bg {
			position: absolute;
			width: 92%;
			height: 85px;
		}

		.goto-notebook-button {
			margin-bottom: 13px;
			margin-right: 6%;
			border-radius: 50%;
			width: 50px;
			height: 50px;
			font-size: 20px;
			font-weight: bold;
			display: flex;
			justify-content: center;
			box-shadow: -1px 1px 2px 1px rgba(130, 130, 130, 0.5);
		}
	}

	.detail-section {
		display: flex;
		flex-direction: column;
		margin-left: 4%;
		margin-top: 10px;
	}

	.detail-section-item {
		display: flex;
		flex-direction: column;

		.title {
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			.title-start {
				display: flex;
				justify-content: center;
				align-items: center;

				.title-start-img {
					height: 23px;
					width: 23px;
					margin-right: 6px;
				}

				.title-start-text {
					color: #2C2FAD;
					font-size: 19px;
				}
			}

			.title-end {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-right: 4%;

				.title-end-img {
					height: 8px;
					width: 8px;
				}

				.title-end-text {
					color: #2C2FAD;
					font-size: 13px;
					margin-right: 5px;
				}
			}
		}
	}

	.detail-section-item .swiper-list {
		width: 100%;
		height: 105px;

		.swiper-list-item {
			margin-top: 8px;
			display: flex;
			flex-direction: column;


			.swiper-list-item-img {
				height: 65px;
				width: 92%;
				border-radius: 12px;
			}

			.swiper-list-item-text {
				font-size: 12px;
				color: black;
			}
		}
	}
</style>