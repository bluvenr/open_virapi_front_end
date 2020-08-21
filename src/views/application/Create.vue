<template>
  <div class="v-main-body">
    <div class="v-create-body">
      <div class="v-introduce">
        <h2>新建应用</h2>
        <p>应用创建成功后，即可在该应用下创建您所需要的API。</p>
        <p>当前系统默认每个账号下最多创建{{ $store.state.user.basicsData.max_app_count }}个应用，更多开放敬请期待！</p>
        <p>
          若是第一次使用，或不知道如何新建应用，可点击这里查看
          <a
            href="https://virapi.com/article/xsrm01-cjyy.html"
            target="_blank"
          >新手快速入门</a>。
        </p>
        <p>
          <strong>注意：</strong>请遵守本平台的规范及相关法律法规，若发现应用存在违规情况，平台将会直接冻结清除；严重的将禁封账号。
        </p>
      </div>
      <div class="v-form">
        <a-form :form="appForm" hideRequiredMark @submit="handleSubmit">
          <a-form-item label="应用名">
            <a-input
              v-decorator="['name', {
                validateTrigger: ['blur'],
                rules: [
                  { required: true, whitespace:true, message: '应用名不能为空' },
                  {min:2, message:'应用名长度必须在2至36个字符以内'},
                  {max:36, message:'应用名长度必须在2至36个字符以内'}
                ],
                getValueFromEvent: disposeValueHandle}]"
              placeholder="请输入应用名"
              @blur="blurAppNameHandle"
            />
          </a-form-item>

          <a-form-item label="应用API网址">
            <a-input
              v-decorator="['slug', {
                validateTrigger: ['blur'],
                rules: [
                  { required: true, whitespace:true, message: '应用标识码不能为空' },
                  { pattern: /^[\w\-\.]{2,20}$/, message: '应用标识必须由2至20个大小写字母、数字、下划线(_)、中划线(-)、英文句号(.)这些字符组成' }
                ],
                getValueFromEvent: disposeValueHandle
              }]"
              placeholder="请输入应用标识"
            >
              <span slot="addonBefore">{{ app_api_request_uri || '--' }}{{ $store.getters.virUid }}/</span>
            </a-input>
          </a-form-item>

          <a-form-item label="描述(可选)">
            <a-textarea
              v-decorator="['describe', {rules: [
                { max: 120, message: '最多120个字符' }
              ]}]"
              placeholder="(可选)应用描述......"
              :autoSize="{ minRows: 2, maxRows: 6 }"
            />
          </a-form-item>

          <a-form-item label="应用图标(可选)" extra="仅限上传jpg、png、gif格式，且大小不超过5m">
            <a-upload
              name="logo"
              class="v-icon-uploader"
              accept="image/png, image/jpeg, image/gif"
              :showUploadList="false"
              :beforeUpload="beforeUpload"
              listType="picture-card"
            >
              <img v-if="iconBase64" class="v-icon-preview" :src="iconBase64" alt="logo" />
              <div v-else>
                <a-icon type="plus" />
                <div class="ant-upload-text">选择上传</div>
              </div>
            </a-upload>
          </a-form-item>

          <div class="v-more-options-box" v-if="showOptions">
            <a-form-item label="请求验证规则">
              <a-radio-group
                v-decorator="['verify_rule', {
                  initialValue:'compatible',
                  rules: [{ required: true, message: '请选择验证请求规则' }]
                }]"
              >
                <a-radio value="header">
                  请求头部Token验证
                  <a-tooltip placement="top" title="请求头部Header中附带一个名为【app-token】的报文数据">
                    <a-icon type="info-circle" />
                  </a-tooltip>
                </a-radio>
                <a-radio value="param">
                  请求参数Token验证
                  <a-tooltip placement="top" title="请求路由请求参数中附带一个名为【_token】的GET请求参数">
                    <a-icon type="info-circle" />
                  </a-tooltip>
                </a-radio>
                <a-radio value="compatible">
                  兼容模式
                  <a-tooltip placement="top" title="兼容请求头部和请求参数验证规则，优先从请求头部中获取验证Token，若无则再从请求参数中获取">
                    <a-icon type="info-circle" />
                  </a-tooltip>
                </a-radio>
              </a-radio-group>
            </a-form-item>

            <label class="v-options-group-label">自定义请求响应结构 :</label>

            <div class="response-template-box">
              <a-form-item label="状态码键名" class="v-more-options-group-item">
                <a-auto-complete
                  style="width: 200px"
                  v-decorator="['response_template.code_name', {
                    initialValue:`${responseTemplate.code_name}`,
                    rules: [{ required: true, message: '状态码键名不能为空' }],
                    getValueFromEvent: disposeValueHandle
                  }]"
                  filterOption
                  placeholder="输入或选择您要的状态码对应键名"
                >
                  <template slot="dataSource">
                    <a-select-option key="code">code</a-select-option>
                    <a-select-option key="status">status</a-select-option>
                  </template>
                </a-auto-complete>
              </a-form-item>

              <a-form-item label="请求成功状态码值" class="v-more-options-group-item">
                <a-auto-complete
                  style="width: 200px"
                  v-decorator="['response_template.succeed_code_value', {
                    initialValue:`${responseTemplate.succeed_code_value}`,
                    rules: [{ required: true, message: '请求成功状态码值不能为空' }],
                    getValueFromEvent: disposeValueHandle
                  }]"
                  filterOption
                  placeholder="输入或选择您要的请求成功状态码值"
                >
                  <template slot="dataSource">
                    <a-select-option key="200">200</a-select-option>
                    <a-select-option key="0">0</a-select-option>
                    <a-select-option key="succeed">succeed</a-select-option>
                  </template>
                </a-auto-complete>
              </a-form-item>

              <a-form-item label="请求失败状态码值" class="v-more-options-group-item">
                <a-auto-complete
                  style="width: 200px"
                  v-decorator="['response_template.failed_code_value', {
                    initialValue:`${responseTemplate.failed_code_value}`,
                    rules: [{ required: true, message: '请求失败状态码值不能为空' }],
                    getValueFromEvent: disposeValueHandle
                  }]"
                  filterOption
                  placeholder="输入或选择您要的请求失败状态码值"
                >
                  <template slot="dataSource">
                    <a-select-option key="1000">1000</a-select-option>
                    <a-select-option key="failed">failed</a-select-option>
                  </template>
                </a-auto-complete>
              </a-form-item>

              <a-form-item label="响应描述键名" class="v-more-options-group-item">
                <a-auto-complete
                  style="width: 200px"
                  v-decorator="['response_template.message_name', {
                    initialValue:`${responseTemplate.message_name}`,
                    rules: [{ required: true, message: '响应描述键名不能为空' }],
                    getValueFromEvent: disposeValueHandle
                  }]"
                  filterOption
                  placeholder="输入或选择您要的响应描述键名"
                >
                  <template slot="dataSource">
                    <a-select-option key="message">message</a-select-option>
                    <a-select-option key="msg">msg</a-select-option>
                    <a-select-option key="info">info</a-select-option>
                  </template>
                </a-auto-complete>
              </a-form-item>

              <a-form-item label="请求成功默认描述" class="v-more-options-group-item">
                <a-auto-complete
                  style="width: 200px"
                  v-decorator="['response_template.succeed_message_value', {
                    initialValue:`${responseTemplate.succeed_message_value}`,
                    rules: [{ required: true, message: '请求成功默认描述不能为空' }]
                  }]"
                  filterOption
                  placeholder="输入或选择您要的请求成功默认描述"
                >
                  <template slot="dataSource">
                    <a-select-option key="Succeed">Succeed</a-select-option>
                  </template>
                </a-auto-complete>
              </a-form-item>

              <a-form-item label="请求失败默认描述" class="v-more-options-group-item">
                <a-auto-complete
                  style="width: 200px"
                  v-decorator="['response_template.failed_message_value', {
                    initialValue:`${responseTemplate.failed_message_value}`,
                    rules: [{ required: true, message: '请求失败默认描述不能为空' }]
                  }]"
                  filterOption
                  placeholder="输入或选择您要的请求失败默认描述"
                >
                  <template slot="dataSource">
                    <a-select-option key="Failed">Failed</a-select-option>
                  </template>
                </a-auto-complete>
              </a-form-item>

              <a-form-item label="请求响应目标数据键名" class="v-more-options-group-item">
                <a-auto-complete
                  style="width: 200px"
                  v-decorator="['response_template.data_name', {
                    initialValue:`${responseTemplate.data_name}`,
                    rules: [{ required: true, message: '请求响应目标数据键名不能为空' }],
                    getValueFromEvent: disposeValueHandle
                  }]"
                  filterOption
                  placeholder="输入或选择您要的请求响应目标数据键名"
                >
                  <template slot="dataSource">
                    <a-select-option key="data">data</a-select-option>
                  </template>
                </a-auto-complete>
              </a-form-item>

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

          <a-form-item style="padding-top:20px;">
            <a-button type="primary" html-type="submit" :loading="submitStatus">创建应用</a-button>
            <a
              href="javascript:;"
              style="float:right;font-size:12px;"
              @click="showOptions=!showOptions"
            >{{ showOptions ? '隐藏':'显示' }}高级设置</a>
          </a-form-item>
        </a-form>
      </div>
    </div>

    <Footer />

    <a-modal
      title="系统提示"
      v-model="showModel"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      width="400px"
    >
      <p>很遗憾当前系统每个账号最多可创建{{ $store.state.user.basicsData.max_app_count }}个应用，您当前已创建{{ $store.state.user.basicsData.have_app_count }}个应用，无法再创建更多新的应用。</p>
      <p>后期会根据系统用户总体需求进行调整，敬请期待~~</p>
      <p>
        若您当前真的有需要想创建更多新的应用，可尝试
        <router-link to>联系我</router-link>。
      </p>

      <a-button type="primary" class="v-model-btn" icon="rollback" @click="$router.back(-1)">返回上一页</a-button>
    </a-modal>
  </div>
</template>

<script>
import pinyin from "pinyin";
import Footer from "@/components/Footer.vue";
import { createAppRequest } from "@/api/application.js";
import { cropIconToBase64 } from "@/utils/pictureProcess";

export default {
  components: {
    Footer,
  },
  data() {
    return {
      app_api_request_uri: process.env.VUE_APP_API_REQUEST_URI,
      showOptions: false,
      iconBase64: null,
      uploadLoading: false,
      responseTemplate: {
        code_name: "code",
        succeed_code_value: 200,
        failed_code_value: 1000,
        data_name: "data",
        message_name: "message",
        succeed_message_value: "Succeed",
        failed_message_value: "Failed",
      },
      responseSucceed: null,
      responseFailed: null,
      submitStatus: false,
      showModel: false,
    };
  },
  beforeCreate() {
    this.appForm = this.$form.createForm(this, {
      onValuesChange: (_, values) => {
        if (values.response_template) {
          let responseData = Object.assign(
            this.appForm.getFieldsValue().response_template,
            values.response_template
          );
          this._disposeIntegerStr(responseData);
          this._initResponseData(responseData);
        }
      },
    });
  },
  watch: {},
  created: function () {
    if (
      this.$store.state.user.basicsData.max_app_count <=
      this.$store.state.user.basicsData.have_app_count
    ) {
      this.showModel = true;
      return;
    }

    this._initResponseData(this.responseTemplate);
  },
  mounted() {},
  methods: {
    _initLoad() {},
    _initResponseData(data) {
      this.responseSucceed = {};
      this.responseSucceed[data.code_name] = data.succeed_code_value;
      this.responseSucceed[data.message_name] = data.succeed_message_value;
      this.responseSucceed[data.data_name] = {
        id: 1,
        name: "virapi",
      };

      this.responseFailed = {};
      this.responseFailed[data.code_name] = data.failed_code_value;
      this.responseFailed[data.message_name] = data.failed_message_value;
    },
    _disposeIntegerStr(data) {
      if (
        data.succeed_code_value !== undefined &&
        /^\d+$/.test(data.succeed_code_value)
      ) {
        data.succeed_code_value = parseInt(data.succeed_code_value);
      }
      if (
        data.failed_code_value !== undefined &&
        /^\d+$/.test(data.failed_code_value)
      ) {
        data.failed_code_value = parseInt(data.failed_code_value);
      }
      return data;
    },
    blurAppNameHandle(e) {
      let value = e.target.value;
      if (value && !this.appForm.getFieldsValue().slug) {
        if (/[\u4e00-\u9fa5]/.test(value)) {
          value = pinyin(value, { style: pinyin.STYLE_NORMAL }).join("");
        }

        value = value.match(/[\w\-.]/g).join("");

        this.appForm.setFieldsValue({
          slug: value,
        });
      }
    },
    disposeValueHandle(e) {
      if (!e || !e.target) {
        return e.trim();
      }

      const { target } = e;
      if (target.type === "checkbox") {
        return target.checked;
      } else {
        return target.value.trim();
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.appForm.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (values.response_template) {
            this._disposeIntegerStr(values.response_template);
          }
          if (this.iconBase64) {
            values.icon = this.iconBase64;
          }

          this.submitStatus = true;
          createAppRequest(values)
            .then((res) => {
              this.submitStatus = false;
              this.$message.success("应用创建成功");

              this.$store.dispatch("handleUpdateMyApps");

              let basicsData = { ...this.$store.state.user.basicsData };
              basicsData.have_app_count++;
              this.$store.dispatch("handleUserBasicsData", basicsData);

              this.appForm.resetFields();

              this.$router.push({
                name: "appDetail",
                params: { slug: res.data.slug },
              });
            })
            .catch((err) => {
              this.submitStatus = false;
              this.$message.error(err.message);
            });
        }
      });
    },
    beforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error("图片不能超过5M");
        return false;
      }
      cropIconToBase64(file, (imageUrl) => {
        this.iconBase64 = imageUrl;
      });
      return false;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (
      Object.values(
        this.appForm.getFieldsValue(["name", "slug", "describe"])
      ).filter((v) => v && v.trim() > 0).length > 0
    ) {
      this.$confirm({
        title: "温馨提示",
        content: "当前页面数据尚未保存，确定要离开该页面？",
        okText: "确定离开",
        cancelText: "留在本页",
        onOk() {
          next();
        },
        onCancel() {
          next(false);
        },
      });
    } else {
      next();
    }
  },
};
</script>

<style lang="less">
.v-icon-uploader {
  .ant-upload {
    height: 104px !important;
  }
}
.v-icon-preview {
  overflow: hidden;
  width: 100%;
  height: 100%;
  object-fit: cover;
  vertical-align: middle;
}
.v-main-body {
  background-color: #fff;
  width: 100%;
}
.v-create-body {
  padding: 20px 40px 160px;
  display: flex;
  // max-width: 1200px;
  width: 1180px;
  margin: 0 auto;

  .v-introduce {
    padding-right: 20px;
    border-right: 1px solid #f0f2f5;
    width: 260px;

    a {
      text-decoration: underline;
    }
  }

  .v-form {
    padding-left: 40px;
    flex: 1;
    overflow: hidden;
  }

  .ant-form-item-label {
    label {
      font-weight: 600;
    }
  }
}
.v-more-options-box {
  border-top: 1px solid #f0f2f5;
  margin-top: 40px;
  // background: #ccc;
  // padding: 10px;
}
.v-pre-box {
  margin-top: 20px;

  label {
    display: block;
    font-weight: 500;
    margin-bottom: 4px;
  }

  pre {
    padding: 12px 20px;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;
    border-radius: 6px;
    background: #f2f4f5;
  }
}
.response-template-box {
  padding-left: 20px;
}
.v-options-group-label {
  margin: 22px 0;
  font-weight: 600;
  display: block;
}
.v-more-options-group-item {
  display: flex;
  align-items: flex-start;

  .ant-form-item-label {
    label {
      font-weight: inherit;
    }
  }

  .ant-form-item-label {
    display: inline-block;
    width: 160px;
  }

  .ant-form-item-control-wrapper {
    display: inline-block;
  }
}
/* @media (max-width: 990px) {
  .v-create-body {
    flex-flow: column;

    .v-introduce {
      padding: 10px 0;
      border-right-width: 0;
      border-bottom: 1px solid #f0f2f5;
      width: 100%;
    }

    .v-form {
      padding: 20px 0;
    }
  }
  .v-header {
    padding: 0 10px;
  }
} */

.v-model-btn {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>
