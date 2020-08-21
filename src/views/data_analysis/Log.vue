<template>
  <div class="v-layout-content">
    <h2 class="v-layout-c-head">
      请求日志
      <a-radio-group
        class="v-l-c-head-column"
        :value="requestParams.date_type"
        button-style="solid"
        size="small"
        @change="changeDateHandle"
      >
        <a-radio-button value="today">今日</a-radio-button>
        <a-radio-button value="yesterday">昨日</a-radio-button>
        <a-radio-button value="7days">近7日</a-radio-button>
        <a-radio-button value="30days">近30日</a-radio-button>
      </a-radio-group>

      <a-button
        size="small"
        :loading="dataLoading"
        style="margin-left:14px;"
        @click="searchLogHandle"
        icon="reload"
      >刷新</a-button>
    </h2>

    <div class="v-table-header-form">
      <a-select
        :allowClear="true"
        showSearch
        placeholder="请求接口"
        style="width:180px;"
        :filterOption="filterOption"
        v-model="requestParams.api_id"
      >
        <a-select-option v-for="(v, i) in apiMap" :key="i" :value="i">{{ v }}</a-select-option>
        <a-select-option value="undefined">其他未知接口</a-select-option>
      </a-select>

      <a-select
        :allowClear="true"
        placeholder="请求类型"
        style="width:120px;"
        v-model="requestParams.method"
      >
        <a-select-option v-for="(v, i) in methodMap" :key="i" :value="i">{{ v }}</a-select-option>
      </a-select>

      <a-select
        :allowClear="true"
        placeholder="请求结果"
        style="width:120px;"
        v-model="requestParams.result"
      >
        <a-select-option v-for="(v, i) in resultMap" :key="i" :value="i">{{ v }}</a-select-option>
      </a-select>

      <!-- <a-input
        placeholder="请求响应关键字"
        style="width:160px;margin-right:10px;"
        v-model="requestParams.kw"
        @keyup.enter="searchLogHandle"
      />-->

      <a-button type="primary" icon="search" style="margin-left:10px;" @click="searchLogHandle">搜索</a-button>
    </div>

    <a-table
      class="v-table-body"
      :dataSource="logList"
      :columns="columns"
      :pagination="pagination"
      :loading="dataLoading"
      :rowKey="record => record.created"
      :scroll="{ x: logList&&logList.length?1300:true }"
      @change="handleTableChange"
    >
      <template
        slot="created"
        slot-scope="created"
      >{{ moment(created).format('YYYY-MM-DD HH:mm:ss') }}</template>

      <template slot="uri" slot-scope="uri">
        <span
          class="v-tb-overflow-row"
          style="width:140px;"
          :title="uri"
        >{{ uri.split($route.params.slug)[1] || '--' }}</span>
      </template>

      <template slot="method" slot-scope="method">{{ method || '未知' }}</template>

      <span
        slot="result"
        slot-scope="result"
        :class="`v-r-result-status${result}`"
      >{{ resultMap[result] || '未知' }}</span>

      <template slot="params" slot-scope="params">
        <a-tooltip v-if="params" overlayClassName="v-tooltip-pre">
          <template slot="title">
            <pre class="v-pre"><code>{{ params || '无' }}</code></pre>
          </template>
          <span class="v-tb-overflow-row">{{ params || '无' }}</span>
        </a-tooltip>
        <template v-else>--</template>
      </template>

      <template slot="response" slot-scope="response">
        <a-tooltip v-if="response" overlayClassName="v-tooltip-pre">
          <template slot="title">
            <pre class="v-pre"><code>{{ response || '无' }}</code></pre>
          </template>
          <span class="v-tb-overflow-row">{{ response || '无' }}</span>
        </a-tooltip>
        <template v-else>--</template>
      </template>
    </a-table>
  </div>
</template>

<script>
import moment from "moment";
import { getApisMapRequest, getRequestLogsRequest } from "@/api/interface.js";

export default {
  data() {
    return {
      logList: [],
      dataLoading: true,
      requestParams: {
        kw: null,
        api_id: undefined,
        method: undefined,
        result: undefined,
        date_type: "today"
      },
      pagination: {
        kw: null,
        api_id: undefined,
        method: undefined,
        result: undefined,
        date_type: null,
        total: 0,
        current: 1,
        pageSize: 10,
        size: "small",
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "40", "100"],
        showTotal: total => `总数：${total}条`,
        onShowSizeChange: (current, pagesize) => {
          this.pagination.current = current;
          this.pagination.pageSize = pagesize;
        },
        onChange: current => {
          this.pagination.current = current;
        }
      },
      columns: [
        {
          title: "请求时间",
          dataIndex: "created",
          width: 160,
          scopedSlots: { customRender: "created" },
          fixed: "left"
        },
        {
          title: "请求路由",
          dataIndex: "uri",
          width: 160,
          scopedSlots: { customRender: "uri" },
          fixed: "left"
        },
        {
          title: "请求类型",
          dataIndex: "method",
          width: 90,
          align: "center",
          scopedSlots: { customRender: "method" }
          // fixed: "left"
        },
        {
          title: "请求来源IP",
          dataIndex: "ip",
          width: 120,
          align: "center"
          // fixed: "left"
        },
        {
          title: "请求结果",
          dataIndex: "result",
          width: 90,
          align: "center",
          scopedSlots: { customRender: "result" }
          // fixed: "left"
        },
        {
          title: "请求参数",
          dataIndex: "params",
          width: "10%",
          scopedSlots: { customRender: "params" }
        },
        {
          title: "响应数据",
          dataIndex: "response",
          // width: "30%",
          scopedSlots: { customRender: "response" }
        }
      ],
      apiMap: {},
      methodMap: {
        GET: "GET请求",
        POST: "POST请求",
        PUT: "PUT请求",
        DELETE: "DELETE请求"
      },
      resultMap: {
        1: "成功",
        0: "失败"
      }
    };
  },
  watch: {
    $route(to, from) {
      this.dataLoading = true;
      this.requestParams.api_id = undefined;
      this._initLoad();
    }
  },
  created: function() {
    this._initLoad();
  },
  methods: {
    moment,
    _initLoad() {
      this.pagination.current = 1;
      this._loadLogList();

      getApisMapRequest({
        app_slug: this.$route.params.slug,
        _type: "api_uri_map"
      })
        .then(res => {
          let _map = {};
          res.data.forEach(o => {
            _map[
              o._id
            ] = `[${o.method}]${o.name}(/${this.$route.params.slug}/${o.uri})`;
          });
          this.apiMap = _map;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    changeDateHandle(e) {
      this.requestParams.date_type = e.target.value;
      this.searchLogHandle();
    },
    searchLogHandle() {
      this.pagination = Object.assign(this.pagination, this.requestParams, {
        current: 1
      });
      this._loadLogList();
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current };

      this.requestParams = Object.assign(this.requestParams, {
        per_page: pagination.pageSize,
        page: pagination.current
      });
      this._loadLogList();
    },
    _loadLogList() {
      this.dataLoading = true;

      getRequestLogsRequest({
        app_slug: this.$route.params.slug,
        ...this.requestParams,
        page: this.pagination.current,
        per_page: this.pagination.pageSize
      })
        .then(res => {
          this.dataLoading = false;

          this.pagination = { ...this.pagination, total: res.data.total };
          this.logList = res.data.list;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  }
};
</script>

<style lang="less">
.v-r-result-status0 {
  color: #f44336;
}
.v-r-result-status1 {
  color: #66bb6a;
}
.v-tooltip-pre {
  max-width: 600px;

  .v-pre {
    background-color: #3f3f3f;
    color: #fff;
    max-height: 600px;
    padding: 10px;
    border-radius: 6px;
  }
}
.v-tb-overflow-row {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  max-width: 100%;
}
.v-layout-c-head {
  margin-bottom: 20px;
}
.v-l-c-head-column {
  margin-left: 20px;
}
.v-pre {
  margin-bottom: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.ant-table {
  .v-pre {
    max-height: 400px;
  }
}
.v-table-header-form {
  margin-bottom: 20px;

  .ant-select {
    margin-right: 10px;
  }

  .ant-calendar-picker {
    width: 320px;
  }
}
</style>
