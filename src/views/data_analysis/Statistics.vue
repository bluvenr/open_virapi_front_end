<template>
  <div class="v-layout-content">
    <h2 class="v-layout-c-head">
      数据统计
      <a-radio-group
        class="v-l-c-head-column"
        :value="dateScope"
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
        @click="_loadStatisticsData"
        icon="reload"
      >刷新</a-button>
    </h2>

    <a-spin tip="加载中..." :spinning="dataLoading" class="v-statistics-body">
      <div class="v-statistics-item v-statistics-row-item">
        <h3>请求频率概览</h3>
        <div class="v-statistics-c">
          <v-chart
            v-if="statisticsData.request_list && Object.keys(statisticsData.request_list).length"
            :options="chartOptions.request_list"
            theme="ovilia-green"
            autoresize
          />
          <a-empty v-else />
        </div>
      </div>

      <div class="v-statistics-item v-statistics-row-item">
        <h3>请求结果比例</h3>
        <div class="v-statistics-c">
          <v-chart
            v-if="statisticsData.result_map && Object.keys(statisticsData.result_map).length"
            :options="chartOptions.result_map"
            theme="ovilia-green"
            autoresize
          />
          <a-empty v-else />
        </div>
      </div>

      <div class="v-statistics-item">
        <h3>Top10请求路由</h3>
        <div class="v-statistics-c">
          <a-table
            :columns="uriRankColumns"
            :dataSource="statisticsData.uri_rank"
            :pagination="false"
            :rowKey="record => record._id"
            size="small"
          >
            <template slot="uri" slot-scope="uri">
              <span
                class="v-tb-overflow-row"
                style="width:200px;"
                :title="uri"
              >{{ uri.split($route.params.slug)[1] || uri }}</span>
            </template>
          </a-table>
        </div>
      </div>

      <div class="v-statistics-item">
        <h3>Top10请求来源IP</h3>
        <div class="v-statistics-c">
          <a-table
            :columns="ipRankColumns"
            :dataSource="statisticsData.ip_rank"
            :pagination="false"
            :rowKey="record => record._id"
            size="small"
          ></a-table>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import moment from "moment";
import ECharts from "vue-echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
import "echarts/lib/component/tooltip";
import { getStatisticsRequest } from "@/api/interface.js";

export default {
  components: {
    "v-chart": ECharts
  },
  data() {
    return {
      dataLoading: true,
      dateScope: "today",
      chartOptions: {},
      statisticsData: {},
      uriRankColumns: [
        {
          title: "请求路由",
          dataIndex: "_id",
          scopedSlots: { customRender: "uri" }
        },
        {
          title: "总请求次数",
          dataIndex: "count"
        }
      ],
      ipRankColumns: [
        {
          title: "请求来源IP",
          dataIndex: "_id"
        },
        {
          title: "总请求次数",
          dataIndex: "count"
        }
      ]
    };
  },
  watch: {
    $route(to, from) {
      this.dataLoading = true;
      this._initLoad();
    }
  },
  created: function() {
    this._initLoad();
  },
  methods: {
    _initLoad() {
      this._loadStatisticsData();
    },
    changeDateHandle(e) {
      this.dateScope = e.target.value;
      this._loadStatisticsData();
    },
    _loadStatisticsData() {
      this.dataLoading = true;

      getStatisticsRequest({
        app_slug: this.$route.params.slug,
        date_scope: this.dateScope
      })
        .then(res => {
          this.dataLoading = false;
          this.statisticsData = res.data;

          let request_list_keys = [],
            request_list_values = [];
          if (this.dateScope == "today") {
            let end_date = moment().format("HH");
            for (let i = 0; i <= end_date; i++) {
              request_list_keys.push(i);
              request_list_values.push(0);
            }
          } else if (this.dateScope == "yesterday") {
            for (let i = 0; i <= 23; i++) {
              request_list_keys.push(i);
              request_list_values.push(0);
            }
          } else if (this.dateScope == "7days") {
            for (let i = 6; i >= 0; i--) {
              request_list_keys.push(
                moment()
                  .subtract(i, "days")
                  .format("YYYY-MM-DD")
              );
              request_list_values.push(0);
            }
          } else if (this.dateScope == "30days") {
            for (let i = 29; i >= 0; i--) {
              request_list_keys.push(
                moment()
                  .subtract(i, "days")
                  .format("YYYY-MM-DD")
              );
              request_list_values.push(0);
            }
          }
          res.data.request_list.forEach(o => {
            let i = isNaN(o._id) ? o._id : parseInt(o._id);
            request_list_values[request_list_keys.indexOf(i)] = o.count;
          });
          this.chartOptions.request_list = {
            tooltip: {
              trigger: "axis",
              formatter: "[{b}] 累积请求: {c}次"
            },
            xAxis: {
              type: "category",
              data:
                this.dateScope == "today" || this.dateScope == "yesterday"
                  ? request_list_keys.map(
                      v => v + ":00~" + (parseInt(v) + 1) + ":00"
                    )
                  : request_list_keys
            },
            yAxis: {
              type: "value"
            },
            series: [
              {
                data: request_list_values,
                type: "line",
                color: ["#37A2DA", "#6ce697", "#ff9800"]
              }
            ]
          };

          let result_map_data = {
            0: { value: 0, name: "无效请求" },
            1: { value: 0, name: "有效请求" }
          };
          res.data.result_map.forEach(o => {
            result_map_data[o._id] = {
              value: o.count,
              name: o._id == 0 ? "无效请求" : o._id == 1 ? "有效请求" : "其他"
            };
          });
          this.chartOptions.result_map = {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [
              {
                name: "请求数据结果统计",
                type: "pie",
                radius: "55%",
                center: ["50%", "50%"],
                data: Object.values(result_map_data),
                color: ["#f98ba5", "#6ce697", "#ff9800"],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              }
            ]
          };
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  }
};
</script>

<style lang="less">
@import "../../assets/theme_param.less";

.v-statistics-body {
  padding-bottom: 140px;

  .ant-spin-container {
    display: flex;
    flex-wrap: wrap;
  }
}
.v-statistics-item {
  width: 50%;
  padding: 10px 0;
  margin-bottom: 20px;

  &:nth-child(even) {
    padding-left: 15px;
  }

  &:nth-child(odd) {
    padding-right: 15px;
  }

  h3 {
    padding: 0 0 10px 0;
    border-bottom: 1px solid #f0f2f5;

    &::before {
      content: "";
      display: inline-block;
      height: 12px;
      width: 4px;
      background-color: @primary-color;
      margin-right: 4px;
    }
  }
}
.v-statistics-row-item {
  padding: 10px 0 !important;
  width: 100%;
}
.v-statistics-c {
  min-height: 240px;

  .ant-empty {
    padding-top: 40px;
  }

  .ant-table {
    width: 100%;
  }

  .echarts {
    width: 100%;
  }

  .ant-table-small {
    border: none;
  }
}
</style>
