<template>
  <a-config-provider :locale="locale">
    <a-layout id="var-app" class="layout">
      <Header v-if="!$route.meta.full" :locale="locale" />

      <a-spin v-if="layoutLoading" class="v-layout-loading" tip="加载中..." />
      <router-view v-else />

      <a-back-top />
    </a-layout>
  </a-config-provider>
</template>

<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import Header from "@/components/Header.vue";

export default {
  name: "appLayout",
  components: {
    Header,
  },
  data() {
    return {
      locale: zh_CN,
      layoutLoading: true,
    };
  },
  watch: {
    $route(to, from) {
      if (to.meta.auth && !this.$store.getters.userName) {
        this.$store.dispatch("handleGetUserInfo");
      }
      if (to.meta.auth && !this.$store.getters.myApps) {
        this.$store.dispatch("handleUpdateMyApps");
      }
    },
  },
  created: function () {
    if (this.$route.meta.auth) {
      this.$store
        .dispatch("handleGetUserInfo")
        .then(() => {
          this.$store.dispatch("handleUpdateMyApps").then(() => {
            this.layoutLoading = false;
          });
        })
        .catch((err) => {
          if (err.code == 401) this.layoutLoading = false;
        });
    } else {
      this.layoutLoading = false;
    }

    console.log(
      "%cVirAPI - 在线虚拟数据云接口平台",
      "color:#2570ff;font-size:24px;font-weight:600;"
    );
    console.log(
      "如果您觉得VirAPI有为您带来便利或帮助，请赞助我们~~。\n如果您有兴趣参与VirAPI的维护，或想为该平台提供一些帮助，也欢迎联系！"
    );
    console.group("【系统信息】");
    console.log("Version：%s", process.env.VUE_APP_VERSION);
    console.log("Host：https://www.virapi.com/");
    console.log("Date：%s", new Date());
    console.log("Email：virapi@outlook.com");
    console.log("Copyright © 2019~2020 Bluven. All Rights Reserved.");
    console.groupEnd();
    console.log(
      "%c温馨提示：%c请勿暴露或擅自他用您的cookie等身份登录信息，以免数据信息被盗用！\n如在使用过程中遇到任何问题，请及时与我们反馈！\n再次感谢您对本平台的支持~~",
      "color:#f00;font-weight:600;",
      "color:#666;"
    );
  },
};
</script>

<style lang="less">
@import "./assets/theme_param.less";

body {
  padding-top: 44px;
}

input {
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
}

.v-input-err {
  border-color: @error-color !important;

  &:hover {
    border-color: saturate(@error-color, 10%) !important;
  }

  &:focus {
    border-color: desaturate(@error-color, 10%) !important;
    box-shadow: 0 0 0 2px fade(@error-color, 20%) !important;
  }
}

.v-layout-loading {
  height: 90vh;
  padding-top: 30vh;
  background-color: #fff;
}
</style>
