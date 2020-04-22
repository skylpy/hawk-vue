<template>
    <f7-page>
        <f7-navbar title="考勤设置" back-link>
        </f7-navbar>

        <f7-block-title>考勤组列表</f7-block-title>
        <f7-card v-for="s in getTimeCardSummary()" :key="s.name">
            <f7-card-header valign="bottom"> {{s.name}} </f7-card-header>
            <f7-card-content>
                <f7-list>
                    <f7-list-item header="考勤类型" :title="s.type">
                        <f7-icon slot="media" f7="compose"></f7-icon>
                    </f7-list-item>
                    <f7-list-item header="工作日" :title="s.workDays">
                        <f7-icon slot="media" f7="calendar"></f7-icon>
                    </f7-list-item>
                    <f7-list-item header="考勤时段" :title="s.workTimes">
                        <f7-icon slot="media" f7="time"></f7-icon>
                    </f7-list-item>
                    <f7-list-item header="考勤地点" :title="s.location">
                        <f7-icon slot="media" f7="compass"></f7-icon>
                    </f7-list-item>
                    <f7-list-item header="考勤员工" :title="s.owners">
                        <f7-icon slot="media" f7="person"></f7-icon>
                    </f7-list-item>
                </f7-list>
            </f7-card-content>
            <f7-card-footer>
                <f7-link @click="editTimeCard(s._id)">编辑</f7-link>
                <f7-link @click="removeTimeCard(s)">删除</f7-link>
            </f7-card-footer>
        </f7-card>

        <f7-block v-if="!timeCards || timeCards.length < 1">
            <p>没有已经定义的考勤组</p>
        </f7-block>

        <f7-block>
            <f7-link href="#" @click="editTimeCard('')">新增考勤组</f7-link>
        </f7-block>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';

export default {
    props: {
        lastPage: String,
        default: '上一页'
    },
    data: () => {
        return {

        }
    },

    computed: {
        ...mapGetters([
            'myCompany',
            'personnel'
        ]),

        timeCards() {
            return this.myCompany.timeCards;
        },
    },

    methods: {
        ...mapMutations({
            'cleanup': 'UPDATE_TIMECARD'
        }),
        ...mapActions({
            'remove': 'TIMECARD_DELETE'
        }),


        editTimeCard(tcId) {
            this.$f7router.navigate('/setting/company/timecard', {
                props: {
                    lastPage: '考勤设置',
                    tId: tcId
                }
            })
        },

        removeTimeCard(tcs) {
            $dialog.confirm('确定要删除"' + tcs.name + '"的设置吗？', '删除数据', () => {
                $dialog.preloader('正在删除设置');

                this.remove(tcs._id).then(() => {
                    $dialog.close();
                    $alert('删除考勤组设置成功', '操作成功');
                }).catch((err) => {
                    console.error(err);
                    $dialog.close();
                    $alert('无法删除考勤组设置，请联系管理员', '操作失败');
                })

            });
        },

        getTimeCardSummary() {
            let tcs = [];
            this.timeCards.forEach((tc) => {
                let s = {};
                s._id = tc._id;
                s.name = tc.name;
                s.type = tc.type;
                s.workDays = ['一', '二', '三', '四', '五' , '六', '日'].filter((v, index) => { return tc.workDays[index] }).join('、');
                s.workTimes = tc.workTimes.map(wt => { return wt.start_range + '-' + wt.end_range }).join(', ');
                s.owners = this.getUsersName(tc.owners)
                s.location = tc.location.name;
                tcs.push(s);
            });

            return tcs;
        },
        getUsersName(owners){
            let list = []
            owners.forEach(owner=>{
                this.personnel.forEach(u=>{
                    if(u._id == owner){
                        list.push(u.name)
                    }
                })
            })
            return list.join(', ')
        }
    }
}
</script>
