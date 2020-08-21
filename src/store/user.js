import {
  loginRequest,
  logoutRequest,
  getMyInfoRequest
} from "@/api/user.js";

function getLoginCookie() {
  return document.cookie.split("; ").filter(v => v.indexOf('v_token=') === 0).map(v => v.split('=')[1])[0] || null;
}

export default {
  state: {
    isLogin: getLoginCookie(),
    nickname: null,
    avatarUrl: null,
    virUid: null,
    basicsData: null,
  },
  mutations: {
    setLoginStatus(state, value) {
      state.isLogin = value;
    },
    setUserName(state, name) {
      if (name) {
        state.nickname = name;
      } else {
        state.nickname = null;
      }
    },
    setUserAvatarUrl(state, avatarUrl) {
      if (avatarUrl) {
        state.avatarUrl = avatarUrl;
      } else {
        state.avatarUrl = null;
      }
    },
    setUserVirUid(state, virUid) {
      if (virUid) {
        state.virUid = virUid;
      } else {
        state.virUid = null;
      }
    },
    setUserBasicsData(state, data) {
      if (data) {
        state.basicsData = data;
      } else {
        state.basicsData = null;
      }
    },
  },
  actions: {
    // 设置用户主页个人信息
    handleUserBasicsData({ commit }, data) {
      commit("setUserBasicsData", data);
    },
    // 登录
    handleLogin({ commit }, data) {
      return new Promise((resolve, reject) => {
        loginRequest(data)
          .then(res => {
            commit("setLoginStatus", 1);
            commit("setUserName", res.data.nickname);
            commit("setUserAvatarUrl", res.data.avatar);
            commit("setUserVirUid", res.data.vir_uid);
            commit("setUserBasicsData", res.data.other_info);
            resolve(res.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 退出登录
    handleLogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logoutRequest()
          .then(() => {
            commit("setLoginStatus", null);
            commit("setUserName", null);
            commit("setUserAvatarUrl", null);
            commit("setUserVirUid", null);
            commit("setUserBasicsData", null);
            resolve();
          })
          .catch(err => {
            commit("setLoginStatus", null);
            commit("setUserName", null);
            commit("setUserAvatarUrl", null);
            commit("setUserVirUid", null);
            commit("setUserBasicsData", null);
            reject(err);
          });
      });
    },
    // 获取用户相关信息
    handleGetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getMyInfoRequest()
          .then(res => {
            const data = res.data;
            commit("setUserName", data.nickname);
            commit("setUserAvatarUrl", data.avatar);
            commit("setUserVirUid", data.vir_uid);
            commit("setUserBasicsData", data.other_info);
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
  }
};
