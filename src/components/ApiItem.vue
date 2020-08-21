<template>
  <div :class="`v-api-item ${isEdit?'v-edit-status':''}`">
    <template v-if="!isEdit">
      <header class="v-api-item-header">
        <h3 :id="`${apiInfo.method}:${apiInfo.uri}`" class="v-api-name">
          <a :href="`#${apiInfo.method}:${apiInfo.uri}`" class="v-api-target">
            <a-icon type="api" />
          </a>
          &nbsp;{{ apiInfo.name || '--' }}
        </h3>

        <div class="v-api-operate">
          <router-link :to="{name:'apiDebug', params:{slug:appSlug}, query:{api_id:apiInfo._id}}">
            <a-icon type="code" />&nbsp;测试
          </router-link>
          <a href="javascript:;" @click="editApiHandle">
            <a-icon type="edit" />&nbsp;编辑
          </a>
          <a-popconfirm
            title="删除后将无法找回，确定删除该接口？"
            @confirm="confirmDelApiHandle"
            okText="删除"
            cancelText="取消"
          >
            <a href="javascript:;" class="v-del-api-btn">
              <a-icon type="delete" />&nbsp;删除
            </a>
          </a-popconfirm>
        </div>
      </header>

      <blockquote class="v-api-describe">{{ apiInfo.describe || '--无接口描述--' }}</blockquote>

      <ul class="v-api-infos">
        <li>
          <label>URI</label>
          <code>{{ `/${appSlug || '--'}/${apiInfo.uri}` }}</code>
          <a-button
            type="dashed"
            icon="copy"
            size="small"
            class="v-uri-copy-btn v-copy-tag"
            title="一键复制请求接口URL到粘贴板"
            @click="copyTextHandle(`${app_api_request_uri || '--/'}${$store.getters.virUid}/${appSlug || '--'}/${apiInfo.uri}`)"
          ></a-button>
        </li>
        <li>
          <label>请求方式</label>
          <span>{{ apiInfo.method }}</span>
        </li>
        <li>
          <label>响应结构(data数据)</label>
          <span v-if="!responseData || responseData.length==0">该接口无data数据响应</span>
          <div v-else class="v-api-response-pane">
            <div class="v-pre-box v-response-pre-box">
              <span class="v-pre-label">MockJS</span>
              <pre>{{ responseData }}</pre>
            </div>
          </div>

          <div class="v-pre-box">
            <span>
              最终结构示例
              <b class="v-res-status-s-text">(请求成功)</b>
            </span>
            <pre class="v-res-suc-pre">{{ responseSucceed }}</pre>
            <span>
              最终结构示例
              <b class="v-res-status-f-text">(请求失败)</b>
            </span>
            <pre>{{ responseFailed }}</pre>
          </div>
        </li>
      </ul>
    </template>
    <template v-else>
      <a-form :form="form" :hideRequiredMark="true" @submit="handleSubmit" class="v-api-edit-form">
        <header class="v-api-item-header">
          <h3 :id="`${apiInfo.method}:${apiInfo.uri}`" class="v-api-name">
            <a-icon type="api" />&nbsp;
            <a-form-item>
              <a-input
                placeholder="接口名"
                v-decorator="[
                  'name',
                  {
                    initialValue: apiInfo.name,
                    rules: [
                      { required: true, whitespace:true, message: '请输入接口名' },
                      { min: 2, message: '接口名最小2个字符' },
                      { max: 36, message: '接口名最多不能超过36个字符' },
                    ]
                  }
                ]"
              />
            </a-form-item>
          </h3>
          <div class="v-api-operate">
            <a href="javascript:;" @click="cancelEditHandle">
              <a-icon type="rollback" />&nbsp;取消
            </a>
            <a-button
              type="primary"
              size="small"
              icon="save"
              :disabled="saveDisabled"
              :loading="submitStatus"
              html-type="submit"
            >保存</a-button>
          </div>
        </header>

        <blockquote class="v-api-describe">
          <a-form-item>
            <a-textarea
              placeholder="(可选)接口描述"
              :autoSize="{ maxRows: 6 }"
              v-decorator="[
                'describe',
                {
                  initialValue: apiInfo.describe,
                  rules: [
                    { max: 160, message: '最多160个字符' }
                  ]
                }
              ]"
            />
          </a-form-item>
        </blockquote>

        <ul class="v-api-infos">
          <li class="v-line-api-label">
            <label>
              URI
              <a-tooltip title="支持动态路由，定义如：book/{id}、category/{id?}、news/{topic}/{id}">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </label>
            <a-form-item class="v-api-uri-input">
              <a-input
                :addonBefore="`${app_api_request_uri || '--'}${$store.getters.virUid}/${appSlug}/`"
                placeholder="请求URI，如：my/book"
                ref="uri_input"
                v-decorator="[
                  'uri',
                  {
                    initialValue: apiInfo.uri,
                    validateTrigger: ['blur'],
                    rules: [
                      { required: true, whitespace:true, message: '接口请求URI不能为空' },
                      { max:60, message:'URI最多60个字符' },
                      { pattern: /^[\w-.]+$/, message: '接口请求URI输入非法' },
                    ]
                  }
                ]"
              />
            </a-form-item>
          </li>

          <li class="v-line-api-label">
            <label>请求方式</label>
            <span>
              <a-form-item>
                <a-select
                  style="width: 120px"
                  v-decorator="[
                    'method',
                    {
                      initialValue: apiInfo.method,
                      rules: [{ required: true, message: '请选择请求方法类型' }]
                    }
                  ]"
                >
                  <a-select-option key="GET">GET</a-select-option>
                  <a-select-option key="POST">POST</a-select-option>
                  <a-select-option key="PUT">PUT</a-select-option>
                  <a-select-option key="DELETE">DELETE</a-select-option>
                </a-select>
              </a-form-item>
            </span>
          </li>

          <li>
            <label>对应响应数据(data)</label>
            <div class="v-res-inputs-box ant-form-inline">
              <p
                class="v-res-remark"
              >* 此处返回数据特指返回数据的data部分，因api所属应用已创建了对应响应模板；即不需要再返回code及message部分。若无data内容可不编辑此项。</p>

              <a-form-item class="v-res-inputs-table">
                <MonacoEditor
                  :options="{language:'json'}"
                  :value="responseData"
                  class="v-json-editor"
                  style="height:400px;"
                  ref="mockjs_editor"
                  @contentChange="(v)=>responseData=v"
                  @blur="blurMockEditorHandle"
                />
              </a-form-item>
            </div>
          </li>
        </ul>
      </a-form>
    </template>
  </div>
</template>

<script>
import moment from "moment";
import Clipboard from "clipboard";
import MonacoEditor from "@/components/MonacoEditor";

export default {
  components: {
    MonacoEditor,
  },
  props: {
    appInfo: Object,
    apiData: Object,
    apiIndex: Number,
  },
  data() {
    return {
      apiInfo: null,
      app_api_request_uri: process.env.VUE_APP_API_REQUEST_URI,
      appSlug: this.$route.params.slug,
      responseData: [],
      responseSucceed: null,
      responseFailed: null,
      isEdit: false,
      saveDisabled: true,
      submitStatus: false,
    };
  },
  watch: {
    responseData: {
      handler() {
        this.saveDisabled = false;
        this.$emit("changeEditStatus", this.apiData._id, false);
      },
      deep: true,
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      onValuesChange: () => {
        this.saveDisabled = false;
        this.$emit("changeEditStatus", this.apiData._id, false);
      },
    });
  },
  created: function () {
    this.init();
  },
  mounted() {},
  methods: {
    moment,
    init() {
      this._buildDataByRules();
      this._initResponseData();
    },
    _initResponseData() {
      const response_tpl = this.appInfo.response_template;
      this.responseSucceed = {};
      this.responseSucceed[response_tpl.code_name] =
        response_tpl.succeed_code_value;
      this.responseSucceed[response_tpl.message_name] =
        response_tpl.succeed_message_value;
      if (this.apiInfo.response_rules) {
        this.responseSucceed[
          response_tpl.data_name
        ] = this.apiInfo.succeed_response;
      }

      this.responseFailed = {};
      this.responseFailed[response_tpl.code_name] =
        response_tpl.failed_code_value;
      this.responseFailed[response_tpl.message_name] =
        response_tpl.failed_message_value + ":请求参数非法";
    },
    _buildDataByRules() {
      this.apiInfo = { ...this.apiData };
      this.responseData = this.apiInfo.response_rules
        ? JSON.stringify(this.apiInfo.response_rules, null, 4)
        : null;

      this.$nextTick(() => {
        this.saveDisabled = true;
        this.$emit("changeEditStatus", this.apiData._id, true);
      });
    },
    editApiHandle() {
      this.isEdit = true;
    },
    cancelEditHandle(render = true) {
      if (render) {
        this._buildDataByRules();
      }

      this.$nextTick(() => {
        this.saveDisabled = true;
        this.$emit("changeEditStatus", this.apiData._id, true);
      });

      this.isEdit = false;
    },
    confirmDelApiHandle() {
      this.$emit("del", this.apiData._id);
    },
    blurMockEditorHandle() {
      if (!this.$refs.mockjs_editor || !this.$refs.mockjs_editor.$el) return;

      try {
        if (
          !this.responseData ||
          typeof JSON.parse(this.responseData) == "object"
        ) {
          this.$refs.mockjs_editor.$el.classList.remove("v-input-err");
        }
      } catch (error) {
        this.$refs.mockjs_editor.$el.classList.add("v-input-err");
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          try {
            !this.responseData ||
              typeof JSON.parse(this.responseData) == "object";
          } catch (error) {
            return;
          }

          values.response_rules = this.responseData
            ? JSON.parse(this.responseData)
            : null;

          values.app_id = this.apiData.app_id;
          // console.log("Received values of form: ", values);

          this.$emit("update", this.apiData._id, values);
        }
      });
    },
    copyTextHandle(text) {
      let clipboard = new Clipboard(".v-copy-tag", {
        text: () => text,
      });
      clipboard.on("success", (e) => {
        this.$message.success("复制成功");
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$message.error("该浏览器不支持自动复制");
        clipboard.destroy();
      });
    },
    changeSubmitStatus(status = true) {
      this.submitStatus = status;
    },
  },
};
</script>

<style lang="less">
@import "../assets/theme_param.less";

.v-res-suc-pre {
  max-height: 450px;
}
.v-res-status-s-text {
  // font-weight: 500;
  color: #66bb6a;
}
.v-res-status-f-text {
  // font-weight: 500;
  color: #ff7043;
}
.v-del-api-btn {
  color: @error-color;

  &:hover {
    color: @error-color;
  }
}
.v-api-response-pane {
  margin: 6px 0 20px 16px;
}
.v-response-pre-box {
  padding-left: 0 !important;

  pre {
    max-height: 450px;
    background-color: lighten(@primary-color, 38%);
  }

  .v-pre-label {
    position: absolute;
    top: 0;
    right: 0;
    background-color: lighten(@primary-color, 30%);
    font-size: 12px;
    padding: 2px 6px;
  }
}
.v-api-item {
  padding: 20px 10px 40px 0;

  &.v-edit-status {
    background-color: lighten(@primary-color, 41.6%);
  }

  & + .v-api-item {
    border-top: 1px solid #f0f2f5;
  }

  .v-pre-box {
    margin-top: 10px;
    padding-left: 16px;
    position: relative;

    span {
      margin-bottom: 4px;
      display: block;
    }
  }

  .ant-tabs-tabpane {
    .v-pre-box {
      padding-left: 0;
      margin-top: 16px;
    }
  }

  .ant-form-item {
    display: inline-block;
    margin-bottom: 0;
  }
}
.v-api-target {
  color: #000;
}
.v-api-edit-form {
  // background-color: lighten(@primary-color, 42%);
}
.v-api-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.v-api-name {
  flex: 1;
  font-weight: bold;

  .ant-form-item {
    width: 80%;
  }
}
.v-api-operate {
  a {
    margin-left: 14px;
  }

  button {
    margin-left: 10px;
  }
}
.v-api-describe {
  margin-left: 22px;
  padding-left: 10px;
  font-size: 14px;
  line-height: 1.5;
  border-left: 4px solid #ebedf0;
  color: darken(@primary-color, 40%);

  .ant-form-item {
    width: 100%;
  }
}
.v-api-infos {
  list-style: none;
  padding-left: 22px;

  li {
    margin-bottom: 10px;
    position: relative;

    > label {
      font-weight: 600;
      margin-right: 4px;

      &::after {
        content: ":";
        margin: 0 8px 0 2px;
      }

      &::before {
        content: "+";
        margin-right: 4px;
        font-weight: bold;
        font-size: 16px;
      }
    }

    &::before {
      content: "";
      position: absolute;
      top: -20px;
      bottom: 0;
      left: 0;
      width: 1px;
      background-color: #f8f8f8;
    }

    &.v-line-api-label {
      display: flex;
      align-items: center;
    }
  }

  .v-api-input-operate {
    display: none;
    margin-left: 10px;
  }

  code {
    background-color: lighten(@primary-color, 40%);
    padding: 2px 6px;
    border-radius: 2px;
  }

  .ant-tabs {
    // border: 1px solid #e8e8e8;
    margin-top: 6px;
    margin-bottom: 20px;
  }
  .ant-tabs-left-bar {
    .ant-tabs-tab {
      padding-left: 10px;
    }
  }
  .ant-table td {
    white-space: nowrap;
  }
  .ant-input-group {
    margin-bottom: 6px;

    &:hover {
      .v-api-input-operate {
        display: inline-block;
      }
    }
  }
}
.v-uri-copy-btn {
  margin-left: 10px;
}
.v-api-uri-input {
  // width: 80%;
  flex: 1;
}
.v-res-remark {
  margin-top: 14px;
  font-size: 12px;
  color: #a9a9a9;
  line-height: 20px;
}
.v-res-inputs-box {
  padding-left: 16px;

  .v-res-inputs-table {
    .ant-form-item-control-wrapper {
      display: block !important;
    }
  }

  .ant-form-item {
    width: 100%;
  }
}
</style>
