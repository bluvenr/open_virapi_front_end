<template>
  <div class="v-main-body">
    <div class="v-create-body">
      <div class="v-introduce">
        <h2>新建接口</h2>
        <p>接口创建成功后，即可在该接口下创建您所需要的API。</p>
        <p>当前系统默认每个应用下最多创建{{ $store.state.user.basicsData.max_api_count }}个接口，更多开放敬请期待！</p>
        <p>
          若是第一次使用，或不知道如何新建接口，可点击这里查看
          <a
            href="https://virapi.com/article/xsrm02-xjjk.html"
            target="_blank"
          >新手快速入门</a>。
        </p>
        <p>
          <strong>注意：</strong>请遵守本平台的规范及相关法律法规，若发现接口存在违规情况，平台将会直接冻结清除；严重的将禁封账号。
        </p>
      </div>

      <div class="v-form v-create-api-form">
        <a-form :form="apiForm" hideRequiredMark @submit="handleSubmit">
          <a-form-item label="对应应用">
            <a-select
              showSearch
              v-decorator="[
                'app_id',
                {
                  initialValue: appId,
                  rules: [{ required: true, message: '请选择要关联的应用' }]
                }
              ]"
              placeholder="请选择要关联的应用"
              @change="changeAppHandle"
              optionFilterProp="children"
              :filterOption="filterOption"
            >
              <a-select-option
                v-for="item in $store.getters.myApps"
                :key="item._id"
                :value="item._id"
                :disabled="item.api_count >= $store.state.user.basicsData.max_api_count"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="接口名">
            <a-input
              v-decorator="['name',{
                validateTrigger: ['blur'],
                rules: [
                  {required:true, whitespace:true, message:'接口名不能为空'},
                  {min:2, message:'接口名长度必须在2至36个字符以内'},
                  {max:36, message:'接口名长度必须在2至36个字符以内'}
                ]}]"
              placeholder="请输入接口名"
              @blur="blurApiNameHandle"
            />
          </a-form-item>

          <a-form-item label="接口URI">
            <a-input
              :addonBefore="`${app_api_request_uri || '--'}${$store.getters.virUid}/${appSlug || '请选择对应应用'}/`"
              v-decorator="['uri', {
                validateTrigger: ['blur'],
                rules: [
                  { required: true, whitespace:true, message: '接口请求URI不能为空' },
                  { max:60, message:'URI最多60个字符' },
                  { pattern: /^[\w-.]+$/, message: '接口请求URI输入非法' },
                ]
              }]"
              placeholder="请输入接口URI"
              ref="uri_input"
            ></a-input>
          </a-form-item>

          <a-form-item label="描述(可选)">
            <a-textarea
              v-decorator="['describe', {rules: [
                { max: 160, message: '最多160个字符' }
              ]}]"
              placeholder="(可选)接口描述......"
              :autoSize="{ minRows: 2, maxRows: 6 }"
            />
          </a-form-item>

          <a-form-item label="请求类型">
            <a-radio-group
              v-decorator="['method', {initialValue: 'GET', rules: [{ required: true, message: '请选择请求方法类型' }]}]"
            >
              <a-radio value="GET">GET请求</a-radio>
              <a-radio value="POST">POST请求</a-radio>
              <a-radio value="PUT">PUT请求</a-radio>
              <a-radio value="DELETE">DELETE请求</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="响应数据">
            <p class="v-res-remark" style="margin-top:0;">
              * 此处返回数据特指返回数据的data部分，因api所属应用已创建了对应响应模板；即不需要再返回code及message部分。若无data内容可不编辑此项。当前响应数据需要使用MockJS语法定义，若之前未有接触可通过
              <a
                href="https://virapi.com/article/xsrm05-mockjsffsydq.html"
                target="_blank"
              >《MockJS常用语法快速上手》</a>进行了解学习。
            </p>

            <MonacoEditor
              :value="responseData"
              :options="{language:'json'}"
              class="v-json-editor"
              style="height:350px;"
              ref="mockjs_editor"
              @contentChange="(v)=>responseData=v"
              @blur="blurMockEditorHandle"
            />
          </a-form-item>

          <a-form-item style="padding-top:40px;">
            <a-button type="primary" html-type="submit" :loading="submitStatus">创建接口</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>

    <a-modal
      title="系统提示"
      v-model="goCreateAppViewModel"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      width="400px"
    >
      <p>创建接口需先创建对应应用；您当前未创建任何应用，请先创建目标应用！</p>

      <a-button type="primary" class="v-model-btn" @click="$router.push({name:'appCreate'})">前往创建应用</a-button>
      <a-button
        class="v-model-btn"
        @click="$router.back(-1)"
        icon="rollback"
        style="margin-top:0px;"
      >返回上一页</a-button>
    </a-modal>

    <Footer />
  </div>
</template>

<script>
import moment from "moment";
import pinyin from "pinyin";
import Footer from "@/components/Footer.vue";
import MonacoEditor from "@/components/MonacoEditor";
import { createApiRequest } from "@/api/interface.js";

export default {
  components: {
    MonacoEditor,
    Footer,
  },
  data() {
    return {
      app_api_request_uri: process.env.VUE_APP_API_REQUEST_URI,
      appId: this.$route.query.app_id,
      appSlug: null,
      responseData: "",
      submitStatus: false,
      goCreateAppViewModel: false,
    };
  },
  watch: {
    $route(to, from) {
      this._initLoad();
    },
  },
  beforeCreate() {
    this.apiForm = this.$form.createForm(this);
  },
  created: function () {
    if (!this.$store.getters.myApps || this.$store.getters.myApps.length == 0) {
      this.goCreateAppViewModel = true;
      return;
    }

    this._initLoad();
  },
  mounted() {},
  methods: {
    moment,
    _initLoad() {
      this.changeAppHandle(this.appId);
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    blurApiNameHandle(e) {
      let value = e.target.value;
      if (value && !this.apiForm.getFieldsValue().uri) {
        if (/[\u4e00-\u9fa5]/.test(value)) {
          value = pinyin(value, { style: pinyin.STYLE_NORMAL }).join("");
        }

        value = value.match(/[\w\-\.]/g).join("");

        this.apiForm.setFieldsValue({
          uri: value,
        });
      }
    },
    changeAppHandle(id) {
      if (!id) return;

      for (const e of this.$store.getters.myApps) {
        if (e._id === id) {
          if (e.api_count >= this.$store.state.user.basicsData.max_api_count) {
            this.appId = undefined;
            this.appSlug = null;
          } else {
            this.appSlug = e.slug;
          }
          break;
        }
      }
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
      this.apiForm.validateFieldsAndScroll((err, values) => {
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

          this.submitStatus = true;
          createApiRequest(values)
            .then((res) => {
              this.submitStatus = false;

              let apps = [];
              this.$store.getters.myApps.filter((o) => {
                if (o.slug == this.appSlug) {
                  o.api_count += 1;
                }
                apps.push(o);
              });
              this.$store.commit("setAppList", apps);

              this.apiForm.resetFields();
              this.apiForm.setFieldsValue({ method: values.method });

              const _self = this;
              this.$confirm({
                title: "接口创建成功",
                icon: "check-circle",
                okText: "前往接口列表",
                // okType: "danger",
                cancelText: "继续创建",
                onOk() {
                  _self.$router.push({
                    name: "apiList",
                    params: { slug: _self.appSlug },
                  });
                },
                onCancel() {
                  document.body.scrollIntoView();
                  _self.responseData = "";
                  _self.$refs.mockjs_editor.setEditorValue("");
                },
              });
            })
            .catch((err) => {
              this.submitStatus = false;
              this.$message.error(err.message);
            });
        }
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    if (
      Object.values(
        this.apiForm.getFieldsValue(["name", "uri", "describe"])
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
.v-json-editor {
  height: 200px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;
}
.v-create-api-form {
  .ant-form-item {
    margin-bottom: 0;
  }
}
.ant-input-group {
  .v-input-group-r {
    text-align: center;
    border-left: 0;
  }
  .v-input-group-l {
    text-align: center;
  }
  .v-input-group-c {
    width: 30px;
    border-left: 0;
    pointer-events: none;
    background-color: #fff;
  }
}
</style>
