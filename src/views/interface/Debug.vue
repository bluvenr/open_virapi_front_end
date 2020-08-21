<template>
  <a-spin tip="加载中..." :spinning="pageLoading" class="v-layout-content">
    <a-alert
      message="此处发起的接口测试记录不会统计到【请求日志】及【数据统计】，请注意！"
      style="margin-top:-20px;margin-bottom:10px;"
      type="info"
      banner
      show-icon
    />

    <header class="v-api-debug-header">
      <h2>
        <a-icon type="code" />&nbsp;接口测试
      </h2>

      <div class="v-api-d-s">
        <label>目标接口:</label>
        <a-select
          showSearch
          placeholder="选择要测试的接口"
          optionFilterProp="children"
          v-model="apiId"
          @change="changeApiHandle"
          :filterOption="filterOption"
        >
          <a-select-option
            v-for="(item, index) in apiList"
            :key="index"
            :value="item._id"
          >{{ item.name }}</a-select-option>
        </a-select>
      </div>
    </header>

    <div class="v-api-debug-content" v-if="apiInfo">
      <ul class="v-api-request-form">
        <li>
          <label>接口名</label>
          <span>{{ apiInfo.name }}</span>
        </li>

        <li>
          <label>URL</label>
          <code>{{ `${app_api_request_uri || '--/'}${$store.getters.virUid}/${$route.params.slug || '--'}/${apiInfo.uri}` }}</code>
          <a-button
            type="dashed"
            icon="copy"
            size="small"
            class="v-uri-copy-btn v-copy-tag"
            title="一键复制请求接口URL到粘贴板"
            @click="copyTextHandle(`${app_api_request_uri || '--/'}${$store.getters.virUid}/${$route.params.slug || '--'}/${apiInfo.uri}`)"
          ></a-button>
        </li>

        <li>
          <label>请求方式</label>
          <span>{{ apiInfo.method }}</span>
        </li>

        <li class="v-api-r-f-flex-item">
          <label>描述</label>
          <p>{{ apiInfo.describe }}</p>
        </li>

        <li>
          <a-button
            type="primary"
            class="v-api-debug-submit-btn"
            block
            @click="sendDebugHandle"
            :loading="submitStatus"
          >发出测试请求</a-button>
        </li>
      </ul>

      <div class="v-api-response-content" v-if="responseData">
        <span>接口响应数据：</span>

        <div class="v-pre-box">
          <pre>{{ responseData }}</pre>
        </div>
      </div>
    </div>
    <div class="v-api-debug-empty" v-else>
      <a-icon type="api" />

      <p>
        请先选择要测试的目标接口
        <br />选择后填写测试数据即可获取虚拟响应数据了
        <br />很简单！
      </p>
    </div>
  </a-spin>
</template>

<script>
import Clipboard from "clipboard";
import { getApisMapRequest, debugApiRequest } from "@/api/interface.js";

export default {
  data() {
    return {
      app_api_request_uri: process.env.VUE_APP_API_REQUEST_URI,
      apiId: this.$route.query.api_id,
      apiList: [],
      pageLoading: true,
      apiInfo: null,
      responseData: null,
      submitStatus: false
    };
  },
  watch: {
    $route(to, from) {
      this.apiId = this.$route.query.api_id;
      this.apiList = [];
      this.apiInfo = null;
      this.pageLoading = true;
      this._initLoad();
    }
  },
  created: function() {
    this._initLoad();
  },
  methods: {
    _initLoad() {
      getApisMapRequest({ app_slug: this.$route.params.slug })
        .then(res => {
          this.apiList = res.data;

          if (this.apiId) {
            this.changeApiHandle(this.apiId);
          }

          this.pageLoading = false;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    copyTextHandle(text) {
      let clipboard = new Clipboard(".v-copy-tag", {
        text: () => text
      });
      clipboard.on("success", e => {
        this.$message.success("复制成功");
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        this.$message.error("该浏览器不支持自动复制");
        clipboard.destroy();
      });
    },
    changeApiHandle(value) {
      let apiInfo = this.apiList.filter(o => o._id == value)[0];

      this.apiInfo = { ...apiInfo };
      this.responseData = null;
    },
    sendDebugHandle() {
      this.submitStatus = true;
      debugApiRequest({
        api_id: this.apiId,
        app_slug: this.$route.params.slug,
      })
        .then(res => {
          this.submitStatus = false;
          this.responseData = res.data;
        })
        .catch(err => {
          this.submitStatus = false;
          this.$message.error(err.message);
        });
    }
  }
};
</script>

<style lang="less">
@import "../../assets/theme_param.less";

.v-api-debug-empty {
  text-align: center;
  margin-top: 14%;
  color: #ddd;

  .anticon {
    font-size: 60px;
    margin-bottom: 10px;
  }
}
.v-api-debug-header {
  padding: 16px;
  text-align: center;

  h2 {
    color: @primary-color;
  }
}
.v-api-d-s {
  text-align: center;

  label {
    margin-right: 6px;
  }

  .ant-select {
    width: 60%;
  }
}
.v-api-debug-content {
  margin-top: 20px;
}
.v-api-request-form {
  list-style: none;
  padding: 24px 20px 16px;
  border-radius: 4px;
  border: 1px solid #e6e6e6;
  //   box-shadow: 0 0 6px fade(@primary-color, 10%);

  code {
    background-color: lighten(@primary-color, 40%);
    padding: 2px 6px;
    border-radius: 2px;
  }

  .v-api-r-f-flex-item {
    display: flex;
    align-items: flex-start;

    label {
      width: 60px;
    }
    p {
      flex: 1;
      margin-bottom: 0;
      line-height: 24px;
    }
  }

  li {
    margin-bottom: 10px;

    > label {
      font-weight: 600;
      margin-right: 4px;

      &::before {
        content: "+";
        margin-right: 4px;
        font-weight: bold;
        font-size: 16px;
      }

      &::after {
        content: ":";
        margin: 0 8px 0 2px;
      }
    }
  }
}
.v-api-debug-submit-btn {
  margin-top: 20px;
}
.v-api-response-content {
  margin-top: 40px;
}
</style>
