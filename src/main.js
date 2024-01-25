import {
	createSSRApp
} from "vue"
import App from "./App.vue"
import servive from './utils/request.js';
export function createApp() {
	const app = createSSRApp(App)
	app.config.globalProperties.$service = servive; // 将axios添加到Vue实例的全局属性中
	return {
		app,
	};
}
