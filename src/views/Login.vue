<template>
  <div class="v-full-layout">
    <div class="v-login-content">
      <a href="https://www.virapi.com/" target="_blank" class="v-login-home-link">
        <img src="@/assets/logo-icon.png" alt="VirAPI" />
      </a>

      <h2>
        欢迎使用
        <span>VirAPI</span> 开源版
        <p>
          由
          <a href="http://www.virapi.com/" target="_blank">www.virapi.com</a> 提供
        </p>
      </h2>

      <a-form :form="form" class="v-login-form" @submit="handleSubmit">
        <a-form-item>
          <a-input
            v-decorator="[
              'account',
              { rules: [{ required: true, message: '登录账号不能为空！' }] },
            ]"
            placeholder="登录账号"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'password',
              { rules: [{ required: true, message: '请输入登录密码！' }] },
            ]"
            type="password"
            placeholder="登录密码"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" block :loading="loading">登 录</a-button>
        </a-form-item>
      </a-form>

      <div class="v-login-footer">
        <span>
          Copyright © 2019{{ newYear > 2019 ? '-'+newYear : '' }}
          <a
            href="https://github.com/bluvenr"
            target="_blank"
          >Bluven</a>. All Rights Reserved.
        </span>
        <span>Version {{ appVersion || '--' }}</span>
        <a href="https://github.com/bluvenr/open_virapi" target="_blank">
          <a-icon type="github" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      newYear: new Date().getFullYear(),
      appVersion: process.env.VUE_APP_VERSION,
      loading: false,
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true;

          this.$store
            .dispatch("handleLogin", values)
            .then(() => {
              this.$router.push({ name: "home" });
            })
            .catch((err) => {
              this.$notification.error({
                message: "登录失败",
                description: `抱歉，登录失败，请重新再试~~ Err:${err.message}`,
              });
              this.loading = false;
            });
        }
      });
    },
  },
  beforeDestroy() {},
};
</script>

<style lang="less">
@import "../assets/theme_param.less";

.v-login-form {
  margin-top: 60px;
}
.v-full-layout {
  margin-top: -44px;
  min-height: 100vh;
  background-color: desaturate(lighten(@primary-color, 40%), 60%);
}
.v-login-content {
  background-color: #fff;
  margin: 20vh auto 20px;
  width: 30%;
  min-width: 400px;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0px 10px 80px 0px rgba(138, 138, 138, 0.45);
  position: relative;
  padding: 60px 40px 20px;

  h2 {
    text-align: center;
  }

  p {
    font-size: 14px;
  }
}
.v-login-footer {
  border-top: 1px solid #ececec;
  font-size: 12px;
  text-align: center;
  padding-top: 20px;
  margin-top: 60px;

  span {
    display: block;
  }
}
.v-login-home-link {
  position: absolute;
  top: -80px;
  left: 50%;
  height: 60px;
  margin-left: -30px;

  img {
    height: 100%;
  }
}
</style>
