<template>
    <f7-page>
        <f7-navbar>
            <f7-nav-left>
                <f7-link icon-only @click="cancel">
                    <i class="icon icon-back"></i>
                </f7-link>
            </f7-nav-left>
            <f7-nav-title>{{title||'选择员工'}}</f7-nav-title>
            <f7-subnavbar :inner="false">
                <f7-searchbar
                    search-container=".search-list"
                    search-in=".search-name"
                    disable-button-text="取消"
                    placeholder="输入名字"
                ></f7-searchbar>
            </f7-subnavbar>
        </f7-navbar>
        <div style="height: 44px"></div>
        <f7-list class="search-list hawk-org">

            <template v-if="navigatable">
                <f7-list-item>
                    <div slot="inner" class="hawk-org-department-nav">
                        <f7-link
                            v-for="(d, index) in chain"
                            :key="index"
                            @click="goto_department(d)"
                        > {{d.name == '公司' ? '联系人' : d.name}} </f7-link>
                    </div>
                </f7-list-item>

                <f7-list-item v-if="showSubDepartment && department.sub.length" divider></f7-list-item>

                <f7-list-item
                    v-if="showSubDepartment"
                    v-for="(sub, index) in department.sub"
                    :key="index + 'department'"

                >
                    <div slot="inner" style="display:inline-block">{{ sub.name + `（${sub.employees.filter(uid => !!who(uid)).length}人）` }}</div>

                    <f7-link slot="inner" class="sub-department-link" @click="goto_department(sub)">
                        <img :src="sub_icon" class="sub-department">
                        <span>下级</span>
                    </f7-link>
                </f7-list-item>
            </template>

            <template v-if="this.multiple && department.employees.length > 1">
                <f7-list-item divider></f7-list-item>

                <f7-list-item>
                    <div slot="inner" class="hawk-org-user-container">
                        <f7-link class="hawk-select-radio" @click="toggle_all_employees()">
                            <i v-if="!all_selected" class="fa fa-lg fa-circle-thin" aria-hidden="true" style="color:#979797"></i>
                            <i v-if="all_selected" class="fa fa-lg fa-check-circle-o" aria-hidden="true"></i>
                        </f7-link>
                        <div>全选</div>
                    </div>
                </f7-list-item>
            </template>

            <f7-list-item v-if="department.employees.length" divider></f7-list-item>

            <f7-list-item
                v-for="(uid, index) in department.employees"
                :key="index + 'employee'" @click="toggle_employee(uid)"
                v-if="(superAdmin._id != uid || showSuperAdmin)"
                v-show="who(uid) && who(uid).name"
            >
                <div v-if="who(uid)" slot="inner" class="hawk-org-user-container">
                    <f7-link v-if="multiple" class="hawk-select-radio">
                        <i v-if="!has_selected(uid)" class="fa fa-lg fa-circle-thin" aria-hidden="true" style="color:#979797"></i>
                        <i v-if="has_selected(uid)" class="fa fa-lg fa-check-circle-o" aria-hidden="true"></i>
                    </f7-link>
                    <img class="hawk-org-user-avatar" :src="who(uid).avatarUrl">
                    <div class="search-name">{{ who(uid).name }}</div>
                    <div class="hawk-org-user-title">{{ who(uid).job || '职位待定' }}</div>
                </div>
            </f7-list-item>

        </f7-list>

        <f7-toolbar  v-if="multiple">
            <div id="hawk-employeepicker-selected-container" class="select_con">
                <div v-for="(uid, index) in selected.filter(uid => !!who(uid))" :key="index">
                    <f7-button class="hawk-selected-tag" :text="who(uid).name"></f7-button>
                    <i class="fa fa-times-circle" aria-hidden="true" @click="toggle_employee(uid)"></i>
                </div>
            </div>
            <f7-button v-if="selected.length < 1" class="hawk-button hawk-button-invalid">确定</f7-button>
            <f7-button v-if="selected.length" class="hawk-button" @click="done">确定</f7-button>
        </f7-toolbar>

    </f7-page>
</template>

<style lang="scss" scoped>
    .select_con{
        overflow-y: auto;
        width: calc(100% - 58px);
    }
    .hawk-select-radio {
        display: inline-block;
        padding-right: 10px;
    }

    .sub-department-link {
        padding-left: 15px;
        border-left: solid 1px rgba(216,216,216,1);

        .sub-department {
            width:16px;
            height:16px;
            padding-right:3px
        }
    }

    #hawk-employeepicker-selected-container {
        display: flex;

        div {
            position: relative;

            .hawk-selected-tag {
                color: #01B38B;
                border: solid 1px #01B38B;
                margin-right: 10px;
            }

            i {
                position: absolute;
                top: -5px;
                right: 5px;
            }
        }
    }
</style>


<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'departmentpicker',

    props: {
        multiple: {
            type: Boolean,
            default: true
        },
        parentDepartmentId: '',
        showSubDepartment:{
            type:Boolean,
            default: true
        },
        showSuperAdmin:{
            type:Boolean,
            default: true
        },
        selectedList: {
            type: Array
        },
        title: String,
        isemploy:{
            type:Boolean,
            default: true
        }
    },
    watch:{
        parentDepartmentId(val){
            this.load()
        },
        selectedList(val){
            this.selected = val
        },
        organization() {
            this.load();
        },
    },
    data() {
        return {
            chain: [],
            sub_icon: require('assets/images/icon_truee_green@2x.png'),

            selected: [],

            single_department: null,
        }
    },
    computed: {
        ...mapGetters([
            'organization',
            'superAdmin',
            'myProfile',
            'who'
        ]),

        IamSuperAdmin(){
            if (this.myProfile._id && this.superAdmin){
                return this.superAdmin._id == this.myProfile._id
            }
        },

        navTitle() {
            return this.department.name || '公司';
        },

        navigatable() {
            return this.single_department == null;
        },

        department() {
            if (this.single_department) return this.single_department;
            if (this.chain.length) return this.chain[this.chain.length-1];
            return this.organization;
        },

        reminder() {
            return this.department.admin.length == 0 && this.department.name != '公司';
        },

        parent_department() {
            let index = this.chain.findIndex(d => d.departmentId == this.department.departmentId);
            if (index < 1) return null;
            return this.chain[index-1];
        },

        all_selected() {
            if (!this.department.employees.length) return false;
            return this.department.employees.every(e => this.selected.includes(e));
        }
    },

    created() {
        this.load();
        if(this.selectedList) this.selected = this.selectedList
    },

    methods: {
        load() {
            let rootD = this.parentDepartmentId ? this.departments(this.organization).find(d => d.departmentId == this.parentDepartmentId) : this.organization;
            this.chain = [rootD];
        },

        departments(root) {
            return (function listD(d) {
                return d.sub.slice(0).concat(d.sub.reduce((accum, s) => { return accum.concat(listD(s)) }, []));
            })(root);
        },

        set(options) {
            let {selected, path, single_department} = options;

            if (selected) this.selected = selected.slice(0);
            else this.selected = [];

            if (path) {
                for (let n = 0; n < path.length; n++) {
                    let d = this.departments(this.chain[0]).find(e => e.departmentId == path[n].departmentId);
                    if (d) this.goto_department(d);
                }
            }

            if (single_department) {
                this.single_department = single_department;
            }
        },

        has_selected(uid) {
            return this.selected.findIndex(i => i == uid) != -1;
        },

        goto_department(d) {
            let pos = this.chain.findIndex(item => item.departmentId == d.departmentId);

            if (pos == -1) {
                this.chain.push(d);
                return;
            }

            if (pos == this.chain.length - 1) return;

            this.chain.splice(pos+1);
        },

        toggle_employee(uid) {

            //单选模式 直接确定跳转
            if(!this.multiple) {
                this.$emit('employee:selected', [uid]);

                return
            }

            let index = this.selected.findIndex(i => i == uid);

            if (index == -1) {
                if (!this.multiple) this.selected = [];
                this.selected.push(uid);
            }
            else this.selected.splice(index, 1);
        },

        toggle_all_employees() {
            if (this.all_selected) {
                this.selected = this.selected.filter(e => !this.department.employees.includes(e));
                return;
            }

            this.department.employees.forEach(e => {
                if (!this.selected.includes(e)) this.selected.push(e);
            })
        },

        cancel() {
            this.$emit('employee:cancel');
        },

        done() {
            this.$emit('employee:selected', this.selected);
        }
    }
}
</script>

