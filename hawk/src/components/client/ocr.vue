<template>
    <f7-page>
        <f7-navbar title="扫名片" back-link>
        </f7-navbar>
        <div>
            <div class="text_con">
                <img class="bg" src="../../assets/images/ill_map_gray@2x.png">
                <p>扫名片是把客户资料录入到</p>
                <p>客户管理的客户联系人当中</p>
            </div>
            <div class="phone_con">
                <img class="phone" style="" src="../../assets/images/ill_tel_phone_green@2x.png">
            </div>
            <div class="tip_con">
                注：在保证光线充足情况下，给名片拍照时，使用手机 打横进行拍摄，这样更容易成功
            </div>
            <div class="bt_con" @click="take">
                开始
            </div>
        </div>
        <f7-actions :id="'ocr_'+actionId">
            <f7-actions-group>
                <f7-actions-button @click="takePicture()">拍摄</f7-actions-button>
                <f7-actions-button @click="takePicture(true)">从相册选择</f7-actions-button>
            </f7-actions-group>
            <f7-actions-group>
                <f7-actions-button color="red">取消</f7-actions-button>
            </f7-actions-group>
        </f7-actions>

        <f7-actions :id="'ocr_select_'+actionId">
            <f7-actions-group>
                <f7-actions-label>请问录入的是客户还是商家的联系人？</f7-actions-label>
                <f7-actions-button @click="goto('客户资料', true)">录入到新客户</f7-actions-button>
                <f7-actions-button @click="goto('商家资料', true)">录入到新商家</f7-actions-button>
                <f7-actions-button @click="showClientList('客户资料', false)">录入到已有客户</f7-actions-button>
                <f7-actions-button @click="showClientList('商家资料', false)">录入到已有商家</f7-actions-button>
            </f7-actions-group>
            <f7-actions-group>
                <f7-actions-button color="red">取消</f7-actions-button>
            </f7-actions-group>
        </f7-actions>
        <f7-popup :opened="clientListShow" @popup:closed="(clientListShow = false)" :id="'ocr-client-list_'+actionId">
            <f7-page>
                <f7-navbar title="请选择客户">
                    <f7-nav-right>
                        <f7-link popup-close>取消</f7-link>
                    </f7-nav-right>
                </f7-navbar>
                <f7-block-title>客户列表</f7-block-title>
                <f7-list>
                    <f7-list-item v-for="(item,index) in clientList" :key="index" link="#" :title="item.name"
                                  v-if="(classify ? (item.classify==classify) : true)" :after="regionName(item.region)"
                                  @click="goto(classify,false,item)"></f7-list-item>
                </f7-list>
            </f7-page>
        </f7-popup>
    </f7-page>
</template>

<script>
    import axios from 'axios'
    import {mapGetters} from 'vuex'
    import {openCamera, openFilePicker} from 'lib/camera';
    import {upload} from 'lib/aliyun'

    export default {
        name: "ocr",
        props: ['which'],
        data() {
            return {
                actionId: Date.now(),
                result: {},
                clientListShow: false,
                clientList: [],
                classify: "", // 商家资料 客户资料
            }
        },
        computed: {
            ...mapGetters([
                'myProfile',
                'userDepartment',
                'regionName',
            ]),
        },
        mounted() {
            let department = this.userDepartment(this.myProfile._id).departmentId
            axios.get('api/client?q=' + JSON.stringify({department})).then(resp => {
                this.clientList = resp.data
            })

            if (this.which) this.take()
        },
        methods: {
            take() {
                $f7.actions.open('#ocr_' + this.actionId);
            },
            selectAction(result) {
                this.result = result
                // this.result = {
                //     "name": "张三",                         //姓名
                //     "company": ["阿里巴巴", "阿里巴巴有限公司" ],                //公司结果数组，数组可能为空
                //     "department": ["市场部" ],               //部门结果数组，数组可能为空
                //     "title" : [ "经理" ],                    //职位结果数组，数组可能为空
                //     "tel_cell" : ["15234563443"],           //手机结果数组，数组可能为空
                //     "tel_work": ["057185212345"],          //座机结果数组，数组可能为空
                //     "addr": ["浙江省杭州市西湖区文一西路969号"], //地址结果数组，数组可能为空
                //     "email": [],         //邮箱结果数组  ，数组可能为空
                //     "request_id" : '20160822_32423dfsa23432f',   //请求对应的唯一表示
                //     "success": true                           //识别成功与否 true/false
                // }
                $f7.actions.open('#ocr_select_' + this.actionId);
            },
            showClientList(classify) {
                this.classify = classify
                $f7.popup.open('#ocr-client-list_' + this.actionId);
            },
            goto(classify, isNew, reference) {
                if (isNew) {
                    this.$f7router.navigate('/client/client/', {
                        props: {
                            classify,
                            ocr: this.result
                        }
                    });
                } else {
                    this.$f7router.navigate('/client/client/', {
                        props: {
                            reference,
                            ocr: this.result
                        }
                    });
                    $f7.popup.close('#ocr-client-list_' + this.actionId);
                }
            },
            takePicture(fromFile) {
                let self = this;

                let cb = (ret, base64) => {
                    if (ret instanceof Error) {
                        console.error(ret);
                    } else {
                        let dataUrl = base64;
                        $preloader.show();
                        upload("data:image/jpeg;base64," + dataUrl, (res) => {
                            $preloader.hide();
                            let photoUrl
                            if (res instanceof Error) {
                                console.error(res);
                            } else {
                                photoUrl = res
                            }
                            console.log(res);
                            self.rec(dataUrl,photoUrl)
                        });
                    }
                };
                if (!fromFile) openCamera(cb, null, null, false);
                if (fromFile) openFilePicker(cb, null, false);
            },
            rec(base64, photoUrl) {
                $preloader.show();
                axios.post('https://dm-57.data.aliyun.com/rest/160601/ocr/ocr_business_card.json', {image: base64}, {
                    headers: {
                        Authorization: 'APPCODE ' + CONFIG.ocr.appCode
                    }
                }).then(res => {
                    $preloader.hide();
                    console.log(res)
                    if (res.data && res.data.success) {
                        if(photoUrl)res.data.photo = photoUrl
                        this.selectAction(res.data)
                    } else {
                        $alert('识别失败!')
                    }
                }).catch(err => {
                    $preloader.hide();
                    $alert('操作失败!')
                })
            }
        }
    }
</script>

<style scoped>
    .text_con {
        text-align: center;
        padding-top: 80px;
        height: 156px;
    }

    .text_con p {
        font-size: 18px;
        margin: 6px;
    }

    .bg {
        width: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
    }

    .phone_con {
        margin: 0 auto;
        width: 80%;
    }

    .phone_con img {
        width: 100%;
    }

    .tip_con {
        font-size: 13px;
        color: #333333;
        padding: 20px;
    }

    .bt_con {
        background-color: #01b38b;
        color: white;
        padding: 10px;
        text-align: center;
        margin: 10px;
        cursor: pointer;
    }
</style>
