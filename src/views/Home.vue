<template>
  <div class="v-home-layout">
    <div class="v-home-content">
      <div class="v-home-l">
        <div class="v-home-user-box">
          <router-link
            class="v-h-u-edit-btn"
            :to="{name:'profile',query:{from:'home'}}"
            title="编辑个人资料"
          >
            <a-icon type="form" />
          </router-link>

          <img :src="$store.getters.avatarUrl" alt="头像" />
          <div class="v-h-u-name">{{ $store.getters.userName }}</div>
          <div class="v-h-u-vid">
            <span>ID:</span>
            {{ $store.getters.virUid || '暂未定义' }}
            <router-link
              v-if="$store.state.user.basicsData && !$store.state.user.basicsData.vir_uid_updated"
              :to="{name:'profile', query:{from:'home_edit_vir_uid'}}"
            >前往设置</router-link>
          </div>
          <div v-if="$store.state.user.basicsData" class="v-h-u-data">
            <span>
              已创建
              <router-link
                :to="{name:'myApps', query:{from:'home'}}"
              >{{ $store.state.user.basicsData.have_app_count || 0 }}</router-link>&nbsp;个应用
            </span>
            <span>于{{ $store.state.user.basicsData.created.substring(0, 10) || '--' }}注册</span>
          </div>
        </div>

        <div class="v-home-sponsor-box">
          <h3 class="v-home-box-title">赞助支持</h3>
          <p>若您觉得本平台有为你提供帮助，可随意打赏表示支持哦~</p>

          <div class="v-h-sponsor-list">
            <div class="v-h-sponsor-item">
              <img src="@/assets/sponsor/alipay_qr_code.png" alt="支付宝打赏" />
              <p style="color:#019fe8;">支付宝打赏赞助</p>
            </div>
            <div class="v-h-sponsor-item">
              <img src="@/assets/sponsor/wxpay_qr_code.png" alt="微信打赏" />
              <p style="color:#22ab39;">微信打赏赞助</p>
            </div>
          </div>
        </div>
      </div>

      <div class="v-home-c">
        <div class="v-h-app-cards">
          <h3 class="v-home-box-title">我的应用</h3>

          <router-link
            class="v-h-app-card"
            v-for="(item, index) in $store.getters.myApps"
            :key="index"
            :to="{name:'appDetail', params:{slug:item.slug}}"
            :title="item.name"
          >
            <div class="v-app-icon">
              <img class="v-app-icon-img" :src="item.icon" alt="app icon" v-if="item.icon" />
              <i class="v-app-icon-text" v-else>{{ item.name.substr(0, 1) }}</i>
            </div>
            <div class="v-h-app-info">
              <div class="v-h-app-name">{{ item.name || '--' }}</div>
              <div class="v-h-app-data">
                <a-icon type="api" />
                {{ item.api_count || 0 }}
                <span>{{ item.created }}</span>
              </div>
            </div>
          </router-link>
        </div>

        <a-empty description="暂无更多内容" />
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Footer from "@/components/Footer.vue";

export default {
  name: "home",
  components: {
    Footer,
  },
  data() {
    return {};
  },
  created: function () {
    this._initLoad();
  },
  methods: {
    _initLoad() {},
  },
  beforeDestroy() {},
};
</script>

<style lang="less">
@import "../assets/theme_param.less";

.v-h-app-cards {
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 20px;

  h3 {
    width: 100%;

    a {
      float: right;
      font-size: 13px;
    }
  }
}
.v-h-app-card {
  width: 31%;
  overflow: hidden;
  margin: 0 1% 2%;
  padding: 10px;
  text-align: center;
  background-color: #fff;
  border: 1px solid #ececec;
  border-radius: 4px;
  transition: all linear 0.2s;

  .v-app-icon {
    width: 100%;
    text-align: center;
    margin: 8px 0 16px;
  }

  .v-app-icon-img {
    width: 70px;
  }
  .v-app-icon-text {
    width: 70px;
    line-height: 70px;
    display: inline-block;
  }

  .v-h-app-info {
    margin: 4px 0 0;
  }

  .v-h-app-name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 4px;
  }

  &:hover {
    box-shadow: -2px -2px 4px rgba(221, 221, 221, 0.5),
      2px 4px 6px rgba(221, 221, 221, 0.5);
  }
}
.v-home-layout {
  min-width: 1180px;
  padding: 20px 0 0;
  background: #f0f2f5;
}
.v-home-content {
  min-width: 1080px;
  min-height: 100vh;
  margin: 20px 50px 60px;
  display: flex;
  overflow: hidden;
}
.v-home-l {
  width: 300px;
  margin-right: 10px;
}
.v-home-user-box {
  text-align: center;
  padding: 30px 16px;
  background-color: #fff;
  position: relative;

  img {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    border: 1px solid #e5e4e4;
  }
}
.v-h-u-edit-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 16px;
}
.v-h-u-name {
  margin-top: 6px;
  font-size: 16px;
}
.v-h-u-vid {
  margin: 4px;

  a {
    font-size: 12px;
    margin-left: 4px;
  }
}
.v-home-sponsor-box {
  margin-top: 20px;
  padding: 10px;

  h3 {
    color: @primary-color;
    position: relative;
    margin-bottom: 4px;
  }
  p {
    font-size: 12px;
    color: #999;
  }
}
.v-h-sponsor-list {
  display: flex;
  align-items: flex-start;
}
.v-h-sponsor-item {
  flex: 1;
  margin: 10px;

  img {
    width: 100%;
  }
  p {
    text-align: center;
    margin: 6px 0 0;
  }
}
.v-home-c {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  overflow: hidden;

  .ant-alert {
    margin-bottom: 10px;
  }

  .ant-empty {
    margin-top: 120px;
  }
}

.v-home-box-title {
  margin-bottom: 20px;

  &::before {
    content: "";
    display: inline-block;
    height: 12px;
    width: 4px;
    background-color: @primary-color;
    margin-right: 4px;
  }
}
.v-h-app-info {
  margin-left: 10px;
  color: #666;
  flex: 1;
  overflow: hidden;
}
.v-h-app-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.v-h-app-data {
  font-size: 12px;

  span {
    margin-left: 10px;
  }
}
.v-h-u-data {
  font-size: 13px;
  display: flex;

  span {
    flex: 1;
    text-align: center;
  }
}
</style>
