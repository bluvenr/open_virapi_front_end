import axios from "axios"
import store from "../store"
import router from "@/router"
import { Modal, message } from 'ant-design-vue'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_REQUEST_URL, // api的base_url
  timeout: 30000, // 请求超时时间
  headers: {
    "Content-Type": "application/json; charset=UTF-8"
  }
});

// request拦截器
service.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

let loginStatusErr = false;

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;

    if (res.code !== 200) {
      // 401 -> 未登陆或登陆验证信息失效，需要重新登录
      if (res.code == 401 && !loginStatusErr) {
        loginStatusErr = true;

        if (store.getters.isLogin) {
          store
            .dispatch("handleLogOut")
            .then(res => {
              Modal.confirm({
                title: '账户登录状态异常',
                content: '登录信息失效或被挤下线，是否重新登录',
                okText: '重新登录',
                onOk: () => {
                  router.push("/login");
                }
              })
            })
            .catch(err => {
              Modal.confirm({
                title: '提示',
                content: '账号状态异常，请重新登录',
                okText: '重新登录',
                onOk: () => {
                  router.push("/login");
                }
              })
            });
        } else {
          message.error('当前登录状态异常', 5);
        }
      }

      return Promise.reject({ code: res.code, message: res.message });
    } else {
      loginStatusErr = false;
      return res;
    }
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;
