import Vue from 'vue'
// import Antd from 'ant-design-vue'
import '@/assets/theme.less'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  Base,
  Button,
  Icon,
  Modal,
  Layout,
  message,
  notification,
  Anchor,
  AutoComplete,
  Alert,
  BackTop,
  Badge,
  Breadcrumb,
  Carousel,
  Cascader,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  LocaleProvider,
  Menu,
  Pagination,
  Popconfirm,
  Popover,
  Radio,
  Select,
  Spin,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Upload,
  Drawer,
  ConfigProvider,
  Empty,
} from 'ant-design-vue'

Vue.config.productionTip = false

// Vue.use(Antd)

Vue.use(Base);
Vue.use(LocaleProvider);
Vue.use(Divider);
Vue.use(Anchor);
Vue.use(Alert);
Vue.use(AutoComplete);
Vue.use(Breadcrumb);
Vue.use(Carousel);
Vue.use(BackTop);
Vue.use(Badge);
Vue.use(Menu);
Vue.use(Form);
Vue.use(Button);
Vue.use(Pagination);
Vue.use(Popconfirm);
Vue.use(Popover);
Vue.use(Modal);
Vue.use(Icon);
Vue.use(Table);
Vue.use(Tag);
Vue.use(Cascader);
Vue.use(Checkbox);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(Select);
Vue.use(Spin);
Vue.use(Tabs);
Vue.use(Layout);
Vue.use(Upload);
Vue.use(Drawer);
Vue.use(Tooltip);
Vue.use(Empty);
Vue.use(ConfigProvider);

Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#var-app')
