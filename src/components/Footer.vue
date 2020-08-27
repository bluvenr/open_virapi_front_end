<template>
  <a-layout-footer class="v-footer-layout">
    <div class="v-footer-group">
      <dl>
        <dt>联系方式</dt>
        <dd>
          Email:
          <span>
            <a href="mailto:virapi@outlook.com">virapi@outlook.com</a>
          </span>
        </dd>
        <dd>
          Gitter:
          <span>
            <a href="https://gitter.im/bluvenr" target="_blank" rel="noopener noreferrer">bluvenr</a>
          </span>
          |
          <span>
            <a href="https://gitter.im/virapi" target="_blank" rel="noopener noreferrer">virapi</a>
          </span>
        </dd>
        <dd>
          GitHub:
          <span>
            <a
              href="https://github.com/virapi"
              target="_blank"
              rel="noopener noreferrer"
            >github.com/virapi</a>
          </span>
        </dd>
      </dl>

      <dl>
        <dt>其他</dt>
        <dd>
          <a href="https://www.virapi.com/about.html" target="_blank">关于本站</a>
        </dd>
        <dd>
          <a href="https://www.virapi.com/terms.html" target="_blank">条款声明</a>
        </dd>
        <dd>
          <a href="https://gitter.im/virapi/feedback" target="_blank" rel="noopener noreferrer">意见反馈</a>
        </dd>
        <dd>
          <a href="https://www.virapi.com/links.html" target="_blank">友情链接</a>
        </dd>
        <dd>
          <a href="https://www.virapi.com/contactus.html" target="_blank">合作洽谈</a>
        </dd>
      </dl>

      <dl>
        <dt>产品服务</dt>
        <dd>
          <a href="https://www.virapi.com/">VirApi</a> - 在线虚拟数据云接口平台
        </dd>
      </dl>

      <dl class="v-footer-sponsor-box">
        <dt>
          赞助捐赠
          <small>(请备注virapi)</small>
        </dt>
        <dd class="v-footer-sponsor-item">
          <img src="@/assets/sponsor/alipay_qr_code.png" alt="支付宝赞助" />
          <span style="color:#019fe8;">支付宝赞助捐赠</span>
        </dd>
        <dd class="v-footer-sponsor-item">
          <img src="@/assets/sponsor/wxpay_qr_code.png" alt="微信赞助" />
          <span style="color:#22ab39;">微信赞助捐赠</span>
        </dd>
      </dl>
    </div>

    <div class="v-footer-info">
      <span>
        Copyright © 2019{{ newYear > 2019 ? '~'+newYear : '' }}
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
  </a-layout-footer>
</template>

<script>
export default {
  data() {
    return {
      newYear: new Date().getFullYear(),
      appVersion: process.env.VUE_APP_VERSION,
    };
  },
};
</script>

<style lang="less">
@import "../assets/theme_param.less";

.v-footer-layout {
  padding: 100px 80px 20px;
  background-color: darken(@primary-color, 50%);
  color: #fff;
  font-size: 14px;

  a {
    color: #fff;

    &:hover {
      color: @primary-color;
      text-decoration: underline;
    }
  }
}
.v-footer-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;

  dt {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  dd {
    color: #c1c1c1;
  }
}
.v-footer-info {
  border-top: 1px solid darken(@primary-color, 42%);
  padding-top: 20px;
  font-size: 12px;
  text-align: center;

  span {
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }
  }
}
.v-footer-sponsor-box {
  small {
    font-weight: initial;
    font-size: 12px;
    color: #8c8c8c;
  }

  dd {
    &:last-child {
      margin-right: 0;
    }
  }
}
.v-footer-sponsor-item {
  text-align: center;
  display: inline-block;
  margin-right: 6px;
  font-size: 12px;

  img {
    width: 100px;
  }

  span {
    display: block;
    margin-top: 4px;
  }
}

/* @media (max-width: 990px) {
  .v-footer-layout {
    padding: 40px 20px 20px;
  }

  .v-footer-group {
    flex-flow: row wrap;
    text-align: center;

    dl {
      width: 100%;
      margin-bottom: 40px;
    }
  }

  .v-footer-info {
    span {
      display: block;
      margin-right: 0;
    }
  }
} */
</style>
