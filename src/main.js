import {
	createSSRApp
} from "vue"
import App from "./App.vue"
import axios from 'axios';
export function createApp() {
	const app = createSSRApp(App)
	app.config.globalProperties.$axios = axios; // 将axios添加到Vue实例的全局属性中
	return {
		app,
	};
}
