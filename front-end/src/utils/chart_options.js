import { mapMutations,   mapState } from 'vuex'
export default {
    getChartOptions() {
        return {
            title: {
                text: '极坐标双数值轴',
                textStyle: {
                    color: '#ccc'
                }
            },
            tooltip: {},
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
                        color: '#ccc'
                    },
                    formatter(val) {
                        return val >= 1000 ? (val / 1000).toFixed(1) + "k" : val;
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#0087ED',
                        width: 1,//这里是为了突出显示加上的
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#ccc'],
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            xAxis: {
                type: 'category',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#ccc'
                    }
                },
                lineStyle: {
                    color: ['#ccc'],
                    width: 1,
                    type: 'solid'
                },
                boundaryGap: false,
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            series: [
                {
                    type: 'line',
                    lineStyle: {
                        color: '#ccc'
                    },
                    data: [0, 120, 132, 101, 134, 90, 230, 210]
                }]
        }
    }
}
