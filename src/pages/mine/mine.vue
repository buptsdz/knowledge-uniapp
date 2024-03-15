<template>
	<view>
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view class="top">
			<topSearchAndLogin :textMsg="topTitle"></topSearchAndLogin>
		</view>
		<view class="user-section">
			<view class="user-avatar">
				<image class="img" :src="userAvatar ? userAvatar : this.userdata.avatar" mode=""></image>
			</view>
			<view class="user-info">
				<view class="user-name">
					<text class="name">{{userdata.username}}</text>
					<view class="level">
						&nbsp lv.{{userdata.level}} &nbsp
					</view>
					<view class="setting">
						<image class="img" src="@/static/image/symple/moon.png" mode=""></image>
						<image class="img" src="@/static/image/symple/setting.png" mode=""></image>
					</view>
				</view>
				<view class="identity">
					<text class="text1">{{userdata.location}}</text>|<text class="text2">{{userdata.identity}}</text>
				</view>
				<view class="detailed">
					<text>积分 {{userdata.score}}</text>
					<text>粉丝 {{userdata.fans}}</text>
					<text>关注 {{userdata.follow}}</text>
					<text>创作 {{userdata.creatity}}</text>
					<text>好友 {{userdata.friends}}</text>
				</view>
			</view>
		</view>
		<view class="middle-section">
			<view class="attendenceAndMission">
				<view class="attendence">
					<image class="img" src="@/static/image/resource/mine-attendence.png" mode="scaleToFill"></image>
					<view class="text">
						<text style="font-size: 21px;font-weight: 600;">每日签到</text>
						<text style="font-size: 14px;">签到多多 赢福利</text>
					</view>
				</view>
				<view class="mission">
					<image class="img" src="@/static/image/resource/mine-mission.png" mode="scaleToFill"></image>
					<view class="text">
						<text style="font-size: 21px;font-weight: 600;">精彩任务</text>
						<text style="font-size: 14px;">完成任务 赢大奖</text>
					</view>
				</view>
			</view>
			<view class="startCreate">
				<view class="text">
					开始创作
				</view>
				<view class="add">
					<image class="img" src="@/static/image/resource/mine-create.png" mode="scaleToFill"></image>
				</view>
			</view>
		</view>
		<view class="bottom-section">
			<view class="title">
				<button v-for="(button, index) in buttons" :key="index" @click="changeColor(index)"
					:class="{'button-active': activeIndex === index }">{{ button }}</button>
			</view>
			<view class="content">
				<view class="needlogin" v-if="isloggdin===false">
					请登录后查看
				</view>
				<wrongQuestions v-show="activeIndex===0 && isloggdin===true"></wrongQuestions>
				<recentlyView v-show="activeIndex===1 && isloggdin===true"></recentlyView>
				<myCollections v-if="activeIndex===2 && isloggdin===true"></myCollections>
				<scoreMall v-if="activeIndex===3 && isloggdin===true"></scoreMall>
			</view>
		</view>
		<button @tap="logOut">退出登录</button>
	</view>
</template>

<script>
	import store from '@/store/index.js'
	import {
		mapState
	} from 'vuex'
	import topSearchAndLogin from "@/components/topSearchAndLogin.vue"
	import wrongQuestions from "./wrongQuestions.vue"
	import recentlyView from "./recentlyView.vue"
	import myCollections from "./myCollections.vue"
	import scoreMall from "./scoreMall.vue"
	export default {
		components: {
			topSearchAndLogin,
			wrongQuestions,
			recentlyView,
			myCollections,
			scoreMall
		},
		data() {
			return {
				topTitle: "我的",
				userdata: {
					avatar: "/static/image/resource/basepage-defaultAvatar.png",
					username: "用户1654351435",
					level: 1,
					location: "武汉",
					identity: "学生",
					score: 0, //积分
					fans: 0, //粉丝
					follow: 0, //关注
					creatity: 0, //创作
					friends: 0 //好友
				},
				buttons: ['近期错题', '最近浏览', '我的收藏', '积分商城'],
				activeIndex: 0, // 初始值为0表示第一个按钮被选中
			}
		},
		computed: mapState({
			// 从state中拿到数据 箭头函数可使代码更简练
			userAvatar: state => state.userdata.headImg,
			isloggdin: state => state.isLoggedIn,
		}),
		onShow(){
			console.log("登录状态",this.isloggdin);
		},
		methods: {
			changeColor(index) {
				this.activeIndex = index; // 更新选中按钮的索引
			},
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

	//顶部背景色
	.top {
		background-color: white;
	}

	page {
		background-color: $uni-bg-color-home;
	}

	.user-section {
		margin-top: 10px;
		margin-left: 4%;
		width: 92%;
		background-image: linear-gradient(to right, rgba(80, 139, 248, 1), rgba(65, 78, 207, 1));
		border-radius: 10px;
		display: flex;
		flex-direction: row;
		padding-bottom: 18px;
		box-shadow: 0px 3px 4px 2px rgba(190, 190, 190, 0.8);
	}

	.user-section .user-avatar {
		margin-top: 18px;
		margin-left: 10px;

		.img {
			height: 60px;
			width: 60px;
			border-radius: 50%;
		}
	}

	//蓝色区域信息
	.user-section .user-info {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		margin-top: 3px;

		//第一行
		.user-name {
			display: flex;
			flex-direction: row;
			margin-top: 12px;
			margin-left: 4%;
			align-items: center;

			.name {
				color: white;
				font-size: 33rpx;
			}

			.level {
				margin-left: 5%;
				height: 26rpx;
				width: fit-content;
				color: white;
				font-size: 25rpx;
				border: 1px solid white;
				border-radius: 5px;
				display: flex;
				align-items: center;
			}

			.setting {
				display: flex;
				align-items: center;
				flex-grow: 1;
				justify-content: flex-end;
				margin-right: 4%;

				.img {
					height: 35rpx;
					width: 35rpx;
					margin-right: 5px;
				}
			}
		}

		//第二行
		.identity {
			margin-left: 4%;
			color: white;

			.text1 {
				margin-right: 3px;
			}

			.text2 {
				margin-left: 3px;
			}
		}

		.detailed {
			display: flex;
			flex-direction: row;
			margin-left: 4%;
			margin-top: 5px;
			color: white;
			font-size: 14px;
			margin-bottom: 4px;

			>* {
				margin-right: 4%;
			}
		}
	}

	//中间区域
	.middle-section {
		margin-top: 15px;
		display: flex;
		flex-direction: row;
		margin-left: 5%;
		width: 90%;
		margin-bottom: 10px;
	}

	.middle-section .attendenceAndMission {
		width: 60%;
		display: flex;
		flex-direction: column;

		//每日签到
		.attendence {
			display: flex;
			flex-direction: row;
			background-color: #E2DEFF;
			height: 80px;
			border-radius: 15px;
			box-shadow: 0px 3px 3px 2px rgba(190, 190, 190, 0.8);

			.img {
				height: 90%;
				width: 50%;
				max-width: 150px;
				align-self: center;
			}

			.text {
				margin-top: -10px;
				display: flex;
				flex-direction: column;
				color: #6B558E;
				justify-content: center;
				margin-left: auto;
				margin-right: auto;
			}
		}

		//任务
		.mission {
			margin-top: 15px;
			display: flex;
			flex-direction: row;
			background-color: #DEF0FF;
			height: 80px;
			border-radius: 15px;
			box-shadow: 0px 3px 3px 2px rgba(190, 190, 190, 0.8);

			.img {
				height: 90%;
				width: 50%;
				max-width: 150px;
				align-self: center;
			}

			.text {
				margin-top: -10px;
				display: flex;
				flex-direction: column;
				color: #55578E;
				justify-content: center;
				margin-left: auto;
				margin-right: auto;
			}
		}
	}

	.middle-section .startCreate {
		height: 175px;
		width: 35%;
		background-color: #CCDEFC;
		border-radius: 15px;
		justify-self: center;
		margin-left: auto;
		box-shadow: 0px 3px 2px 1px rgba(190, 190, 190, 0.8);
		display: flex;
		flex-direction: column;
		align-items: center;

		.text {
			margin-top: 15px;
			font-size: 18px;
		}

		.add {
			margin-top: 15%;
			width: 90px;
			height: 90px;
			border-radius: 18px;
			background-color: #E5EDF8;
			display: flex;
			justify-content: center;
			align-items: center;

			.img {
				height: 100%;
				width: 100%;
			}
		}
	}

	//底部区域
	.bottom-section {
		display: flex;
		flex-direction: column;
		margin-left: 3%;
		width: 94%;
		margin-top: 15px;
		background-color: #CCDEFC;
		border-radius: 15px;
		height: fit-content;
		padding-bottom: 10px;

		.content {
			.needlogin {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 10px;
				height: 50px;
				font-size: 18px;
			}
		}
	}

	.bottom-section .title {
		margin-top: 12px;
		width: 96%;
		display: flex;
		flex-direction: row;
		align-self: center;

		>* {
			color: white;
			display: flex;
			align-items: center;
			font-size: 14px;
			height: 60rpx;
			border-radius: 38rpx;
			background-image: linear-gradient(to right, rgba(80, 139, 248, 1), rgba(65, 78, 207, 1));
		}

		.button-active {
			background-image: linear-gradient(to right, rgba(143, 174, 255, 1), rgba(143, 174, 255, 1)); // 根据需求设定选中按钮的背景颜色
		}
	}
</style>