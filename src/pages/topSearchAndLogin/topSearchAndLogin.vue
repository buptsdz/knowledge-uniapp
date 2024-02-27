<template>
	<view class="top-tab">
		<view class="attendance">
			<button class="attendance-button">签到打卡</button>
		</view>
		<view class="search">
			<image class="search-img" src="../../static/image/symple/search-blue.png" mode="aspectFit"></image>
			<input class="search-input" type="text" placeholder="搜索内容" />
		</view>
		<view class="log-in">
			<view v-if="isLoggedIn">
				<!-- 如果已登录，显示用户头像 -->
				<image class="log-in-avatar" :src="userAvatar ? userAvatar : defaultAvatarUrl" @tap="goToMine" mode="scaleToFill"></image>
			</view>
			<view v-else>
				<!-- 如果未登录，显示登录按钮 -->
				<button class="log-in-button" @tap="goToLogin">登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js'
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				defaultAvatarUrl:"../../static/image/resource/basepage-defaultAvatar.png"
			}
		},
		computed: mapState({
			// 从state中拿到数据 箭头函数可使代码更简练
			isLoggedIn: state => state.isLoggedIn,
			userAvatar: state => state.userdata.headImg,
		}),
		methods: {
			goToMine() {
				uni.switchTab({
					url: "/pages/mine/mine"
				})
			},
			// 未登录状态点击头像跳转到登录页面
			goToLogin() {
				uni.navigateTo({
					url: "/pages/index_login/index_login",
				})
			},
		}
	}
</script>

<style lang="scss">
	.top-tab {
		display: flex;
		z-index: 1;
		flex-direction: row;
		padding-top: 16px;
		margin-left: 4%;
		width: 92%;

		.attendance {
			margin-right: 15px;

			.attendance-button {
				display: flex;
				align-items: center;
				color: white;
				height: 34px;
				border-radius: 8px;
				font-size: 12px;
				white-space: nowrap;
				background-image: linear-gradient(to right, rgba(80, 139, 248, 1), rgba(65, 78, 207, 1));
			}
		}

		.search {
			background-color: #E5EDF8;
			display: flex;
			flex-grow: 1;
			align-items: center;
			border-radius: 12px;

			.search-img {
				margin-left: 10px;
				height: 20px;
				width: 20px;
			}

			.search-input {
				margin-left: 10px;
				font-size: 12px;
			}
		}

		.log-in {
			margin-left: 15px;

			.log-in-button {
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 34px;
				width: 34px;
				font-size: 12px;
				white-space: nowrap;
			}

			.log-in-avatar {
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 34px;
				width: 34px;
			}
		}
	}
</style>