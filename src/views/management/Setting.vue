<template>
  <a-spin tip="加载中..." :spinning="pageLoading" class="v-layout-content v-app-edit-layout">
    <a-tabs v-model="activeKey">
      <a-tab-pane tab="基本信息" key="base">
        <a-form :form="appBaseForm" hideRequiredMark @submit="handleSubmitByBase">
          <a-form-item label="应用名">
            <a-input
              v-decorator="['name', {
                initialValue: appBaseData.name,
                rules: [
                { required: true, whitespace:true, message: '应用名不能为空' },
                {min:2, message:'应用名长度必须在2至36个字符以内'},
                {max:36, message:'应用名长度必须在2至36个字符以内'}
                ],
                getValueFromEvent: disposeValueHandle
              }]"
              placeholder="请输入应用名"
            />
          </a-form-item>

          <a-form-item label="应用API网址">
            <a-input
              v-decorator="['slug', {
                initialValue: appBaseData.slug,
                rules: [
                { required: true, whitespace:true, message: '应用标识码不能为空' },
                { pattern: /^[\w\-\.]{2,20}$/, message: '应用标识必须由2至20个大小写字母、数字、下划线(_)、中划线(-)、英文句号(.)这些字符组成' }
                ],
                getValueFromEvent: disposeValueHandle
              }]"
              placeholder="请输入应用标识"
              disabled
            >
              <span slot="addonBefore">{{ app_api_request_uri || '--' }}{{ $store.getters.virUid }}/</span>
            </a-input>
          </a-form-item>

          <a-form-item label="描述(可选)">
            <a-textarea
              v-decorator="['describe', {
                initialValue: appBaseData.describe,
                rules: [
                    { max: 120, message: '最多120个字符' }
                ]
              }]"
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
              <img
                v-else-if="appBaseData.icon"
                class="v-icon-preview"
                :src="appBaseData.icon"
                alt="logo"
              />
              <div v-else>
                <a-icon type="plus" />
                <div class="ant-upload-text">选择上传</div>
              </div>
            </a-upload>
          </a-form-item>

          <a-form-item style="padding-top:20px;">
            <a-button
              type="primary"
              html-type="submit"
              :disabled="submit1Disabled"
              :loading="submitStatus"
            >保 存</a-button>
            <a-button
              :style="{ marginLeft: '8px' }"
              :disabled="submit1Disabled"
              @click="handleReset('base')"
            >重 置</a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <a-tab-pane tab="更多设置" key="expert">
        <a-form :form="appExpertForm" hideRequiredMark @submit="handleSubmitByExpert">
          <a-form-item label="请求验证规则">
            <a-radio-group
              v-decorator="['verify_rule', {
                  initialValue: appExpertData.verify_rule,
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
                  initialValue:`${appExpertData.response_template.code_name}`,
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
                  initialValue:`${appExpertData.response_template.succeed_code_value}`,
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
                  initialValue:`${appExpertData.response_template.failed_code_value}`,
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
                  initialValue:`${appExpertData.response_template.message_name}`,
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
                  initialValue:`${appExpertData.response_template.succeed_message_value}`,
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
                  initialValue:`${appExpertData.response_template.failed_message_value}`,
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
                  initialValue:`${appExpertData.response_template.data_name}`,
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

          <a-form-item style="padding-top:20px;">
            <a-button
              type="primary"
              html-type="submit"
              :disabled="submit2Disabled"
              :loading="submitStatus"
            >保 存</a-button>
            <a-button
              :style="{ marginLeft: '8px' }"
              :disabled="submit2Disabled"
              @click="handleReset('expert')"
            >重 置</a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>
import { cropIconToBase64 } from "@/utils/pictureProcess";
import { getAppInfoRequest, updateAppRequest } from "@/api/application.js";

export default {
  data() {
    return {
      app_api_request_uri: process.env.VUE_APP_API_REQUEST_URI,
      iconBase64: null,
      pageLoading: true,
      uploadLoading: false,
      appBaseData: {
        id: null,
        icon: null,
        name: null,
        slug: null,
        describe: null,
        visibility_level: null
      },
      appExpertData: {
        id: null,
        verify_rule: null,
        response_template: {}
      },
      responseSucceed: null,
      responseFailed: null,
      submit1Disabled: true,
      submit2Disabled: true,
      submitStatus: false,
      activeKey: this.$route.query.type || "base"
    };
  },
  beforeCreate() {
    this.appBaseForm = this.$form.createForm(this, {
      onValuesChange: (_, values) => {
        this.submit1Disabled = false;
      }
    });

    this.appExpertForm = this.$form.createForm(this, {
      onValuesChange: (_, values) => {
        if (values.response_template) {
          let responseData = Object.assign(
            this.appExpertForm.getFieldsValue().response_template,
            values.response_template
          );
          this._disposeIntegerStr(responseData);
          this._initResponseData(responseData);
        }
        this.submit2Disabled = false;
      }
    });
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
          this.appBaseData = {
            id: res.data._id,
            icon: res.data.icon,
            name: res.data.name,
            slug: res.data.slug,
            describe: res.data.describe,
            visibility_level: res.data.visibility_level
          };
          this.appExpertData = {
            id: res.data._id,
            verify_rule: res.data.verify_rule,
            response_template: res.data.response_template
          };

          this._initResponseData(res.data.response_template);

          this.pageLoading = false;

          this.$nextTick(() => {
            this.submit1Disabled = true;
            this.submit2Disabled = true;
          });
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
    beforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error("图片不能超过5M");
        return false;
      }
      cropIconToBase64(file, imageUrl => {
        this.iconBase64 = imageUrl;
        this.submit1Disabled = false;
      });
      return false;
    },
    handleSubmitByBase(e) {
      e.preventDefault();
      this.appBaseForm.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (this.iconBase64) {
            values.icon = this.iconBase64;
          }

          this.submitStatus = true;
          updateAppRequest(this.appBaseData.id, values)
            .then(res => {
              this.submitStatus = false;
              this.$message.success("应用更新成功");

              let myApps = [];
              this.$store.getters.myApps.forEach(o => {
                if (o._id == this.appBaseData.id) {
                  o.name = values.name;
                  if (values.icon) o.icon = values.icon;
                }
                myApps.push(o);
              });
              this.$store.commit("setAppList", myApps);

              this.submit1Disabled = true;
              this.$router.push({
                name: "appDetail",
                params: { slug: this.$route.params.slug }
              });
            })
            .catch(err => {
              this.submitStatus = false;
              this.$message.error(err.message);
            });
        }
      });
    },
    handleSubmitByExpert(e) {
      e.preventDefault();
      this.appExpertForm.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (values.response_template) {
            this._disposeIntegerStr(values.response_template);
          }

          this.submitStatus = true;
          updateAppRequest(this.appExpertData.id, values)
            .then(res => {
              this.submitStatus = false;
              this.$message.success("应用更新成功");

              this.submit2Disabled = true;
              this.$router.push({
                name: "appDetail",
                params: { slug: this.$route.params.slug }
              });
            })
            .catch(err => {
              this.submitStatus = false;
              this.$message.error(err.message);
            });
        }
      });
    },
    handleReset(type) {
      if (type == "base") {
        this.iconBase64 = null;
        this.appBaseForm.resetFields();
        this.submit1Disabled = true;
      } else {
        this._initResponseData(this.appExpertData.response_template);
        this.appExpertForm.resetFields();
        this.submit2Disabled = true;
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.submit1Disabled || !this.submit2Disabled) {
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
        }
      });
    } else {
      next();
    }
  }
};
</script>

<style lang="less">
.v-app-edit-layout {
  padding-bottom: 140px;

  .ant-form-item-label label {
    font-weight: 600;
  }
}
</style>
