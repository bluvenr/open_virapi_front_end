<template>
  <a-spin tip="加载中..." :spinning="pageLoading" class="v-layout-content v-center-content">
    <h2>重置我的账号密码</h2>

    <a-form class="v-personal-form" :form="form" :hideRequiredMark="true" @submit="handleSubmit">
      <a-form-item label="当前密码" v-bind="formItemLayout" extra="请输入您当前的账号登录密码">
        <a-input
          type="password"
          v-decorator="['old_password', {
            rules: [
              { required: true, message: '请输入您当前的账号登录密码' },
              { min: 6, message: '密码最小需要6个字符' },
              { max: 20, message: '密码最多不能超过20个字符' },
            ]
          }]"
          placeholder="请输入您当前的账号登录密码"
        />
      </a-form-item>

      <a-form-item label="新登录密码" v-bind="formItemLayout" extra="请输入您的新账号登录密码，设置成功后请妥善保管好您的新密码哟~">
        <a-input
          type="password"
          v-decorator="['password', {
            rules: [
              { required: true, message: '请输入您的新账号登录密码' },
              { min: 6, message: '密码最小需要6个字符' },
              { max: 20, message: '密码最多不能超过20个字符' },
              {
                validator: validateToNextPassword,
              },
            ]
          }]"
          placeholder="请输入您的新账号登录密码"
        />
      </a-form-item>

      <a-form-item label="确认登录密码" v-bind="formItemLayout" extra="请再次输入您的新账号登录密码，设置成功后请妥善保管好您的新密码哟~">
        <a-input
          type="password"
          v-decorator="['confirm_password', {
            rules: [
              { required: true, message: '请输入您的新账号登录密码' },
              { min: 6, message: '密码最小需要6个字符' },
              { max: 20, message: '密码最多不能超过20个字符' },
              {
                validator: compareToFirstPassword,
              },
            ]
          }]"
          placeholder="请再次输入您的新账号登录密码"
        />
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
        <a-button type="primary" :loading="submitLoading" html-type="submit">确定重置密码</a-button>
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script>
import { getAppInfoRequest, updateUserPwdRequest } from "@/api/user.js";

export default {
  data() {
    return {
      pageLoading: true,
      submitLoading: false,
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      },
    };
  },
  watch: {
    $route(to, from) {
      this.pageLoading = true;
      this._initLoad();
    },
  },
  created: function () {
    this._initLoad();
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
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
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("两次密码不一致");
      } else {
        callback();
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.submitLoading = true;
          if (values.old_password == values.password) {
            this.$message.error("当前重置密码不能与原密码一致！");
            this.submitLoading = false;
            return;
          }

          updateUserPwdRequest(values)
            .then((res) => {
              this.submitLoading = false;
              this.form.resetFields();
              this.$message.success("密码重置成功");
            })
            .catch((err) => {
              this.submitLoading = false;
              this.$message.error(err.message);
            });
        }
      });
    },
  },
};
</script>

<style lang="less">
</style>
