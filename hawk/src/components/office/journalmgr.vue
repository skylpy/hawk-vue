<template>
    <f7-page no-toolbar style="background: #f8f8f8">
        <f7-navbar id="back"  title="写日报" back-link>
            <f7-nav-right>

            </f7-nav-right>
        </f7-navbar>
        <div class="content">
            <div  class="list-item  list-type" @click="openPicker($event, 'items','item')">
                <span class="item-icon">*</span>
                <label>日报类型</label>
                <div>
                    <span style="font-size: 12px">{{journal.rtype}}</span>
                    <img :src=arrow_right_gray style="position: relative;top:1px;width: 7px;height: 13px;" />
                </div>
            </div>

            <div class="list-item clear-float textarea-item">
                <span class="item-icon">*</span>
                <label>日报内容</label>
                <textarea  placeholder="请输入日报内容"
                           :value="journal.content"
                           @input="journal.content = $event.target.value">
                </textarea>
            </div>

            <div class="list-item clear-float textarea-item">
                <span class="item-icon">*</span>
                <label>{{journal.rtype === '月报' ? '下个月' : journal.rtype === '周报' ? '下周' : '明天'}}计划安排</label>
                <textarea  :placeholder="`请输入${journal.rtype === '月报' ? '下个月' : journal.rtype === '周报' ? '下周' : '明天'}计划安排`"
                           :value="journal.plan"
                           @input="journal.plan = $event.target.value">
                </textarea>
            </div>

            <div class="list-item photo-item">

                <label>照片：</label>
                <photoeditor
                        slot="inner"
                        :gallery="true"
                        :photos="journal.photos"
                        @photo:update="(photos) => {journal.photos = photos}"
                ></photoeditor>
            </div>

            <footer class="footer" @click="submit">提交</footer>

        </div>
    </f7-page>    　
</template>

<script>

    import photoeditor from '../gadget/photoeditor.vue';
    import personnelselector from '../gadget/personnelselector.vue';
    import {mapGetters,mapMutations,mapActions} from 'vuex';
    import axios from 'axios';

    const arrow_right_gray = require("assets/images/arrow_right_gray@2x.png");
    const btn_add_people = require("assets/images/btn_add_people@2x.png");
    const hp_default_96 = require("assets/images/hp_default_96@2x.png");
    const btn_close_small_black = require("assets/images/btn_close_small_black@2x.png");
    const arrow_process_right_gray = require("assets/images/arrow_process_right_gray@2x.png");

    export default {
        name: "journalmgr",

        components: {
            personnelselector,
            photoeditor
        },
        //监听值改变
        computed:{

            ...mapGetters([
                'who',
                'IamAdmin',
                'IamManager',
                'myCompany',
                'myProfile',
                'departmentName',
                'userDepartment',
                'organization',
                'isDepartmentAdmin',
                'getSuperiorAdmin',
                'myUserId',
                'superAdmin'
            ])
        },
        data: () => {
            return {

                arrow_right_gray:arrow_right_gray,
                btn_add_people:btn_add_people,
                hp_default_96:hp_default_96,
                btn_close_small_black:btn_close_small_black,
                arrow_process_right_gray:arrow_process_right_gray,

                selectDatas:{
                    departments:[],
                    departmentsDisplay:[]
                },

                photo: [],

                isClick:true,
                journal:{

                    photos:[],
                    approver:[],
                    content:"",
                    rtype:"请选择",
                    coment:"",
                    department:"",
                    plan: ''
                }
            }
        },
        mounted: function() {


        },
        methods: {

            deleteperson(index){
                this.expense.approver.splice(index,1)
            },
            selectapproval(pList) {

                let seft = this;

                seft.journal.approver = [];
                pList.forEach(function(value,i){
                    console.log('forEach遍历:'+i+'--'+value);

                    let dic = {uid: value,status: "待审批",coment: "",createtime:""};
                    seft.journal.approver.push(dic);
                })

                this.journal.approver.push("");
                this.$forceUpdate();
                $f7.popup.close('#appro-userselector')
            },

            openPicker(ev,itemname,name) {
                let input = ev.target;
                if (name == 'department'&&input.picker){
                    input.picker.open();
                    return;
                }

                let self = this;

                let parant =    [{"id":"日报","name":"日报"},
                                {"id":"周报","name":"周报"},
                                {"id":"月报","name":"月报"}];

                self.selectDatas.departments = [];
                self.selectDatas.departmentsDisplay = [];
                parant.forEach(function (val,index) {
                    self.selectDatas.departments.push(val.id);
                    self.selectDatas.departmentsDisplay.push(val.name);
                })

                let values = self.selectDatas.departments;

                let displayValues = self.selectDatas.departmentsDisplay

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

                            self.journal.rtype = picker.value[0];
                        }
                    }
                });
                input.picker.open();
            },

            submit() {
                let admin = []
                let superior = this.getSuperiorAdmin(this.myUserId)
                if (this.superAdmin._id === this.myUserId) {
                    admin = [this.superAdmin._id]
                } else if (superior.length) {
                    superior.map(v => {
                      if (!admin.includes(v)) admin.push(v)
                    })
                }
                if (admin.length == 0) admin = [this.superAdmin._id]
                this.journal.approver = admin
                // if (this.isDepartmentAdmin(this.myProfile._id)) {
                //     this.journal.approver = this.organization.admin;
                // }else {
                //     this.journal.approver = this.userDepartment(this.myProfile._id).admin;
                // }
                this.journal.department = this.userDepartment(this.myProfile._id).departmentId;
                // console.log(this.userDepartment(this.myProfile._id))
                this.save(this.journal);
            },

            save(entry){
                if (!this.isClick) return;
                if (entry.rtype == '请选择') {
                    $alert('请选择类型', '操作提醒');
                    return;
                }
                if (entry.content == ''){
                    $alert('请输入日报内容', '操作提醒');
                    return;
                }
                if (entry.plan == ''){
                    $alert(`请输入${this.journal.rtype === '月报' ? '下个月' : this.journal.rtype === '周报' ? '下周' : '明天'}计划安排`, '操作提醒');
                    return;
                }

                this.busy()
                this.isClick = false;
                axios.post('api/journalmgr', entry).then(resp => {
                    this.isClick = true;
                    this.nobusy('提交成功，请等待审批', '操作成功', () => {
                        this.$f7router.back();
                    });
                }).catch(error => {
                    this.isClick = true;
                    this.nobusy(error.response.data.message, '操作失败');
                })
            },

            busy() {
                $preloader.show();
            },

            nobusy(s, t, cb) {
                $preloader.hide();
                if (s) {
                    this.alert(s, t, cb);
                }
            },
            alert(s, t, cb) {
                $alert(s, t, cb);
            },
        }
    }
</script>

<style scoped>

    .clear-float {
        clear:both;
        height: 0;
        line-height: 0;
        font-size: 0;
    }
    .textarea-item{
        height: 200px!important;
    }
    .textarea-item textarea{
        width: 100%;
        background:none;
        outline:none;
        border:0px;
        float: left;
        font-size: 14px;
        line-height: 1.5em;
        margin-top: -10px;
        padding-right: 15px;
        padding-left: 20px;
        box-sizing: border-box;
        height: 70%;
        color: #333;
    }
    .list-item{
        background: #FFFFFF;
        width: 100%;
        height: 46px;
        font-size: 14px;
        line-height: 46px;
        border-bottom: 1px solid #f8f8f8;

    }
    .list-type {

        background: white;
        line-height: 45px;
        font-size: 14px;
        margin-top: 0px;
        margin-bottom: 0px;
    }
    .list-type div{
        display: inline-block;
        width: 50%;
        text-align: right;
        float: right;
        margin-right: 10px;
        color: darkgray;
    }
    .item-icon{
        display: inline-block;
        color: red;
        width: 18px;
        text-align: right;
    }
    .photo-item{

        background: #FFFFFF;
        width: 100%;
        font-size: 14px;
        line-height: 30px;
        min-height: 105px!important;
        margin-bottom: 10px;
        padding-bottom: 10px;
    }

    .approvar-item{

        background: #FFFFFF;
        width: 100%;
        font-size: 14px;
        line-height: 30px;
        min-height: 105px!important;
        margin-bottom: 10px;
        padding-bottom: 10px;
    }

    .photo-item label {

        margin-left: 20px;
        display: inline-block;

    }

    .item-selpon{
        width: 60px;
        height: 60px;
        margin-top: 5px;
        margin-left: 20px;
        float: left;

    }

    .approvallabel{
        margin-left: 0px;
        display: inline-block;
    }

    .content {

        overflow: auto;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        height: 100%;
        position: relative;
        z-index: 1;
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
        font-size: 18px;
        z-index: 99;
        font-size: 16px;

    }

    .item-person{
        float: left;
    }

    .item-selpon .item-image{

        width: 40px;
        margin: 0 auto;
        height: 40px;
        background-color: gainsboro;
        float: top;
        border-radius:20px;

    }
    .delete-person{

        width: 10px;
        height: 10px;
        float: left;
        bottom: 45px;
        left: 33px;
        position: relative;
        display: inline-block;
    }

    .spanname{
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 30px;
        line-height: 20px;
        /*background: red;*/
        position: relative;
        right: 5px;
    }

</style>
