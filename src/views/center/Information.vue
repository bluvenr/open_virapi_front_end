<template>
  <a-spin tip="加载中..." :spinning="pageLoading" class="v-layout-content v-center-content">
    <h2>我的消息通知</h2>

    <div class="v-empty-information">
      <a-icon type="coffee" />
      <p>-- 暂无您的消息通知 --</p>
    </div>
  </a-spin>
</template>

<script>
import { getAppInfoRequest } from "@/api/user.js";

export default {
  data() {
    return {
      pageLoading: true
    };
  },
  beforeCreate() {},
  watch: {
    $route(to, from) {
      this.pageLoading = true;
      this._initLoad();
    }
  },
  created: function() {
    this._initLoad();
  },
  mounted() {},
  methods: {
    _initLoad() {
      this.pageLoading = false;
      /* getAppInfoRequest(this.$route.params.slug)
        .then(res => {
          //
        })
        .catch(err => {
          this.$message.error(err.message);
        }); */
    }
  }
};
</script>

<style lang="less">
.v-empty-information {
  text-align: center;
  color: #ccc;
  margin-top: 25vh;

  .anticon {
    font-size: 60px;
    margin-bottom: 20px;
  }
}
</style>
