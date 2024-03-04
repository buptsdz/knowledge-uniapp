<template>
	<view class="page">
		<view class="paper-section" v-for="(paper, index) in papers" :key="index">
			<image class="img" :src="paper.imgSrc" mode="widthFix"></image>
			<text class="text">{{ paper.title }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				papers: [{
						title: '2023全国乙卷数学高考真题 3题',
						imgSrc: '/static/image/resource/samplePaper.png'
					},
					{
						title: '2023全国乙卷数学高考真题 3题',
						imgSrc: '/static/image/resource/samplePaper.png'
					},
					{
						title: '2023全国乙卷数学高考真题 3题',
						imgSrc: '/static/image/resource/samplePaper.png'
					},
					{
						title: '2023全国乙卷数学高考真题 3题',
						imgSrc: '/static/image/resource/samplePaper.png'
					}
				]
			}
		},
		methods: {}
	}
</script>

<style lang="scss">
	.page {
		margin-top: 15px;
		display: flex;
		flex-direction: column;
	}

	.paper-section {
		margin-bottom: 10px;
		display: flex;
		flex-direction: column;

		.img {
			width: 98%;
		}

		.text {
			color: #03066D;
			margin-left: 1%;
		}
	}
</style>