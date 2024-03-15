<template>
	<view class="recentview-sec">
		<!-- 使用v-for遍历处理后的行数据 -->
		<view class="recentview-sec-row" v-for="(row, index) in rows" :key="index">
			<!-- 再次遍历每行的元素 -->
			<view class="item" v-for="item in row" :key="item.title">
				<view class="item-image">
					<image :src="item.imageUrl" class="img" mode="scaleToFill"></image>
				</view>
				<text class="item-title">{{ item.title }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				listArr: [{
						imageUrl: '/static/image/test/dog.jpg',
						title: '重庆医科大学 xxxxxx',
					},
					{
						imageUrl: '/static/image/test/beida.jpg',
						title: '北京邮电大学 xxxxxx',
					},
					{
						imageUrl: '/static/image/test/qinghua.jpg',
						title: 'dbiasbcabcaocbsadasdadqawwvevcwsvw',
					},
					{
						imageUrl: '/static/image/test/dazhuan.jpg',
						title: '北京邮电大专 xxxxxx',
					},
					{
						imageUrl: '/static/image/test/dog.jpg',
						title: 'jj',
					},{
						imageUrl: '/static/image/test/dog.jpg',
						title: '重庆医科大学 xxxxxx',
					},
					{
						imageUrl: '/static/image/test/beida.jpg',
						title: '北京邮电大学 xxxxxx',
					},
					{
						imageUrl: '/static/image/test/qinghua.jpg',
						title: 'dbiasbcabcaocbsadasdadqawwvevcwsvw',
					},
				]
			}
		},
		computed: {
			// 处理后的行数据，每行两个元素
			rows() {
				let rows = [];
				for (let i = 0; i < this.listArr.length; i += 2) {
					rows.push(this.listArr.slice(i, i + 2));
				}
				return rows;
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.recentview-sec {
		margin-top: 10px;
	}

	.recentview-sec .recentview-sec-row {
		display: flex;
		justify-content: space-between;
		overflow-wrap: break-word;
		align-items: flex-start;

		.item {
			width: 50%;
			display: flex;
			justify-content: space-around;
			flex-direction: column;
			margin-bottom: 6px;


			/* 根据需要调整样式 */
			.item-image {
				margin-left: 3%;
				width: 94%;
				height: 0;
				position: relative;
				padding-bottom: 53%;

				/* 这个值可以调成自己想要的比值, 比如4:3的话就设置75% */
				.img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					object-position: center;
					position: absolute;
					border-radius: 15px;
				}
			}

			.item-title {
				margin-left: 4%;
				margin-right: 2%;
				font-size: 14px;
				flex-wrap: wrap;
			}
		}
	}
</style>