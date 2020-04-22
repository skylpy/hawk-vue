<template>
    <f7-page name="home" class="page-home">
        <!-- add valid modules -->
        <f7-list class="task-container-layer">
            <f7-list-group v-for="(mod, i) in mods" :key="i" class="task-list-group">
                <f7-list-item class="task-list-layer">
                    <div class="task-list-title">{{mod.category}}</div>
                </f7-list-item>

                <f7-list-item class="task-list-layer task-list-content">
                    <f7-row
                            v-for="(task, index) in mod.tasks" :key="index"
                            v-if="index % 3 == 0"
                            style="display: flex;">

                        <f7-col class="task-container-col" v-for="n in [0,1,2]" :key="n">
                            <div v-if="mod.tasks[index+n]" @click="doWork(mod.target, mod.tasks[index+n])">
                                <div>
                                    <img class="icon-task" :src="mod.tasks[index+n].icon" alt="icon">
                                    <div class="task-col-title">{{mod.tasks[index+n].name}}</div>
                                </div>
                            </div>
                        </f7-col>
                    </f7-row>
                </f7-list-item>
            </f7-list-group>
        </f7-list>

        <!-- ! version error handler -->
        <f7-block v-if="!getModules()">
            <p style="color:red; font-weight: bold;">您选择了错误的软件版本，请联系开发商解决！</p>
        </f7-block>

    </f7-page>
</template>

<style lang="scss" scoped>
.page-home {

    background: #F6F6F6;

    .task-container-layer {
        margin: 0 0 18px;
        overflow: hidden;
    }

    .task-list-group {
        margin-top: 10px;
    }

    .task-list-title {
        border-left: 4px solid #01B38B;
        height: 18px;
        line-height: 18px;
        font-size: 14px;
        color: #01B38B;
        padding-left: 10px;
    }

    .task-list-layer {
        overflow: hidden;
    }

    .task-container-col {
        justify-content: center;
        display: flex;
        margin-bottom: 21px;
    }

    .icon-task {
        width: 55px;
        height: 55px;
        display: block;
        margin: 0 auto;
    }

    .task-col-title {
        font-size: 13px;
        color: #333;
        text-align: center;
    }
}

</style>
<style lang="scss">
.page-home {
    .task-list-layer .item-content{
        padding-left: 0;

        .item-inner {
            overflow: hidden;
            padding-right: 0;
        }
    }

    .task-list-content .item-inner {
        display: block;
        margin: 20px 0 10px;
    }
}
</style>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { getValidMods } from 'lib/module.js';

export default {
    name: "home",

    data: () => {
        return {
            mods: []
        }
    },

    computed: {
        ...mapGetters([
            'myProfile',
            'userPermissions',
            'myUserId',
            'superAdmin'
        ]),

        isSuperadmin(){
            return this.myProfile.superadmin
        }
    },

    mounted: function() {
        this.mods = this.getModules();
    },

    methods: {

        getModules() {
            let item = localStorage.getItem('module-filter');
            let tFilter = item ? JSON.parse(item) : [];
            let mods = deepCopy(getValidMods(this.myProfile.role));

            mods.forEach(m => {

                // m.tasks = m.tasks.filter(t => !tFilter.includes(t.name));
                m.tasks = m.tasks.filter(function (t) {
                    return !tFilter.includes(t.name);
                });
            })

            // filtered by permissions
            if (!this.superAdmin || (this.superAdmin && this.superAdmin._id != this.myUserId)) {
                let myPermissions = this.userPermissions(this.myUserId);

                mods = mods.filter(m => {
                    m.tasks = m.tasks.filter(t => myPermissions.includes(t.name));
                    if (m.tasks.length) return true;
                    return false;
                })
            }

            return mods || [];
        },

        getTaskPair(taskList) {
            let pairList = [];
            if (!taskList) return pairList;
            let tl = deepCopy(taskList);
            if (tl.length % 2 != 0) tl.push({name: "", icon: ""});

            for (let n = 0; n < tl.length; n++) {
                if (n%2 != 0) continue;
                pairList.push([tl[n], tl[n+1]]);
            }
            return pairList;
        },

        doWork(category, task) {
            let what = task.target;
            if (!category || !what) {
                console.error('no specified target for page navigation');
                $alert('页面正在开发中', '提示');
                return;
            }

            let props = { lastPage: '工作台' };
            if (task.props) props = Object.assign(props, task.props);

            let target = what == 'scorepersonal' && this.isSuperadmin ? what + 'list' : what
            let link = '/' + category + '/' + target + '/';

            this.$f7router.navigate(link,{ props });
        }
    }
};

</script>
