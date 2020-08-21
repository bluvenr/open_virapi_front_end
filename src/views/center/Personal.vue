<template>
  <a-spin tip="加载中..." :spinning="pageLoading" class="v-layout-content v-center-content">
    <h2>编辑个人资料</h2>

    <a-form class="v-personal-form" :form="form" :hideRequiredMark="true" @submit="handleSubmit">
      <a-form-item label="账户昵称" v-bind="formItemLayout" extra="自定义您的账户昵称，长度必须在2至20个字符以内">
        <a-input
          v-decorator="['nickname', {
            initialValue: $store.getters.userName,
            rules: [
              { required: true, message: '请输入您的账户昵称' },
              { min: 2, message: '昵称最小需要两个字符' },
              { max: 20, message: '昵称最多不能超过20个字符' },
              { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '昵称不能包含特殊字符' },
            ]
          }]"
          placeholder="请输入您的账户昵称"
        />
      </a-form-item>

      <a-form-item label="平台唯一ID" v-bind="formItemLayout" extra="平台唯一用户标识ID，只有一次修改机会，编辑保存后将不能再次更改！">
        <a-input
          v-decorator="['vir_uid', {
            initialValue: $store.getters.virUid,
            rules: [
              { required: true, message: '请输入您的唯一ID名称' },
              { pattern: /^[a-z][a-z0-9_\-]{3,23}$/, message: '长度为4至24，支持小写字母、数字、下划线_、及中隔符-，且首位必须为字母' },
            ]
          }]"
          placeholder="请自定义您的平台唯一个性ID"
          :disabled="virUidDisabled"
          ref="vir_uid_input"
        >
          <a
            slot="addonAfter"
            v-if="!$store.state.user.basicsData.vir_uid_updated"
            @click="editVirUidHandle"
          >{{ virUidDisabled ? '自定义编辑' : '取消编辑' }}</a>
        </a-input>
      </a-form-item>

      <a-form-item label="登录邮箱" v-bind="formItemLayout" extra="登录时用于识别身份，请谨慎修改！">
        <a-input
          v-decorator="['email', {
            initialValue: $store.state.user.basicsData.email,
            rules: [
              { required: true, message: '请输入您的登录邮箱' },
              { type:'email', message: '请输入正确邮箱格式' }
            ]
          }]"
          placeholder="请输入您的登录邮箱"
        />
      </a-form-item>

      <a-form-item v-bind="formItemLayout" label="头 像" extra="允许上传最大2M大小图片，支持格式：png、jpg、gif">
        <a-upload
          accept="image/png, image/jpeg, image/gif"
          :showUploadList="false"
          :beforeUpload="beforeUpload"
        >
          <a-button icon="upload">选择图片</a-button>
        </a-upload>

        <img :src="avatarImgUrl" alt="头像" class="v-personal-avatar" />
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
        <a-button type="primary" :disabled="btnDisabled" html-type="submit">确定保存</a-button>
        <a-button @click="cancelHandle" :disabled="btnDisabled" style="margin-left:20px;">取 消</a-button>
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script>
import { getMyInfoRequest, updateUserInfoRequest } from "@/api/user.js";
import { cropIconToBase64 } from "@/utils/pictureProcess";

export default {
  data() {
    return {
      pageLoading: true,
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      },
      avatarImgUrl: this.$store.getters.avatarUrl,
      virUidDisabled: true,
      btnDisabled: true,
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: "validate_other",
      onValuesChange: () => {
        this.btnDisabled = false;
      },
    });
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
  mounted() {},
  methods: {
    _initLoad() {
      this.pageLoading = false;

      /* getMyInfoRequest()
        .then(res => {
          this.pageLoading = false;

          this.$store.commit("setUserName", res.data.nickname);
          this.$store.commit("setUserAvatarUrl", res.data.avatar);
          this.$store.commit("setUserVirUid", res.data.vir_uid);
          this.$store.commit("setUserBasicsData", res.data.other_info);
        })
        .catch(err => {
          this.$message.error(err.message);
        }); */
    },
    cancelHandle() {
      this.form.resetFields();
      this.avatarImgUrl = this.$store.getters.avatarUrl;
      this.btnDisabled = true;
    },
    beforeUpload(file) {
      if (file.size / 1024 / 1024 > 2) {
        this.$message.error("图片不能超过2M");
        return false;
      }
      cropIconToBase64(file, (imageUrl) => {
        this.avatarImgUrl = imageUrl;
        this.btnDisabled = false;
      });
      return false;
    },
    editVirUidHandle() {
      if (!this.virUidDisabled) {
        this.virUidDisabled = true;
        this.form.setFieldsValue({ vir_uid: this.$store.getters.virUid });
      } else {
        this.virUidDisabled = false;

        this.$nextTick(() => {
          this.$refs.vir_uid_input.focus();
        });
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if (
            this.avatarImgUrl &&
            this.avatarImgUrl != this.$store.getters.avatarUrl
          ) {
            values.avatar = this.avatarImgUrl;
          }

          if (
            this.virUidDisabled ||
            values.vir_uid.trim() == this.$store.getters.virUid
          ) {
            delete values.vir_uid;
          }

          updateUserInfoRequest(values)
            .then((res) => {
              this.$store.commit("setUserName", values.nickname);

              if (values.avatar) {
                this.$store.commit("setUserAvatarUrl", values.avatar);
              }
              let _other_info = {};
              if (values.vir_uid) {
                _other_info.vir_uid_updated = true;
                this.$store.commit("setUserVirUid", values.vir_uid);
              }
              if (values.email) {
                _other_info.email = values.email;
              }
              if (Object.keys(_other_info).length > 0) {
                this.$store.commit("setUserBasicsData", {
                  ...this.$store.state.user.basicsData,
                  ..._other_info,
                });
              }

              this.virUidDisabled = true;
              this.btnDisabled = true;
              this.$message.success("个人资料修改成功");
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        }
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.btnDisabled) {
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
.v-center-content {
  h2 {
    margin-bottom: 30px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f2f5;
  }
}

.v-personal-avatar {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  border: 1px solid #ccc;
  display: block;
  margin: 10px;
}
</style>
