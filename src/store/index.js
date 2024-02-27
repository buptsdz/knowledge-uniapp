import {
	createStore
} from 'vuex'
function getStoredData(key) {
	const data = uni.getStorageSync(key);
	try {
		return JSON.parse(data) || {};
	} catch (e) {
		// 如果解析失败，返回一个空对象或者其他默认值
		return {};
	}
}
const store = createStore({
	state: {
		//防止调试时刷新页面重置vuex中数据
		isLoggedIn: uni.getStorageSync("isLoggedIn") || false, //用户是否登录
		userdata: getStoredData("userdata"), //用户数据
		token: uni.getStorageSync("token"),
	},
	//mutations定义同步操作的方法
	mutations: {
		//设置登录
		setLoggedIn(state) {
			state.isLoggedIn = true;
			uni.setStorageSync('isLoggedIn', state.isLoggedIn);
			console.log('登录状态：', state.isLoggedIn);
		},
		//存token
		setToken(state, token) {
			//登录状态为已登录
			state.token = token;
			uni.setStorageSync('token', token);
			console.log("token已保存：", token);
		},
		//登录
		login(state, userdata) {
			state.userdata = userdata;
			console.log(typeof userdata);
			//储存用户数据到本地
			uni.setStorageSync('userdata', JSON.stringify(userdata));
			console.log('登录信息', state.userdata);
		},
		// 退出登录
		logout(state) {
			//登录状态为未登录
			state.isLoggedIn = false
			state.userdata = {}
			state.token = ""
			uni.removeStorageSync("userdata");
			uni.removeStorageSync("token");
			uni.setStorageSync('isLoggedIn', false);
			console.log('已退出登录')
			console.log("token：", state.token)
			console.log("登录信息", uni.getStorageSync("userdata"))
		}
	},
	actions: {

	}
})
export default store