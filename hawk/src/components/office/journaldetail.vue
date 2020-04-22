<template>
    <f7-page no-toolbar style="background: #f8f8f8">
        <f7-navbar  title="日报详情" back-link>
            <f7-nav-right>

            </f7-nav-right>
        </f7-navbar>

        <div>
            <div class="list-item  list-type">
                <label>提交时间：</label>
                <span>{{new Date(item.createdAt).toMinutesString()}}</span>
            </div>

            <div class="list-item  list-type">
                <label>日报类型：</label>
                <span>{{item.rtype}}</span>

            </div>

            <div class="list-item-content">
                <label>日报内容：</label>

                <div>{{item.content}}</div>

            </div>

            <div class="list-item-content">
                <label>{{item.rtype === '月报' ? '下个月' : item.rtype === '周报' ? '下周' : '明天'}}计划安排：</label>
                <div>{{item.plan}}<br v-if="!item.plan" /></div>
            </div>

            <div class="image-top">
                <div>
                    <span class="imagetite">图片</span>
                </div>
                <div class="imgDiv" v-if="imgSrc.length == 0">
                    <span>无图片上传</span>
                </div>
                <div class="imgDiv" v-for="item in imgSrc">
                    <img :src=item width="60px" height="60px">
                </div>
            </div>

        </div>
        <!---->
        <footer class="footer" v-if="item.applicant != myProfile._id && (item.status == '未读'||item.status == '已读')">
            <div class="footerbohui" @click="promptpop">驳回</div>
            <div class="footertongguo" @click="through">通过</div>
        </footer>

    </f7-page>
</template>

<script>

    import {mapGetters,mapMutations,mapActions} from 'vuex';
    import {upload, getSignUrl} from 'lib/aliyun';
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
                'IamAdmin',
                'IamManager',
                'myCompany',
                'myProfile',
                'departmentName'
            ])
        },

        data: () => {

            return {
                imgSrc: [],
            }
        },

        watch: {
            item(val){

                this.watchImage();
            }
        },

        mounted(){
            this.watchImage()
        },

        methods: {

            watchImage(){

                this.item.photos.forEach((p, index) => {

                    let url = p.substr(0, 4) == 'http' ? p.match(/aliyuncs.com\/(\S*)\?OSSAccessKeyId/)[1] : p
                    getSignUrl(url, (ret) => {
                        if (ret instanceof Error) {
                            this.imgSrc.push('#') ;
                        } else {
                            this.imgSrc.push(ret) ;
                            console.log(this.imgSrc)
                        }
                    });
                })
            },

            promptpop(){

                $dialog.prompt('请填写驳回原因', '驳回原因', val => {

                    let status = "已驳回";
                    let comment = val;
                    console.log(val);
                    $preloader.show();

                    axios.put('api/journalmgr/' + this.item._id, {status,comment}).then(() => {

                        $preloader.hide();
                        $alert('操作成功', '操作成功', () => {
                            this.$emit('submit', '');
                        })

                    }).catch(error => {
                        console.error(error);
                        $alert('无法保存数据，请稍后再试', '操作错误');

                    })
                })
            },

            through(){

                let status = "已确认";

                $preloader.show();

                axios.put('api/journalmgr/' + this.item._id, {status}).then(() => {

                    $preloader.hide();
                    $alert('操作成功', '操作成功', () => {
                        this.$emit('submit', '');
                    })

                }).catch(error => {
                    console.error(error);
                    $alert('无法保存数据，请稍后再试', '操作错误');

                })
            },

            busy() {
                $preloader.show();
            },

            nobusy(s, t, cb) {
                $preloader.hide();

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

</style>
