<template>
	<view>
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<topSearchAndLogin ref="top"></topSearchAndLogin>
		<button @tap="logOut">退出登录</button>
	</view>
</template>

<script>
	import store from '@/store/index.js'
	import topSearchAndLogin from "../topSearchAndLogin/topSearchAndLogin.vue"
	export default {
		components: {
			topSearchAndLogin,
		},
		data() {
			return {

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
</style>