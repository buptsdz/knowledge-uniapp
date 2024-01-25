// 导入axios
import axios from 'axios'

const service = axios.create({
  // baseURL 将自动加在 url`前面，除非 url 是一个绝对 URL。
  baseURL: 'http://www.liuchen.work:280',//测试环境
  // timeout设置一个请求超时时间，如果请求时间超过了timeout，请求将被中断，单位为毫秒（ms）
  timeout: 6000,
  // headers是被发送的自定义请求头，请求头内容需要根据后端要求去设置，这里我们使用本项目请求头。
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
// http request 请求拦截器
service.interceptors.request.use(
  config => {
    // 这里判断localStorage里面是否存在token，如果有则在请求头里面设置
    // if (localStorage.jwtToken) {
    //   config.headers.token = getLocalStorage("jwtToken");
    // }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做些事
    return response;
  },
  error => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

export default service;