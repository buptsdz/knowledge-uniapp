<template>
	<button @tap="verification()">发布</button>
	<uv-overlay :show="show">
		<view class="warp">
			<!-- 选择身份 -->
			<view class="rect" @tap.stop v-if="state==0">
				<image @tap="noTitlemodalTap()" class="rect-cancel" src="../../static/image/symple/cancel.svg" mode="">
				</image>
				<view class="rect-title">
					<text class="title-text">
						选择身份
					</text>
					<image style="height: 25px;width: 72%" src="../../static/image/resource/split-line.png"
						mode="aspectFit"></image>
				</view>
				<view class="choose-grade">
					<button v-for="(item, index) in buttons" :key="index"
						:class="{'highlight-background': highlightedIndex === index}" @click="handleButtonClick(index)">
						{{ item.label }}
						<image v-show="highlightedIndex === index" style="height: 25px;width: 25px;"
							src="../../static/image/symple/arrow-forward.png" mode=""></image>
					</button>
				</view>
				<!-- 确认动画 -->
				<view class="check" style="margin-top: -5px;">
					<svg width="40" height="40">
						<circle class="circle" fill="none" stroke="#32CD32" stroke-width="3" cx="20" cy="20" r="18"
							stroke-linecap="round" transform="rotate(-90,20,20)"
							:class="{ animateCircle: isAnimating }" />
						<polyline class="tick" fill="none" stroke="#32CD32" stroke-width="4" points="9,21 17,28 30,14"
							stroke-linecap="round" stroke-linejoin="round" :class="{ animateTick: isAnimating }" />
					</svg>
				</view>
			</view>
			<!-- 选择学校 -->
			<view class="rect" @tap.stop v-if="state==1">
				<image @tap="noTitlemodalTap()" class="rect-cancel" src="../../static/image/symple/cancel.svg" mode="">
				</image>
				<view class="rect-title">
					<text class="title-text">
						选择学校
					</text>
					<image style="height: 25px;width: 72%" src="../../static/image/resource/split-line.png"
						mode="aspectFit"></image>
				</view>
				<view class="choose-school">
					<text class="choose-school-text">你的学校</text>
					<view class="input-section">
						<uni-combox class="choose-school-input" :candidates="schoolCandidates" placeholder="请选择所在学校"
							v-model="schoolName"></uni-combox>
					</view>
				</view>
				<!-- 确认动画 -->
				<view style="flex-grow: 1;display: flex;">
					<view class="check">
						<svg width="40" height="40">
							<circle class="circle" fill="none" stroke="#32CD32" stroke-width="3" cx="20" cy="20" r="18"
								stroke-linecap="round" transform="rotate(-90,20,20)"
								:class="{ animateCircle: isAnimating }" />
							<polyline class="tick" fill="none" stroke="#32CD32" stroke-width="4"
								points="9,21 17,28 30,14" stroke-linecap="round" stroke-linejoin="round"
								:class="{ animateTick: isAnimating }" />
						</svg>
					</view>
				</view>
				<view class="more">
					<text class="more-text">没有找到自己的学校？点击搜索</text>
					<view class="input-section">
						<input class="more-input" />
					</view>
				</view>
				<view class="bottom">
					<view class="back" @tap="back()">
						<image style="height: 30px;width: 30px;" src="../../static/image/symple/arrow-back.png" mode="">
						</image>
						<text>返回上一页</text>
					</view>
					<view class="next" @tap="next()">
						<text>继续</text>
						<image style="height: 30px;width: 30px;" src="../../static/image/symple/arrow-forward.png"
							mode=""></image>
					</view>
				</view>
			</view>
			<!-- 选择年级 -->
			<view class="rect" @tap.stop v-if="state==2">
				<image @tap="noTitlemodalTap()" class="rect-cancel" src="../../static/image/symple/cancel.svg" mode="">
				</image>
				<view class="rect-title">
					<text class="title-text">
						选择年级
					</text>
					<image style="height: 25px;width: 72%" src="../../static/image/resource/split-line.png"
						mode="aspectFit"></image>
				</view>
				<view class="choose-classes">
					<text class="choose-classes-text">你的年级</text>
					<view class="input-section">
						<uni-combox class="choose-classes-input" :candidates="currentclasses" placeholder="请选择所在年级"
							v-model="classes"></uni-combox>
					</view>
				</view>
				<view class="bottom">
					<view class="back" @tap="back()">
						<image style="height: 30px;width: 30px;" src="../../static/image/symple/arrow-back.png" mode="">
						</image>
						<text>返回上一页</text>
					</view>
					<view class="next" @tap="next()">
						<text>继续</text>
						<image style="height: 30px;width: 30px;" src="../../static/image/symple/arrow-forward.png"
							mode=""></image>
					</view>
				</view>
			</view>
		</view>
	</uv-overlay>
</template>
<script>
	export default {
		data() {
			return {
				show: false,
				state: 0, //弹窗进行阶段
				isAnimating: false, // 控制动画的播放
				highlightedIndex: null, // 用来跟踪当前高亮的按钮索引
				buttons: [{
						label: '我是初中生'
					},
					{
						label: '我是高中生'
					},
					{
						label: '我是本科生'
					},
					{
						label: '我是研究生'
					},
				],
				classNumber: "", //学号
				currentclasses: [], //目前待选年级
				classesCandidates:[
					['初一', '初二', '初三'],
					['高一', '高二', '高三'],
					['大一', '大二', '大三', '大四'],
					['研一', '研二', '研三'],
				],
				classes: "", //年级
				name: "",
				photo: "", //学生证图片
				schoolCandidates: [],
				schoolName: "",
				schoolId: null, //绑定的学校id
			}
		},
		onShow() {},
		methods: {
			verification() {
				this.show = true;
				this.state = 0;
				this.isAnimating = false;
				this.highlightedIndex = null;
			},
			handleButtonClick(index) {
				if (this.isAnimating) {
					// 如果动画正在执行，不执行任何操作
					return;
				}
				if (this.highlightedIndex === index) {
					// 如果点击的按钮已经是高亮的，视为确认操作
					console.log("确认: ", this.buttons[index].label);
					this.performAction(index); // 执行跳转或其他操作
				} else {
					// 否则，更新高亮的按钮索引为当前点击的按钮
					this.highlightedIndex = index;
					console.log("当前选中：", this.buttons[index].label)
				}
			},
			performAction(index) {
				console.log("执行操作，身份索引: ", index);
				//得到当前候选项
				this.currentclasses = this.classesCandidates[index];
				// 触发打勾动画
				this.isAnimating = true;
				// 动画持续2秒后停止
				setTimeout(() => {
					this.state = 1;
					this.isAnimating = false;
				}, 2000);
			},
			back() {
				if (this.isAnimating) {
					// 如果动画正在执行，不执行任何操作
					return;
				}
				if (this.state == 1) {
					this.schoolId = null;
					this.schoolName = "";
				}
				if (this.state == 2) {
					this.classes = "";
				}
				this.state = this.state - 1;
			},
			next() {
				if (this.isAnimating) {
					// 如果动画正在执行，不执行任何操作
					return;
				}
				this.isAnimating = true;
				setTimeout(() => {
					this.state = this.state + 1;
					this.isAnimating = false;
				}, 2000);
			},
			//关闭弹窗
			noTitlemodalTap: function(e) {
				uni.showModal({
					content: '确认关闭吗？这会丢失当前的填写信息',
					confirmText: '确定',
					cancelText: '取消',
					success: (res) => { // 使用箭头函数
						if (res.confirm) {
							console.log('用户点击确定');
							this.show = false; // 这里的this正确地指向Vue实例
							console.log("this.show:", this.show);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		}
	}
</script>
<style lang="scss">
	//遮罩层
	.warp {
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	//确认时动画
	.check {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-grow: 1;

		.circle {
			stroke-dasharray: 113;
			stroke-dashoffset: 113;
		}

		.tick {
			stroke-dasharray: 33;
			stroke-dashoffset: 33;
		}

		@keyframes circle {
			from {
				stroke-dashoffset: 113;
			}

			to {
				stroke-dashoffset: 226;
			}
		}

		@keyframes tick {
			from {
				stroke-dashoffset: 33;
			}

			to {
				stroke-dashoffset: 0;
			}
		}

		.animateCircle {
			animation: circle 1s ease-in-out;
			animation-fill-mode: forwards;
		}

		.animateTick {
			animation: tick .8s ease-out;
			animation-fill-mode: forwards;
			animation-delay: .95s;
		}
	}

	//弹窗
	.rect {
		width: 70%;
		margin-top: -15%;
		height: 50%;
		background-color: rgba(229, 237, 248, 1);
		border-radius: 15px;
		display: flex;
		flex-direction: column;

		//弹窗底部
		.bottom {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			margin-top: auto;

			.next,
			.back {
				display: flex;
				flex-direction: row;
				align-items: center;
				width: fit-content;
			}
		}

		//弹窗顶部
		.rect-title {
			margin-top: -10px;
			margin-left: 7%;
			display: flex;
			flex-direction: column;

			.title-text {
				color: rgba(44, 47, 173, 1);
				font-size: 16px;
				font-weight: 600;
			}
		}

		//选择身份
		.choose-grade {
			margin-top: -5px;
			display: flex;
			flex-direction: column;

			.highlight-background {
				background-color: white;
				color: black;
			}
		}

		.choose-grade>button {
			margin-top: 25px;
			font-size: 15px;
			background-color: rgba(76, 123, 237, 1);
			width: 50%;
			height: 55px;
			color: white;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 10px;
		}

		//选择学校
		.choose-school {
			display: flex;
			margin-top: 5px;
			margin-left: 13%;
			flex-direction: column;

			.choose-school-text {
				color: rgba(64, 127, 245, 1);
			}

			.input-section {
				width: 84%;
				height: 35px;
				color: #383838;
				border-radius: 5px;
				background-color: rgba(204, 222, 252, 1);
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.choose-school-input {
				margin-left: 4px;
				font-size: 18px;
			}
		}

		//未搜索到学校
		.more {
			display: flex;
			margin-top: 5px;
			margin-left: 13%;
			flex-direction: column;
			margin-top: auto;
			margin-bottom: 10px;

			.more-text {
				color: rgba(64, 127, 245, 1);
			}

			.input-section {
				width: 84%;
				height: 35px;
				color: #383838;
				border-radius: 5px;
				background-color: rgba(204, 222, 252, 1);
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.more-input {
				margin-left: 8px;
				font-size: 18px;
			}
		}

		//选择年级
		.choose-classes {
			display: flex;
			margin-top: 5px;
			margin-left: 13%;
			flex-direction: column;

			.choose-classes-text {
				color: rgba(64, 127, 245, 1);
			}

			.input-section {
				width: 84%;
				height: 35px;
				color: #383838;
				border-radius: 5px;
				background-color: rgba(204, 222, 252, 1);
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.choose-classes-input {
				margin-left: 4px;
				font-size: 18px;
			}
		}
	}

	//取消弹窗按钮
	.rect-cancel {
		position: relative;
		top: 5px;
		right: 5px;
		margin-left: auto;
		height: 25px;
		width: 25px;
	}
</style>