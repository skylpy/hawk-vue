<template>
    <f7-page>
        <f7-navbar title="我的考勤" back-link>
            <f7-nav-right>
                <f7-link @click="$f7router.navigate('/office/timerecord/', {props: {lastPage: '我的考勤'}})">打卡记录</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <!-- Extended FAB Center Bottom (Red) -->
        <f7-fab
                position="center-bottom"
                slot="fixed"
                :text="checkin.text"
                color="red"
                @click="popup.clockIn.present = true"
        >
            <f7-icon :f7="checkin.icon"></f7-icon>
        </f7-fab>

        <f7-fab position="right-bottom" slot="fixed" color="orange">
            <f7-icon ios="f7:add" md="material:add" id="fRightBottom"></f7-icon>
            <f7-icon ios="f7:close" md="material:close"></f7-icon>
            <f7-fab-buttons position="top">
                <f7-fab-button @click="$f7router.navigate('/office/goOut/')" label="外出">
                    <i class="fa fa-shopping-bag" aria-hidden="true"></i>
                </f7-fab-button>

                <f7-fab-button @click="$f7router.navigate('/office/overtime/')" label="加班">
                    <i class="fa fa-moon-o" aria-hidden="true"></i>
                </f7-fab-button>

                <f7-fab-button @click="$f7router.navigate('/office/travel/')" label="出差">
                    <i class="fa fa-plane" aria-hidden="true"></i>
                </f7-fab-button>

                <f7-fab-button @click="$f7router.navigate('/office/leave/')" label="请假">
                    <i class="fa fa-hospital-o" aria-hidden="true"></i>
                </f7-fab-button>
            </f7-fab-buttons>
        </f7-fab>
        <div v-if="noLocation" class="location_ing">{{locationError?'GPS信号弱，无法定位。':'正在定位中'+loading}}</div>

        <div class="map">
            <div id="amap-container" :style="amap.style"></div>
        </div>
        <f7-popup class="clock-on" :opened="popup.clockIn.present">
            <f7-page>
                <f7-navbar title="打卡">
                    <f7-nav-right>
                        <f7-link @click="popup.clockIn.present = false">取消</f7-link>
                        <f7-link @click="clockin">确定</f7-link>
                    </f7-nav-right>
                </f7-navbar>
                <f7-block-title>打卡时间</f7-block-title>
                <f7-block>
                    <p>{{(new Date()).toHawkString()}}</p>
                </f7-block>
                <f7-block-title>打卡类型</f7-block-title>
                <f7-block>
                    <p>{{type}}</p>
                </f7-block>
                <f7-block-title>打卡地点</f7-block-title>
                <f7-block>
                    <p v-if="myPosition && myPosition.address">{{myPosition.address}}</p>
                    <p v-if="locOffset" style="font-size:small; color:gray">距离偏差{{Math.floor(locOffset)}}米</p>
                </f7-block>

                <f7-block-title>
                    <span style="color:red">* </span>
                    照片 ({{popup.clockIn.photo.length}}/5)
                    <span style="font-size: 13px; color: #999;">请准确拍摄打卡地点的照片作为审批依据</span>
                </f7-block-title>
                <photoeditor
                        :max="5"
                        :photos="popup.clockIn.photo"
                        @photo:update="(photos) => {popup.clockIn.photo = photos}"
                ></photoeditor>

                <f7-block-title><span style="color:red">* </span>补充说明</f7-block-title>
                <f7-block strong>
                    <textarea
                            style="width:100%"
                            class="resizable"
                            placeholder="请输入补充说明"
                            v-model="popup.clockIn.detail"
                    ></textarea>
                </f7-block>
            </f7-page>
        </f7-popup>

    </f7-page>
</template>
<style scoped>
    .location_ing {
        position: absolute;
        top: 50px;
        left: 0px;
        right: 0px;
        margin: auto;
        text-align: center;
        width: 180px;
        z-index: 1550;
        padding: 5px;
        color: white;
        background-color: rgba(0, 0, 0, 0.52);
        border-radius: 3px;
    }
</style>
<script>
    import {defaultImgUrl} from 'lib/loading';
    import {mapGetters, mapActions} from 'vuex';
    import {createMap, addGeoLocation, addMarker, getDistBetween, getVisibleHeight} from 'lib/amap';
    import {parse} from 'semver';
    import {openCamera} from 'lib/camera';
    import {getSignUrl} from 'lib/aliyun';
    import photoeditor from 'gadget/photoeditor.vue';
    import {log} from 'util';

    export default {
        components: {
            photoeditor
        },

        props: {
            lastPage: {
                type: String,
                default: '上一页'
            },
            which: {
                type: String,
                default: ''
            }
        },

        data: () => {
            return {
                imgSrc: [],

                amap: {
                    instance: null,
                    style: {
                        width: '100%',
                        height: '100px'
                    },
                    browserLocation: {},
                    denotations: {}
                },

                checkin: {
                    text: "打卡",
                    icon: "login"
                },

                popup: {
                    clockIn: {
                        present: false,
                        photo: [], //'211d80f9d982ba1f.1550133752444.jpeg'
                        detail: '',
                    }
                },
                type: '打卡',
                interval: null,
                myTimeCard: null,
                workTime: null,
                noLocation: true,
                locationError: false,
                loading: '...',
                myPosition: null
            }
        },

        computed: {
            ...mapGetters([
                'myProfile',
                'myUserId',
                'myCompany',
                'timeCard',
                'position',
                'timeRecords'
            ]),
            // 我的定位
            // myPosition() {
            //     if (this.position.longitude) {
            //         console.log('updating position from sdk');
            //         return {
            //             lng: this.position.longitude,
            //             lat: this.position.latitude,
            //             address: this.position.address,
            //             at: this.position.date
            //         }
            //     } else if (this.amap.browserLocation.position) {
            //         console.log('updating position from browser');
            //         return {
            //             lng: this.amap.browserLocation.position.lng,
            //             lat: this.amap.browserLocation.position.lat,
            //             address: this.amap.browserLocation.formattedAddress,
            //             at: (new Date()).toHawkString()
            //         }
            //     }
            //     return null;
            // },
            // 定位偏移
            locOffset() {
                if (!this.myPosition) return 0;

                let target = this.myTimeCard && this.myTimeCard.location || null;
                if (!target || !target.lng) return 0;
                let a = [this.myPosition.lng, this.myPosition.lat];
                let b = [target.lng, target.lat];
                return getDistBetween(a, b);
            }
        },

        watch: {
            // 监听定位变化
            // myPosition: {
            //     handler: function (val, oldVal) {
            //         this.showPosition();
            //     },
            //     immediate: true,
            //     deep: true
            // },
            myPosition: function (val, oldVal) {
                this.showPosition();
            },
            // 监听定位变化
            'popup.clockIn.photo': function (value, oldValue) {

                this.popup.clockIn.photo.forEach((p, index) => {
                    this.imgSrc[index] = defaultImgUrl;
                    let url = p.substr(0, 4) == 'http' ? p.match(/aliyuncs.com\/(\S*)\?OSSAccessKeyId/)[1] : p
                    getSignUrl(url, (ret) => {
                        if (ret instanceof Error) {
                            this.imgSrc[index] = '#';
                        } else {
                            this.imgSrc[index] = ret;
                        }
                    });
                })
            }
        },

        mounted: function () {
            // 我的考勤时间
            this.myTimeCard = this.timeCard(this.myUserId)
            this.amap.style.height = getVisibleHeight() + 'px'
            this.amap.instance = createMap('amap-container', {zoom: 'rt'})
            // addGeoLocation(this.amap.instance, this.setBrowserLocation);

            $preloader.show();
            this.load({
                userId: this.myUserId,
                date: (new Date()).toHawkDateString()
            }).then(() => {
                $preloader.hide();
                this.remind();// 提示打卡类型内容
                this.setCheckinBtn();// 打卡按钮文字
                this.showPosition();// 显示定位
            }).catch(error => {
                $preloader.hide();
                console.error(error);
            })

            if (device.platform == "Android" || device.platform == "iOS") {
                if (cordova.plugins.aMapLocation) {
                    let self = this
                    cordova.plugins.aMapLocation.getCurrentPosition(null,  (response) => {
                        self.myPosition = {
                            lng: response.longitude,
                            lat: response.latitude,
                            address: response.address,
                            at: response.date
                        }
                        console.log(self.myPosition)
                    }, function (response) {
                        console.error('获取定位失败');
                    })
                }
            }

            let count = 0
            let timeCount = 15
            let tipStr = ['', '.', '..', '...']
            let self = this
            // 时时刷新按钮状态
            this.interval = setInterval(() => {
                this.setCheckinBtn()
                if (this.noLocation) {
                    self.loading = tipStr[count % 4]
                    count++
                    if (timeCount < 0) {
                        self.locationError = true
                    } else {
                        timeCount--
                    }
                }
            }, 1000)

            if (this.which) {
                this.$nextTick(() => {
                    if (this.which === 'checkin') {
                        this.popup.clockIn.present = true
                    } else {
                        document.getElementById('fRightBottom').click()
                    }
                })
            }
        },
        beforeDestroy() {
            clearInterval(this.interval)
        },
        methods: {
            ...mapActions({
                'save': 'SAVE_TIMERECORD',
                'load': 'LOAD_TIMERECORD'
            }),
            // 获取图片地址
            imgUrl(f) {
                let url = '#';
                getSignUrl(f, (ret) => {
                    if (ret instanceof Error) {
                        url = '#';
                    } else {
                        url = ret;
                    }
                });
                return url;
            },
            // 假日
            isHoliday() {
                let ret = false;
                this.myCompany.holidays.forEach(h => {
                    let holiday = new Date(h);
                    if (holiday.toHawkDateString() == (new Date()).toHawkDateString()) {
                        ret = true;
                    }
                })
                return ret;
            },

            // 工作日
            isWorkDay() {
                if (!this.myTimeCard) return false;
                let index = (new Date()).getDay();
                index = (index == 0) ? 6 : (index - 1);
                return this.myTimeCard.workDays[index];
            },

            // 08:00时间转换Date对象
            toDate(timepoint) {
                let time = timepoint.split(':');
                let d = new Date();
                d.setHours(parseInt(time[0]));
                d.setMinutes(parseInt(time[1]));
                d.setSeconds(0);
                d.setMilliseconds(0);
                return d;
            },
            // 判断当时间是否是上下班打卡时间内
            status(type) {
                let checkin = false;
                let checkout = false;
                let timeDist = 0;
                let workTime = null;
                let status = '打卡'

                if (type == '上下班打卡' && this.myTimeCard.location.range < this.locOffset) {
                    status = '外勤'
                }
                this.myTimeCard.workTimes.forEach(wt => {
                    if (checkin || checkout) return;
                    let dist = 0;
                    let now = Date.now()
                    let min = 60 * 1000
                    let last = 60 * min // 允许迟到的时间  单位分钟
                    let leave = 60 * min // 允许早迟的时间  单位分钟
                    // 上班打卡
                    if (this.toDate(wt.start_range).getTime() <= now && now <= (this.toDate(wt.start).getTime() + last)) {
                        dist = now - this.toDate(wt.start).getTime();
                        timeDist = dist;
                        checkin = true;
                        status = (timeDist > 0) ? '迟到' : '上班'
                        workTime = wt
                    }

                    // 下班打卡
                    if ((this.toDate(wt.end).getTime() - leave) <= now && now <= this.toDate(wt.end_range).getTime()) {
                        dist = now - this.toDate(wt.end).getTime();
                        timeDist = dist;
                        checkout = true;
                        status = (timeDist < 0) ? '早退' : '下班'
                        workTime = wt
                    }
                });
                return {checkin, checkout, timeDist, status, workTime};
            },

            // 设置打卡按钮文字
            setCheckinBtn() {
                if (!this.myTimeCard) return;
                let week = new Date().getDay();
                week = week === 0 ? 6 : week - 1;
                if (this.myTimeCard.workDays[week]) {
                    if (this.myTimeCard.type == '上下班打卡') {
                        if (this.myTimeCard.location.range < this.locOffset) {
                            this.type = '外勤'
                            this.checkin.text = '外勤打卡' + new Date().toHawkTimeString();
                        } else {
                            let {checkin, checkout, timeDist, status, workTime} = this.status('上下班打卡');
                            this.type = status
                            this.workTime = workTime ? workTime._id : null
                            let dist = Math.abs(timeDist / 1000);
                            let minutes = parseInt(dist / 60)
                            let seconds = parseInt(dist % 60)
                            if (checkin) {
                                this.checkin.text = '上班打卡';
                                if (timeDist < 0) this.checkin.text = `上班打卡`;
                                if (timeDist > 0) this.checkin.text = `上班打卡(迟到${minutes}分${seconds}秒)`;
                            } else if (checkout) {
                                this.checkin.text = '下班打卡';
                                if (timeDist < 0) this.checkin.text = `下班打卡(早退${minutes}分${seconds}秒)`;
                                if (timeDist > 0) this.checkin.text = `下班打卡`;
                            }
                        }

                    } else if (this.myTimeCard.type == '实时打卡') {
                        let {checkin, checkout, timeDist, status, workTime} = this.status('实时打卡');
                        this.type = status
                        this.workTime = workTime ? workTime._id : null
                        let dist = Math.abs(timeDist / 1000);
                        let minutes = parseInt(dist / 60)
                        let seconds = parseInt(dist % 60)
                        if (checkin) {
                            this.checkin.text = '实时打卡';
                            if (timeDist < 0) this.checkin.text = `实时打卡-上班`;
                            if (timeDist > 0) this.checkin.text = `实时打卡-上班(迟到${minutes}分${seconds}秒)`;
                        } else if (checkout) {
                            this.checkin.text = '实时打卡';
                            if (timeDist < 0) this.checkin.text = `实时打卡-下班(早退${minutes}分${seconds}秒)`;
                            if (timeDist > 0) this.checkin.text = `实时打卡-下班`;
                        }
                    }
                } else {
                    this.checkin.text = '打卡';
                }
            },
            // 打卡
            clockin() {
                let time = (new Date()).toHawkTimeString();
                let location = this.myPosition;
                let detail = this.popup.clockIn.detail;
                let userId = this.myUserId;
                let offset = this.locOffset;
                let photo = this.popup.clockIn.photo;
                let type = this.type;
                let workTime = this.workTime;
                let auditing = '2';

                // let saveData = {
                //     userId,
                //     time,
                //     location,
                //     type,
                //     workTime,
                //     detail,
                //     offset,
                //     photo,
                //     auditing
                // }


                if (photo.length == 0) {
                    $alert('请选择照片！', "操作失败");
                    return;
                }

                if (detail == "") {
                    $alert('请填写补充说明！', "操作失败");
                    return;
                }

                let save = () => {
                    let self = this;
                    $preloader.show();
                    this.save({userId, time, location, type, workTime, detail, offset, photo, auditing}).then(() => {
                        $preloader.hide();
                        $alert('你已经打卡成功', '操作成功');

                        // clean up the popup
                        this.popup.clockIn.detail = "";
                        this.popup.clockIn.photo = []; //'211d80f9d982ba1f.1550133752444.jpeg'
                        this.popup.clockIn.present = false;
                        this.load({
                            userId: this.myUserId,
                            date: (new Date()).toHawkDateString()
                        })

                    }).catch((error) => {
                        $preloader.hide();
                        console.error(error);
                        $alert('打卡失败，请稍后再试', '操作失败');
                    })
                }

                if (!location) {
                    // $alert('地点无法确定，请确保定位设置已经打开并重试', "操作失败");
                    // return;
                    // 无打卡定位设置审核字段 -1：待审核， 0审核失败，1人工审核通过，2自动审核通过
                    auditing = '-1';
                    $confirm('无定位打卡，需要管理员审核，相片和补充说明作为重要凭证。', () => {
                        save()
                    })
                } else {
                    save()
                }
            },
            // 刷新显示定位
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
                        new AMap.LngLat(this.myPosition.lng, this.myPosition.lat),
                        (this.myPosition.poiName || this.myPosition.address)
                    );
                    this.noLocation = false
                }
            },
            // 设置浏览器位置
            setBrowserLocation(data) {
                this.amap.browserLocation = data;
            },

            // 对比两个时间的分钟差 格式00:00
            timeDiff(time1, time2) { // time must be in the form of 00:00
                let a = time1.split(':'),
                    b = time2.split(':');

                let hourDiff = parseInt(a[0]) - parseInt(b[0]);
                let minuteDiff = hourDiff * 60 - (parseInt(a[1]) - parseInt(b[1]));

                return minuteDiff;
            },

            // 把分钟值转成时间
            textOfTimeDiff(diff) {
                let m = diff < 0 ? (-1) * diff : diff;
                let hours = m / 60;
                let minutes = m % 60;
                return (hours == 0 ? '' : hours + '小时') + minutes + '分钟';
            },

            // 提醒打卡类型内容
            remind() {
                let timeCard = this.myTimeCard;
                let message = '';

                if (this.isHoliday() || !this.isWorkDay()) {
                    message = "您今日无需打卡!";
                } else if (timeCard.type == '实时打卡') {
                    message = "您的考勤类型为[实时打卡]，请根据公司要求进行打卡。";
                } else if (timeCard.type == '上下班打卡') {
                    message = "您的考勤类型为[上下班打卡]，请按上下班时间打卡。";
                }

                this.toast(message);
            },

            // 弹窗提醒
            toast(message) {
                if (message) {
                    let r = this.$f7.toast.create({
                        text: message,
                        position: 'center',
                        // position: 'top',
                        closeTimeout: 2000,
                        // closeButton: true,
                        // closeButtonText: '确定'
                    });

                    r.open();
                }
            }, // reminder
        }
    }
</script>
 
