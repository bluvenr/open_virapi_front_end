<template>
  <div class="v-layout-content v-export-management-content">
    <h2>导出接口文档</h2>
    <p class="v-export-explain">
      导出当前应用基本信息及该应用下的所有接口数据，当前暂仅支持导出Markdown格式文本。
    </p>

    <div class="v-export-btn-box">
      <a-button @click="exportMarkdownHandle" icon="export" size="large">
        导出接口文档
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  watch: {
    $route(to, from) {
      this._initLoad();
    },
  },
  created: function () {
    this._initLoad();
  },
  mounted() {},
  methods: {
    _initLoad() {},
    exportMarkdownHandle() {
      window.open(
        process.env.VUE_APP_REQUEST_URL +
          "/application/export?slug=" +
          this.$route.params.slug
      );
    },
  },
};
</script>

<style lang="less">
.v-export-management-content {
  text-align: center;
}
.v-export-explain {
  color: #8b8b8b;
}
.v-export-btn-box {
  margin-top: 20vh;
}
</style>
