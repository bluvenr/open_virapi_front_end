import { getAppsListRequest } from "@/api/application.js";

export default {
  state: {
    appList: null,
    maxConfig: null,
  },
  mutations: {
    setAppList(state, data) {
      if (data) {
        state.appList = data;
      } else {
        state.appList = [];
      }
    },
    setMaxConfig(state, data) {
      if (data) {
        state.maxConfig = data;
      } else {
        state.maxConfig = {};
      }
    },
  },
  actions: {
    handleUpdateMyApps({ commit }) {
      return new Promise((resolve, reject) => {
        getAppsListRequest()
          .then(res => {
            commit("setAppList", res.data);
            resolve(res.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
  }
};
