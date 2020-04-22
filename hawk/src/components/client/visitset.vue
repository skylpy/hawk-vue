<template>
    <f7-page no-toolbar style="background: #f8f8f8">
        <f7-navbar  title="拜访管理" back-link>
            <f7-nav-right>

            </f7-nav-right>
        </f7-navbar>

        <div class="warning">
            <f7-icon class="icon" f7="info_round"></f7-icon>
            要满足下面的所有条件才可以算是完成拜访
        </div>

        <div class="wrapper">

            <div class="list-item  list-type">

                <label>电话拜访时不得少于(分钟)</label>
                <div class="list-type-item">
                    <div class="list-type-item-letter">
                        <div class="list-type-item-letter-left" @click="onereduce">-</div>
                        <textarea class="list-type-item-letter-center"
                                  maxlength="5"
                                  v-model="visitset.phoneMinute"
                                  @input="inputChange($event, 'phoneMinute')"></textarea>
                        <div class="list-type-item-letter-right" @click="oneadd">+</div>
                    </div>
                </div>
            </div>

            <div  class="list-item  list-type">

                <label>拜访内容字数不得少于(个)</label>
                <div class="list-type-item">
                    <div class="list-type-item-letter">
                        <div class="list-type-item-letter-left" @click="tworeduce">-</div>
                        <textarea class="list-type-item-letter-center"
                                  maxlength="5"
                                  v-model="visitset.contentCount"
                                  @input="inputChange($event, 'contentCount')"></textarea>
                        <div class="list-type-item-letter-right" @click="twoadd">+</div>
                    </div>
                </div>
            </div>

            <div class="list-item  list-type">

                <label>走访总结拍照上传不得少于(张)</label>
                <div class="list-type-item">
                    <div class="list-type-item-letter">
                        <div class="list-type-item-letter-left" @click="threereduce">-</div>
                        <textarea class="list-type-item-letter-center"
                                  maxlength="5"
                                  v-model="visitset.photoCount"
                                  @input="inputChange($event, 'photoCount')"></textarea>
                        <div class="list-type-item-letter-right" @click="threeadd">+</div>
                    </div>
                </div>
            </div>

            <div class="list-item  list-type" @click="openPicker($event, 'items','item')">

                <label>填写拜访结果</label>
                <div class="list-type-jian">
                    <span style="font-size: 12px">{{visitset.needResult}}</span>
                    <img :src=arrow_right_gray style="position: relative;top:1px;width: 7px;height: 13px;" />
                </div>
            </div>

            <div class="list-item  list-type">

                <label>拜访结果总结字数不得少于(个)</label>
                <div class="list-type-item">
                    <div class="list-type-item-letter">
                        <div class="list-type-item-letter-left" @click="fourreduce">-</div>
                        <textarea class="list-type-item-letter-center"
                                  maxlength="5"
                                  v-model="visitset.summaryCount"
                                  @input="inputChange($event, 'summaryCount')"></textarea>
                        <div class="list-type-item-letter-right" @click="fouradd">+</div>
                    </div>
                </div>
            </div>

        </div>
        <footer class="footer" @click="submit">保存</footer>
    </f7-page>
</template>

<script>

    import {mapGetters, mapActions} from 'vuex';
    import axios from 'axios';

    const arrow_right_gray = require("assets/images/arrow_right_gray@2x.png");

    export default {
        name: "visitset",

        computed: {
            ...mapGetters([
                'myCompany',
                'who',
                'myProfile',
                'companyRegions',
                'reportOptionData',
                'reportOptionName',
                'regionName',
                'userDepartment',
                'organization'
            ]),

        },
        data() {
            return {
                arrow_right_gray : arrow_right_gray,

                selectDatas:{
                    departments:[],
                    departmentsDisplay:[]
                },

                visitset:{
                    phoneMinute:0,
                    contentCount:50,
                    photoCount:1,
                    summaryCount:100,
                    needResult:"需要"
                }
            }
        },

        created(){

            this.visitset.phoneMinute = this.myCompany.visitset.phoneMinute;
            this.visitset.contentCount = this.myCompany.visitset.contentCount;
            this.visitset.photoCount = this.myCompany.visitset.photoCount;
            this.visitset.summaryCount = this.myCompany.visitset.summaryCount;
            this.visitset.needResult = this.myCompany.visitset.needResult;
        },

        methods: {
            inputChange (e, which){
                this.visitset[which] = parseInt(e.target.value) || ''
            },
            submit(){

                this.save();
            },
            save(){

                let visitset = this.visitset;
                // let sav = true ? :axios.put('api/company/visit',this.organization.visitset._id, entry)
                axios.put('api/company/visit/'+this.myCompany.visitset._id, visitset).then(resp => {
                    this.nobusy('设置成功', '操作成功', () => {
                        this.reloadCompany().catch((err) => {
                            console.error('try to reload company setting but failed');
                        });
                        this.$f7router.back();
                    });
                }).catch(error => {
                    console.log(error.message);
                    this.nobusy(error.message, '操作失败');
                })
            },
            alert(s, t, cb) {
                $alert(s, t, cb);
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

            onereduce(){

                if (this.visitset.phoneMinute <= 0) return;
                this.visitset.phoneMinute --;
            },
            oneadd(){

                if (this.visitset.phoneMinute >= 999) return;
                this.visitset.phoneMinute ++;
            },
            tworeduce(){

                if (this.visitset.contentCount <= 0) return;
                this.visitset.contentCount --;
            },
            twoadd(){

                if (this.visitset.contentCount >= 999) return;
                this.visitset.contentCount ++;
            },
            threereduce(){

                if (this.visitset.photoCount <= 0) return;
                this.visitset.photoCount --;
            },
            threeadd(){

                if (this.visitset.photoCount >= 999) return;
                this.visitset.photoCount ++;
            },
            fourreduce(){

                if (this.visitset.summaryCount <= 0) return;
                this.visitset.summaryCount --;
            },
            fouradd(){

                if (this.visitset.summaryCount >= 999) return;
                this.visitset.summaryCount ++;
            },
            openPicker(ev,itemname,name) {

                let input = ev.target;
                if (name == 'department'&&input.picker){
                    input.picker.open();
                    return;
                }

                let self = this;

                let parant =    [{"id":"需要","name":"需要"},
                    {"id":"不需要","name":"不需要"}];


                // {"id":"年报","name":"年报"}
                console.log(parant);
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

                            self.visitset.needResult = picker.value[0];
                        }
                    }
                });
                input.picker.open();
            },
            ...mapActions({

                'reloadCompany': 'LOAD_COM'
            })
        }
    }
</script>

<style scoped>

    .wrapper {

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
    .list-item{

        background: #FFFFFF;

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
        padding-left: 15px;
        color: #666666;
        font-size: 13px;
    }

    .list-type-jian {

        display: inline-block;
        width: 50%;
        text-align: right;
        float: right;
        margin-right: 10px;
        color: darkgray;
    }


    .list-type-item{
        display: inline-block;
        width: 100px;
        text-align: center;
        float: right;
        margin-right: 15px;
    }
    .list-type-item-letter{

        margin-top: 6px;
        height: 30px;
        line-height: 30px;
        border-radius: 3px;
        border:1px solid #999999;
    }
     .list-type-item-letter-left{

         width: 25px;
         display: inline-block;
         float: left;
         border-right:1px solid #999999
     }
    .list-type-item-letter-center{

        width: 45px;
        display: inline-block;
        text-align: center;
        line-height: 30px;

    }
    .list-type-item-letter-right{

        width: 25px;
        display: inline-block;
        float: right;
        border-left:1px solid #999999
    }
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


</style>
