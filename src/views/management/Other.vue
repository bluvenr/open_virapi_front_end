<template>
  <div class="v-layout-content v-other-management-content">
    <div class="v-o-m-group">
      <h3>接口相关操作管理</h3>
      <div class="v-other-m-block">
        <div>
          <label>接口拷贝</label>
          <a-button @click="visibleModalHandle('copy_api')">拷贝接口</a-button>
        </div>

        <p>拷贝指定接口到当前应用或其他应用，方便快捷减少重复创建的麻烦。</p>
      </div>

      <div class="v-other-m-block">
        <div>
          <label>接口转移</label>
          <a-button @click="visibleModalHandle('move_api')">转移接口</a-button>
        </div>

        <p>将指定应用接口转移至您的其他应用。转移成功后该接口将不在当前应用中。</p>
      </div>
    </div>

    <div class="v-o-m-group">
      <h3>应用相关操作管理</h3>
      <div class="v-other-m-block">
        <div>
          <label>应用拷贝</label>
          <a-button @click="visibleModalHandle('copy_app')">拷贝应用</a-button>
        </div>

        <p>拷贝当前应用并另新建应用，执行该操作后新创建的应用将拥有与当前应用一样的基本数据配置，包括应用的所有数据接口。</p>
      </div>

      <!-- <div class="v-other-m-block">
        <div>
          <label>应用转移</label>
          <a-button>转移应用</a-button>
        </div>

        <p>将应用转移给平台内其他账号用户。一旦转移成功后您将失去该应用的拥有权，连同其所有接口您都不再可见。</p>
      </div>-->

      <div class="v-other-m-block">
        <div>
          <label>应用清空</label>
          <a-button type="danger" @click="visibleModalHandle('empty_app')">清空应用</a-button>
        </div>

        <p>清空应用所有接口，执行该操作后所有接口将永久消失无法恢复。</p>
      </div>

      <div class="v-other-m-block">
        <div>
          <label>应用删除</label>
          <a-button type="danger" @click="visibleModalHandle('delete_app')">删除应用</a-button>
        </div>

        <p>删除内容包括应用基本信息及其所有接口。删除后应用及接口数据将永久消失无法恢复。</p>
      </div>
    </div>

    <a-modal
      :title="modalType=='copy_api'?'接口拷贝':'接口转移'"
      v-model="copeApiModalVisible"
      :maskClosable="false"
      :width="600"
      @ok="handleOkByCopyApi"
      :okButtonProps="{props:{disabled:!targetApp || checkedApi.length==0}}"
      class="v-o-lf-modal"
    >
      <div class="v-o-m-l">
        <span>请选择要{{ modalType=='copy_api'?'拷贝':'转移'}}的接口（{{ checkedApi.length || 0 }}）：</span>
        <a-checkbox-group
          v-if="apiOptions && apiOptions.length>0"
          :options="apiOptions"
          v-model="checkedApi"
        />
        <p
          v-else
          style="font-size:12px;color:#ccc;text-align:center;margin-top:20px;"
        >-- 当前应用未定义任何接口 --</p>
      </div>

      <div class="v-o-m-r">
        <span>请选择要{{ modalType=='copy_api'?'拷贝':'转移'}}到哪个目标应用：</span>
        <a-select
          showSearch
          v-model="targetApp"
          placeholder="目标应用"
          optionFilterProp="children"
          :filterOption="filterOption"
        >
          <a-select-option
            v-for="(item, index) in appOptions"
            :key="index"
            :value="item.value"
            :disabled="disabledApps.indexOf(item.value)>-1"
          >{{ item.label }}</a-select-option>
        </a-select>
      </div>
    </a-modal>

    <a-modal
      title="应用拷贝"
      v-model="copeAppModalVisible"
      :maskClosable="false"
      :width="600"
      @ok="handleOkByCopyApp"
      :footer="null"
    >
      <a-form :form="appForm" hideRequiredMark @submit="handleOkByCopyApp">
        <a-form-item label="新应用名">
          <a-input
            v-decorator="['name', {
                initialValue: '',
                rules: [
                  { required: true, whitespace:true, message: '应用名不能为空' },
                  {min:2, message:'应用名长度必须在2至36个字符以内'},
                  {max:36, message:'应用名长度必须在2至36个字符以内'}
                ],
                getValueFromEvent: disposeValueHandle
            }]"
            placeholder="请输入应用名"
            @blur="blurAppNameHandle"
          />
        </a-form-item>

        <a-form-item label="新应用网址">
          <a-input
            v-decorator="['slug', {
                initialValue: '',
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

        <a-form-item style="padding-top:20px;">
          <a-button type="primary" html-type="submit" block :loading="submitStatus">确定拷贝应用</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import {
  getApisListRequest,
  emptyApisRequest,
  copyApiRequest,
  moveApiRequest
} from "@/api/interface.js";
import { delAppRequest, copyAppRequest } from "@/api/application.js";

export default {
  data() {
    return {
      app_api_request_uri: process.env.VUE_APP_API_REQUEST_URI,
      apiOptions: null,
      appOptions: null,
      checkedApi: [],
      disabledApps: [],
      targetApp: undefined,
      copeApiModalVisible: false,
      modalType: null,
      copeAppModalVisible: false,
      submitStatus: false
    };
  },
  beforeCreate() {
    this.appForm = this.$form.createForm(this);
  },
  watch: {
    $route(to, from) {
      this._initLoad();
    }
  },
  created: function() {
    this._initLoad();
  },
  mounted() {},
  methods: {
    _initLoad() {},
    _loadApiData() {
      if (this.apiOptions) return;

      getApisListRequest({ app_slug: this.$route.params.slug })
        .then(res => {
          let apiOptions = [];
          res.data.forEach(o => {
            apiOptions.push({
              label: o.name,
              value: o._id
            });
          });

          this.apiOptions = apiOptions;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    _loadAppData() {
      if (this.appOptions) return;

      let appOptions = [];
      this.$store.getters.myApps.forEach(o => {
        appOptions.push({
          label: o.name,
          value: o.slug
        });
      });
      this.appOptions = appOptions;
    },
    _emptyApp() {
      emptyApisRequest({ app_slug: this.$route.params.slug })
        .then(res => {
          this.apiOptions = [];
          this.$message.success("应用清空成功");

          let apps = [];
          this.$store.getters.myApps.filter(o => {
            if (o.slug == this.$route.params.slug) {
              o.api_count = 0;
            }
            apps.push(o);
          });
          this.$store.commit("setAppList", apps);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    _deleteApp() {
      delAppRequest(this.$route.params.slug)
        .then(res => {
          this.$message.success("应用删除成功");

          let apps = this.$store.getters.myApps.filter(
            o => o.slug != this.$route.params.slug
          );
          this.$store.commit("setAppList", apps);

          let basicsData = { ...this.$store.state.user.basicsData };
          basicsData.have_app_count--;
          this.$store.dispatch("handleUserBasicsData", basicsData);

          this.$router.push({ name: "myApps" });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    visibleModalHandle(type) {
      this.modalType = type;

      if (type == "copy_api") {
        this._loadApiData();
        this._loadAppData();
        this.checkedApi = [];
        this.disabledApps = [];
        this.targetApp = undefined;

        this.copeApiModalVisible = true;
      } else if (type == "move_api") {
        this._loadApiData();
        this._loadAppData();
        this.checkedApi = [];
        this.disabledApps = [this.$route.params.slug];
        this.targetApp = undefined;

        this.copeApiModalVisible = true;
      } else if (type == "copy_app") {
        this._loadAppData();
        this.disabledApps = [];
        this.targetApp = undefined;

        this.copeAppModalVisible = true;
      } else if (type == "empty_app") {
        const _self = this;

        this.$confirm({
          title: "清空应用所有接口",
          content:
            "你确定要清空当前拥有所有接口吗？执行后所有接口将无法恢复，请谨慎操作！",
          okText: "确定清空",
          okType: "danger",
          cancelText: "取消",
          onOk() {
            _self._emptyApp();
          },
          onCancel() {
            // console.log("Cancel");
          }
        });
      } else if (type == "delete_app") {
        const _self = this;

        this.$confirm({
          title: "删除应用",
          content:
            "删除当前应用及其下所有创建的接口，删除后该应用及接口数据将无法找回，请谨慎操作！",
          okText: "确定删除",
          okType: "danger",
          cancelText: "取消",
          onOk() {
            _self._deleteApp();
          },
          onCancel() {
            // console.log("Cancel");
          }
        });
      }
    },
    blurAppNameHandle(e) {
      let value = e.target.value;
      if (value && !this.appForm.getFieldsValue().slug) {
        if (/[\u4e00-\u9fa5]/.test(value)) {
          value = pinyin(value, { style: pinyin.STYLE_NORMAL }).join("");
        }

        value = value.match(/[\w\-.]/g).join("");

        this.appForm.setFieldsValue({
          slug: value
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
    handleOkByCopyApi(e) {
      if (this.modalType == "copy_api") {
        copyApiRequest({
          api_ids: this.checkedApi,
          target_app_slug: this.targetApp
        })
          .then(res => {
            this.copeApiModalVisible = false;
            this.checkedApi = [];
            this.targetApp = undefined;
            this.$message.success("拷贝接口成功");

            let apps = [];
            this.$store.getters.myApps.filter(o => {
              if (o.slug == this.targetApp) {
                o.api_count += this.checkedApi.length;
              }
              apps.push(o);
            });
            this.$store.commit("setAppList", apps);
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      } else {
        moveApiRequest({
          api_ids: this.checkedApi,
          target_app_slug: this.targetApp
        })
          .then(res => {
            this.copeApiModalVisible = false;
            this.checkedApi = [];
            this.targetApp = undefined;
            this.apiOptions = null;
            this.$message.success("拷贝转移成功");

            let apps = [];
            this.$store.getters.myApps.filter(o => {
              if (o.slug == this.targetApp) {
                o.api_count += this.checkedApi.length;
              } else if (o.slug == this.$route.params.slug) {
                o.api_count -= this.checkedApi.length;
              }
              apps.push(o);
            });
            this.$store.commit("setAppList", apps);
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
    },
    handleOkByCopyApp(e) {
      e.preventDefault();
      this.appForm.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const nowAppInfo = this.$store.getters.myApps.filter(
            o => o.slug == this.$route.params.slug
          )[0];
          if (nowAppInfo.name == values.name) {
            this.$message.warning("新应用名不能与原应用一样");
            return;
          }
          if (nowAppInfo.slug == values.slug) {
            this.$message.warning("新应用标识不能与原应用一样");
            return;
          }

          values.target_app_slug = this.$route.params.slug;
          copyAppRequest(values)
            .then(res => {
              this.copeAppModalVisible = false;
              this.$message.success("拷贝应用成功");

              this.$store.dispatch("handleUpdateMyApps");

              let basicsData = { ...this.$store.state.user.basicsData };
              basicsData.have_app_count++;
              this.$store.dispatch("handleUserBasicsData", basicsData);

              this.$router.push({
                name: "appDetail",
                params: { slug: values.slug }
              });
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        }
      });
    },
    filterOption(inputValue, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(inputValue.toLowerCase()) > -1
      );
    }
  }
};
</script>

<style lang="less">
@import "../../assets/theme_param.less";

.v-other-management-content {
}
.v-o-m-group {
  margin-bottom: 80px;

  h3 {
    color: darken(@primary-color, 10%);
    font-size: 14px;
    margin-bottom: 20px;
    padding-left: 6px;
    border-left: 4px solid darken(@primary-color, 10%);
  }
}
.v-other-m-block {
  padding-bottom: 20px;
  margin-bottom: 40px;
  padding-left: 10px;
  border-bottom: 1px solid #f0f2f5;

  div {
    button {
      float: right;
    }
  }

  label {
    font-weight: bold;
    font-size: 16px;
  }

  p {
    font-size: 12px;
    margin-top: 10px;
    color: #8b8b8b;
  }
}
.v-o-lf-modal {
  .ant-modal-body {
    display: flex;
  }
}
.v-o-m-l {
  flex: 1;
  margin-right: 10px;
  overflow: hidden;

  .ant-checkbox-group {
    max-height: 30vh;
    overflow-y: auto;
    display: block;
    margin-top: 6px;
  }

  .ant-checkbox-group-item {
    display: block;
    margin-bottom: 6px;
  }
}
.v-o-m-r {
  flex: 1;
  margin-left: 10px;
  overflow: hidden;

  .ant-select {
    max-height: 30vh;
    overflow-y: auto;
    display: block;
    margin-top: 6px;
  }
}
</style>
