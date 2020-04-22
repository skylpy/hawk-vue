<template>
    <f7-page no-toolbar style="background: #f8f8f8">
        <f7-navbar  title="绩效报告" back-link>
        </f7-navbar>

        <div style="overflow-x: hidden;">
            <div class="list-item  list-type">
                <label>绩效人：</label>
                <span>{{who(item.creator) && who(item.creator).name}}</span>
            </div>

            <div class="list-item-content">
                <label>上月工作内容：</label>
                <div>{{item.lastContent}}</div>
            </div>

            <div class="list-item-content">
                <label>上月完成情况：</label>
                <div>{{item.lastSchedule}}</div>
            </div>

            <div class="list-item  list-type">
                <label>完成率：</label>
                <span>{{item.finishing}}</span>
            </div>

            <div class="list-item-content">
                <label>上月工作自评：</label>
                <div>{{item.selfAssessment}}</div>
            </div>


            <div class="list-item-content">
                <label>本月工作目标：</label>
                <div>{{item.content}}</div>
            </div>

            <div class="list-item-content">
                <label>本月工作计划：</label>
                <div>{{item.plan}}</div>
            </div>

            <div class="list-item  list-type">
                <label>审批状态：</label>
                <span>{{item.status}}</span>
            </div>

            <div class="list-item  list-type" v-if="item.comment">
                <label>拒绝理由：</label>
                <span>{{item.comment}}</span>
            </div>

            <div class="expense-list" style="padding-left: 10px;">
                审批人
            </div>
            <div class="expense-list">
                <div class="expense-left">
                    <div class="expense-left-icon">
                        <img :src="item.approver && who(item.approver).avatarUrl || hp_default_96" width="30px" height="30px">
                    </div>
                </div>
                <div class="expense-right">
                    <span class="expense-name">{{who(item.approver).name}}</span>
                </div>
            </div>
        </div>
        <!---->
        <footer class="footer" v-if="item.approver === myProfile._id && item.status == '待审批'">
            <div class="footerbohui" @click="promptpop">驳回</div>
            <div class="footertongguo" @click="through">通过</div>
        </footer>
    </f7-page>
</template>

<script>
    import {mapGetters,mapMutations,mapActions} from 'vuex';
    import axios from 'axios';
    export default {
        name: "journaldetail",

        props: [
            'lastPage',
            'item'
        ],
        //监听值改变
        computed: {
            ...mapGetters([
                'who',
                'myProfile'
            ])
        },

        data: () => {
            return {
            }
        },

        methods: {
            promptpop(){
                $dialog.prompt('请填写驳回原因', '驳回原因', val => {
                    $preloader.show();

                    let data = Object.assign({}, this.item)
                    data.status = '已驳回'
                    data.comment = val;
                    $preloader.show();
                    axios.post('/api/performance/', data).then(() => {
                        $preloader.hide();
                        $alert('操作成功', '操作成功', () => {
                            this.$f7router.back()
                        })
                    }).catch(error => {
                        $preloader.hide();
                        console.error(error);
                        $alert('无法保存数据，请稍后再试', '操作错误');
                    })
                })
            },

            through(){
                let data = Object.assign({}, this.item)
                data.status = '已确认'
                $preloader.show();
                axios.post('/api/performance/', data).then(() => {
                    $preloader.hide();
                    $alert('操作成功', '操作成功', () => {
                        this.$f7router.back()
                    })
                }).catch(error => {
                    console.error(error);
                    $preloader.hide();
                    $alert('无法保存数据，请稍后再试', '操作错误');
                })
            },
        }
    }
</script>

<style scoped>

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
    }

    .list-type label{

        float: left;
        margin-left: 15px;
        display: inline-block;
        color: #666666;
        font-size: 14px;
    }

    .list-type span {

        float: right;
        margin-right: 15px;
        display: inline-block;
        color: #333333;
        font-size: 14px;
        font-weight: bold;
    }

    .list-item-content{

        background: #FFFFFF;
        border-bottom: 1px solid #f8f8f8;
    }

    .list-item-content label{

        display: inline-block;
        margin-top: 10px;
        margin-left: 15px;
        color: #666666;
        font-size: 14px;
    }

    .list-item-content div{

        margin-left: 15px;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-right: 15px;
        color: #333333;
        font-size: 14px;
        font-weight: bold;
    }

    .image-top{

        margin-top: 0px;
        min-height: 50px;
        background: #FFFFFF;
        margin-bottom: 30px;
    }

    .imagetite {

        color: #666666;
        width: 100%;
        margin-top: 10px;
        height: 20px;
        display: inline-block;
        margin-left: 15px;
        margin-bottom: 8px;
        font-size: 14px;
    }

    .imgDiv{

        display: inline-block;
        margin-left: 15px;
        margin-bottom: 10px;
    }

    .footer{

        position: fixed;
        bottom: 0px;
        width: 100%;
        height: 50px;
        background: #FFFFFF;
        color: white;
        text-align: center;
        line-height: 50px;
        font-size: 18px;
        z-index: 99;
        font-size: 16px;
    }

    .footerbohui{

        background: #FF715A;
        height: 35px;
        width: 35%;
        display: inline-block;
        float: left;
        margin-left: 20px;
        margin-top: 7px;
        line-height: 35px;
        border-radius: 2px;
    }

    .footertongguo{

        background: #01B38B;
        height: 35px;
        width: 35%;
        display: inline-block;
        float: right;
        margin-right: 20px;
        margin-top: 7px;
        line-height: 35px;
        border-radius: 2px;
    }

    .expense-list {
        width: 100%;
        margin-top: 10px;
    }

    .expense-left {
        display: inline-block;
        width: 15%;

        margin-bottom: 15px;
    }

    .expense-left-icon {
        width: 30px;
        height: 30px;
        border-radius: 15px;
        background-color: #2196F3;
        margin: 0px auto;
        overflow: hidden;
    }

    .expense-left-icon > img {
        width: 100%;
        height: 100%;
    }

    .expense-right {

        float: right;
        width: 85%;
    }
</style>
