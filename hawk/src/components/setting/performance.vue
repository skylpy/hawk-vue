<template>
    <f7-page :page-content="false">
        <f7-navbar title="任务指标设置" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="newIndex">新增指标</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-toolbar tabbar>
            <f7-link tab-link="#taskIndex" tab-link-active>任务指标</f7-link>
            <f7-link tab-link="#attendanceIndex">考勤指标</f7-link>
        </f7-toolbar>

        <f7-tabs>
            <f7-tab id="taskIndex" class="page-content" tab-active @tab:show="toggle">
                <f7-block-title>任务指标列表</f7-block-title>
                <f7-list media-list>
                    <f7-list-item
                        v-for="(ti, index) in taskIndexes"
                        :key="index"
                        :title="ti.name"
                        link="#"
                        after="编辑"
                        @click="openTaskIndexEditor(ti)"
                    >
                        <f7-icon slot="media" fa="hashtag"></f7-icon>
                    </f7-list-item>
                </f7-list>
            </f7-tab>

            <f7-tab id="attendanceIndex" class="page-content" @tab:show="toggle">
                <f7-block-title>考勤指标列表</f7-block-title>
                <f7-list media-list>
                    <f7-list-item
                        v-for="(ai, index) in attendanceIndexes"
                        :key="index"
                        :title="ai.name"
                        link="#"
                        @click="openAttendanceIndexEditor(ai)"
                    >
                        <f7-icon slot="media" fa="hashtag"></f7-icon>
                        <div slot="after-title">{{ai.quantity + unit(ai.name)}}</div>
                        <div slot="after">扣{{ai.penalty || '0'}}分</div>
                    </f7-list-item>
                </f7-list>
            </f7-tab>
        </f7-tabs>

        <f7-popup id="taskindex-editor">
            <f7-page>
                <f7-navbar title="编辑任务指标">
                    <f7-nav-right>
                        <f7-link href="#" @click="$f7.popup.close('#taskindex-editor')">取消</f7-link>
                        <f7-link v-if="IamAdmin" href="#" @click="submitTaskIndex">保存</f7-link>
                    </f7-nav-right>
                </f7-navbar>

                <f7-toolbar :bottom-md="true" v-if="IamAdmin">
                    <f7-link href="#" @click="removeTaskIndex">删除指标</f7-link>
                    <f7-link href="#" @click="addTaskIndexBenchmark">新增参数</f7-link>
                </f7-toolbar>

                <f7-block-title> {{taskIndex.name}} 
                    <f7-link href="#" @click="renameTaskIndex" style="font-size:small; float:right">重命名</f7-link>
                </f7-block-title>
                <f7-list 
                    media-list
                    inset
                    v-for="(bm, index) in taskIndex.benchmarks"
                    :key="index"
                >
                    <f7-list-item title="完成度(%)">
                        <f7-stepper 
                            small raised 
                            slot="after" 
                            :min="0" :max="100"
                            :autorepeat="true" :wraps="true" 
                            :manual-input-mode="true" 
                            :value="bm.ratio"
                            @input="bm.ratio = parseInt($event.target.value)"
                        ></f7-stepper>
                    </f7-list-item>
                    <f7-list-item title="扣分">
                        <f7-stepper 
                            small raised 
                            slot="after" 
                            :min="0"
                            :max="9999"
                            :manual-input-mode="true" 
                            :value="bm.penalty"
                            @input="bm.penalty = parseInt($event.target.value)"
                        ></f7-stepper>
                    </f7-list-item>
                    <f7-list-item>
                        <f7-link slot="after" href="#" style="color:red" @click="removeTaskIndexBenchmark(index)">删除参数</f7-link>
                    </f7-list-item>
                </f7-list>

            </f7-page>
        </f7-popup>

        <f7-popup id="attendanceindex-editor">
            <f7-view><f7-page>
                <f7-navbar title="编辑考勤指标">
                    <f7-nav-right>
                        <f7-link href="#" @click="$f7.popup.close('#attendanceindex-editor')">取消</f7-link>
                        <f7-link v-if="IamAdmin" href="#" @click="submitAttendanceIndex">保存</f7-link>
                    </f7-nav-right>
                </f7-navbar>

                <f7-toolbar :bottom-md="true" v-if="IamAdmin">
                    <f7-link href="#" @click="removeAttendanceIndex">删除指标</f7-link>
                </f7-toolbar>

                <f7-block-title>考勤指标选项</f7-block-title>
                <f7-list>
                    <f7-list-item
                        link="#" title="类别"
                        smart-select :smart-select-params="{openIn: 'popover', closeOnSelect: true}"
                        ref="attendanceIndex_name"
                    >
                        <select @change="attendanceIndex.name = $event.target.value">
                            <option
                                :value="a"
                                v-for="(a, i) in Object.keys(attendance)" :key="i" 
                                :selected="a == attendanceIndex.name"
                            >{{a}}</option>
                        </select>
                    </f7-list-item>

                    <f7-list-item v-if="attendanceIndex.name != '不打卡'" :title="unit(attendanceIndex.name) || '分钟'">
                        <f7-stepper 
                            small raised 
                            slot="after" 
                            :min="0"
                            :manual-input-mode="true" 
                            :value="attendanceIndex.quantity"
                            @input="attendanceIndex.quantity = parseInt($event.target.value)"
                        ></f7-stepper>
                    </f7-list-item>

                    <f7-list-item title="扣分">
                        <f7-stepper 
                            small raised 
                            slot="after" 
                            :min="0"
                            :manual-input-mode="true" 
                            :value="attendanceIndex.penalty"
                            @input="attendanceIndex.penalty = parseInt($event.target.value)"
                        ></f7-stepper>
                    </f7-list-item>
                </f7-list>
            </f7-page></f7-view>
        </f7-popup>

    </f7-page>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';

export default {
    props: {
        lastPage: {
            type: String,
            default: '上一页'
        },
    },

    data() {
        return {
            tab: 'taskIndex',

            attendance: {
                '迟到': '分钟',
                '早退': '分钟',
                '不打卡': '次'
            },

            taskIndex: {
                name: '',
                benchmarks: []
            },

            attendanceIndex: {
                name: '',
                quantity: 0,
                penalty: 0
            }
        }
    },

    computed: {
        ...mapGetters([
            'myCompany',
            'IamAdmin'
        ]),

        taskIndexes() {
            return this.myCompany.taskIndexes;
        },

        attendanceIndexes() {
            return this.myCompany.attendanceIndexes;
        }
    },

    methods: {

        ...mapMutations({
            'update': 'COM_UPDATE'
        }),

        ...mapActions({
            'save': 'SAVE_COM_KEY',
            'load': 'LOAD_COM'
        }),

        unit(name) {
            return this.attendance[name];
        },

        toggle(ev) {
            this.tab = ev.target.id;
        },

        newIndex() {
            if (this.tab == 'taskIndex') this.openTaskIndexEditor(null);
            if (this.tab == 'attendanceIndex') this.openAttendanceIndexEditor(null);
        },

        openAttendanceIndexEditor(attendanceIndex) {
            if (attendanceIndex) {
                this.attendanceIndex = JSON.parse(JSON.stringify(attendanceIndex));
            } else {
                this.attendanceIndex = { name: '迟到', quantity: 0, penalty: 0 };
            }            

            if (this.attendanceIndex.name) this.$refs.attendanceIndex_name.f7SmartSelect.setValue(this.attendanceIndex.name);

            $popup.open('#attendanceindex-editor');
        },
        
        submitAttendanceIndex() {
            let attendanceIndexes = this.attendanceIndexes.slice(0);
            if (this.attendanceIndex._id) {
                attendanceIndexes = attendanceIndexes.filter(ti => ti._id != this.attendanceIndex._id);
            }
            attendanceIndexes.push(this.attendanceIndex);
            this.update({attendanceIndexes});
            this.saveIndex();
        },

        removeAttendanceIndex() {
            let deleteId = this.attendanceIndex._id;

            if (!deleteId) {
                console.error('invalid attendanceIndex _id to delete');
                return;
            }

            $confirm('确定要删除该指标吗？', '操作确认', () => {

                let attendanceIndexes = this.attendanceIndexes.filter(ai => {
                    return ai._id != deleteId;
                })

                this.update({attendanceIndexes});
                this.saveIndex();
            })
        },

        renameTaskIndex() {
            $prompt('请填入新的名称', '更改指标名称', (value) => {
                if (value) this.taskIndex.name = value;
            });
        },

        addTaskIndexBenchmark() {
            this.taskIndex.benchmarks.push({ratio: 0, penalty: 0});
        },

        removeTaskIndexBenchmark(index) {
            this.taskIndex.benchmarks.splice(index, 1);
        },

        submitTaskIndex() {
            let taskIndexes = this.taskIndexes.slice(0);
            if (this.taskIndex._id) {
                taskIndexes = taskIndexes.filter(ti => ti._id != this.taskIndex._id);
            }
            taskIndexes.push(this.taskIndex);
            this.update({taskIndexes});
            this.saveIndex();
        },

        saveIndex() {
            let popup = this.tab == 'taskIndex' ? '#taskindex-editor' : '#attendanceindex-editor';
            let attr = this.tab == 'taskIndex' ? 'taskIndexes' : 'attendanceIndexes';

            $preloader.show();
            this.save(attr).then(() => {
                this.load();
                this.$forceUpdate();
                $preloader.hide();
                $popup.close(popup);
            }).catch(err => {
                $preloader.hide();
                console.log(err);
                $alert('无法保存数据，请稍后再试', '操作失败');
            })            
        },

        openTaskIndexEditor(taskIndex) {
            if (taskIndex) {
                this.taskIndex = JSON.parse(JSON.stringify(taskIndex));
                $popup.open('#taskindex-editor');
                return;
            } else {
                $prompt('输入新任务指标的名称', '新建指标', (name) => {
                    if (this.taskIndexes.find(ti => (ti.name == name))) {
                        $alert('任务指标的名字不能重复', '操作错误');
                        return;
                    }
                    this.taskIndex = {name, benchmarks: [{ratio: 100, penalty: 0}]};
                    $popup.open('#taskindex-editor');
                });
            }
        },

        removeTaskIndex() {
            let deleteId = this.taskIndex._id;

            if (!deleteId) {
                console.error('invalid taskIndex _id to delete');
                return;
            }

            $confirm('确定要删除该指标吗？', '操作确认', () => {

                let taskIndexes = this.taskIndexes.filter(ti => {
                    return ti._id != deleteId;
                })

                this.update({taskIndexes});
                this.saveIndex();
            })
        },
    }
}
</script>

