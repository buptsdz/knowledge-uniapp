<template>
	<view>
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view class="top">
			<topSearchAndLogin :textMsg="topTitle"></topSearchAndLogin>
		</view>
		<view class="user-section">
			<view class="user-avatar">
				<image class="img" :src="userdata.avatar" mode=""></image>
			</view>
			<view class="user-info">
				<view class="user-name">
					<text class="name">{{userdata.username}}</text>
					<view class="level">
						&nbsp lv.{{userdata.level}} &nbsp
					</view>
					<view class="setting">
						<image class="img" src="@/static/image/symple/moon.png" mode=""></image>
						<image class="img" src="@/static/image/symple/setting.png" mode=""></image>
					</view>
				</view>
				<view class="identity">
					<text class="text1">{{userdata.location}}</text>|<text class="text2">{{userdata.identity}}</text>
				</view>
			</view>
		</view>
		<button @tap="logOut">退出登录</button>
	</view>
</template>

<script>
	import store from '@/store/index.js'
	import topSearchAndLogin from "@/components/topSearchAndLogin.vue"
	export default {
		components: {
			topSearchAndLogin,
		},
		data() {
			return {
				topTitle: "我的",
				userdata: {
					avatar: "/static/image/resource/basepage-defaultAvatar.png",
					username: "用户1654351435",
					level: 1,
					location:"武汉",
					identity:"学生",
				}
			}
		},
		methods: {
			logOut() {
				store.commit("logout");
				// 清除本地缓存中的token
				uni.showToast({
					title: "已退出登录",
					icon: "success",
					duration: 2000
				})
			},
		}
	}
</script>

<style lang="scss">
	//状态栏占位
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	//顶部背景色
	.top {
		background-color: white;
	}

	body {
		background-color: $uni-bg-color-home;
	}

	.user-section {
		margin-top: 10px;
		margin-left: 4%;
		width: 92%;
		background-image: linear-gradient(to right, rgba(80, 139, 248, 1), rgba(65, 78, 207, 1));
		border-radius: 10px;
		height: 120px;
		display: flex;
		flex-direction: row;
	}

	.user-avatar {
		margin-top: 15px;
		margin-left: 10px;

		.img {
			height: 60px;
			width: 60px;
			border-radius: 50%;
		}
	}

	.user-info {
		display: flex;
		flex-direction: column;
		flex-grow: 1;

		.user-name {
			display: flex;
			flex-direction: row;
			margin-top: 12px;
			margin-left: 4%;
			align-items: center;

			.name {
				color: white;
				font-size: 33rpx;
			}

			.level {
				margin-left: 5%;
				height: 26rpx;
				width: fit-content;
				color: white;
				font-size: 25rpx;
				border: 1px solid white;
				border-radius: 5px;
				display: flex;
				align-items: center;
			}
			.setting{
				display: flex;
				align-items: center;
				flex-grow: 1;
				justify-content: flex-end;
				margin-right: 4%;
				.img{
					height: 35rpx;
					width: 35rpx;
					margin-right: 5px;
				}
			}
		}
		.identity{
			margin-left: 4%;
			color: white;
			.text1{
				margin-right: 3px;
			}
			.text2{
				margin-left: 3px;
			}
		}
	}
</style>