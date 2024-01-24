<template>
	<view class="top-img">
		<image style="width:100%;" src="../../static/image/background/bg-basefunction-top.png" mode=""></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {
			var token = localStorage.getItem("token");
			console.log(token);
		},
		methods: {

		}
	}
</script>

<style lang="scss">
@import "../../uni.scss";

	body {
		width: 100%;
		background-color:$uni-bg-color-signin;
	}

	.top-img {
		width: 100%;
		height: fit-content;
		z-index: -10;
	}
</style>