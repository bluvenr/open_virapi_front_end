<template>
  <a-layout-header class="v-header">
    <router-link to="/">
      <img class="logo" src="@/assets/logo.png" alt="VirApi LOGO" />
      <span class="v-logo-s">开源版</span>
    </router-link>

    <div class="v-header-menu">
      <a-menu mode="horizontal" :selectedKeys="[]">
        <a-menu-item>
          <router-link :to="{name:'myApps'}">
            <a-icon type="appstore" />
            <span>我的应用</span>
          </router-link>
        </a-menu-item>
        <a-menu-item>
          <a href="https://github.com/bluvenr/open_virapi" target="_blank">
            <a-icon type="book" />更多资源
          </a>
        </a-menu-item>
        <a-menu-item>
          <a href="http://www.virapi.com/" target="_blank">
            <a-icon type="compass" />VirAPI官网
          </a>
        </a-menu-item>
        <a-menu-item>
          <a href="http://console.virapi.com/" target="_blank">
            <a-icon type="crown" />在线服务
          </a>
        </a-menu-item>
      </a-menu>

      <a-menu mode="horizontal" :selectedKeys="[]">
        <a-menu-item key="bell">
          <router-link :to="{name:'information'}">
            <!-- <a-badge count="5" dot> -->
            <a-icon type="bell" />消息
            <!-- </a-badge> -->
          </router-link>
        </a-menu-item>

        <a-sub-menu>
          <span slot="title" class="v-submenu-title-wrapper">
            <a-icon type="plus-square" />
            <span>新建</span>
          </span>

          <a-menu-item key="create_app">
            <router-link :to="{name:'appCreate'}">新建应用</router-link>
          </a-menu-item>

          <a-menu-item key="create_api">
            <router-link :to="{name:'apiCreate'}">新建接口</router-link>
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu>
          <span slot="title" class="v-submenu-title-wrapper v-header-avatar-box">
            <img
              :src="$store.getters.avatarUrl ? $store.getters.avatarUrl : require('@/assets/default_avatar.jpg')"
              class="v-header-avatar"
              alt="头像"
            />
            <span>{{ $store.getters.userName ? $store.getters.userName : '个人中心' }}</span>
            <a-icon type="down" />
          </span>

          <a-menu-item>
            <router-link :to="{name:'profile'}">
              <a-icon type="user" />个人资料
            </router-link>
          </a-menu-item>

          <a-menu-item>
            <a href="https://github.com/bluvenr/open_virapi" target="_blank">
              <a-icon type="github" />GitHub
            </a>
          </a-menu-item>

          <a-menu-item key="setting:logout" @click="logoutHandle">
            <a-icon type="logout" />退出登录
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
  </a-layout-header>
</template>

<script>
export default {
  methods: {
    handleChangeLang(e) {
      console.log("e", e);
    },
    logoutHandle() {
      this.$store
        .dispatch("handleLogOut")
        .then((res) => {
          this.$router.push({ name: "login" });
        })
        .catch((err) => {
          this.$router.push({ name: "login" });
        });
    },
  },
};
</script>

<style lang="less">
@import "../assets/theme_param.less";

.v-logo-s {
  position: absolute;
  left: 96px;
  top: 0px;
  line-height: 14px;
  padding: 1px 2px;
  font-size: 12px;
  background-color: #ff2525;
  color: #fff;
}
.v-header {
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
  box-shadow: 0 4px 6px rgba(221, 221, 221, 0.5);

  &.ant-layout-header {
    height: 44px;
    background: #fff;
  }

  .logo {
    height: 24px;
    margin: 10px 24px 10px 0;
    float: left;
  }
}
.v-header-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .ant-menu {
    line-height: 43px;
  }
}
.ant-menu-submenu-active {
  .v-header-avatar {
    border-color: @primary-color;
  }
}
.v-header-avatar-box {
  // display: flex;
  // align-items: center;

  span {
    display: inline-block;
    line-height: 14px;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .anticon {
    margin-right: 0;
    margin-left: 2px;
    font-size: 12px;
    color: #e5e4e4;
  }
}
.v-header-avatar {
  height: 28px;
  width: 28px;
  margin-right: 4px;
  border-radius: 50%;
  border: 1px solid #e5e4e4;
  transition: border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>
