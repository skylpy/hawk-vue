<template>
    <f7-page  style="background: #f8f8f8">
        <f7-navbar :title="title">
        </f7-navbar>
        <div class="search-select">
            <div class="select-date clear-float" @click="openPicker($event, searchDatas,'date')" >
                <input type="text" placeholder="选择" :value="searchDatas.date" readonly="readonly" />
                <i class="f7-icons">chevron_down</i>
            </div>
            <div class="select-item clear-float"  @click="openPicker($event, searchDatas,'item')" >
                <input type="text" placeholder="选择" :value="searchDatas.item" readonly="readonly"/>
                <i class="f7-icons">chevron_down</i>
            </div>
        </div>

        <div class="chart" v-show="statisticsData && Object.keys(statisticsData).length > 0">
            <v-chart :options="polar" :auto-resize="true" ref="line"/>
        </div>
        <div v-if="!statisticsData || Object.keys(statisticsData).length == 0" class="no_template">
            <img :src="zero_employee_icon" width="71px" height="84px">
            <p>暂无数据</p>
        </div>
        <div class="item-list">
            <ul>
                <li v-for="(obj,key,index) in statisticsData" :key="index">
                    <span>{{key}}：<div class="color-box" :style="{'background-color':obj.color}" ></div></span>
                    <span class="item-value">{{obj.sum}} 元</span>
                </li>
            </ul>
        </div>
    </f7-page>
</template>
<style scoped>
.no_template{
    text-align: center;
    margin: 120px 0px auto;
}
.no_template p{
    font-size: 14px;
    color: #333333;
    margin: 5px 0;
}
.color-box{
    width: 12px;
    height: 12px;
    background-color: #4B946A;
    display: inline-block;
}
.echarts {
    width: 100%;
    height: 100%;
}
.chart{
    height: 30%;
    width: 100%;
    background: #FFFFFF;

}
    .hint{
        margin-top: 10px;
        height: 60px;
        width: 100%;
        background: #FFFFFF;
        text-align: center;
        line-height: 60px;

    }
.item-list .clear-float {
        clear:both;
        height: 0;
        line-height: 0;
        font-size: 0;
    }
.item-list{
    margin-top: 10px;
    width: 100%;
    background: #FFFFFF;
}
.item-list ul{
    margin: 0;
    padding: 0;
}
.item-list li{
    padding: 0 20px;
    list-style: none;
    line-height: 50px;
    font-size: 16px;
    height: 50px;
    border-bottom: 1px solid #d8d8d8;
}
.item-value{
    float: right;
}
.f7-icons{
    float: right;
    margin-right: 10px;
    display:inline-block;
    font-size: 1em;
    line-height: 40px;
    color: #CCCCCC;
}
.search-select input{
    display:inline-block;
    padding: 0;
    margin: 0;
    text-align: center;
    line-height: 40px;
    width: 80%
}
.search-select{
    height: 40px;
    background: white;
    border-bottom: 1px solid #d8d8d8;
}
.select-date{
    float: left;
    height: 100%;
    width: 35%;
    border-right: 1px solid #d8d8d8;
}
.select-item{
    float: right;
    width: 60%;
    height: 100%;

    }

</style>
<script>
    import {mapGetters,mapMutations,mapActions} from 'vuex';
    import ECharts from 'lib/chart/ECharts.vue';
    import 'echarts/lib/chart/line';
    import 'echarts/lib/component/polar';

    import axios from 'axios';
    export default {
        name: 'selfstatistics',
        components:{
            'v-chart': ECharts
        },
        props: {
            lastPage: {
                type: String,
                default: '上一页'
            },
            title: {
                type: String,
                default: '数据统计'
            },
        },

        data: () => {
            return {
                height:200,
                zero_employee_icon: require('assets/images/ill_no_data@2x.png'),
                selectDatas:{
                  date:["最近一周","最近两周","最近一个月","最近两个月","最近三个月","最近半年"],
                  item:["今日消费额","今日用户数"],
                },
                searchDatas:{
                    date:'最近一周',
                    item:'',
                },
                statisticsData:null,
                polar:{
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: '8%',
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name:'邮件营销',
                            type:'line',
                            stack: '总量',
                        }
                    ]
                }

            }
        },

        computed: {
            ...mapGetters([
                'myCompany',
                'myProfile',
                'statisticsDataCache',
                'departmentName'
            ])
        },

        mounted: function() {

        },
        created(){
           // this.getStatisticsData();
        },
        watch:{
            'searchDatas.item':function (val) {
              this.refreshEchart()
            },
            'searchDatas.date':function (val) {
               this.getStatisticsData();
            },
        },
        methods: {
            ...mapMutations({
                'set_statistics_data':'SET_STATISTICS_DATA',
                preloaderHide: 'PRELOADER_HIDE',
                preloaderShow: 'PRELOADER_SHOW'
            }),
            resize(){
                this.$refs.line.resize();
            },
            refreshEchart(){
                var self = this;
                if (!this.statisticsData || Object.keys(this.statisticsData).length ==0){
                    var val = self.searchDatas.item;
                    self.polar.xAxis.data = [];
                    self.polar.series[0].data = [];
                    self.polar.series[0].name = val;
                    self.polar.color = [];
                    self.statisticsData = null;
                    return;
                }
                if (this.statisticsData&&self.searchDatas.item){
                    var val = self.searchDatas.item;
                    self.polar.xAxis.data = self.statisticsData[val].dates;
                    self.polar.series[0].data = self.statisticsData[val].datas;
                    self.polar.series[0].name = val;
                    self.polar.color = [self.statisticsData[val].color]
                }


            },
            getStatisticsData(){
                let self = this;
                this.preloaderShow(this);
                let filter = {
                    user:this.myProfile._id,dateName:self.searchDatas.date
                }
                let _setData = function (statisticsData) {
                    if (statisticsData){
                        self.statisticsData = statisticsData;
                        self.selectDatas.item = Object.keys(statisticsData);
                        if (!self.searchDatas.item){
                            self.searchDatas.item = self.selectDatas.item[0];
                        }else {
                            self.refreshEchart()
                        }
                        self.$nextTick(function () {
                                self.resize()
                            }
                        );
                    }
                }
                if (!this.statisticsDataCache(filter)){
                    let key = encodeURI(JSON.stringify(filter));
                    axios.get('api/reportdata/statistics?q='+ JSON.stringify(filter)).then(resp => {
                        var data = resp.data;
                        self.set_statistics_data({key,data});
                        _setData(data)
                        this.preloaderHide(this);
                    });
                }else {
                    _setData(this.statisticsDataCache(filter));
                    this.preloaderHide(this);
                }
            },
            openPicker(ev, when,name) {
                let input = ev.target;
                if (input.picker) {
                    input.picker.open();
                    return;
                }
                let self = this;
                input.picker = this.$f7.picker.create({
                    inputEl: '#' + name,
                    toolbarCloseText: '完成',
                    rotateEffect: true,
                    cols: [
                        {
                            textAlign: 'center',
                            values: self.selectDatas[name]
                        }],
                    on: {
                        close:function (picker) {
                            self.searchDatas[name]=picker.value
                        }
                    }
                });
                input.picker.open();
            },
        }
    }
</script>

