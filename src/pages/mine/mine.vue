<template>
	<view>
		<button @tap="logOut">退出登录</button>
	</view>
</template>

<script>
	import store from '@/store/index.js'
	export default {
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

<style>

</style>