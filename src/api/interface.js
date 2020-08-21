import request from "@/utils/request";

// 获取接口列表
export function getApisRequest(params) {
  return request({
    url: "/interface",
    method: "get",
    params
  });
}

// 获取接口Map
export function getApisMapRequest(params) {
  return request({
    url: "/interface_map",
    method: "get",
    params
  });
}

// 获取接口简易list
export function getApisListRequest(params) {
  return request({
    url: "/interface/list",
    method: "get",
    params
  });
}

// 查看接口详情
export function getApiInfoRequest(id) {
  return request({
    url: "/interface/" + id,
    method: "get"
  });
}

// 创建我的接口
export function createApiRequest(data) {
  return request({
    url: "/interface",
    method: "post",
    data: data
  });
}

// 清空我的应用接口
export function emptyApisRequest(data) {
  return request({
    url: "/interface/empty",
    method: "post",
    data: data
  });
}

// 删除我的接口
export function delApiRequest(id) {
  return request({
    url: "/interface/" + id,
    method: "delete"
  });
}

// 更新接口信息
export function updateApiRequest(id, data) {
  return request({
    url: "/interface/" + id,
    method: "put",
    data: data
  });
}

// 测试接口
export function debugApiRequest(data) {
  return request({
    url: "/interface_debug",
    method: "post",
    data: data
  });
}

// 拷贝接口
export function copyApiRequest(data) {
  return request({
    url: "/interface/copy",
    method: "post",
    data: data
  });
}

// 转移接口
export function moveApiRequest(data) {
  return request({
    url: "/interface/move",
    method: "post",
    data: data
  });
}

// 查看接口请求历史记录
export function getRequestLogsRequest(params) {
  return request({
    url: "/request_log",
    method: "get",
    params
  });
}

// 查看接口相关数据统计
export function getStatisticsRequest(params) {
  return request({
    url: "/statistics",
    method: "get",
    params
  });
}
