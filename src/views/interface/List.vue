<template>
  <a-spin tip="加载中..." :spinning="pageLoading" class="v-layout-content v-api-content">
    <header class="v-api-page-header">
      <div class="v-line-box v-app-info-header">
        <div class="v-app-icon">
          <img class="v-app-icon-img" :src="appInfo.icon" alt="app icon" v-if="appInfo.icon" />
          <i class="v-app-icon-text" v-else>{{ appInfo.name.substr(0, 1) || '--' }}</i>
        </div>
        <div class="v-app-base-info">
          <div class="v-base-info-top">
            <h1>{{ appInfo.name || '--' }}</h1>
          </div>
          <div class="v-base-info-bottom">
            <span>Number:</span>
            {{ appInfo.number || '--' }}
          </div>
        </div>
      </div>
      <div class="v-api-data">
        总计
        <span>{{ appApis.length || appInfo.api_count || 0 }}</span>api，其中
        <span>{{ apiCountMap.get }}</span>GET api、
        <span>{{ apiCountMap.post }}</span>POST api、
        <span>{{ apiCountMap.put }}</span>PUT api、
        <span>{{ apiCountMap.delete }}</span>DELETE api；单应用最多可创建
        <span>{{ maxApiCount || '--' }}</span>api
      </div>
    </header>

    <div class="v-api-content-box">
      <div class="v-api-l-main">
        <div class="v-api-list-header">
          <h2>
            对应API列表
            <small>({{ appApis.length || 0}})</small>
          </h2>
          <router-link
            :to="{name:'apiCreate', query:{slug:$route.params.slug, app_id:appInfo._id}}"
            class="ant-btn ant-btn-primary"
            :disabled="maxApiCount && appApis.length >= maxApiCount"
          >
            <a-icon type="plus" />
            <span>新增接口</span>
          </router-link>
        </div>

        <div class="v-options-group">
          <a-input-search
            placeholder="API名称搜索"
            v-model="queryOptions.kw"
            @change="filterSortApiList"
          />
          <a-select v-model="queryOptions.method" style="width:150px;" @change="filterSortApiList">
            <a-select-option value="ALL">全部</a-select-option>
            <a-select-option value="GET">GET请求接口</a-select-option>
            <a-select-option value="POST">POST请求接口</a-select-option>
            <a-select-option value="PUT">PUT请求接口</a-select-option>
            <a-select-option value="DELETE">DELETE请求接口</a-select-option>
          </a-select>
          <a-select v-model="queryOptions.sort" @change="filterSortApiList">
            <a-select-option value="create_desc">
              <a-icon type="arrow-down" />&nbsp;创建时间降序
            </a-select-option>
            <a-select-option value="create_asc">
              <a-icon type="arrow-up" />&nbsp;创建时间升序
            </a-select-option>
            <a-select-option value="update_desc">
              <a-icon type="arrow-down" />&nbsp;最后更新时间降序
            </a-select-option>
            <a-select-option value="update_asc">
              <a-icon type="arrow-up" />&nbsp;最后更新时间升序
            </a-select-option>
          </a-select>
        </div>

        <div class="v-api-list" v-if="appInfo._id">
          <ApiItem
            v-for="(item, index) in apiList"
            :key="item._id"
            :ref="`api_item_${item._id}`"
            :app-info="appInfo"
            :api-data="item"
            :api-index="index"
            @update="updateApiHandle"
            @del="delApiHandle"
            @changeEditStatus="changeEditStatusHandle"
          />

          <div class="v-app-empty" v-if="!apiList || apiList.length==0">
            <a-empty :description="appApis && appApis.length > 0 ? '未找到满足条件的接口' : '当前应用尚未创建接口'" />
          </div>
        </div>
      </div>

      <div class="v-api-r-link" :affix="false">
        <a-anchor :offsetTop="60">
          <a-anchor-link
            v-for="(item, index) in apiList"
            :key="index"
            :href="`#${item.method}:${item.uri}`"
            :title="item.name"
          />
        </a-anchor>
      </div>
    </div>
  </a-spin>
</template>

<script>
import ApiItem from "@/components/ApiItem.vue";
import { getAppBaseInfoRequest } from "@/api/application.js";
import {
  getApisRequest,
  updateApiRequest,
  delApiRequest
} from "@/api/interface.js";

export default {
  components: {
    ApiItem
  },
  data() {
    return {
      appInfo: {
        icon: null,
        name: "",
        slug: null
      },
      apiCountMap: {
        post: 0,
        get: 0,
        put: 0,
        delete: 0
      },
      appApis: [],
      apiList: [],
      maxApiCount: null,
      pageLoading: true,
      queryOptions: {
        kw: "",
        sort: "create_desc",
        method: "ALL"
      },
      hasNotSaveMap: {}
    };
  },
  watch: {
    $route(to, from) {
      if (to.path != from.path) {
        this.pageLoading = true;
        this._initLoad();
      }
    }
  },
  created: function() {
    this._initLoad();
  },
  mounted() {},
  methods: {
    _initLoad() {
      getAppBaseInfoRequest(this.$route.params.slug)
        .then(res => {
          this.appInfo = res.data;
        })
        .catch(err => {
          this.$message.error(err.message);
        });

      this._loadApi();
    },
    _loadApi() {
      getApisRequest({ app_slug: this.$route.params.slug })
        .then(res => {
          this.appApis = res.data.list;
          this.maxApiCount = res.data.max_api_count;

          this.computeApiCount();
          this.filterSortApiList();

          this.pageLoading = false;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    computeApiCount() {
      let apiCountMap = {
        post: 0,
        get: 0,
        put: 0,
        delete: 0
      };

      this.appApis.forEach(o => {
        apiCountMap[o.method.toLowerCase()]++;
      });
      this.apiCountMap = apiCountMap;
    },
    filterSortApiList() {
      const kw = this.queryOptions.kw.trim();
      const method = this.queryOptions.method;

      this.apiList = this.appApis
        .filter(o => {
          if (kw) {
            return o.name.indexOf(kw) > -1 || o.describe.indexOf(kw) > -1;
          } else {
            return true;
          }
        })
        .filter(o => {
          if (method !== "ALL") {
            return o.method == method;
          } else {
            return true;
          }
        })
        .sort((a, b) => {
          if (this.queryOptions.sort == "update_desc") {
            return (
              new Date(b.updated).getTime() - new Date(a.updated).getTime()
            );
          } else if (this.queryOptions.sort == "update_asc") {
            return (
              new Date(a.updated).getTime() - new Date(b.updated).getTime()
            );
          } else if (this.queryOptions.sort == "create_desc") {
            return (
              new Date(b.created).getTime() - new Date(a.created).getTime()
            );
          } else if (this.queryOptions.sort == "create_asc") {
            return (
              new Date(a.created).getTime() - new Date(b.created).getTime()
            );
          } else {
            return 0;
          }
        });
    },
    delApiHandle(api_id) {
      delApiRequest(api_id)
        .then(res => {
          this.appApis = this.appApis.filter(o => o._id != api_id);

          this.computeApiCount();
          this.filterSortApiList();

          let apps = [];
          this.$store.getters.myApps.filter(o => {
            if (o.slug == this.appSlug) {
              o.api_count -= 1;
            }
            apps.push(o);
          });
          this.$store.commit("setAppList", apps);

          this.$message.success("接口删除成功");
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    updateApiHandle(api_id, data) {
      const refApi = this.$refs["api_item_" + api_id][0];

      refApi.changeSubmitStatus(true);
      updateApiRequest(api_id, data)
        .then(res => {
          this.$message.success("接口更新成功");

          for (let index = 0; index < this.appApis.length; index++) {
            const o = this.appApis[index];
            if (o._id == api_id) {
              this.appApis.splice(index, 1, {
                ...o,
                ...data,
                succeed_response: res.data.succeed_response || null
              });
              break;
            }
          }

          this.computeApiCount();
          this.filterSortApiList();
          refApi.cancelEditHandle(false);
          refApi.changeSubmitStatus(false);

          this.$nextTick(() => {
            refApi.init();
          });
        })
        .catch(err => {
          refApi.changeSubmitStatus(false);
          this.$message.error(err.message);
        });
    },
    changeEditStatusHandle(api_id, status) {
      this.hasNotSaveMap[api_id] = status;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (Object.values(this.hasNotSaveMap).filter(v => !v).length > 0) {
      this.$confirm({
        title: "温馨提示",
        content: "当前页面数据尚未保存，确定要离开该页面？",
        okText: "确定离开",
        cancelText: "留在本页",
        onOk() {
          next();
        },
        onCancel() {
          next(false);
        }
      });
    } else {
      next();
    }
  }
};
</script>

<style lang="less">
.v-api-content {
  max-width: 1000px;
}
.v-api-content-box {
  display: flex;
  margin-top: 46px;
}
.v-api-l-main {
  flex: 1;
  overflow: hidden;
}
.v-api-r-link {
  width: 200px;
  padding-left: 20px;
}
.v-api-page-header {
  margin-top: -24px;
  border-bottom: 1px solid #f0f2f5;

  .v-line-box {
    display: flex;
    align-items: center;
  }

  .v-app-info-header {
    height: 40px;
    margin-bottom: 10px;
  }
  .v-app-icon {
    width: 40px;
  }
  .v-app-icon-text {
    line-height: 40px;
  }
  .v-app-base-info {
    height: 100%;

    h1 {
      font-size: 16px;
      line-height: initial;
      margin: 0 10px 0 0;
    }
  }
  .v-api-data {
    padding: 8px 0;
    font-size: 14px;

    span {
      padding: 0 4px;
      font-weight: 600;
    }
  }
}
.v-api-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f2f5;

  h4 {
    font-size: 24px;
  }
}
.v-api-list {
  margin-top: 40px;
}
/* @media (max-width: 1100px) {
  .v-api-r-link {
    display: none;
  }
} */
</style>
