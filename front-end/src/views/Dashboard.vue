<style lang="scss">
  .head-card{
    width: 100%;
    .v-card--material-chart{
      margin: 0;
    }
    div{
      text-align: center;
      width: 100%;
    }
    .v-card__text,.v-card__title{
      margin: 0;
      padding:1rem 0 0 0;
    }
    .v-card__text{
      padding-bottom: 1rem;
    }
  }
</style>
<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-layout wrap>
      <material-notification
              class="mb-3"
              color="error"
              v-show="errorShow"
              dismissible
      >
        <strong>错误</strong> - This is a regular notification made with `color="error"`
      </material-notification>
      <v-flex md4>
        <v-card class="head-card">
          <v-card-title primary-title color="green">
            <div>今日到店数</div>
          </v-card-title>
          <v-card-text>
            <div class="headline text-success">
             {{numberObj.num.all_person}}
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex md4>
        <v-card class="head-card">
          <v-card-title primary-title>
            <div>今日新增数</div>
          </v-card-title>
          <v-card-text>
            <div class="headline text-info">
              {{numberObj.num.new_person}}
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex md4>
        <v-card class="head-card">
          <v-card-title primary-title>
            <div>今日老顾客</div>
          </v-card-title>
          <v-card-text>
            <div class="headline text-warning">
              {{numberObj.num.all_person-numberObj.num.new_person}}
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12
              md6>
        <v-card class="v-card--material-chart">
          <v-card-text>
            <div ref="myChartPie" class="echarts sm"></div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12
              md6>
        <v-card class="v-card--material-chart">
          <v-card-text>
            <div ref="myChartBar" class="echarts sm"></div>
          </v-card-text>
        </v-card>

      </v-flex>
      <v-flex md12>
        <v-card class="v-card--material-chart">
          <v-card-text>
            <div ref="myChartLine" class="echarts lg"></div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import * as _utilService from "../utils";
import $http from  '../plugins/axios'
export default {
    data() {
        return {
            errorShow:false,
            pagination: {size: 5, page: 1, storeId: 1},
            baseURL: $http.defaults.staticURL,
            loading: false,
            day30Data: [],
            numberObj: {num:{all_person: 0, new_person: 0},gender:{male:0,fmale:0}}
        }
    },
    computed: {
        color() {
            return this.$store.state.app.color
        }
    },
   async mounted() {
        await this.getPageDatas();
    },
    methods: {
        setChartLineData(data) {
            console.log(data);
            let xData=[],seriesData=[];
            data.map(items=>{
                xData.push(_utilService.dateFormat(items.dateTime,'/'))
                seriesData.push(items.number)
            })

            return {
                title: {
                    text: '最近30天客流统计',
                    textStyle: {
                        color: '#ccc'
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "日期：{b} <br/> 人数：{c}"
                },
                legend: {
                    textStyle: {
                        color: '#999'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#999'
                        },
                        formatter(val) {
                            return val >= 1000 ? (val / 1000).toFixed(1) + "k" : val;
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#666',
                            width: 1,
                            type: 'dotted'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#666',
                            width: 1
                        }
                    }
                },
                xAxis: {
                    type: 'category',
                    data: xData,
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#999'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#666',
                            width: 1
                        }
                    },
                    boundaryGap: false
                },
                series: [
                    {
                        type: 'line',
                        showSymbol: true,
                        symbol: 'circle',     //设定为实心点
                        symbolSize: _utilService.getDeviceRealPixel(10),
                        itemStyle: {
                            normal: {
                                color: this.$vuetify.theme['success'],  // 会设置点和线的颜色，所以需要下面定制 line
                                borderColor: "#ccc"  // 点边线的颜色
                            }
                        },
                        lineStyle: {
                            color: this.$vuetify.theme['success'],
                            width: 1
                        },
                        data:seriesData
                    }]
            }
        },
        setPieData(female,male){
          return {
              title: {
                  text: '最近30天性别统计',
                  textStyle: {
                      color: '#ccc'
                  }
              },
              tooltip: {
                  trigger: 'item',
                  formatter: "{b}性 : 共计{c}人 <br/> 占比:{d}%"
              },
              legend: {
                  orient: 'vertical',
                  left: 'right',
                  data: ['男', '女'],
                  textStyle: {
                      color: '#999'
                  }
              },
              series: [
                  {
                      type: 'pie',
                      radius: '80%',
                      center: ['50%', '50%'],
                      data: [
                          {
                              value: female, name: '女',
                              itemStyle: {
                                  color: '#9c27b0'
                              }
                          },
                          {
                              value: male, name: '男',
                              itemStyle: {
                                  color: this.$vuetify.theme['info']
                              }
                          }
                      ]
                  }
              ]
          }
        },
        setBarData(data){
            let xData=[],seriesData=[];
            data.map(items=>{
                xData.push(items.name)
                seriesData.push(items.value)
            })
          return {
              title: {
                  text: '最近30天年龄统计',
                  textStyle: {
                      color: '#ccc'
                  }
              },
              color: [this.$vuetify.theme['info']],
              tooltip : {
                  trigger: 'axis',
                  axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                      type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                  }
              },
              grid: {
                  top:'25%',
                  left: '1%',
                  right: '1%',
                  bottom: '0',
                  containLabel: true
              },
              xAxis : [
                  {
                      type : 'category',
                      data :xData,
                      axisLabel: {
                          show: true,
                          textStyle: {
                              color: '#999'
                          }
                      },
                      axisLine: {
                          show: false,
                          lineStyle: {
                              color: '#999',
                              width: 1,//这里是为了突出显示加上的
                          }
                      }
                  }
              ],
              yAxis : [
                  {
                      type : 'value',
                      splitLine: {
                          show: true,
                          lineStyle: {
                              color: '#666',
                              width: 1
                          }
                      },
                      axisLabel:{
                          formatter: function(val) {
                               return val >= 1000 ? (val / 1000).toFixed(1) + "k" : val;
                          }
                      },
                      axisLine: {
                          lineStyle: {
                              color: '#999',
                              width: 1
                          }
                      }
                  }
              ],
              series : [
                  {
                      type:'bar',
                      barWidth: '60%',
                      data:seriesData
                  }
              ]
          }
        },
        getPageDatas() {
            const req_ary = [{
                path: '/auth/select_num', callback: (res) => {
                    this.numberObj= res;
                    let myChartPie = this.$echarts.init(this.$refs['myChartPie']);
                    const {female,male} =this.numberObj.gender;
                    myChartPie.setOption(this.setPieData(female,male))
                }
            }, {
                path: '/auth/store_histroy', callback: (res) => {
                    let myChartLine = this.$echarts.init(this.$refs['myChartLine'])
                    // 绘制折线图表
                    myChartLine.setOption(this.setChartLineData(res))
                }
            },{
                path:'/auth/histroy_age',callback: (res) => {
                    let myChartBar = this.$echarts.init(this.$refs['myChartBar']);
                    myChartBar.setOption(this.setBarData(res))
                }
            }];
            return new Promise(r => {
                let n=1;
                req_ary.map(items => {
                    $http.get(items.path, {
                        params: {
                            storeId: 1,
                            startTime:_utilService.day30Before(),
                            endTime: _utilService.dateFormat(new Date()),
                        }
                    }).then(res => {
                        n++;
                        if (res.code !== 0) {
                            return
                        }
                        items.callback(res.data);
                        if(n===req_ary.length){
                            r(res)
                        }
                    }).catch((e)=>{
                        this.errorShow=true;
                    });
                })
            })
        }
    }
}
</script>
