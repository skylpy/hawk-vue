<template>
    <f7-page>
        <f7-navbar title="考勤记录" back-link>
        </f7-navbar>

        <f7-list style="background-color:aliceblue; margin-top:0px">
            <f7-list-item title="员工" link="#" @click="selectorPersonnelShow = true">
                <f7-icon slot="media" f7="person"></f7-icon>
                <span slot="after">{{userId ? who(userId).name : myProfile.name}}</span>
            </f7-list-item>
            <f7-list-item title="时间长度" smart-select :smart-select-params="{openIn: 'popover'}">
                <f7-icon slot="media" f7="calendar"></f7-icon>
                <select name="days" class="timerange">
                    <option value="1">一天之内</option>
                    <option value="3" selected>三天之内</option>
                    <option value="7">一周之内</option>
                    <option value="30">一个月之内</option>
                </select>
            </f7-list-item>
        </f7-list>

        <div class="timeline">

            <div
                class="timeline-item"
                v-for="(d, index) in dates"
                :key="index"
            >
                <div class="timeline-item-date">
                    {{ d.substring(5) }}
                </div>
                <div class="timeline-item-divider">
                </div>
                <div
                    v-if="getTimeRecords(d)"
                    class="timeline-item-content"
                >
                    <div
                        class="timeline-item-inner"
                        v-for="(r, index) in getTimeRecords(d)"
                        :key="index"
                        @click="showRecord(d, r)"
                    >
                        <div class="timeline-item-time" style="height: 18px; line-height: 18px; margin-bottom: 4px;">
                            <span style="height: 18px; line-height: 20px; display: block; float: left">{{ r.time }}</span>
                            <span v-if="!r.location || r.auditing != '2'"
                                    :style="getAuditing(r.auditing, true)">
                                {{getAuditing(r.auditing)}}
                            </span>
                        </div>
                        <div class="timeline-item-text">
                            {{ r.location && r.location.address || '打卡地点（GPS定位无地址）'}}{{r.offset?' 偏移'+ parseInt(r.offset)+'米':''}}
                            <f7-icon fa="info-circle"></f7-icon>
                        </div>
                    </div>
                </div>
                <div v-else class="timeline-item-content">
                    <div class="timeline-item-inner">
                        <div class="timeline-item-text">没有打卡记录</div>
                    </div>
                </div>
            </div>

        </div>

        <f7-popup :opened="record.popup" @popup:closed="record.popup = false">
            <f7-page>
                <f7-navbar title="考勤记录详情">
                    <f7-nav-right>
                        <f7-link popup-close>关闭</f7-link>
                    </f7-nav-right>
                </f7-navbar>

                <f7-block-title>考勤记录</f7-block-title>
                <f7-block v-if="record._id">
                    <f7-list>
                        <f7-list-item title="员工姓名">
                            <f7-icon slot="media" f7="person"></f7-icon>
                            {{who(userId).name}}
                        </f7-list-item>
                        <f7-list-item title="打卡时间">
                            <f7-icon slot="media" f7="timer"></f7-icon>
                            {{record.fulltime}}
                        </f7-list-item>
                        <f7-list-item title="打卡地点">
                            <f7-icon slot="media" f7="navigation"></f7-icon>
                            <span style="max-width:160px">
                                {{record.location && record.location.address || '打卡地点（GPS定位无地址）'}}
                            </span>
                        </f7-list-item>
                    </f7-list>

                    <f7-block-title>照片</f7-block-title>
                    <f7-block>
                        <img
                            v-for="(url, index) in record.photoSignUrls"
                            :key="index"
                            :src="url"
                            width="60px"
                            style="display:inline-block; margin-right:10px"
                            @click="openPhotoBrowser"
                        >
                    </f7-block>
                    <f7-block-title>补充说明</f7-block-title>
                    <f7-block strong>
                        <textarea
                            style="width:100%"
                            class="resizable"
                            :value = "record.detail"
                        ></textarea>
                    </f7-block>
                </f7-block>

                <div class="auditing_btn" v-if="isAuditing(userId) && record.auditing == -1">
                    <div class="refuse" @click="auditingFun('0', record._id)">拒绝</div>
                    <div class="pass"  @click="auditingFun('1', record._id)">通过</div>
                </div>
            </f7-page>
        </f7-popup>

        <f7-popup :opened="selectorPersonnelShow" @popup:closed="selectorPersonnelShow = false">
            <personnelselector
                :multiple="false"
                :title = "'选择直属员工'"
                :subordinate="true"
                :isFilterMe="true"
                :isFilterSub="true"
                @submit="onSelectorPersonne"
                @cancel="selectorPersonnelShow=false">
            </personnelselector>
            <!--<directlyuserselector-->
                    <!--:multiple="false"-->
                    <!--:title = "'选择直属员工'"-->
                    <!--@submit="onSelectorPersonne"-->
                    <!--@cancel="selectorPersonnelShow=false"-->
            <!--&gt;</directlyuserselector>-->
        </f7-popup>
    </f7-page>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {defaultImgUrl} from 'lib/loading';
import {getSignUrl} from 'lib/aliyun';
import personnelselector from 'gadget/personnelselector.vue';
import directlyuserselector from 'gadget/directlyuserselector.vue';
import axios from 'axios';

export default {
    components: {
        personnelselector,
        directlyuserselector
    },

    props: {
        lastPage: {
            type: String,
            default: '上一页'
        },
        uId: {
            type: String,
            default: ""
        }
    },

    computed: {
        ...mapGetters([
            'timeRecords',
            'myProfile',
            'myUserId',
            'who',
            'superAdmin',
        ]),
    },

    data: () => {
        return {
            userId: '',
            range: 3,
            dates: [],
            record: {
                popup: false
            },
            selectorPersonnelShow: false, // 查看员工
            pSelector: false,
            recordDate: ''
        }
    },

    mounted: function() {
        this.userId = this.uId ? this.uId : this.myUserId;
        this.loadTimeRecords();

        $('select[name="days"]').change(() => {
            this.range = parseInt($('select[name="days"] option:checked').attr('value'));
            this.$f7.popover.close('.smart-select-popover');
        });
    },

    watch: {
        range: function() {
            this.loadTimeRecords();
        },
        userId: function() {
            this.loadTimeRecords();
        },
    },

    methods: {
        ...mapActions({
            'load': 'LOAD_TIMERECORD'
        }),

        // selectEmployee(pList) {
        //     if (pList && pList[0]) {
        //         this.userId = pList[0];
        //     }
        //     this.pSelector = false;
        // },

        onSelectorPersonne(uIds) {

            this.selectorPersonnelShow = false;
            // console.log(uIds)
            this.userId = uIds[0];
            this.pSelector = true;
            this.loadTimeRecords();
        },

        openPhotoBrowser(ev) {
            let photos = [];
            $(ev.target.parentElement).find('img').each((index, elm) => {
                photos.push(elm.src);
            });

            let pb = this.$f7.photoBrowser.create({ photos });

            pb.on('closed', () => { pb.destroy(); })
            pb.open();
        },

        showRecord(date, r) {
            this.record = { popup: false };
            Object.assign(this.record, r);

            // calculate full time literal
            this.recordDate = date;
            let d = date.split('-');
            let dLiteral = d[0] + '年' + d[1] + '月' + d[2] + '日';
            this.record.fulltime = dLiteral + ' ' + this.record.time;

            // get image url
            this.record.photoSignUrls = [];
            this.record.photo.forEach((f, index) => {
                this.record.photoSignUrls[index] = defaultImgUrl;

                getSignUrl(f, (ret) => {
                    if (ret instanceof Error) {
                        console.error(ret);
                    } else {
                        this.record.photoSignUrls[index] = ret;
                    }
                });
            })

            // open popup
            this.record.popup = true;
        },

        getTimeRecords(d) {
            if (this.timeRecords[this.userId]){
                return this.timeRecords[this.userId][d];
            } else {
                return null;
            }
        },

        loadTimeRecords() {
            let userId = this.userId;
            let dateList = this.calculateDates();

            $preloader.show();
            this.load({
                'userId': userId,
                'date': dateList
            }).then(() => {

                this.dates = dateList;

                $preloader.hide();
            }).catch((error) => {
                console.error(error);
                $preloader.hide();
            });
        },

        calculateDates(reverse) {
            let today = new Date();
            let dates = [];

            while (true) {
                dates.push(today.toHawkDateString());
                today.setTime(today.getTime() - 24*3600*1000);
                if (dates.length >= this.range) { break }
            }

            return dates;
        },

        getAuditing (auditing, isClass) {
            let cn = '';
            let cls = 'display: inline-block ; font-size: 10px; float: right; color:';
            switch (auditing) {
                case '-1': cn = '待审核'; cls += '#fff; width: 47px; height: 18px; line-height: 18px; text-align: center; background:#01B38B;';
                break;
                case '0': cn = '未通过'; cls += '#FF715A;';
                break;
                case '1': cn = '已通过'; cls += '#01B38B;';
                break;
                default: cn = '审核超时-已通过'; cls += '#01B38B;';
                break;
            }
            return isClass ? cls : cn
        },

        isAuditing(userId) {
            // 判断是不是超级管理员自己的打卡, 或者是不是他的部门管理员
            return userId === this.myUserId && userId == this.superAdmin._id || this.pSelector
        },

        auditingFun(auditing, id) {
            let filter = {
                userId: this.userId,
                _id: id,
                auditing: auditing,
                date: this.recordDate
            };
            $confirm(`确定要${auditing == '1' ? '通过' : '拒绝'}下属的申请吗？`, '确认', () => {
                axios.put('api/timerecord', filter).then(resp => {
                    this.loadTimeRecords();
                    this.record.popup = false;
                }).catch(err => {
                    console.error(err);
                    $alert('无法更新数据，请稍后再试');
                });
            });
        }
    }
}
</script>

<style lang="scss">
.auditing_btn {
    width: 100%;
    height: 50px;
    background: #fff;
    border-top: 1px solid #D8D8D8;
    margin-top: 45px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    overflow: hidden;

    .pass,
    .refuse {
        width: 42.67%;
        height: 35px;
        line-height: 35px;
        text-align: center;
        font-size: 16px;
        color: #fff;
        cursor: pointer;
    }

    .refuse { background: #FF715A; }
    .pass { background: #01B38B; }
}
</style>
