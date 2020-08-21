<template>
  <a-layout id="v-app-layout">
    <a-layout-sider collapsible v-model="collapsed" theme="light" class="v-center-sider">
      <div class="v-mini-profile-box">
        <img :src="$store.getters.avatarUrl" alt="头像" />
        <span>{{ $store.getters.userName }}</span>
      </div>

      <a-menu
        theme="light"
        :selectedKeys="[$route.name]"
        :openKeys.sync="openMenuKeys"
        mode="inline"
      >
        <a-menu-item key="profile">
          <router-link :to="{name:'profile'}">
            <a-icon type="user" />
            <span>个人资料</span>
          </router-link>
        </a-menu-item>

        <a-menu-item key="information">
          <router-link :to="{name:'information'}">
            <!-- <a-badge count="5" dot> -->
            <a-icon type="bell" />
            <span>消息通知</span>
            <!-- </a-badge> -->
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout :style="{ marginLeft: collapsed ? '80px' : '200px'}">
      <a-alert v-if="warningMsg" :message="warningMsg" type="warning" closable showIcon />

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
      openMenuKeys: []
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
      //
    }
  }
};
</script>

<style lang="less">
.v-center-sider {
  // background-color: #ececec !important;
}

.ant-layout-sider-collapsed {
  .v-mini-profile-box {
    img {
      margin: 0 auto;
    }

    span {
      display: none;
    }
  }
}

.v-mini-profile-box {
  padding: 14px 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f2f5;

  img {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background-color: #ccc;
  }

  span {
    font-size: 16px;
    margin-left: 8px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
