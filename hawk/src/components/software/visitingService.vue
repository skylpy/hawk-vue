<template>
    <f7-page style="background: #fff">
        <f7-navbar title="上门服务" back-link></f7-navbar>
        <div class="p_content">
            <p class="title">预约成功后，将会有三帆外勤相关人员通过上门或远程方式，为你的企业提供以下服务：</p>
            <p>三帆外勤APP端操作指导</p>
            <p>三帆外勤网页端操作指导</p>
            <p>三帆外勤行业解决方案分享</p>

            <div class="content_layer">
                <div class="content">
                    <f7-list>
                        <f7-list-item
                                :after="location && location.name"
                                link="#"
                                @click="$f7.popup.open('#client-location-selector')">
                            <span slot="title" style="color:red">* </span>
                            <span slot="title">服务地区</span>
                        </f7-list-item>

                        <f7-list-item>
                            <span  slot="title" style="color:red">* </span>
                            <span slot="title">详细地址</span>
                            <input
                                    slot="inner" style="text-align:right; width: calc(100% - 90px); height: inherit;"
                                    type="text"
                                    v-model="address"
                            >
                        </f7-list-item>

                        <f7-list-item>
                            <span  slot="title" style="color:red">* </span>
                            <span slot="title">意向时间</span>
                            <date-picker v-model="appointmentTime" type="datetime"
                                         :editable="false"
                                         class="date-picker"
                                         width="180px"
                                         :confirm="true"
                                         :not-before="new Date()"
                                         :confirm-text="'确定'"
                                         placeholder=""
                                         :readonly="'disabled'"
                                         format="YYYY-MM-DD HH:mm" :minute-step="30"
                                         :first-day-of-week="1"></date-picker>
                        </f7-list-item>
                    </f7-list>
                </div>
                <div class="bt_save">
                    <div @click="save">保存</div>
                    <p>预约后三帆外勤相关人员将通过公用电话或手机号码与你联系</p>
                </div>
            </div>
        </div>

        <f7-popup id="client-location-selector" @popup:opened="$refs.location.init()">
            <location @selected="getLocation" @cancel="$f7.popup.close('#client-location-selector')"
                      ref="location"></location>
        </f7-popup>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import axios from 'axios'
import DatePicker from 'vue2-datepicker'
import location from 'gadget/location.vue';
import moment from 'moment'
export default {
    name: "visitingService",
    components: {
        location,
        DatePicker
    },
    data () {
        return {
            location: {},
            address: '',
            appointmentTime: ''
        }
    },
    computed: {
        ...mapGetters([
            'myProfile',
            'myCompany'
        ]),
    },
    methods: {
        getLocation(loc) {
            if (loc && loc.address) {
                let {lng, lat, address, name} = loc;
                this.location.lng = lng;
                this.location.lat = lat;
                this.location.name = name;
                this.location.address = address;
            }
            this.$forceUpdate();
            $f7.popup.close('#client-location-selector');
        },

        save () {
            if (
                !this.location.lng ||
                !this.location.lat ||
                !this.address ||
                !this.appointmentTime
            ) {
                $alert('请填写完整资料')
            } else {
                axios.post(CONFIG.server.tradeApiUrl + '/appointmentSceneService', {
                    companyId: this.myCompany._id,
                    phone: this.myProfile.phone,
                    linkName: this.myProfile.name,
                    address: this.address,
                    lng: this.location.lng,
                    lat: this.location.lat,
                    appointmentTime: moment(this.appointmentTime).format('YYYY-MM-DD HH:mm:ss')
                }).then(res => {
                    $alert('已经提交成功')
                }).catch(err => {
                    $alert('提交失败', '操作错误');
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.p_content {
    padding: 20px;
    p {
        font-size: 18px;
        color: gray;
        margin: 0 0 5px;

        &.title {
            margin: 0 0 15px;
        }
    }

    .bt_save{
        height: 45px;
        width: 100%;

        p {
            font-size: 14px;
            color: gray;
            margin: 5px 0 0 0;
        }

    }
    .bt_save>div{
        width: 100%;
        height: 45px;
        background-color: #01b38b;
        font-size: 16px;
        color: white;
        text-align: center;
        line-height: 45px;
    }
}
</style>
