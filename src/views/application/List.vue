<template>
  <a-spin tip="加载中..." :spinning="pageLoading" class="v-app-list-layout">
    <header class="v-app-list-header v-list-content">
      <h4>
        我的应用
        <small>({{ myApps.length }})</small>
      </h4>
      <router-link :to="{name:'appCreate'}" class="ant-btn ant-btn-primary">
        <a-icon type="plus-square" />
        <span>新建应用</span>
      </router-link>
    </header>

    <div class="v-options-group v-list-content">
      <a-input-search placeholder="搜索我的应用" v-model="queryOptions.kw" @change="filterSortAppList" />
      <a-select v-model="queryOptions.sort" @change="filterSortAppList">
        <a-select-option value="update_desc">
          <a-icon type="arrow-down" />&nbsp;最后更新时间降序
        </a-select-option>
        <a-select-option value="update_asc">
          <a-icon type="arrow-up" />&nbsp;最后更新时间升序
        </a-select-option>
        <a-select-option value="create_desc">
          <a-icon type="arrow-down" />&nbsp;创建时间降序
        </a-select-option>
        <a-select-option value="create_asc">
          <a-icon type="arrow-up" />&nbsp;创建时间升序
        </a-select-option>
      </a-select>
    </div>

    <div class="v-app-box v-list-content">
      <div class="v-app-item" v-for="(item, index) in appList" :key="index">
        <router-link class="v-app-icon" :to="{name:'appDetail', params:{slug:item.slug}}">
          <img class="v-app-icon-img" :src="item.icon" alt="app icon" v-if="item.icon" />
          <i class="v-app-icon-text" v-else>{{ item.name.substr(0, 1) }}</i>
        </router-link>

        <div class="v-app-base">
          <div class="v-app-info-top">
            <router-link :to="{name:'appDetail', params:{slug:item.slug}}">{{ item.name || '--' }}</router-link>
          </div>
          <div class="v-app-intro">{{ item.describe }}</div>
        </div>
        <div class="v-app-data">
          <router-link :to="{name:'apiList', params:{slug:item.slug}}">
            <a-tooltip placement="top" title="对应接口数">
              <template slot="title">
                <span>对应接口数</span>
              </template>
              <a-icon type="api" />
              {{ item.api_count || 0 }}
            </a-tooltip>
          </router-link>
        </div>
        <div class="v-app-time">
          <a-tooltip placement="topRight">
            <template slot="title">
              <span>最后更新时间：{{ dateFormat(item.updated) }}</span>
            </template>
            <span>{{ amityDateFormat(item.updated) }}</span>
          </a-tooltip>
        </div>
      </div>
      <div class="v-app-empty" v-if="!appList || appList.length==0">
        <a-empty :description="myApps && myApps.length > 0 ? '未找到满足相关条件的应用' : '无相关应用'" />
      </div>
    </div>

    <Footer />
  </a-spin>
</template>

<script>
import Footer from "@/components/Footer.vue";
import { getAppsRequest } from "@/api/application.js";
import { dateFormat, amityDateFormat } from "@/utils/handle.js";

export default {
  components: {
    Footer
  },
  data() {
    return {
      message: [],
      myApps: [],
      appList: [],
      pageLoading: true,
      queryOptions: {
        kw: "",
        sort: "update_desc"
      }
    };
  },
  created: function() {
    this._initLoad();
  },
  methods: {
    amityDateFormat,
    _initLoad() {
      getAppsRequest(this.$route.params.slug)
        .then(res => {
          this.myApps = res.data;
          this.filterSortAppList();

          this.pageLoading = false;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    dateFormat(date) {
      return dateFormat(date, "yyyy-MM-dd hh:mm:ss");
    },
    filterSortAppList() {
      const kw = this.queryOptions.kw.trim();
      this.appList = this.myApps
        .filter(o => {
          return o.name.indexOf(kw) > -1 || o.describe.indexOf(kw) > -1;
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
    }
  }
};
</script>

<style lang="less">
@import "../../assets/theme_param.less";

.v-alert-box {
  .ant-alert {
    margin-bottom: 20px;
  }
}
.v-app-list-layout {
  min-width: 1180px;
  background-color: #fff;
  padding: 20px 0 0;
}
.v-list-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.v-app-empty {
  text-align: center;
  padding: 80px 0;
}
.v-app-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f2f5;
  margin-top: 24px;

  h4 {
    font-size: 24px;
  }
}
.v-options-group {
  padding-top: 12px;

  .ant-input-search {
    width: 200px;
  }

  .ant-select {
    width: 200px;
    margin-left: 20px;
  }
}
.v-app-box {
  padding: 24px 0 140px;
  min-height: 80vh;
}
.v-app-icon {
  width: 50px;
  border-radius: 4px;
  overflow: hidden;
}
.v-app-icon-img {
  width: 100%;
}
.v-app-icon-text {
  background-color: lighten(@primary-color, 30%);
  // background-color: #a884de;
  color: #fff;
  font-style: initial;
  display: block;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 50px;
  font-size: 30px;
}
.v-app-item {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  height: 80px;

  & + .v-app-item {
    border-top: 1px solid #f0f2f5;
  }

  .v-app-base {
    flex: 3;
    padding-left: 12px;
    display: flex;
    flex-flow: column;
    overflow: hidden;
  }
  .v-app-info-top {
    padding: 4px;
    a {
      color: #000;
      font-size: 16px;
      font-weight: 600;
      margin-right: 12px;

      &:hover {
        text-decoration: underline;
      }
    }
    .ant-tag {
      margin-left: 12px;
    }
  }
  .v-app-intro {
    font-size: 14px;
    margin-left: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
    white-space: nowrap;
    max-width: 100%;
  }
  .v-app-data {
    flex: 2;
    text-align: center;
    padding: 0 10px;

    a {
      color: #000000a6;
    }

    .anticon {
      margin-right: 6px;
    }
  }
  .v-app-time {
    flex: 1;
    // width: 180px;
    text-align: right;
    padding-right: 10px;
    font-size: 14px;
  }
}
</style>
