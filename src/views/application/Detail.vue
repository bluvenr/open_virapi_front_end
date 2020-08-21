<template>
  <a-spin tip="加载中..." :spinning="pageLoading" class="v-layout-content">
    <header class="v-app-detail-header">
      <div class="v-line-box v-app-info-header">
        <div class="v-app-icon">
          <img class="v-app-icon-img" :src="appInfo.icon" alt="app icon" v-if="appInfo.icon" />
          <i class="v-app-icon-text" v-else>{{ appInfo.name.substr(0, 1) }}</i>
        </div>
        <div class="v-app-base-info">
          <div class="v-base-info-top">
            <h1>{{ appInfo.name || '--' }}</h1>
            <a-tooltip placement="top">
              <template slot="title">
                <span>可见类型：{{ appInfo.visibilityLevel || '--' }}</span>
              </template>
              <a-icon v-if="appInfo.visibility_level == 'private'" type="lock" />
              <a-icon v-else-if="appInfo.visibility_level == 'internal'" type="unlock" />
              <a-icon v-else-if="appInfo.visibility_level == 'public'" type="global" />
            </a-tooltip>
            <!-- <a-tag>v0.0.1</a-tag> -->
          </div>
          <div class="v-base-info-bottom">
            <span>slug:</span>
            {{ appInfo.slug || '--' }}&nbsp;&nbsp;
            <span>编号:</span>
            {{ appInfo.number || '--' }}
          </div>
        </div>
        <div class="v-app-operate">
          <router-link
            :to="{name:'basicSetting', params:{slug:$route.params.slug}, query:{type:'base'}}"
            class="ant-btn ant-btn-default"
          >
            <a-icon type="edit" />
            <span>编辑</span>
          </router-link>
          <router-link
            :to="{name:'apiCreate', query:{slug:$route.params.slug, app_id:appInfo._id}}"
            class="ant-btn ant-btn-primary"
          >
            <a-icon type="plus" />
            <span>新增接口</span>
          </router-link>
        </div>
      </div>
      <div class="v-app-intro">
        <p>{{ appInfo.describe || '无对应应用简介' }}</p>
        <ul class="v-app-date">
          <li>
            当前API数量：
            <router-link
              :to="{name:'apiList',params:{slug:$route.params.slug}}"
            >{{ appInfo.api_count || 0 }}</router-link>
          </li>
          <li>创建时间：{{ appInfo.created ? dateFormat(appInfo.created) : '--' }}</li>
          <li>最后更新时间：{{ appInfo.updated ? dateFormat(appInfo.updated) : '--' }}</li>
        </ul>
      </div>
    </header>

    <div class="v-app-detail-content">
      <div class="v-detail-item-box v-line-item-box">
        <h3>应用API网址：</h3>
        <code>{{ `${app_api_request_uri || '--/'}${$store.getters.virUid}/${appInfo.slug || '--'}` }}</code>
        <a
          class="v-copy-tag"
          style="margin-left:10px;"
          title="复制到粘贴板"
          @click="copyTextHandle(`${app_api_request_uri || '--/'}${$store.getters.virUid}/${appInfo.slug || '--'}`)"
        >
          <a-icon type="copy" />
        </a>
      </div>
      <div class="v-detail-item-box v-line-item-box">
        <h3>验证方式：</h3>
        <span>
          {{ verifyRuleMap[appInfo.verify_rule] || '未知验证方式' }}
          <a-tooltip placement="top">
            <template slot="title">
              <p>
                <b>请求头部Token验证：</b>请求头部Header中附带一个名为【app-token】的报文数据；
              </p>
              <p>
                <b>请求参数Token验证：</b>请求路由请求参数中附带一个名为【_token】的GET请求参数；
              </p>
              <p>
                <b>兼容模式验证：</b>兼容请求头部和请求参数验证规则，优先从请求头部中获取验证Token，若无则再从请求参数中获取。
              </p>
            </template>
            <a-icon type="info-circle" />
          </a-tooltip>
        </span>
      </div>
      <div class="v-detail-item-box">
        <h3>
          APP KEY
          <a-tooltip placement="top" title="即请求应用虚拟接口验证权限的Token">
            <a-icon type="info-circle" />
          </a-tooltip>：
          <a-button type="dashed" icon="redo" size="small" @click="changeAppKeyHandle">更换</a-button>
        </h3>
        <a-input placeholder="APP访问凭证key" v-model="appInfo.app_key" disabled>
          <a slot="addonAfter" class="v-copy-tag" @click="copyTextHandle(appInfo.app_key)">
            <a-icon type="copy" />&nbsp;复制
          </a>
        </a-input>
      </div>
      <div class="v-detail-item-box">
        <h3>请求响应模板结构：</h3>
        <div class="v-pre-box">
          <label>
            最终结构示例(
            <b>请求成功</b>)：
          </label>
          <pre>{{ responseSucceed }}</pre>
          <label>
            最终结构示例(
            <b>请求失败</b>)：
          </label>
          <pre>{{ responseFailed }}</pre>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script>
import Clipboard from "clipboard";
import { getAppInfoRequest, changeAppKeyRequest } from "@/api/application.js";
import { dateFormat } from "@/utils/handle.js";

export default {
  data() {
    return {
      app_api_request_uri: process.env.VUE_APP_API_REQUEST_URI,
      responseSucceed: null,
      responseFailed: null,
      pageLoading: true,
      appInfo: {
        _id: null,
        icon: null,
        name: "",
        slug: null,
        describe: null
      },
      verifyRuleMap: {
        header: "请求头部Token验证",
        param: "请求参数Token验证",
        compatible: "兼容模式验证"
      }
    };
  },
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
      getAppInfoRequest(this.$route.params.slug)
        .then(res => {
          this.appInfo = res.data;
          this._initResponseData(res.data.response_template);

          this.pageLoading = false;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    _initResponseData(data) {
      this.responseSucceed = {};
      this.responseSucceed[data.code_name] = data.succeed_code_value;
      this.responseSucceed[data.message_name] = data.succeed_message_value;
      this.responseSucceed[data.data_name] = {
        id: 1,
        name: "virapi"
      };

      this.responseFailed = {};
      this.responseFailed[data.code_name] = data.failed_code_value;
      this.responseFailed[data.message_name] = data.failed_message_value;
    },
    dateFormat(date) {
      return dateFormat(date, "yyyy-MM-dd hh:mm:ss");
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
    changeAppKeyHandle() {
      let _self = this;
      this.$confirm({
        title: "确定更换app key？",
        content:
          "更换后原app key将立即失效；若更换后请立即更换您原应用系统请求的app key，否则将无法成功请求接口获取数据。",
        maskClosable: true,
        okType: "danger",
        okText: "确定更换",
        cancelText: "取消",
        onOk() {
          changeAppKeyRequest(_self.appInfo._id)
            .then(res => {
              _self.appInfo.app_key = res.data;
              _self.$message.success("appkey更换成功");
            })
            .catch(err => {
              _self.$message.error(err.message);
            });
        },
        onCancel() {
          console.log("Cancel");
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "../../assets/theme_param.less";

.v-layout-content {
  padding: 24px;
  min-height: 360px;
  max-width: 980px;
  margin: 0 auto;
}
.v-app-detail-header {
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f2f5;

  .v-app-icon {
    width: 60px;
    height: 60px;
  }
  .v-app-icon-text {
    line-height: 60px;
  }

  .v-line-box {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  .v-app-operate {
    .ant-btn {
      margin-left: 10px;
    }
  }

  .v-app-intro {
    p {
      font-size: 14px;
    }
  }

  .v-app-date {
    list-style: none;
    padding-left: 0;

    li {
      display: inline-block;
      margin-right: 16px;
    }
  }
}
.v-app-info-header {
  .v-app-base-info {
    flex: 1;
    height: 70px;
    padding-left: 14px;
    display: flex;
    flex-flow: column;
    justify-content: space-evenly;

    h1 {
      margin-bottom: 8px;
      margin-right: 10px;
      line-height: 30px;
      display: inline-block;
    }
  }

  .v-base-info-top {
    .ant-tag {
      margin-left: 10px;
    }
  }

  .v-base-info-bottom {
    span {
      font-weight: 500;
    }
  }
}
.v-app-detail-content {
  padding: 20px 0 140px;
}
.v-detail-item-box {
  padding-top: 10px;
  margin-bottom: 14px;

  h3 {
    // color: darken(@primary-color, 10%);
    // color: #4804ae;
    font-weight: bold;
  }
}
.v-line-item-box {
  h3 {
    display: inline-block;
  }
}
</style>

