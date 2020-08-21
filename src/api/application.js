import request from "@/utils/request";

// 获取应用列表
export function getAppsRequest() {
  return request({
    url: "/application",
    method: "get"
  });
}

// 获取应用列表
export function getAppsListRequest() {
  return request({
    url: "/application/list",
    method: "get"
  });
}

// 查看应用详情
export function getAppInfoRequest(slug) {
  return request({
    url: "/application/" + slug,
    method: "get"
  });
}

// 获取应用基本
export function getAppBaseInfoRequest(slug) {
  return request({
    url: "/application/" + slug + "/base_info",
    method: "get"
  });
}

// 创建我的应用
export function createAppRequest(data) {
  return request({
    url: "/application",
    method: "post",
    data: data
  });
}

// 删除我的应用
export function delAppRequest(id) {
  return request({
    url: "/application/" + id,
    method: "delete"
  });
}

// 更新应用信息
export function updateAppRequest(id, data) {
  return request({
    url: "/application/" + id,
    method: "put",
    data: data
  });
}

// 更新应用app key
export function changeAppKeyRequest(id) {
  return request({
    url: "/change_application_key",
    method: "post",
    data: {
      id
    }
  });
}

// 拷贝应用
export function copyAppRequest(data) {
  return request({
    url: "/application/copy",
    method: "post",
    data: data
  });
}
