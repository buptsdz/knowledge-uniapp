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
				uni.removeStorageSync("userdata");
				console.log("已退出登录");
				uni.showToast({
					title: "已退出登录",
					icon: "success",
					duration: 2000
				}),
				console.log("token:",typeof uni.getStorageSync("token"),uni.getStorageSync("token"));
				console.log("userdata",typeof uni.getStorageSync("userdata"),uni.getStorageSync("userdata"))
			},
		}
	}
</script>

<style>

</style>