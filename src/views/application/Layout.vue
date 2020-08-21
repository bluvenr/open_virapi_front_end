<template>
  <a-layout id="v-app-layout">
    <a-layout-sider collapsible v-model="collapsed" theme="light">
      <div class="v-app-now">
        <a-select
          showSearch
          :value="$route.params.slug"
          @change="switchAppHandle"
          placeholder="选择要操作的应用"
          optionFilterProp="children"
          :filterOption="filterOption"
        >
          <a-select-option
            v-for="(item, index) in $store.getters.myApps"
            :key="index"
            :value="item.slug"
          >
            <img
              class="v-app-icon-img v-app-m-icon"
              :src="item.icon"
              alt="app icon"
              v-if="item.icon"
            />
            <i class="v-app-icon-text v-app-m-icon" v-else>{{ item.name.substr(0, 1) }}</i>

            <span class="v-app-m-name">{{ item.name }}</span>
          </a-select-option>
        </a-select>
      </div>

      <a-menu
        theme="light"
        :selectedKeys="[$route.name]"
        :openKeys.sync="openMenuKeys"
        mode="inline"
      >
        <a-menu-item key="appDetail">
          <router-link :to="{name:'appDetail', params:{slug:$route.params.slug}}">
            <a-icon type="home" />
            <span>应用信息</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="apiList">
          <router-link :to="{name:'apiList', params:{slug:$route.params.slug}}">
            <a-icon type="api" />
            <span>所有接口</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="apiDebug">
          <router-link :to="{name:'apiDebug', params:{slug:$route.params.slug}}">
            <a-icon type="code" />
            <span>接口测试</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="appLog">
          <router-link :to="{name:'appLog', params:{slug:$route.params.slug}}">
            <a-icon type="file" />
            <span>请求日志</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="appStatistics">
          <router-link :to="{name:'appStatistics', params:{slug:$route.params.slug}}">
            <a-icon type="line-chart" />
            <span>数据统计</span>
          </router-link>
        </a-menu-item>
        <a-sub-menu key="management">
          <span slot="title">
            <a-icon type="setting" />
            <span>管理</span>
          </span>
          <a-menu-item key="basicSetting">
            <router-link :to="{name:'basicSetting', params:{slug:$route.params.slug}}">
              <span>应用设置</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="otherSetting">
            <router-link :to="{name:'otherSetting', params:{slug:$route.params.slug}}">
              <span>高级操作</span>
            </router-link>
          </a-menu-item>
          <!-- <a-menu-item key="exportApp">应用数据导出</a-menu-item> -->
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout :style="{ marginLeft: collapsed ? '80px' : '200px'}">
      <a-alert v-if="warningMsg" :message="warningMsg" type="warning" closable showIcon />
      <a-breadcrumb>
        <a-breadcrumb-item>
          <router-link to="/">
            <a-icon type="home" />
          </router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link to="/apps">我的应用</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item v-if="$route.params.slug">
          <router-link
            :to="'/app/'+$route.params.slug"
          >{{ nowApplication ? nowApplication.name : $route.params.slug }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item
          v-if="$route.params.slug && $route.meta.title"
        >{{ $route.meta.title || '--' }}</a-breadcrumb-item>
      </a-breadcrumb>

      <a-layout-content>
        <router-view />
      </a-layout-content>

      <Footer />
    </a-layout>
  </a-layout>
</template>

<script>
import Footer from "@/components/Footer.vue";

export default {
  components: {
    Footer
  },
  data() {
    return {
      collapsed: false,
      warningMsg: null,
      openMenuKeys: [],
      nowApplication: null
    };
  },
  watch: {
    $route(to, from) {
      this.openMenuKeys = to.meta.subKey ? [to.meta.subKey] : [];

      this._initLoad();
    }
  },
  created: function() {
    this.openMenuKeys = this.$route.meta.subKey
      ? [this.$route.meta.subKey]
      : [];

    this._initLoad();
  },
  methods: {
    _initLoad() {
      var _apps = this.$store.getters.myApps
        ? this.$store.getters.myApps.filter(
            o => o.slug == this.$route.params.slug
          )
        : null;
      this.nowApplication = _apps && _apps.length > 0 ? _apps[0] : null;
    },
    switchAppHandle(value) {
      this.$router.push({ name: this.$route.name, params: { slug: value } });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[1].elm.textContent
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
  }
};
</script>

<style lang="less">
#v-app-layout {
  min-width: 1180px;
  min-height: 100vh;

  .ant-layout-content {
    margin: 16px;
    min-height: 100vh;
  }

  .ant-menu {
    background: initial;
  }

  .ant-menu-sub {
    background-color: #fafafa;
  }

  .ant-layout-sider {
    overflow: auto;
    height: 100vh;
    position: fixed;
    left: 0;
    z-index: 10;
  }

  .ant-layout-sider-light {
    border-right: 1px solid #f0f2f5;
    background-color: #fdfdfd;
  }

  .ant-layout-sider-trigger {
    background-color: #f0f2f5;
  }

  .ant-layout {
    background-color: #fff;
  }

  .ant-breadcrumb {
    margin: 16px 16px 0 16px;
    padding: 0 20px 10px;
    border-bottom: 1px solid #f0f2f5;
  }
}
.v-app-now {
  padding: 16px;

  .ant-select {
    width: 100%;
  }
}

.v-app-m-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  margin-right: 4px;

  &.v-app-icon-img {
    margin-top: -4px;
  }

  &.v-app-icon-text {
    font-size: 14px;
    line-height: 20px;
  }
}
.ant-layout-sider-collapsed {
  .v-app-m-name {
    display: none;
  }
}
</style>
