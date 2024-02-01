// store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    isUserLoggedIn: false,
    // 其他状态...
  },
  mutations: {
    setLoginStatus(state, status) {
      state.isUserLoggedIn = status;
    },
    // 其他mutations...
  },
});
