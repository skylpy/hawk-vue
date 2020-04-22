<template>
    <f7-page>
        <f7-navbar title="工作轨迹" back-link>
            <f7-nav-right>
                <f7-link icon-fa="refresh" @click="refresh"></f7-link>
                <f7-link href="#" @click="$f7.popup.open('#trace-details')">详情</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-list
                inline-labels no-hairlines-md
                class="trace-filter"
        >
            <f7-list-input
                    label="员工"
                    :value="employee && who(employee).name || ''"
                    @focus="$f7.popup.open('#trace-personnelselector')"
            >
                <f7-icon slot="media" fa="user"></f7-icon>
            </f7-list-input>
            <f7-list-input
                    input-id="trace-date-input"
                    label="日期"
                    @focus="openDatePicker"
                    :value="date"
                    @change="date = $event.target.value"
            >
                <f7-icon slot="media" fa="calendar"></f7-icon>
            </f7-list-input>
        </f7-list>

        <div class="map">
            <div id="trace-amap-container" :style="amap.style"></div>
        </div>

        <!-- FAB Right Bottom (Orange) -->
        <f7-fab class="fn_bottom" position="right-bottom" slot="fixed" color="green">
            <f7-icon ios="f7:add" md="material:add"></f7-icon>
            <f7-icon ios="f7:close" md="material:close"></f7-icon>
            <f7-fab-buttons position="top">
                <f7-fab-button label="原始点路径" @click="openGraspRoad=false;">原始</f7-fab-button>
                <f7-fab-button label="轨道纠偏路径" @click="openGraspRoad=true;">纠偏</f7-fab-button>
                <f7-fab-button label="添加工作内容" @click="addMarkerFun">添加</f7-fab-button>
            </f7-fab-buttons>
        </f7-fab>

        <f7-popup id="trace-personnelselector">
            <personnelselector
                    :multiple="false"
                    :subordinate="true"
                    :isFilterSub="true"
                    @submit="selectEmployee"
                    @cancel="$f7.popup.close('#trace-personnelselector')"
            ></personnelselector>
        </f7-popup>


        <f7-popup id="trace-details">
            <f7-page>
                <f7-navbar title="轨迹详情">
                    <f7-nav-right>
                        <f7-link href="#" @click="$f7.popup.close('#trace-details')">确定</f7-link>
                    </f7-nav-right>
                </f7-navbar>

                <f7-list style="margin-top:0" id="hawk-trace-list" v-for="(move, index) in getDetail" :key="index">

                    <template v-if="move.path.length == 1">
                        <f7-list-item
                                :title="'停留时间' + lingerInterval(move)"
                                group-title>
                        </f7-list-item>

                        <f7-list-input
                                :label="move.from + '-' + move.to"
                                :value="move.path[0].address"
                                readonly>
                        </f7-list-input>
                    </template>

                    <template v-if="move.path.length > 1">
                        <f7-list-item
                                :title="'行进时间' + lingerInterval(move)"
                                group-title>
                        </f7-list-item>
                        <f7-list-input v-for="(pos, n) in move.path"
                                       :label="moment(pos.locatetime).format('YYYY-MM-DD HH:mm:ss')"
                                       :value="pos.address"
                                       readonly
                                       :key="n"
                        >
                        </f7-list-input>
                    </template>
                </f7-list>
            </f7-page>
        </f7-popup>
    </f7-page>
</template>

<style scoped>
    .fn_bottom{
        z-index: 1500;
    }
    .trace-filter {
        background: rgba(255, 255, 255, 0.7);
        position: absolute;
        margin-top: 0;
        width: 100%;
    }

    .map {
        position: relative;
    }

    .map-input {
        position: absolute;
        bottom: 50px;
        margin-left: 30px;
    }
</style>

<script>
    import {defaultImgUrl} from 'lib/loading';
    import {mapGetters, mapActions} from 'vuex';
    import personnelselector from 'gadget/personnelselector.vue';
    import {createMap, addMarkers, drawPath, getVisibleHeight, showInfo, getAddress} from 'lib/amap';
    import axios from 'axios';
    import moment from 'moment'

    export default {
        components: {
            personnelselector
        },

        props: [
            'lastPage'
        ],

        data() {
            return {
                employee: '',
                date: (new Date()).toHawkDateString(),
                records: [],

                amap: {
                    instance: null,
                    style: {
                        width: '100%',
                        height: '100px'
                    },
                    path: null
                },
                nodatawarning: null,
                openGraspRoad: false //打开纠偏
            }
        },

        computed: {
            ...mapGetters([
                'myUserId',
                'who',
                'trace',
            ]),
            getDetail () {
                let list = this.analyzeTrace()
                return list
            }
        },

        watch: {
            employee: function (value, oldvalue) {
                this.loadTrace();
            },
            date: function (value, oldvalue) {
                this.loadTrace();
            },
            records: function (value, oldvalue) {
                this.showTrace();
            },
            openGraspRoad () {
                this.loadTrace();
            }
        },

        mounted() {
            this.loadMap();

            if (!this.employee) {
                this.employee = this.myUserId;
            }

            if (!this.nodatawarning) {
                this.nodatawarning = $f7.toast.create({
                    text: '没有轨迹数据，无法展示轨迹',
                    position: 'center',
                    closeTimeout: 2000,
                });
            }
        },

        methods: {
            moment,
            refresh() {
                this.loadTrace();
            },

            getInternval(from, to) {
                let diff = Date.parseHawkString(to).getTime() - Date.parseHawkString(from).getTime();
                let h = Math.floor(diff / (60 * 60000));
                let m = Math.floor((diff % (60 * 60000)) / 60000);
                let s = Math.floor(((diff % (60 * 60000)) % 60000) / 1000);

                return (h ? `${h}小时` : '') + (m ? `${m}分钟` : '') + (s ? `${s}秒` : '');
            },

            lingerInterval(move) {
                let {from, to} = move;
                if (!from || !to) return 0;
                return this.getInternval(from, to);
            },

            loadMap() {
                this.amap.style.height = getVisibleHeight() + 'px';
                this.amap.instance = createMap('trace-amap-container', {zoom: 'lb'});
                this.amap.path = drawPath(this.amap.instance);
                this.amap.path.on('pathClick pointClick', this.showPathDetail);

                if (!this.amap.instance) console.error('Failed to create map');
                if (!this.amap.path) console.error('Failed to create path');
            },

            async showPathDetail(event, info) {
                let params = {
                    title: '员工轨迹',
                    content: '',
                    center: this.amap.instance.getCenter()
                };
                let path = this.records;

                if (info.type == 'path') {
                    let start_time = moment(this.records[0].locatetime).format('YYYY-MM-DD HH:mm:ss');
                    let end_time = moment(this.records[this.records.length - 1].locatetime).format('YYYY-MM-DD HH:mm:ss');
                    let totalDist = 0;

                    for (let n = 0; n < this.records.length - 2; n++) {
                        totalDist += AMap.GeometryUtil.distance([path[n].location.split(',')[0], path[n].location.split(',')[1]], [path[n + 1].location.split(',')[0], path[n + 1].location.split(',')[1]]);
                    }

                    params.title = '员工轨迹';
                    params.content = `
                        <span>开始时间：${start_time}</span><br>
                        <span>结束时间：${end_time}</span><br>
                        <span>总距离：${totalDist.toFixed(2)}米</span><br>
                        `;

                } else if (info.type == 'point') {
                    let pt = info.pathData.path[info.pointIndex];
                    let traces = this.records.filter(r => AMap.GeometryUtil.distance([r.location.split(',')[0], r.location.split(',')[1]], pt) < 50 /*meter*/)

                    if (traces.length) {
                        let address = null;
                        let arr = traces.slice(0);
                        arr.sort((a, b) => a.accuracy < b.accuracy);
                        address = await getAddress(arr[0].location.split(',')[0], arr[0].location.split(',')[1]);

                        let lingeringInterval = 0;

                        if (traces.length == 1) {
                            lingeringInterval = '少于一分钟';
                        } else {
                            lingeringInterval = this.getInternval(moment(traces[0].locatetime).format('YYYY-MM-DD HH:mm:ss'), moment(traces[traces.length - 1].locatetime).format('YYYY-MM-DD HH:mm:ss'));
                        }

                        params.title = '员工轨迹节点';
                        params.content = `
                            <span>停留时间：${lingeringInterval}</span><br>
                            <span>地点：${address}</span><br>
                            `;
                        params.center = pt;
                    }

                }

                showInfo(this.amap.instance, params);
            },

            selectEmployee(pList) {
                if (pList && pList[0]) this.employee = pList[0];
                $popup.close('#trace-personnelselector');
            },

            openDatePicker() {
                if (!this.datepicker) {
                    this.datepicker = $calendar.create({
                        inputEl: '#trace-date-input',
                        minDate: new Date(Date.now() - 30 * 24 * 3600 * 1000),
                        maxDate: new Date(),
                        closeOnSelect: true
                    });
                }
                this.datepicker.open();
            },

            analyzeTrace() {
                if (!this.records || this.records.length == 0) return [];

                let pos = this.records[0];
                let moves = [{
                    from: moment(pos.locatetime).format('YYYY-MM-DD HH:mm:ss'),
                    to: moment(pos.locatetime).format('YYYY-MM-DD HH:mm:ss'),
                    path: [pos]
                }];
                //
                for (let n = 1; n < this.records.length; n++) {
                    let new_pos = this.records[n];
                    let time_diff = Date.parseHawkString(moment(new_pos.locatetime).format('YYYY-MM-DD HH:mm:ss')).getTime() - Date.parseHawkString(moment(pos.locatetime).format('YYYY-MM-DD HH:mm:ss')).getTime();
                    let loc_diff = AMap.GeometryUtil.distance([
                        new_pos.location.split(',')[0],
                        new_pos.location.split(',')[1]
                    ], [
                        pos.location.split(',')[0],
                        pos.location.split(',')[1]
                    ]);

                    if (time_diff > 10 * 60000/* 10 min */ && loc_diff > 500/* meter */) {
                        // missing geolocation data for over 10 minutes, consider a new path
                        moves.push({
                            from: moment(new_pos.locatetime).format('YYYY-MM-DD HH:mm:ss'),
                            to: moment(new_pos.locatetime).format('YYYY-MM-DD HH:mm:ss'),
                            path: [new_pos]
                        });
                        pos = new_pos;

                    } else {
                        // continue with the exiting path
                        let lastMove = moves[moves.length - 1];
                        lastMove.to = moment(new_pos.locatetime).format('YYYY-MM-DD HH:mm:ss');

                        if (loc_diff < CONFIG.trace.minOffset) {
                            // skip it, consider user is lingering
                            if (new_pos.accuracy && pos.accuracy && new_pos.accuracy < pos.accuracy) {
                                lastMove.path[lastMove.path.length - 1] = new_pos;
                                pos = new_pos;
                            }
                        } else {
                            // add point in the last move
                            lastMove.path.push(new_pos);
                            pos = new_pos;
                        }
                    }
                }
                moves.forEach(async v => {
                    v.path.forEach(async item => {
                        let a = item.location.split(',')[0]
                        let b = item.location.split(',')[1]
                        item.address = await getAddress(a, b);
                        this.$forceUpdate()
                    })
                })
                return moves;
            },

            showTrace() {
                // clean it up first
                this.amap.path && this.amap.path.setData();
                let self = this;

                if (!this.records || this.records.length == 0) {
                    this.nodatawarning.open();
                    return;
                }

                if (!this.amap.path) {
                    console.error('no valid path on map');
                    return;
                }

                // let get_sec = (at) => Math.floor(Date.parseHawkString(at).getTime() / 1000);
                // let start_sec = get_sec(self.records[0].at);
                let data = self.records.map(pt => {
                    return {
                        x: pt.location.split(',')[0],
                        y: pt.location.split(',')[1],
                        sp: pt.speed,
                        ag: pt.accuracy,
                        tm: moment(pt.locatetime).format('YYYY-MM-DD HH:mm:ss')
                    }
                });

                // const OriginalPoint = true // 原始点轨迹
                // const GraspRoad = true // 开启轨迹纠正

                // 原始点轨迹
                self.amap.path.setData([{
                    name: data[0].tm + '至' + data[data.length - 1].tm,
                    path: data.map(d => [d.x, d.y])
                }]);

                // if (this.openGraspRoad) { // 纠正点轨迹
                //
                //     // 分割数据
                //     let dataArr = []
                //     for (var i = 0; i < data.length; i = i + 500) {
                //         dataArr.push(data.slice(i, i + 500));
                //     }
                //
                //     AMap.plugin('AMap.GraspRoad', function () {
                //         let grasp = new AMap.GraspRoad();
                //         let count = 1//dataArr.length
                //         let isError = false
                //         dataArr.forEach((itemArr, index) => {
                //             const _index = index
                //             grasp.driving(itemArr, function (error, result) {
                //                 count--;
                //                 if (!error) {
                //                     //纠偏后的轨迹
                //                     dataArr[_index] = result.data.points;
                //                     // distance = result.data.distance;
                //                 } else {
                //                     isError = true
                //                     console.log('无法使用轨迹纠偏，使用定位轨迹', error)
                //                     // console.error(error);
                //                 }
                //                 if (count <= 0) {
                //                     if (!isError) {
                //                         let outData = []
                //                         for (var i in dataArr) {
                //                             outData = outData.concat(dataArr[i]);
                //                         }
                //                         if(outData.length>1){
                //                             console.log('使用轨迹纠偏')
                //                             self.amap.path.setData([{
                //                                 name: self.records[0].at + '至' + self.records[self.records.length - 1].at,
                //                                 path: outData.map(d => [d.x, d.y])
                //                             }]);
                //                             return
                //                         }
                //                     }
                //                     $alert('该轨迹不能纠偏')
                //                 }
                //             })
                //         })
                //     })
                // }
            },

            loadTrace() {
                if (!this.date) return;
                let date = new Date(this.date);
                let userId = this.employee || this.myUserId;
                let openGraspRoad = this.openGraspRoad;
                this.records = [];

                $preloader.show();
                axios.get('api/trace?q=' + JSON.stringify({
                    userId,
                    date,
                    openGraspRoad
                })).then(resp => {
                    $preloader.hide();
                    if (resp.data) this.records = resp.data
                    // this.records = resp.data && (resp.data)[0] && (resp.data)[0].records.slice(0) || [];
                    console.log(this.records);
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                });

                axios.get('api/trace/maker?q=' + JSON.stringify({userId, date})).then(res => {
                    console.log(res.data)
                    if (res.data && res.data.length) {
                        addMarkers(
                            this.amap.instance,
                            res.data
                        );
                    }
                })

            },

            addMarkerFun () {
                if (device.platform == "Android" || device.platform == "iOS") {
                    let self = this
                    if (cordova.plugins.aMapLocation) {
                        cordova.plugins.aMapLocation.getCurrentPosition(null,  (response) => {
                            $prompt('请输入工作内容', '添加工作内容', (content) => {
                                if (!content) {
                                    $alert('工作内容不能为空', '操作错误');
                                    return;
                                }
                                let data = {
                                    lng: response.longitude,
                                    lat: response.latitude,
                                    address: response.address,
                                    at: response.date,
                                    content: content
                                }
                                axios.post('/api/trace/create', data).then(res => {
                                   this.loadTrace()
                                })
                            })
                        }, function (response) {
                            console.error('获取定位失败');
                        })
                    } else {
                        $alert('加载定位插件失败', '操作错误');
                    }
                } else {
                    $alert('请在手机上操作', '操作错误');
                }
            }
        }
    }
</script>

