import request from "@/utils/request";

// 登录
export function loginRequest(data) {
    return request({
        url: "/login",
        method: "post",
        data: data
    });
}

// 获取当前登录用户信息
export function getMyInfoRequest() {
    return request({
        url: "/account",
        method: "get"
    });
}

// 编辑个人资料
export function updateUserInfoRequest(data) {
    return request({
        url: "/user/profile",
        method: "post",
        data
    });
}

// 获取我的登录历史日志
export function getLoginLogRequest() {
    return request({
        url: "/login_log",
        method: "get",
    });
}

// 退出登录
export function logoutRequest() {
    return request({
        url: "/session",
        method: "delete"
    });
}

// 获取用户主页数据信息
export function getUserHomeRequest(uid) {
    return request({
        url: "/user/home",
        method: "get",
        params: { uid: uid }
    });
}

// 获取当前用户信息--来自编辑页
export function getUserInfoByEditRequest() {
    return request({
        url: "/user/edit",
        method: "get"
    });
}

// 更新用户信息
export function updateUserDataRequest(uid, data) {
    return request({
        url: "/user/" + uid,
        method: "put",
        data: data
    });
}

// 更新用户登录密码
export function updateUserPwdRequest(data) {
    return request({
        url: "/user_pwd",
        method: "put",
        data: data
    });
}
