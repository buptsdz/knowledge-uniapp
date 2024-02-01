<template>
	<view>
		<button @tap="logout">退出登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			logout() {
				// 清除本地缓存中的token
				uni.removeStorageSync("token");
				console.log("已退出登录");
				uni.showToast({
					title: "已退出登录",
					icon: "success",
					duration: 2000
				}),
				console.log("token:",uni.getStorageSync("token"));
			},
		}
	}
</script>

<style>

</style>