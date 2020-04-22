<template>
    <f7-page no-toolbar style="background: #f8f8f8">
        <f7-navbar title = "拜访详情" back-link>
            <f7-nav-right>

            </f7-nav-right>
        </f7-navbar>

        <div class="wrapper">

            <div v-if="visit.type == '电话'" class="warning">
                <f7-icon class="icon" f7="info_round"></f7-icon>
                拜访需点击电话拜访按钮进行通话{{myCompany.visitset.phoneMinute}}分钟以上，然后填写完拜访结果才算完成拜访
            </div>
            <div v-if="visit.type == '走访'" class="warning">
                <f7-icon class="icon" f7="info_round"></f7-icon>
                走访到达目的地需点击打卡按钮进行记录，拜访后在拜访结果上传图片以及拜访总结不得少于{{myCompany.visitset.summaryCount}}字，才算完成拜访
            </div>
            <div class="menu">
                <div class="menu-item" @click="tab = 'detail'" v-bind:class="{active:tab == 'detail'}">拜访详情</div>
                <div class="menu-item" @click="tab = 'result'" v-bind:class="{active:tab == 'result'}">拜访结果</div>
            </div>

            <div v-show="tab=='detail'" class="visit-content">

                <div class="list-item  list-type">
                    <label>拜访客户：</label>
                    <div>
                        <span style="font-size: 12px">{{visit.clientName}}</span>
                    </div>
                </div>

                <div class="list-item  list-type">
                    <label>客户联系人：</label>
                    <div>
                        <span style="font-size: 12px">{{visit.contactName + " &nbsp;&nbsp; " + visit.contactPhone}}</span>
                    </div>
                </div>

                <div class="list-item  list-type">
                    <label>客户类型：</label>
                    <div>
                        <span style="font-size: 12px">{{visit.visitType}}</span>
                    </div>
                </div>

                <div class="list-item  list-type">
                    <label>拜访方式：</label>
                    <div>
                        <span style="font-size: 12px">{{visit.type}}</span>
                    </div>
                </div>

                <div class="list-item  list-type">
                    <label>截止时间：</label>
                    <div>
                        <span style="font-size: 12px">{{new Date(visit.deadline).toMinutesString()}}</span>
                    </div>
                </div>

                <div class="list-item  list-type">
                    <label>拜访人：</label>
                    <div>
                        <span style="font-size: 12px" v-for="(item,index) in visit.executor">{{who(item).name+(index == visit.executor.length-1?'':',')}}</span>
                    </div>
                </div>

                <div class="list-item-eare">
                    <label>拜访内容：</label>
                    <div>{{visit.content}}</div>
                </div>

                <div class="list-item-photo ">
                    <label>照片：</label>

                    <div class="imgDiv" v-if="imgSrc.length == 0" style="position: relative; width: 60px; height: 60px;  bottom: -10px; left: 0;">
                        <span style="position: absolute; bottom: 5px; left: 0;">暂无图片上传</span>
                    </div>
                    <div class="imgDiv" v-for="item in imgSrc">
                        <img :src=item width="60px" height="60px">
                    </div>

                </div>

                <div class="canceled" v-if="visit.status == '未完成'&&visit.creator == myUserId" @click="cancel">取消拜访</div>

            </div>

            <div v-show="tab=='result'" class="visit-content">

                <!--<div v-if="visitnew.visitNumber > 0">-->

                   <!---->
                <!--</div>-->
                <!--已完成-->
                <div v-if="visitnew.status == '已完成' ||visitnew.resultStatus == '1'||statue == 1">
                    <div class="list-item  list-type">
                        <label>拜访时间：</label>
                        <div>
                            <span style="font-size: 12px">{{new Date(visitnew.finishedAt==null?visitnew.createdAt:visitnew.finishedAt).toHawkDateString()}}</span>

                        </div>
                    </div>

                    <div class="list-item  list-type" v-if="visitnew.type == '走访'" style="overflow: hidden;">
                        <label>拜访位置：</label>
                        <div style="line-height: 20px; padding: 12px 0px;">
                            <!--深圳市南山区科新科学园A栋-->
                            <!--{{myPosition? myPosition.address : "定位中..."}}-->
                            <span style="font-size: 12px">{{visit.location == null ? "": visit.location.address}}</span>
                            <span v-if="(visit.location  && clientAddress && visit.location.address !== clientAddress) ||
                                        (clientAddress && result.location.address && result.location.address !== clientAddress)"
                                  style="color: red; display: block; font-size: 12px;">拜访打卡位置与客户位置不符</span>
                        </div>
                    </div>

                    <div class="list-item-photo " >
                        <label>拜访相片：</label>

                        <div class="imgDiv" v-if="visitphoto.length == 0"  style="position: relative; width: 60px; height: 60px;  bottom: -10px; left: 0;">
                            <span style="position: absolute; bottom: 5px; left: 0;">暂无图片上传</span>
                        </div>
                        <div class="imgDiv" v-for="item in visitphoto">
                            <img :src=item width="60px" height="60px">
                        </div>
                    </div>

                    <div class="list-item-eare ">
                        <label>拜访总结：</label>
                        <div>{{visitnew.visitsummary}}</div>
                    </div>
                </div>

                <!--未完成-->

                <div v-if="visitnew.status == '未完成'&&visitnew.resultStatus == '0'&&statue == 0">

                    <div class="list-item  list-type1">
                        <label>拜访时间：</label>
                        <div>
                            <span style="font-size: 12px"></span>
                            <date-picker v-model="result.finishedAt"
                                         :not-before = "new Date()"
                                         type="datetime"
                                         :editable="false"
                                         class="date-picker"
                                         width="150px"
                                         :confirm="true"
                                         :confirm-text="'确定'"
                                         placeholder="   请选择拜访时间"
                                         format="YYYY-MM-DD HH:mm"
                                         :minute-step="1"
                                         :first-day-of-week="1">
                            </date-picker>
                        </div>
                    </div>

                    <div class="list-item  list-type" v-if="visitnew.type == '走访'" style="overflow: hidden;">
                        <label>拜访位置：</label>
                        <div style="line-height: 20px;  padding: 12px 0px;">
                            <!--深圳市南山区科新科学园A栋-->
                            <!--{{myPosition? myPosition.address : "定位中..."}}-->
                            <span style="font-size: 12px">{{myPosition? myPosition.address : "定位中..."}}</span>
                            <span v-if="(visit.location  && clientAddress && visit.location.address !== clientAddress) ||
                                        (clientAddress && result.location.address && result.location.address !== clientAddress)"
                                  style="color: red; display: block; font-size: 12px;">拜访打卡位置与客户位置不符</span>
                        </div>
                    </div>

                    <div class="list-item-photoing " >
                        <label>拜访相片(至少{{myCompany.visitset.photoCount}}张)：</label>
                        <!--(至少{{myCompany.visitset.photoCount}}张)-->
                        <photoeditor
                                slot="inner"
                                :gallery="true"
                                :photo="photo"
                                @photo:update="(p) => {photo = p}"
                        ></photoeditor>
                    </div>

                    <div class="list-item-eare textarea-item">
                        <label>拜访总结(至少{{myCompany.visitset.summaryCount}})字：</label>
                        <textarea  placeholder="请输入拜访总结"
                                   :value="result.visitsummary"
                                   @input="result.visitsummary = $event.target.value"
                        >
                            </textarea>
                    </div>

                    <div class="buttom-button" :class="{a:invalid}" @click="endsave">保存</div>
                </div>
                <div v-if="visitnew.status == '已失访'" class="no_template">
                    <img :src="zero_employee_icon" width="71px" height="84px">
                    <p>您已经失访，请重新开始申请拜访任务</p>
                </div>

            </div>

        </div>
        <!--&&visit.executor[0] == myUserId-->
        <footer @click="start"
                class="footer"
                v-if="visitnew.executor == myUserId && !isOvertime(visitnew.deadline)"
                v-show="tab == 'detail' && visit.status == '未完成'">
            {{visit.type == '电话' ? '电话拜访':'拜访打卡'}}
        </footer>
    </f7-page>
</template>

<script>

    import {mapGetters,mapMutations,mapActions} from 'vuex';
    import {addMarker} from 'lib/amap';
    import {upload, getSignUrl} from 'lib/aliyun';
    import DatePicker from 'vue2-datepicker'
    import photoeditor from 'gadget/photoeditor.vue';
    import axios from 'axios';
    import callLog from 'lib/callLog'
    import moment from 'moment'

    const arrow_right_gray = require("assets/images/arrow_right_gray@2x.png");

    export default {
        name: "visitdateil",

        components: {
            photoeditor,
            DatePicker
        },
        //监听值改变
        computed: {

            ...mapGetters([

                'who',
                'IamAdmin',
                'IamManager',
                'myCompany',
                'myProfile',
                'departmentName',
                'userDepartment',
                'position',
                'myUserId'
            ]),

            invalid() {
                return this.result.visitsummary != ""
                    &&this.result.finishedAt != null;
            },

            myPosition() {
                if (this.position.longitude) {
                    console.log('updating position from sdk');
                    this.result.location.lat = this.position.latitude;
                    this.result.location.lng = this.position.longitude;
                    this.result.location.address = this.position.address;
                    return {
                        lng: this.position.longitude,
                        lat: this.position.latitude,
                        address: this.position.address,
                        at: this.position.date
                    }
                } else if (this.amap.browserLocation.position) {
                    console.log('updating position from browser');
                    this.result.location.lat = this.amap.browserLocation.position.lat;
                    this.result.location.lng = this.amap.browserLocation.position.lng;
                    this.result.location.address = this.amap.browserLocation.formattedAddress;
                    return {
                        lng: this.amap.browserLocation.position.lng,
                        lat: this.amap.browserLocation.position.lat,
                        address: this.amap.browserLocation.formattedAddress,
                        at: (new Date()).toHawkString()
                    }
                }
                return null;
            }
        },
        watch: {
            myPosition: function (value, oldValue) {
                this.showPosition();
            },
        },

        data: () => {

            return {
                amap: {
                    instance: null,
                    style: {
                        width: '100%',
                        height: '100px'
                    },
                    browserLocation: {},
                    denotations: {}
                },
                tab: "detail",
                arrow_right_gray:arrow_right_gray,

                visitnew:{},
                imgSrc: [],
                visitphoto:[],
                photo:[],
                zero_employee_icon: require('assets/images/ill_no_data@2x.png'),

                result:{
                    visitsummary:"",
                    finishedAt:null,

                    visitNumber:0,
                    duration:0,
                    location:{
                        lng: Number,
                        lat: Number,
                        address: ""
                    }
                },
                clientAddress: ''
            }
        },

        mounted(){
            this.watchImage();
            this.visitnew = this.visit;
            if (this.visit.type == '电话') { this.getCall(); }
        },
        created () {
            axios.get('api/client/' + this.visit.client).then((res) => {
                console.log(res.data.location)
                if (res.data && res.data.location) this.clientAddress = res.data.location.address
            }).catch(error => {
                console.error(error);
                $alert('无法获取客户详细信息，请稍后再试', '操作错误');
            })
        },

        methods: {

             getCall(cb){

                 if (device.platform != "Android" || !this.myCompany.visitset.phoneMinute) {
                     if (cb) cb()
                     return
                 }
                 console.log("安卓手机检测通话时长start")
                // 安卓手机检测通话时长
                if(device.platform == "Android" && this.visit.type == '电话'){
                    let filter = {
                        startTime: new Date(this.visit.createdAt),
                        endTime: new Date(this.visit.deadline),
                        phone: this.visit.contactPhone
                    }
                    console.log(this.visit)
                    console.log(this.visit.createdAt,new Date(this.visit.createdAt))
                    console.log(this.visit.deadline,new Date(this.visit.deadline))
                    console.log(filter)
                    let duration = 0

                    callLog.getCallLog(filter,(call_list) => {
                        console.log("call_list",call_list)
                        if(!call_list.length){ //call_list.length 就是通话次数
                            let title = '你与客户的没有通话记录，不能完成拜访';
                            console.log(title)
                            $alert(title, '操作提醒');
                            return;
                        }
                        call_list.forEach(function (item) {
                            duration += item.duration
                        })
                        console.log("duration",duration)
                        this.result.duration = duration;
                        console.log("this.result.duration",this.result.duration)
                        if (cb) cb()
                    })

                } else {
                    $alert('无法获取通话时长');
                }
                console.log("安卓手机检测通话时长end")

            },
            watchImage(){

                this.visit.photo.forEach((p, index) => {

                    let url = p.substr(0, 4) == 'http' ? p.match(/aliyuncs.com\/(\S*)\?OSSAccessKeyId/)[1] : p
                    getSignUrl(url, (ret) => {
                        if (ret instanceof Error) {
                            this.imgSrc.push('#') ;
                        } else {
                            this.imgSrc.push(ret) ;
                            console.log("this.imgSrc"+this.imgSrc)
                        }
                    });
                });

                this.visit.visitphoto.forEach((p, index) => {

                    let url = p.substr(0, 4) == 'http' ? p.match(/aliyuncs.com\/(\S*)\?OSSAccessKeyId/)[1] : p
                    getSignUrl(url, (ret) => {
                        if (ret instanceof Error) {
                            this.visitphoto.push('#') ;
                        } else {
                            this.visitphoto.push(ret) ;
                            console.log(this.visitphoto)
                        }
                    });
                });

            },

            endsave(){

                if (!this.invalid)return;

                console.log("this.photo："+ this.photo)

                this.visit.visitsummary = this.result.visitsummary;
                this.visit.visitphoto = this.photo;
                this.visit.finishedAt = this.result.finishedAt;
                this.visit.location = this.result.location;
                //
                console.log(this.visit)
                if (this.visit.type == '电话') {
                    this.getCall(() => {
                        this.save(this.visit,2);
                    });
                } else {
                    this.save(this.visit,2);
                }
            },

            start(){

                if (this.visit.type == '电话') {

                    window.location.href = "tel:"+this.visit.contactPhone;
                }else {

                    if (this.result.location.address=="") {

                        $alert('您的手机定位失败，请移至空旷位置再点击走访拜访按钮进行尝试', '操作提醒');
                        return;
                    }
                    $dialog.confirm('是否确定开始走访拜访？', '温馨提示', (ok) => {

                        let self = this;
                        self.visit.visitNumber ++;

                        self.save(self.visit,0);
                    });
                }
            },

            cancel(){

                $dialog.confirm('确定要取消这次拜访任务吗？', '温馨提示', (ok) => {
                    this.visit.status = "已取消";
                    this.save(this.visit,1);
                });
            },
            save(item,index){

                let dic = {};
                if (index == 1){
                    let status = this.visit.status
                    dic = {status}
                    $preloader.show();
                } else if (index == 2) {
                    //拜访结果总结的数量
                    if (this.myCompany.visitset.needResult == "需要") {

                        if (this.myCompany.visitset.summaryCount >= this.visit.visitsummary.length) {
                            let title = '拜访结果总结字数不得少于 '+this.myCompany.visitset.summaryCount+' 字';
                            $alert(title, '操作提醒');
                            return;
                        }
                    }

                    console.log("visitphoto："+item.visitphoto)
                    // 图片的数量
                    if (this.myCompany.visitset.photoCount > item.visitphoto.length) {
                        let title = '总结拍照上传不得少于 '+this.myCompany.visitset.photoCount+' 张';
                        $alert(title, '操作提醒');
                        return;
                    }


                    let visitsummary = item.visitsummary;
                    let visitphoto = item.visitphoto;
                    let finishedAt = item.finishedAt;
                    let location = item.location;

                    let resultStatus = "1";

                    let duration = this.result.duration;
                    console.log("通话时长===="+duration)
                    //通话时间小于设置的时间
                    if(this.myCompany.visitset.phoneMinute > 0 && this.myCompany.visitset.phoneMinute>(duration/60)&&device.platform == "Android"&&this.visit.type == '电话'){

                        let title = '你与客户的通话时间少于 '+this.myCompany.visitset.phoneMinute+' 分钟';
                        $alert(title, '操作提醒');
                        return;
                    }else if (this.visit.type == '走访') {

                        console.log("visitNumber："+item.visitNumber);
                        if (!item.isVisit){

                            $alert('您还没有进行拜访打卡呢！', '操作提醒');
                            return;
                        }
                        if (item.location.address=="") {

                            $alert('正在定位你的拜访地址！', '操作提醒');
                            return;
                        }
                    }
                    let status = "已完成";

                    $preloader.show();
                    dic = {visitsummary,visitphoto,finishedAt,location,resultStatus,duration,status};
                }else {
                    // 0 打卡拜访
                    let visitNumber = item.visitNumber;
                    let isVisit = true;
                    dic = {visitNumber,isVisit};
                }

                console.log("流程通过")

                let seft = this;
                axios.put('api/visit/' + this.visit._id, dic).then(() => {

                    if (index == 2){
                        seft.visit.status = "已完成";

                        $dialog.confirm('恭喜您，完成拜访！', '操作提醒', (ok) => {
                            seft.$f7router.back();
                        });
                    }else if (index == 0){
                        $dialog.confirm('您的走访拜访已经开始，需要填写完拜访结果才算完成，请去填写！', '操作提醒', (ok) => {

                            seft.tab=='result';
                        });
                    }
                    setTimeout(function(){
                        $preloader.hide();
                        seft.refresh();
                    },1000);

                }).catch(error => {
                    console.error(error);
                    $alert('无法保存数据，请稍后再试', '操作错误');

                })
            },

            refresh(){
                axios.get('api/visit/' + this.visit._id).then(resp => {

                    this.visitnew = resp.data;
                    this.visit = resp.data;
                    this.$forceUpdate();

                }).catch(error => {
                    console.error(error);

                })
            },

            showPosition() {
                if (this.myPosition && this.myPosition.lng && this.myPosition.lat) {
                    if (this.amap.denotations.marker) {
                        this.amap.instance.remove(this.amap.denotations.marker);
                    }
                    if (this.amap.denotations.infoWindow) {
                        this.amap.instance.remove(this.amap.denotations.infoWindow);
                    }
                    this.amap.denotations = addMarker(
                        this.amap.instance,
                        new AMap.LngLat(this.myPosition.lng,this.myPosition.lat),
                        this.myPosition.address

                    );
                }
            },
            isOvertime (time) {
                return moment().isAfter(time)
            },
        },


        props: [
            'lastPage',
            'visit',
            'statue'
        ],

    }
</script>

<style scoped>

    .warning {
        /*width: 100%;*/
        color: #F96A0E;
        background-color: #FFF5E4;
        font-size: 13px;
        padding: 8px;
    }

    .warning > .icon {
        font-size: 12px;
        margin-bottom: 3px;
    }
    .wrapper {

        overflow: auto;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        height: 100%;
        position: relative;
        z-index: 1;
    }

    .menu{

        height: 45px;
        background-color: #FFFFFF;
        padding-bottom: 2px;
    }

    .menu .menu-item{

        float: left;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        line-height: 45px;
        color: #333333;
        width: 30%;
        margin: 0 10%;
    }

    .menu .active{

        color: #01B38B;
        border-bottom: 2px solid #01B38B;
    }

    .imgDiv{

        display: inline-block;
        margin-left: 15px;
        margin-bottom: 10px;
    }

    .visit-content{

        width: 100%;
        position:absolute;
        /*overflow-y:scroll;*/
        margin-top: 10px;
    }

    .list-item{
        background: #FFFFFF;
        width: 100%;
        min-height: 46px;
        font-size: 14px;
        line-height: 46px;
        border-bottom: 1px solid #f8f8f8;
        /*overflow: hidden;*/
    }

    .list-type,
    .list-type1 {

        background: white;
        line-height: 45px;
        font-size: 14px;
        margin-top: 0px;
        margin-bottom: 0px;
        white-space:nowrap;
    }

    .list-type label,
    .list-type1 label{

        padding-left: 15px;
        color: #666666;
    }

    .list-type div{
        display: inline-block;
        width: calc(100% - 120px);
        text-align: right;
        float: right;
        margin-right: 10px;
        font-size: 14px;
        font-weight: bold;
        color: #333333;
        white-space: normal;

        /*overflow:hidden;*/
        /*text-overflow:ellipsis;*/
        /*white-space:nowrap*/
    }

    .list-type1 div {
        display: inline-block;
        /*width: calc(100% - 100px);*/
        text-align: right;
        float: right;
        margin-right: 10px;
        font-size: 14px;
        font-weight: bold;
        color: #333333;
    }

    .list-item-eare{

        background: #FFFFFF;
        /*width: 100%;*/
        min-height: 50px;
        font-size: 14px;
        padding-left: 15px;
        padding-top: 8px;
        border-bottom: 1px solid #f8f8f8;
    }

    .list-item-eare label{

        color: #666666;
    }

    .list-item-eare div{

        margin-top: 5px;
        font-size: 14px;
        font-weight: bold;
        color: #333333;
        margin-bottom: 10px;
        /*height: 100px;*/
        word-wrap:break-word;
    }

    .list-item-eare textarea{

        margin-top: 5px;
        font-size: 14px;
        font-weight: bold;
        color: #333333;
        height: 100px;
        width: 100%;
    }

    .list-item-photo{

        background: #FFFFFF;
        /*width: 100%;*/
        min-height: 100px;
        font-size: 14px;
        padding-left: 15px;
        padding-top: 8px;
        border-bottom: 1px solid #f8f8f8;
    }

    .list-item-photoing{

        background: #FFFFFF;
        /*width: 100%;*/
        min-height: 100px;
        font-size: 14px;
        padding-left: 15px;
        padding-top: 8px;
        border-bottom: 1px solid #f8f8f8;
    }

    .list-item-photoing label{
        color: #666666;
    }
    .list-item-photo label{

        color: #666666;
    }

    .list-item-photo div{

        width: 60px;
        height: 60px;
        background: #EEEEEE;
        color: #666666;
        text-align: center;
        margin-top: 10px;
    }

    .canceled{

        width: 100%;
        height: 45px;
        background: #FFFFFF;
        margin-top: 10px;
        line-height: 45px;
        text-align: center;
        color: #FF715A;
        font-size: 14px;
        margin-bottom: 60px;
    }

    .footer{

        position: fixed;
        bottom: 0px;
        width: 100%;
        height: 50px;
        background: #01B38B;
        color: white;
        text-align: center;
        line-height: 50px;
        z-index: 99;
        font-size: 16px;

    }

    .visit-top{

        padding: 6px;
        font-size: 13px;
        /*width: 100%;*/
        background: #FFF5E4;
        color: #F96A0E;
    }

    .textarea-item{

        height: 150px!important;
    }

    .textarea-item textarea{

        width: 100%;
        background:none;
        outline:none;
        border:0px;
        float: left;
        font-size: 14px;
        line-height: 1.5em;
        margin-top: 10px;
        padding-right: 15px;
        padding-left: 0px;
        box-sizing: border-box;
        height: 70%;
        color: #333;
    }

    .buttom-button{
        height: 40px;
        line-height: 40px;
        text-align: center;
        margin: 15px;
        background: #D8D8D8;
        color: #FFFFFF;
        border-radius: 3px;
    }

    .a{
        background: #01B38B!important;
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

</style>
