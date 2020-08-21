import request from "@/utils/request";

// 获取文档列表
export function getDocumentListRequest(params) {
    return request({
        url: "/document",
        method: "get",
        params
    });
}

// 查看文档详情
export function getDocumentDetailRequest(id, params = null) {
    return request({
        url: "/document/" + id,
        method: "get",
        params
    });
}

// 新建文档
export function insertDocumentRequest(data) {
    return request({
        url: "/document",
        method: "post",
        data: data
    });
}

// 更新文档信息
export function updateDocumentRequest(id, data) {
    return request({
        url: "/document/" + id,
        method: "put",
        data: data
    });
}

// 删除我的文档
export function delDocumentRequest(id, params = null) {
    return request({
        url: "/document/" + id,
        method: "delete",
        params
    });
}
