<template>
    <f7-page :id="pageId">
        <f7-navbar title="考勤组设置" back-link>
            <f7-nav-right>
                <f7-link
                        :disabled=true
                        href="#"
                        @click="submit">保存
                </f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-block-title>选项列表</f7-block-title>
        <f7-list inline-labels class="hawk-table">

            <f7-list-input
                    type="text"
                    validate
                    required
                    minlength="1"
                    :value="timecard.name"
                    @input="update({name: $event.target.value})"
                    error-message='名称不能为空'
            >
                <div slot="label" class="hawk-input-label">
                    <span>考勤组名称</span>
                </div>
            </f7-list-input>
            <f7-list-item
                    @click="selectType"
            >
                <div class="hawk-input-label" >
                    <span style="font-size: 17px">考勤类型</span>
                </div>

                <div  style="font-size: 17px" >
                    {{timecard.type}}
                </div>
            </f7-list-item>
           <!-- <f7-list-input
                    label="考勤类型"
                    type="text"
                    validate
                    required
                    :value="timecard.type"
                    @focus="selectType"
                    error-message='名称不能为空'
            >
            </f7-list-input>-->
            <f7-list-item
                    @click="selector.workDay = true"
            >
                <div class="hawk-input-label" >
                    <span style="font-size: 17px">工作日</span>
                </div>

                <div  style="font-size: 17px" >
                    {{workDayStr}}
                </div>
            </f7-list-item>
            <!--<f7-list-input
                    label="工作日"
                    readonly
                    required
                    type="text"
                    :value="workDayStr"
                    @focus="selector.workDay = true"
                    validate
                    error-message='工作日不能为空'
            >
            </f7-list-input>-->
            <f7-list-item
                    @click="selector.workTime = true"
            >
                <div class="hawk-input-label" >
                    <span style="font-size: 17px">工作时间</span>
                </div>

                <div  style="font-size: 17px" >
                    {{workTimeStr}}
                </div>
            </f7-list-item>
           <!-- <f7-list-input
                    label="工作时间"
                    required
                    type="text"
                    :value="workTimeStr"
                    @focus="selector.workTime = true"
                    validate
                    error-message='工作时间不能为空'
            >
            </f7-list-input>-->
            <f7-list-item
                    @click="selector.location = true"
            >
                <div class="hawk-input-label" >
                    <span style="font-size: 17px">考勤地点</span>
                </div>

                <div  style="font-size: 17px" >
                    {{locationStr}}
                </div>
            </f7-list-item>
            <!--<f7-list-input
                    label="考勤地点"
                    required
                    type="text"
                    :value="locationStr"
                    @focus="selector.location = true"
                    validate
                    error-message='考勤地点不能为空'
            >
            </f7-list-input>-->
            <f7-list-item
                    @click="selector.personnel = true"
            >
                <div class="hawk-input-label" >
                    <span style="font-size: 17px">考勤人员</span>
                </div>

                <div  style="font-size: 17px" >
                    {{employeesStr}}
                </div>
            </f7-list-item>
            <!--<f7-list-input
                    label="考勤人员"
                    type="text"
                    :value="employeesStr"
                    @focus="selector.personnel = true"
            >
            </f7-list-input>-->

        </f7-list>

        <f7-popover class="type-selector">
            <f7-list>
                <f7-list-item
                        title="上下班打卡"
                        @click="$emit('timecard:type', '上下班打卡')"
                ></f7-list-item>
                <f7-list-item
                        title="实时打卡"
                        @click="$emit('timecard:type', '实时打卡')"
                ></f7-list-item>
            </f7-list>
        </f7-popover>

        <f7-popup class="workday-selector" :opened="selector.workDay" @popup:closed="selector.workDay = false">
            <f7-page>
                <f7-navbar title="选择工作日">
                    <f7-nav-right>
                        <f7-link @click="selector.workDay = false">确定</f7-link>
                    </f7-nav-right>
                </f7-navbar>
                <f7-list>
                    <f7-list-item checkbox title="星期一" :checked="timecard.workDays[0]"
                                  @change="updateWorkDay(0)"></f7-list-item>
                    <f7-list-item checkbox title="星期二" :checked="timecard.workDays[1]"
                                  @change="updateWorkDay(1)"></f7-list-item>
                    <f7-list-item checkbox title="星期三" :checked="timecard.workDays[2]"
                                  @change="updateWorkDay(2)"></f7-list-item>
                    <f7-list-item checkbox title="星期四" :checked="timecard.workDays[3]"
                                  @change="updateWorkDay(3)"></f7-list-item>
                    <f7-list-item checkbox title="星期五" :checked="timecard.workDays[4]"
                                  @change="updateWorkDay(4)"></f7-list-item>
                    <f7-list-item checkbox title="星期六" :checked="timecard.workDays[5]"
                                  @change="updateWorkDay(5)"></f7-list-item>
                    <f7-list-item checkbox title="星期日" :checked="timecard.workDays[6]"
                                  @change="updateWorkDay(6)"></f7-list-item>
                </f7-list>
            </f7-page>
        </f7-popup>

        <f7-popup id="timecard-worktimeselector" :opened="selector.workTime" @popup:closed="selector.workTime = false">
            <f7-page>
                <f7-navbar title="选择考勤时段">
                    <f7-nav-right>
                        <f7-link @click="submitWorkTime">确定</f7-link>
                    </f7-nav-right>
                </f7-navbar>
                <f7-card v-for="(wt, index) in timecard.workTimes" :key="index">
                    <f7-card-header class="no-border" valign="bottom">打卡时间段</f7-card-header>
                    <f7-card-content>
                        <f7-list inline-labels no-hairlines-md>
                            <f7-list-item title="上班最早打卡时间" @click="openDayPicker($event, wt.start_range,(time)=>{updateWorkTime(index,'start_range',time)})">
                                {{wt.start_range}}
                                <f7-icon fa="clock-o" slot="media"></f7-icon>
                            </f7-list-item>
                            <f7-list-item title="上班时间" @click="openDayPicker($event, wt.start,(time)=>{updateWorkTime(index,'start',time)})">
                                {{wt.start}}
                                <f7-icon fa="clock-o" slot="media"></f7-icon>
                            </f7-list-item>

                            <f7-list-item title="下班时间" @click="openDayPicker($event, wt.end,(time)=>{updateWorkTime(index,'end',time)})">
                                {{wt.end}}
                                <f7-icon fa="clock-o" slot="media"></f7-icon>
                            </f7-list-item>

                            <f7-list-item title="下班最晚打卡时间" @click="openDayPicker($event, wt.end_range,(time)=>{updateWorkTime(index,'end_range',time)})">
                                {{wt.end_range}}
                                <f7-icon fa="clock-o" slot="media"></f7-icon>
                            </f7-list-item>


                            <!--<f7-list-input
                                    label="上班卡结束"
                                    type="time"
                                    :value="wt.start"
                                    @change="updateWorkTime(index, wt.start_range, $event.target.value, wt.end, wt.end_range)"
                            >
                                <f7-icon fa="clock-o" slot="media"></f7-icon>
                            </f7-list-input>

                            <f7-list-input
                                    label="下班卡开始"
                                    type="time"
                                    :value="wt.end"
                                    @change="updateWorkTime(index, wt.start_range, wt.start, $event.target.value, wt.end_range)"
                            >
                                <f7-icon fa="clock-o" slot="media"></f7-icon>
                            </f7-list-input>

                            <f7-list-input
                                    label="下班卡结束"
                                    type="time"
                                    :value="wt.end_range"
                                    @change="updateWorkTime(index, wt.start_range, wt.start, wt.end, $event.target.value)"
                            >
                                <f7-icon fa="clock-o" slot="media"></f7-icon>
                            </f7-list-input>-->

                        </f7-list>
                    </f7-card-content>
                    <f7-card-footer>
                        <f7-link @click="deleteWorkTime(index)">删除该时段</f7-link>
                    </f7-card-footer>
                </f7-card>
                <f7-list>
                    <f7-list-button
                            color="red"
                            :style="{'text-align': 'center'}"
                            title="新增工作时段"
                            @click="addWorkTime('07:30', '09:00', '18:00', '23:00')"></f7-list-button>
                </f7-list>
            </f7-page>
        </f7-popup>

        <f7-popup class="location-selector" :opened="selector.location">
            <f7-page class="location-page">
                <f7-navbar class="location-page-nav" title="选择考勤地点">
                    <f7-nav-right>
                        <f7-link @click="selector.location = false">确定</f7-link>
                    </f7-nav-right>
                </f7-navbar>
                <div class="map">
                    <div id="amap-container" :style="amap.style"></div>
                    <div class="map-input">
                        <input id="pickerInput" placeholder="输入关键字选取地点"/>
                    </div>
                </div>
            </f7-page>
        </f7-popup>

        <f7-popup :opened="selector.personnel" @popup:closed="(selector.personnel = false)">
            <personnelselector
                    :selectedList="timecard.owners"
                    @submit="updateEmployees"
                    @cancel="(selector.personnel = false)"
            ></personnelselector>
        </f7-popup>

    </f7-page>
</template>

<style scoped>
    .map {
        position: relative;
    }

    .map-input {
        position: absolute;
        top: 30px;
        width: 100%;
        margin-left: 10%;
    }

    #pickerInput {
        margin: 0;
        width: 70%;
        text-decoration: none;
        padding: 0 1em;
        outline: 0;
        display: block;
        color: #6a6f77;
        border: 1px solid #c8cccf;
        border-radius: 4px;
        height: 2.7em;
        font-size: 1.4em;
        box-sizing: border-box;
    }
</style>


<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';
    import {createMap, destroyMap} from 'lib/amap';
    import personnelselector from 'gadget/personnelselector.vue';
    import {uniquePageId} from 'lib/utils';

    export default {
        components: {
            personnelselector
        },

        props: {
            lastPage: {
                type: String,
                default: '上一页'
            },
            tId: {
                type: String,
                default: ''
            }
        },

        data: () => {
            return {
                selector: {
                    workDay: false,
                    workTime: false,
                    location: false,
                    personnel: false
                },
                amap: {
                    instance: null,
                    style: {
                        width: '100%',
                        height: '100px'
                    }
                },

                pageId: uniquePageId('timecard'),
            }
        },

        mounted: function () {

            this.load(this.tId);
            let windowHeight = window.outerHeight > 0 ? window.outerHeight : window.innerHeight; // this will change by input method

            this.$f7.on('popupOpened', (ev) => {

                if (this.selector.location && !this.amap.instance) {
                    let navHeight = document.querySelector('.location-page-nav').clientHeight;
                    ;
                    this.amap.style.height = (windowHeight - navHeight) + 'px';

                    this.amap.instance = createMap('amap-container', {
                        poiPickerInputId: "pickerInput",
                        poiPickerCallBack: this.getLocation,
                        zoom: 'rb'
                    });
                }

            });
        },

        computed: {
            ...mapGetters([
                'timecard',
                'personnel',
                'myCompany'
            ]),

            employeesStr() {
                let l = [];
                this.personnel.forEach((p) => {
                    if (this.timecard.owners.includes(p._id)) {
                        l.push(p.name);
                    }
                });

                if (l.length == 0) return '';
                if (l.length < 3) return l.join(',');
                if (l.length >= 3) return l[0] + '等' + l.length + '人';

                return '';
            },

            workDayStr() {
                return ['一', '二', '三', '四', '五', '六', '日'].filter((v, index) => {
                    return this.timecard.workDays[index];
                }).join('、');
            },

            workTimeStr() {
                return this.timecard.workTimes.reduce((acc, v) => {
                    console.log(acc, v)
                    return acc + (acc == '' ? '' : ', ') + `${v.start_range}-${v.start}和${v.end}-${v.end_range}`;
                }, '');
            },

            locationStr() {
                let loc = this.timecard.location;
                return loc.name || '';
            }
        },

        methods: {
            openDayPicker(ev, when,done) {
                let input = ev.target;
                if (input.picker) {
                    input.picker.open();
                    return;
                }
                let self = this;
                let tmp
                input.picker = this.$f7.picker.create({
                    inputEl: '#' + input.id,
                    toolbarCloseText: '完成',
                    rotateEffect: true,
                    cols: [
                        {
                            textAlign: 'center',
                            values:this.toArr(0,23),
                            displayValues:this.toArr(0,59)
                        },
                        {
                            textAlign: 'center',
                            values:[':'],
                            displayValues:[':']
                        },
                        {
                            textAlign: 'center',
                            values:this.toArr(0,59),
                            displayValues:this.toArr(0,59)
                        }
                    ],
                    on: {
                        change:(picker, values, displayValues)=>{
                            let h = values[0];
                            let m = values[2];
                            tmp = h+":"+m
                            // when[name] = h+":"+m
                        },
                        close:()=>{
                            when = tmp
                            done(tmp)
                        }
                    }
                });
                let timeArr = when.split(":")
                input.picker.setValue(timeArr)
                input.picker.open();
            },

            toArr(start,end){
                let arr = []
                for(start;start<=end;start++){
                    arr.push(start<10?'0'+start:start)
                }
                return arr
            },

            submit() {
                if (document.querySelectorAll(`#${this.pageId} item-input-invalid`).length > 0) {
                    $alert('请改正错误的输入', '操作失败');
                    return;
                }

                if (!this.timecard.name) {
                    $alert('名称不能为空', '操作失败');
                    return;
                }

                if (!this.timecard.type) {
                    $alert('类型不能为空', '操作失败');
                    return;
                }

                if (!this.timecard.workDays.find(i => i == true)) {
                    $alert('工作日不能为空', '操作失败');
                    return;
                }

                if (!this.timecard.workTimes && this.timecard.workTimes.length == 0) {
                    $alert('工作时间不能为空', '操作失败');
                    return;
                }

                let duplicatedName = false;
                this.myCompany.timeCards.forEach((tc) => {
                    if (tc.name == this.timecard.name &&
                        tc._id != this.timecard._id) {
                        duplicatedName = true;
                    }
                });

                if (duplicatedName) {
                    $alert('考勤组的名字不能重复', '操作失败');
                    return;
                }

                $dialog.preloader('正在保存考勤组设置');

                this.save().then(() => {
                    $dialog.close();
                    $alert('保存考勤组设置成功', '操作成功');
                    this.reloadCompany().catch((err) => {
                        console.error('try to reload company setting but failed');
                    });
                    this.$f7router.back();
                }).catch((err) => {
                    console.error(err);
                    $dialog.close();
                    $alert('无法保存考勤组设置，请联系管理员', '操作失败');
                })

            },

            selectType(event) {
                this.$f7.popover.open('.type-selector', event.target, true);
                this.$once('timecard:type', (v) => {
                    this.$f7.popover.close('.type-selector');
                    let type = v;
                    if (type) {
                        this.update({type})
                    }
                });
            },

            updateEmployees(uIds) {
                this.selector.personnel = false;
                let owners = uIds ? uIds.slice(0) : [];
                this.update({owners});
            },

            updateWorkTime(index,key,value) {
                let workTimes = this.timecard.workTimes.slice(0);
                workTimes[index][key] = value
                // workTimes.splice(index, 1, workTimes[index]);
                this.update({workTimes});
            },

            deleteWorkTime(index) {
                let workTimes = this.timecard.workTimes.slice(0);
                workTimes.splice(index, 1);
                this.update({workTimes});
            },

            addWorkTime(start_range, start, end, end_range) {
                let workTimes = this.timecard.workTimes.slice(0);
                workTimes.push({start_range, start, end, end_range});
                this.update({workTimes});
            },

            updateWorkDay(index) {
                let workDays = this.timecard.workDays.slice(0);
                workDays[index] = !workDays[index];
                this.update({workDays});
            },

            getLocation(poi) {
                $('#pickerInput').val(poi.item.name);

                let range = 500;

                let ac = this.$f7.actions.create({
                    buttons: [
                        {
                            text: '请选择"' + poi.item.name + '"附近的考勤范围',
                            label: true
                        },
                        {
                            text: '500米',
                            onClick: () => {
                                range = 500;
                            }
                        },
                        {
                            text: '1公里',
                            onClick: () => {
                                range = 1000;
                            }
                        },
                        {
                            text: '2公里',
                            onClick: () => {
                                range = 2000;
                            }
                        },
                        {
                            text: '取消',
                            color: 'red'
                        },
                    ],
                    on: {
                        closed: () => {
                            this.update({
                                location: {
                                    name: poi.item.name,
                                    id: poi.item.id,
                                    address: poi.item.address,
                                    district: poi.item.district,
                                    lng: poi.item.location.lng,
                                    lat: poi.item.location.lat,
                                    range: range
                                }
                            });
                            ac.destroy();
                        }
                    }
                });

                ac.open();
            },

            submitWorkTime() {
                let wt = this.checkWorkTimes(this.timecard.workTimes)
                if(typeof wt == 'string'){
                    $alert(wt)
                }else{
                    this.selector.workTime = false;
                }
            },
            // 防止打卡时间区间出现重叠
            checkWorkTimes(workTimes) {

                let wts = this.workTimesValue(workTimes)
                if (!wts) return '时间格式错误'

                // 单个时间段 判断重叠
                for (let i in wts) {
                    let wt = wts[i]

                    let {start, end, start_range, end_range} = wt;

                    if (start_range < start && start < end && end < end_range) {

                    }else{
                        return '时间大小：上班开始 < 上班结束 < 下班开始 < 下班结束'
                    }
                }

                // 多个时间段 判断重叠
                for (let i in wts) {
                    let w = wts[i]
                    for (let ii in wts) {
                        let ww = wts[ii]
                        if(ww == w)continue
                        if (w.end_range < ww.start_range || w.start_range > ww.end_range) {

                        }else{
                            return '时间区间出现重叠'
                        }
                    }
                }
                return true
            },
            // 将workTimes的字符时间转为数值
            workTimesValue(wts) {
                let arr = []
                let error = false
                function toV(t) {
                    // t = '08:00'  返回分钟数
                    let tt = t.split(':')
                    if (tt.length != 2) {
                        error = true
                        return
                    }
                    let h = parseInt(tt[0])
                    let m = parseInt(tt[1])
                    let v = h * 60 + m
                    return v
                }

                for (let key in wts) {
                    let item = wts[key]
                    if (!item.start || !item.end || !item.start_range || !item.end_range) {
                    }
                    arr.push({
                        start_range: toV(item.start_range),
                        start: toV(item.start),
                        end: toV(item.end),
                        end_range: toV(item.end_range)
                    })
                }
                if (error) return false
                return arr
            },
            ...mapMutations({
                'update': 'UPDATE_TIMECARD'
            }),

            ...mapActions({
                'save': 'TIMECARD_SAVE',
                'reloadCompany': 'LOAD_COM',
                'load': 'TIMECARD_LOAD'
            })
        },
    }
</script>
