<style lang="scss">
  .v-card__title {
    margin: 0;
    padding: 10px;
    background: #242424;
    box-shadow: 1px 1px 1px #333333;
  }
  .v-card__text{
    padding:.5rem;
    margin: 0;
  }
  .head-card{
    width: 100%;
    .v-card--material-chart{
      margin: 0;
    }
    div{
      text-align: center;
      width: 100%;
    }
  }
  .swiper-container {
    height: 80px;
    .swiper-slide, .swiper-slide img {
      vertical-align: middle;
      height: 100%;
      text-align: center;
    }
  }
</style>
<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <core-store-list @changeStore="setStoreId"></core-store-list>
    <core-loading :show="loading" />
    <v-layout wrap>
      <v-flex md3>
        <v-card class="head-card">
          <v-card-title primary-title color="green">
            <div>总到店数</div>
          </v-card-title>
          <v-card-text>
            <div class="headline text-success">
              {{numberObj.num.histroy_all+numberObj.num.all_person}}
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex md3>
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
      <v-flex md3>
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
      <v-flex md3>
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
      <v-flex md12>
        <v-card>
          <v-card-title>今日最新到店</v-card-title>
        <!-- swiper -->
          <v-card-text>
        <swiper :options="swiperOption">
          <swiper-slide v-for="item in swiperData" :key="item.id">
           <img :src="baseURL+item.faceId+'.jpg'"  v-on:error.once="moveErrorImg($event)"  class="img" v-cloak/>
          </swiper-slide>
        </swiper>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12
              md6>
        <v-card class="v-card--material-chart">
          <v-card-title>最近30天性别统计</v-card-title>
          <v-card-text>
            <div ref="myChartPie" class="echarts sm"></div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12
              md6>
        <v-card class="v-card--material-chart">
          <v-card-title>最近30天年龄统计</v-card-title>
          <v-card-text>
            <div ref="myChartBar" class="echarts sm"></div>
          </v-card-text>
        </v-card>

      </v-flex>
      <v-flex md12>
        <v-card class="v-card--material-chart">
          <v-card-title>最近30天客流统计</v-card-title>
          <v-card-text>
            <div ref="myChartLine" class="echarts lg"></div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar
            color="error"
            top
            v-model="snackbar"
            dark
    >
      <v-icon
              color="white"
              class="mr-3"
      >
        mdi-bell-plus
      </v-icon>
      <div>网络错误，请稍后再试！</div>
      <v-icon
              size="16"
              @click="snackbar = false"
      >
        mdi-close-circle
      </v-icon>
    </v-snackbar>
  </v-container>
</template>
<script>
import * as _utilService from "../utils";
import $http from  '../plugins/axios'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
    data() {
        return {
            resTimer:null,
            snackbar:false,
            swiperData:[],
            swiperOption: {
                grabCursor: true,
                loop: true,
                slidesPerView: 12,
                spaceBetween: 0,
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: false
                },
                breakpoints: {
                    1024: {
                        slidesPerView: 8,
                        spaceBetween: 20
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 10
                    }
                }
            },
            pagination: {size: 5, page: 1},
            loading: true,
            day30Data: [],
            numberObj: {num:{all_person: 0, new_person: 0},gender:{male:0,fmale:0}}
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    computed: {
        baseURL(){
           return $http.defaults.staticURL+'/images/'+this.storeId+'/'
        },
        color() {
            return this.$store.state.app.color
        }
    },
    methods: {
        moveErrorImg(event) {
            event.target.src = "../../img/noimg.png";
        },
        setStoreId(id){
            if(id) {
                this.storeId = id;
            }
            this.loading=true;
            this.getPageDatas().then(()=>{
                this.loading=false;
            });
        },
        setChartLineData(data) {

            let xData=[],seriesData=[];
            data.map(items=>{
                xData.push(_utilService.dateFormat(items.dateTime,0))
                seriesData.push(items.number)
            })

            return {
                title: {
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
                    top:'0',
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
                  top:'0',
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
            },{
                path: '/auth/select_today', callback: (res) => {
                    this.swiperData= res;
                    console.log(res)
                }
            },{
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
            }
            ];
            return new Promise((r,s)=> {
                let n=1;
                req_ary.map(items => {
                    $http.get(items.path, {
                        params: {
                            storeId:this.storeId,
                            startTime:_utilService.day30Before(),
                            endTime: _utilService.dateFormat(new Date())
                        }
                    }).then(res => {
                        n++;
                        if (res.code !== 0) {
                            this.snackbar=true;
                            return
                        }
                        items.callback(res.data);
                        if(n===req_ary.length){
                            r(res)
                        }
                    }).catch(()=>{
                        this.snackbar=false;
                        s()
                    });
                })
            })
        }
    }
}
</script>
