<template>
    <div  style="background: #f8f8f8">
        <div class="search-select">
            <div class="select-date clear-float" @click="openPicker($event, 'dates','date')" >
                <input type="text" placeholder="选择" :value="searchDatas.date" readonly="readonly" />
                <i class="f7-icons">chevron_down</i>
            </div>
            <div  class="select-department clear-float" @click="departmentpickerShow=true"  >
                <input type="text" placeholder="选择部门" :value="searchDatas.department&&departmentName(searchDatas.department)" readonly="readonly"/>
                <i class="f7-icons">chevron_down</i>
            </div>
            <div class="select-item clear-float"  @click="openPicker($event, 'items','item')" >
                <input type="text" placeholder="选择" :value="searchDatas.item" readonly="readonly"/>
                <i class="f7-icons">chevron_down</i>
            </div>
        </div>

        <div class="chart" v-show="statisticsData && Object.keys(statisticsData).length > 0" style="height: 300px !important;">
            <v-chart :options="polar" :auto-resize="false" ref="line"/>
        </div>
        <div class="item-list">
            <ul>
                <li v-for="(obj,key,index) in statisticsData" :key="index">
                    <span>{{key}}：<div class="color-box" :style="{'background-color':obj.color}" ></div></span>
                    <span class="item-value">{{obj.sum}} {{obj.unit || ''}}</span>
                </li>
            </ul>
        </div>
        <div v-if="!statisticsData || Object.keys(statisticsData).length == 0" class="no_template">
            <img :src="zero_employee_icon" width="71px" height="84px">
            <p>暂无数据</p>
        </div>
        <f7-popup  :opened="departmentpickerShow" @popup:closed="(departmentpickerShow = false)">
            <departmentpicker
                    :multiple="false"
                    :parentDepartmentId="parentDepartmentId"
                    :showParentDepartment="true"
                    @department:cancel="departmentpickerShow = false"
                    @department:selected="onSelectorDepartment"
            ></departmentpicker>
        </f7-popup>

    </div>
</template>
<style scoped>
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
    height: 300px;
    width: 100%;
    background: #FFFFFF;

}
.no_template{
    text-align: center;
    margin: 120px 0px auto;
}
.no_template p{
    font-size: 14px;
    color: #333333;
    margin: 5px 0;
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
    width: 70%
}
.search-select{
    margin-top: 10px;
    height: 40px;
    background: white;
    border-bottom: 1px solid #d8d8d8;
    border-top: 1px solid #d8d8d8;
}
.select-date{
    float: left;
    height: 100%;
    width: 33%;
    border-right: 1px solid #d8d8d8;
}
.select-item{
    float: right;
    width: 33%;
    height: 100%;

    }
.select-department{
    float: left;
    width: 33%;
    height: 100%;

}

</style>
<script>
    import {mapGetters,mapMutations,mapActions} from 'vuex';
    import departmentpicker from 'gadget/departmentpicker.vue';
    import ECharts from 'lib/chart/ECharts.vue';
    import 'echarts/lib/chart/line';
    import 'echarts/lib/component/polar';

    import axios from 'axios';
    export default {
        name: 'departmentstatistics',
        components:{
            'v-chart': ECharts,
            departmentpicker
        },
        props: {
            title: {
                type: String,
                default: '数据查看'
            },
        },

        data: () => {
            return {
                height:200,
                zero_employee_icon: require('assets/images/ill_no_data@2x.png'),
                departmentpickerShow:false,
                parentDepartmentId:'',
                selectDatas:{
                    dates:["最近一周","最近两周","最近一个月","最近两个月","最近三个月","最近半年"],
                    items:["今日消费额","今日用户数"],
                    departments:[],
                    departmentsDisplay:[]
                },
                searchDatas:{
                    date:'最近一周',
                    item:'',
                    department:'',
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
                'superAdmin',
                'myCompany',
                'myProfile',
                'statisticsDataCache',
                'departments',
                'isDepartmentAdmin',
                'userDepartment',
                'departmentName'
            ]),
            IamDepartmentAdmin(){
                if (this.myProfile._id){
                    return this.isDepartmentAdmin(this.myProfile._id)
                }
            },
            IamSuperAdmin(){
                if (this.myProfile._id && this.superAdmin ){
                    return this.superAdmin._id == this.myProfile._id
                }
            }
        },

        mounted: function() {

        },
        created(){
            if (!this.IamSuperAdmin && this.IamDepartmentAdmin) {
                this.parentDepartmentId =  this.userDepartment(this.myProfile._id).departmentId;
            }
           // this.getStatisticsData();
        },
        watch:{
            'searchDatas.item':function (val) {
              this.refreshEchart()
            },
            'searchDatas.date':function (val) {
               this.getStatisticsData();
            },
            'searchDatas.department':function (val) {
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
                var self = this;
                if (this.IamSuperAdmin){
                    if (self.selectDatas.departments.length == 0){
                        self.selectDatas.departments = [];
                        self.selectDatas.departmentsDisplay = [];
                        self.departments.forEach(function (val,index) {
                            self.selectDatas.departments.push(val.departmentId);
                            self.selectDatas.departmentsDisplay.push(val.name);

                        })
                    }
                    if (self.selectDatas.departments.length > 0){
                        this.searchDatas.department = self.selectDatas.departments[0];
                    }
                }
                if (this.IamDepartmentAdmin && this.myProfile){
                    this.searchDatas.department =  this.userDepartment(this.myProfile._id).departmentId;
                }

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
                    // debugger
                    var val = self.searchDatas.item;
                    if (!self.statisticsData[val]) {
                        self.selectDatas.items = Object.keys(this.statisticsData);
                        self.searchDatas.item = self.selectDatas.items[0];
                        val = self.searchDatas.item;
                    }
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
                    dateName:self.searchDatas.date,
                    department: self.searchDatas.department
                };
                let _setData = function (statisticsData) {
                    if (statisticsData){
                        self.statisticsData = statisticsData;
                        self.$nextTick(function () {
                            self.selectDatas.items = Object.keys(statisticsData);
                            if (!self.searchDatas.item){
                                self.searchDatas.item = self.selectDatas.items[0];
                            }else {
                                self.refreshEchart()
                            }
                            self.$refs.line.resize();
                        })
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
            openPicker(ev,itemname,name) {
                if(!this.selectDatas[itemname].length){
                    this.toast("暂无相关数据!")
                    return
                }

                let input = ev.target;
                if (input.picker){
                    input.picker.open();
                    return;
                }
                let self = this;
                let values = self.selectDatas[itemname];
                let displayValues = self.selectDatas[itemname];
                input.picker = this.$f7.picker.create({
                    inputEl: '#' + name,
                    toolbarCloseText: '完成',
                    rotateEffect: true,
                    cols: [
                        {
                            textAlign: 'center',
                            displayValues:displayValues,
                            values: values
                        }],
                    on: {
                        close:function (picker) {
                            if (self.searchDatas[name] != picker.value){
                                self.searchDatas[name]=picker.value
                            }
                        }
                    }
                });
                input.picker.open();
            },
            onSelectorDepartment(uIds) {
                if (uIds && uIds[0]) {
                    this.searchDatas.department = uIds[0];
                } else {
                    this.searchDatas.department = null;
                }
                this.departmentpickerShow = false;
                this.$forceUpdate();
            },
            toast(message) {
                if (message) {
                    let r = this.$f7.toast.create({
                        text: message,
                        position: 'center',
                        closeTimeout: 3000,
                    });
                    r.open();
                }
            }, // reminder
        }
    }
</script>

