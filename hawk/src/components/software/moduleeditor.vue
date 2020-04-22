<template>
    <f7-page>
        <f7-navbar title="设置模块" back-link>
            <f7-nav-right>
                <f7-link @click="submit">提交</f7-link>
            </f7-nav-right>            
        </f7-navbar>

        <f7-block-title>请点击隐藏不需要的模块</f7-block-title>
        <f7-list>
            <f7-list-item
                v-for="(task, index) in taskList" :key="index"
                :title="task.name"
                checkbox
                :checked="!filter.includes(task.name)"
                :value = "task.name"
                @change="update"
            >
                <f7-icon slot="media" :fa="task.icon" size="20px"></f7-icon>
            </f7-list-item>
        </f7-list>

    </f7-page>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import { getValidMods } from 'lib/module.js';

export default {
    data() {
        return {
            filter: []
        }
    },

    computed: {
        taskList() {
            let list = [];

            getValidMods(this.myProfile.role).forEach(m => {
                list.push(...m.tasks);
            })
            return list;
        },

        ...mapGetters(['myProfile', 'module_filter'])
    },

    mounted: function() {
        this.filter = deepCopy(this.module_filter);
    },

    methods: {
        ...mapMutations({
            set: 'SOFTWARE_CONFIG_SET'
        }),

        submit() {
            this.set({ module_filter: this.filter});
            this.$f7router.back();
        },

        update(event) {
            let checked = event.target.checked;
            let taskName = event.target.value;
            
            if (checked && this.filter.includes(taskName)) this.filter.splice(this.filter.findIndex(i => i == taskName), 1);
            if (!checked && !this.filter.includes(taskName)) this.filter.push(taskName);
        }

    }
}
</script>
