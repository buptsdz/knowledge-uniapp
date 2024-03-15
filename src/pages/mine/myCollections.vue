<template>
	<view class="collection-list">
		<view class="paper-list" v-if="paperList && paperList.length > 0">
			<view class="paper-item" v-for="(paper, index) in paperList" :key="index">

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				paperList: [{
						papername: '2022年全国普通高等学校招生全国 统一考试真题（全国甲卷）：语文',
						level: 6,
						quizProgress: 10,
						total: 22,
					},
					{
						papername: '2022年全国普通高等学校招生全国 统一考试真题（全国甲卷）：数学',
						level: 6,
						quizProgress: 10,
						total: 22,
					},
					{
						papername: '2022年全国普通高等学校招生全国 统一考试真题（全国甲卷）：英语',
						level: 6,
						quizProgress: 10,
						total: 22,
					}
				]
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.collection-list {
		.paper-list {
			.paper-item {}
		}
	}
</style>